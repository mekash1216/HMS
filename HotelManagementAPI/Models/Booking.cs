using HotelManagementAPI.Models;

public class Booking {
    public Guid Id { get; set; }
    public Guid GuestId { get; set; }
    public Guest? Guest { get; set; }
    public Guid RoomId { get; set ;}
    public Room? Room { get; set; }

    public DateTime CheckInDate {get ; set; }
    public DateTime CheckOutDate {get; set;}
    public decimal TotalPrice {get; set;}
}