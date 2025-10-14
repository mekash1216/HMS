using HotelManagementAPI.Data;
using HotelManagementAPI.Interfaces;
using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Repositories
{
    public class GuestRepository : IGuestRepository
    {
        private readonly ApplicationDbContext _context;

        public GuestRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Guest>> GetAllAsync()
        {
            return await _context.Guests.ToListAsync();
        }

        public async Task<Guest?> GetByIdAsync(Guid id)
        {
            return await _context.Guests.FindAsync(id);
        }

        public async Task<Guest> AddAsync(Guest guest)
        {
            guest.Id = Guid.NewGuid();
            _context.Guests.Add(guest);
            await SaveChangesAsync();
            return guest;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
