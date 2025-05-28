namespace SignalRPOC.Models
{
    public class BroadcastData
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
        public string IPAddress { get; set; }
    }
}
