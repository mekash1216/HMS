using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
namespace HotelManagementAPI.Controllers
{

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly IBookingRepository _repository;
    private readonly IMapper _mapper;

    public BookingController(IBookingRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetBookings()
    {
        var bookings = await _repository.GetAllAsync();
        var bookingDTOs = _mapper.Map<IEnumerable<BookingDto>>(bookings);
        return Ok(bookingDTOs);
    }

   [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] BookingDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Map DTO to Booking entity
        var booking = _mapper.Map<Booking>(dto);

        try
        {
            var createdBooking = await _repository.CreateAsync(booking);

            // Optionally map to a response DTO
            var resultDto = _mapper.Map<BookingDto>(createdBooking);

            return Ok(resultDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBooking(Guid id, [FromBody] BookingDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var booking = _mapper.Map<Booking>(dto);
        booking.Id = id;

        try
        {
            var updated = await _repository.UpdateAsync(booking);
            if (updated == null)
                return NotFound(new { message = "Booking not found" });

            return Ok(_mapper.Map<BookingDto>(updated));
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(Guid id)
    {
        var deleted = await _repository.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = "Booking not found" });

        return NoContent(); // 204
    }

}
}