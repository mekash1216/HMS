using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using HotelManagementAPI.Interfaces;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;


namespace HotelManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GuestsController : ControllerBase
    {
        private readonly IGuestRepository _repository;
        private readonly IMapper _mapper;

        public GuestsController(IGuestRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetGuests()
        {
            var guests = await _repository.GetAllAsync();
            var guestDtos = _mapper.Map<IEnumerable<GuestDto>>(guests);
            return Ok(guestDtos);
        }

        [HttpPost]
        public async Task<IActionResult> AddGuest([FromBody] GuestDto guestDto)
        {
            var guest = _mapper.Map<Guest>(guestDto);
            var addedGuest = await _repository.AddAsync(guest);
            return CreatedAtAction(nameof(GetGuests), new { id = addedGuest.Id }, addedGuest);
        }
    }
}
