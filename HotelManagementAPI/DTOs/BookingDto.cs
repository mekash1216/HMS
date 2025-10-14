public class BookingDto
{
     public Guid Id { get; set; }
    public  Guid GuestId {get; set;}
    public Guid RoomId { get; set;}
    public DateTime CheckInDate {get;set;}
    public DateTime CheckOutDate {get;set;}

}

