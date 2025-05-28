using Microsoft.AspNetCore.SignalR;

namespace SignalRPOC.NewFolder
{
    public class BroadcastHub : Hub
    {
        public async Task JoinGroup(string email)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, email);
            Console.WriteLine($"User {email} joined the group.");
        }
        public async Task SendBroadcast(string email, string message, string ipAddress)
        {
            await Clients.Group(email).SendAsync("ReceiveBroadcast", email, message, ipAddress);
        }
    }
}
