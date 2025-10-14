using HotelManagementAPI.DTOs;

namespace HotelManagementAPI.Repositories
{
    public interface IRoomRepository
    {
        Task<IEnumerable<RoomDto>> GetAllRooms();
        Task<RoomDto?> GetRoomById(Guid id);
        Task AddRoom(RoomDto roomDto);
        Task UpdateRoom(RoomupdateDto roomDto);
        Task DeleteRoom(Guid id);
        Task<List<Guid>> GetBookedRoomIdsBetweenDates(DateTime checkIn, DateTime checkOut);

    }
}
