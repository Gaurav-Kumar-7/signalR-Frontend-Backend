import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
// import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // connection: signalR.HubConnection | undefined;
  userEmail: string = '';
  broadcasts: { timestamp: string; message: string; ipAddress: string }[] = [];

  constructor() {}

  ngOnInit(): void {
    // this.userEmail = sessionStorage.getItem('email') || '';

    // this.connection = new signalR.HubConnectionBuilder()
    //   .withUrl('https://localhost:7170/broadcastHub')
    //   .build();

    // this.connection
    //   .start()
    //   .then(() => {
    //     console.log('SignalR Connected');
    //     if (this.connection && this.userEmail) {
    //       this.connection.invoke('JoinGroup', this.userEmail);
    //     }
    //   })
    //   .catch((err) => console.error('SignalR connection failed: ', err));

    // // Listen for the 'ReceiveBroadcast' event from the SignalR server
    // if (this.connection) {
    //   this.connection.on(
    //     'ReceiveBroadcast',
    //     (email: string, message: string, ipAddress: string) => {
    //       if (email === this.userEmail) {
    //         this.broadcasts.push({
    //           timestamp: new Date().toISOString(),
    //           message: message,
    //           ipAddress: ipAddress,
    //         });
    //         console.log('New broadcast message:', message);
    //       }
    //     }
    //   );
    // }
  }

  // ngOnDestroy(): void {
  //   if (this.connection) {
  //     this.connection.stop().catch((err) => console.error('Error while stopping SignalR connection: ', err));
  //   }
  // }
}
