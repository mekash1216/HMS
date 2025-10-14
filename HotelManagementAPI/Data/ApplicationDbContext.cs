using Microsoft.EntityFrameworkCore;
using HotelManagementAPI.Models; 

namespace HotelManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Room> Rooms { get; set; } 
        public DbSet<Guest> Guests { get; set; } 
        public DbSet<Booking> Bookings { get;set;}

    }
}
