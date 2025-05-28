import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private connection: any;
  private hubProxy: any;
  private hubUrl = environment.signalRHubUrl1;
  private isConnected = false;
  private currentEmail: string | null = null;

  constructor() {
    if (typeof $ === 'undefined' || typeof $.hubConnection === 'undefined') {
      console.error('jQuery or SignalR is not loaded. Ensure scripts are included in index.html.');
      return;
    }

    this.connection = $.hubConnection(this.hubUrl);
    this.connection.qs = { withCredentials: true };
    this.connection.logging = true;
    this.hubProxy = this.connection.createHubProxy('broadcastHub');

    this.connection.error((err: any) => {
      console.error('SignalR connection error:', err);
    });

    this.connection.stateChanged((change: any) => {
      console.log('SignalR state changed to:', change.newState);
    });
  }

  public connectToSignalR(email: string, onBroadcastReceived: (broadcast: any) => void): void {
    if (this.isConnected) {
      if (this.currentEmail === email) {
        console.warn('Already connected for this email:', email);
        return;
      }

      console.warn(`Reconnecting SignalR with new email: ${email}`);
      this.stopConnection();
      setTimeout(() => this.connectToSignalR(email, onBroadcastReceived), 300);
      return;
    }

    this.hubProxy.off('ReceiveBroadcast');

    this.hubProxy.on('ReceiveBroadcast', (receiverEmail: string, message: string, ipAddress: string, timestamp: string) => {
      console.log('Received broadcast:', { receiverEmail, message, ipAddress, timestamp });
      const broadcastData = {
        clientTimestamp: new Date().toISOString(),
        serverTimestamp: timestamp,
        message,
        ipAddress
      };
      onBroadcastReceived(broadcastData);
    });

    this.connection.start()
      .done(() => {
        this.isConnected = true;
        this.currentEmail = email;
        console.log('SignalR connection established for email:', email);

        this.hubProxy.invoke('JoinGroup', email)
          .fail((err: any) => console.error('Error while joining group:', err));
      })
      .fail((err: any) => {
        this.isConnected = false;
        console.error('Error while establishing SignalR connection:', err);
      });
  }

  public stopConnection(): void {
    if (!this.isConnected) {
      console.log('No active SignalR connection to stop.');
      return;
    }

    this.connection.stop();
    this.isConnected = false;
    this.currentEmail = null;
    console.log('SignalR connection stopped');
  }
}