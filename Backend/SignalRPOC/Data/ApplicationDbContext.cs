using Microsoft.EntityFrameworkCore;
using SignalRPOC.Models;

namespace SignalRPOC.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<BroadcastData> BroadcastData { get; set; }
    }
}
