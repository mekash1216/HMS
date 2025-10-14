using AutoMapper;
using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public RoomRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<RoomDto>> GetAllRooms()
        {
            var rooms = await _context.Rooms.ToListAsync();
            return _mapper.Map<IEnumerable<RoomDto>>(rooms);
        }

        public async Task<RoomDto?> GetRoomById(Guid id)
        {
            var room = await _context.Rooms.FindAsync(id);
            return room == null ? null : _mapper.Map<RoomDto>(room);
        }

      public async Task AddRoom(RoomDto roomDto)
{
    var room = _mapper.Map<Room>(roomDto);

    if (room.Id == Guid.Empty)
    {
        room.Id = Guid.NewGuid();
    }

    _context.Rooms.Add(room);

    await _context.SaveChangesAsync();
}

public async Task UpdateRoom(RoomupdateDto roomDto)
{
    var room = _mapper.Map<Room>(roomDto);
    
    var existingRoom = await _context.Rooms.FindAsync(room.Id);
    if (existingRoom != null)
    {
        _context.Entry(existingRoom).State = EntityState.Detached;
    }

    _context.Rooms.Update(room);
    await _context.SaveChangesAsync();
}
    public async Task<List<Guid>> GetBookedRoomIdsBetweenDates(DateTime checkIn, DateTime checkOut)
    {
        return await _context.Bookings
            .Where(b => b.CheckInDate < checkOut && b.CheckOutDate > checkIn)
            .Select(b => b.RoomId)
            .ToListAsync();
    }

        public async Task DeleteRoom(Guid id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room != null)
            {
                _context.Rooms.Remove(room);
                await _context.SaveChangesAsync();
            }
        }
    }
}
