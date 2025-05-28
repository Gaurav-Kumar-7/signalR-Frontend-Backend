
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SignalRService } from '../../service/signalr.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  email = '';
  errorMessage = '';
  isConnected = false;
  notificationSound = new Audio('assets/notification.mp3');
  isOnline = true;
  broadcasts: { clientTimestamp: string; serverTimestamp: string; message: string; ipAddress: string }[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private signalRService: SignalRService) {}

  ngOnInit(): void {
  }
  

  connect() {
    if (!this.email || this.email.trim() === '') {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.broadcasts = [];
    this.http
      .post<{ message: string }>(`${environment.apiBaseUrl1}Users/Register`, {
        email: this.email,
      })
      .subscribe({
        next: () => {
          this.errorMessage = '';
          sessionStorage.setItem('email', this.email);
          this.startSignalRConnection();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login failed';
          console.error('Login error:', err);
        },
      });
  }


  startSignalRConnection() {
    this.signalRService.connectToSignalR(this.email, (broadcast) => {
      this.broadcasts.push(broadcast);
      this.playNotificationSound();
    });
    this.isConnected = true;
  }


  playNotificationSound() {
    this.notificationSound.volume = 1;
    this.notificationSound.play().catch((error) => {
      console.error('Sound play error:', error);
    });
  }
}
