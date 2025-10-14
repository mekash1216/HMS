
using HotelManagementAPI.Models;

namespace HotelManagementAPI.Interfaces
{
    public interface IGuestRepository
    {
        Task<IEnumerable<Guest>> GetAllAsync();
        Task<Guest?> GetByIdAsync(Guid id);
        Task<Guest> AddAsync(Guest guest);
        Task SaveChangesAsync();
    }
}
