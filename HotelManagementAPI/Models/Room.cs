using System.ComponentModel.DataAnnotations;

namespace HotelManagementAPI.Models
{
    public class Room
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string RoomNumber { get; set; }

        [Required]
        public string RoomType { get; set; }

        [Required]
        public string Status { get; set; }

        [Required]
        public decimal PricePerNight { get; set; }
    }
}
