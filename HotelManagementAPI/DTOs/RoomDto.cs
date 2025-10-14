namespace HotelManagementAPI.DTOs
{
    public class RoomDto
    {
        public Guid Id { get; set; }
        public string RoomNumber { get; set; }
        public string RoomType { get; set; }
        public string Status { get; set; }
        public decimal PricePerNight { get; set; }
    }
     public class RoomupdateDto
    {
        public Guid Id { get; set; }
        public string RoomNumber { get; set; }
        public string RoomType { get; set; }
        public string Status { get; set; }
        public decimal PricePerNight { get; set; }
    }
}
