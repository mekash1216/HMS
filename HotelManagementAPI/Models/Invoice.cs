using System;

namespace HotelManagementAPI.Models
{
    public class Invoice
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public Booking Booking { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public decimal AmountPaid { get; set; } = 0;
        public string PaymentStatus { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
