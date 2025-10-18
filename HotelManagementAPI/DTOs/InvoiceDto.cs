public class InvoiceDto
{
    public Guid Id { get; set; }
    public Guid BookingId { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal AmountPaid { get; set; }
    public string PaymentStatus { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; }
}

public class UpdatePaymentDto
{
    public decimal AmountPaid { get; set; }
}
