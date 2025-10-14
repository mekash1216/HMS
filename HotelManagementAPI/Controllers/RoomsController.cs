using HotelManagementAPI.DTOs;
using HotelManagementAPI.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly IRoomRepository _roomRepository;
         private readonly IBookingRepository _bookingRepository;
        public RoomsController(IRoomRepository roomRepository, IBookingRepository bookingRepository)
        {
            _roomRepository = roomRepository;
            _bookingRepository = bookingRepository;

        }

        [HttpGet]
        public async Task<IActionResult> GetRooms()
        {
            var rooms = await _roomRepository.GetAllRooms();
            return Ok(rooms);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoom(Guid id)
        {
            var room = await _roomRepository.GetRoomById(id);
            if (room == null)
            {
                return NotFound();
            }
            return Ok(room);
        }

            [HttpPost]
        public async Task<IActionResult> CreateRoom([FromBody] RoomDto roomDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            roomDto.Id = Guid.NewGuid(); 

            await _roomRepository.AddRoom(roomDto);

            return CreatedAtAction(nameof(GetRoom), new { id = roomDto.Id }, roomDto);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(Guid id, [FromBody] RoomupdateDto roomDto)
        {
            if (id != roomDto.Id)
            {
                return BadRequest("Room ID mismatch");
            }

            var existingRoom = await _roomRepository.GetRoomById(id);
            if (existingRoom == null)
            {
                return NotFound();
            }

            await _roomRepository.UpdateRoom(roomDto);
            return NoContent();
        }
               [HttpGet("available")]
        public async Task<IActionResult> GetAvailableRooms([FromQuery] DateTime checkIn, [FromQuery] DateTime checkOut)
        {
            if (checkIn >= checkOut)
            {
                return BadRequest("Check-out date must be after check-in date.");
            }

            // get all rooms
            var allRooms = await _roomRepository.GetAllRooms();

            // get all booked rooms overlapping the given range
            var bookedRoomIds = await _bookingRepository.GetBookedRoomIdsBetweenDates(checkIn, checkOut);

            // filter
            var availableRooms = allRooms.Where(r => !bookedRoomIds.Contains(r.Id)).ToList();

            return Ok(availableRooms);
        }
    

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(Guid id)
        {
            var existingRoom = await _roomRepository.GetRoomById(id);
            if (existingRoom == null)
            {
                return NotFound();
            }

            await _roomRepository.DeleteRoom(id);
            return NoContent();
        }
    }
}
