using AutoMapper;
using HotelManagementAPI.Models;
using HotelManagementAPI.DTOs;

namespace HotelManagementAPI.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Room, RoomDto>().ReverseMap();
            CreateMap<Room, RoomupdateDto>().ReverseMap();
            CreateMap<Guest, GuestDto>().ReverseMap();
            CreateMap<Booking, BookingDto>().ReverseMap();
            CreateMap<Invoice, InvoiceDto>().ReverseMap();
            CreateMap<Invoice, UpdatePaymentDto>().ReverseMap();

        }
    }
}
