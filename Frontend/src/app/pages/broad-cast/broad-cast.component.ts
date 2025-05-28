import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import ipify from 'ipify';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-broad-cast',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './broad-cast.component.html',
  styleUrls: ['./broad-cast.component.scss']
})
export class BroadCastComponent implements OnInit {

  email = '';
  message = '';
  ipAddress = '';
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        this.ipAddress = data.ip;
      })
      .catch((err) => {
        console.error('Error fetching IP address:', err);
        this.ipAddress = 'Unknown';
      });
  }

  sendData(): void {
    const requestData = {
      email: this.email,
      message: this.message,
      ipAddress: this.ipAddress
    };
  
    this.http.post('https://localhost:7168/api/Auth/send-data', requestData)
      .subscribe({
        next: (response) => {
          console.log('Data sent successfully', response);
          this.successMessage = 'Data broadcast successfully';
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error sending data', error);
          this.successMessage = '';
          
          if (error?.error?.message === 'User not found') {
            this.errorMessage = 'User not found. Please enter a registered email.';
          } else {
            this.errorMessage = 'Failed to send data. Please try again.';
          }
        }
      });
  }
  
}
