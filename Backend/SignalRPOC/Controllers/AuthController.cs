using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRPOC.Data;
using SignalRPOC.Models;
using SignalRPOC.NewFolder;
using System.Net;

namespace SignalRPOC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<BroadcastHub> _hubContext;

        public AuthController(ApplicationDbContext context, IHubContext<BroadcastHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (_context.Users.Any(u => u.Email == user.Email))
                return BadRequest(new { message = "User already exists" });

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == user.Email);
            if (existingUser == null)
                return Unauthorized(new { message = "User not found" });

            return Ok(new { message = "Login successful" });
        }

        [HttpPost("send-data")]
        public async Task<IActionResult> SendData([FromBody] BroadcastData request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest(new { message = "Email is required" });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return BadRequest(new { message = "User not found" });

            var broadcastData = new BroadcastData
            {
                Email = request.Email,
                Message = request.Message,
                Timestamp = DateTime.UtcNow,
                IPAddress = request.IPAddress ?? HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown"
            };

            _context.BroadcastData.Add(broadcastData);
            await _context.SaveChangesAsync();
            await _hubContext.Clients.Group(request.Email).SendAsync("ReceiveBroadcast", request.Email, request.Message, broadcastData.IPAddress);


            return Ok(new { message = "Data sent successfully" });
        }
    }
}
