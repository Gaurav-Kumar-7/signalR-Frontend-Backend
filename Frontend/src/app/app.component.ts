import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'token';
  currentUser: any;
  allStudents: any;
  constructor(private _httpClient: HttpClient) { }

  private getHeader():any {
    return{
      headers: new HttpHeaders({
        'Content-Type': 'application/json;',
        'Accept': 'application/json;',
        'Authorization': 'bearer ' + this.currentUser?.token
      })
    }
  }

  private loginHeaders(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;',
        'Accept': 'application/json;',
      })
    };
  }

  getStudents() {
    this._httpClient.get('https://localhost:7119/api/Student/All',this.getHeader()).subscribe({
      next: (result: any) => {
        this.allStudents = result;
        console.log(result);
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    })
  }

  generateToken(){
    let payload = {
      "username": "gaurav",
      "password": "gaurav123",
    };

    this._httpClient.post('https://localhost:7119/api/Login', payload, this.loginHeaders()).subscribe({
      //Success  
      next: (result: any) => {
        console.log(result);
        this.currentUser = result;
      },
      //Error
      error: (error: any) => {
        console.log(error);
      }
    })
  }
}
