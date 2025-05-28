import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email = '';
  errorMessage = '';
  isConnected = false;
  notificationSound = new Audio('assets/notification.mp3');
  isOnline = true;

  connection: signalR.HubConnection | undefined;
  broadcasts: { clientTimestamp: string; serverTimestamp: string; message: string; ipAddress: string }[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  @HostListener('window:offline', [])
  onOffline() {
    console.log('You are offline');
    this.isOnline = false;
    if (this.connection) {
      this.connection.stop();
    }
  }

  @HostListener('window:online', [])
  onOnline() {
    console.log('You are online');
    this.isOnline = true;
  
    if (this.email) {
      const latestServerTimestamp = sessionStorage.getItem('latestServerTimestamp');
      if (latestServerTimestamp) {
        console.log('Latest server timestamp from sessionStorage:', latestServerTimestamp);
        this.missedMessage(this.email, latestServerTimestamp);
      }
  
      this.reconnectSignalR();
    }
  }

  ngOnInit(): void {
      const savedEmail = sessionStorage.getItem('email');
      const savedBroadcasts = sessionStorage.getItem('broadcasts');
    
      // if (savedEmail) {
      //   this.email = savedEmail;
      //   this.isConnected = true; // Consider this true if email exists
      //   if (savedBroadcasts) {
      //     this.broadcasts = JSON.parse(savedBroadcasts);
      //   }
      //   this.startSignalRConnection(this.email);
      // }
    
  }
  

  connect() {
    if (!this.email || this.email.trim() === '') {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.broadcasts = [];
    this.http
      .post<{ message: string }>(`${environment.apiBaseUrl}Auth/login`, {
        email: this.email,
      })
      .subscribe({
        next: () => {
          this.errorMessage = '';
          sessionStorage.setItem('email', this.email);
          this.startSignalRConnection(this.email);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login failed';
          console.error('Login error:', err);
        },
      });
  }

  startSignalRConnection(email: string) {
    if (this.connection) {
      this.connection.stop();
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalRHubUrl)
      .withAutomaticReconnect([0, 1000, 5000, 10000])
      .build();

    this.connection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        this.isConnected = true;
        this.connection?.invoke('JoinGroup', email);
        this.connection?.on(
          'ReceiveBroadcast',
          (receiverEmail: string, message: string, ipAddress: string, Timestamp: string) => {
            if (receiverEmail === email) {
              this.broadcasts.push({
                clientTimestamp: new Date().toISOString(),
                serverTimestamp: Timestamp,
                message: message,
                ipAddress: ipAddress,
              });
              sessionStorage.setItem('broadcasts', JSON.stringify(this.broadcasts));
              sessionStorage.setItem('latestServerTimestamp', Timestamp);
              this.cdr.detectChanges();
              this.playNotificationSound();
              console.log('New broadcast:', message);
            }
          }
        );
      })
      .catch((err) => {
        console.error('SignalR connection failed:', err);
      });

    this.connection.onclose(() => {
      console.log('SignalR connection closed. Retrying...');
      this.reconnectSignalR();
    });
  }

  reconnectSignalR() {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Disconnected) {
      console.log('Reconnecting to SignalR...');
      this.startSignalRConnection(this.email);
    }
  }

  missedMessage(email: any, serverTimeStamp: any) {
    const payload = {
      email: email,
      timestamp: serverTimeStamp,
      message: "",
      ipaddress:""
    }
    this.http.post(`${environment.reConnectBaseUrl}/resend-message`, payload).subscribe({
      next: (res) => {
        console.log('Resend message response:', res);
      },
      error: (err) => {
        console.error('Error while resending message:', err);
      }
    });
  }

  playNotificationSound() {
    this.notificationSound.volume = 1;
    this.notificationSound.play().catch((error) => {
      console.error('Sound play error:', error);
    });
  }
}
