using HotelManagementAPI.Data;
using HotelManagementAPI.Models;
using HotelManagementAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Repository.Implementation
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly ApplicationDbContext _context;

        public InvoiceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Invoice> CreateInvoice(Invoice invoice)
        {
            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();
            return invoice;
        }

        public async Task<IEnumerable<Invoice>> GetAllInvoices()
        {
            return await _context.Invoices
                .Include(i => i.Booking)
                    .ThenInclude(b => b.Guest)
                .Include(i => i.Booking)
                    .ThenInclude(b => b.Room)
                .ToListAsync();
        }

        public async Task<Invoice?> GetInvoiceById(Guid id)
        {
            return await _context.Invoices
                .Include(i => i.Booking)
                    .ThenInclude(b => b.Guest)
                .Include(i => i.Booking)
                    .ThenInclude(b => b.Room)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<Invoice?> UpdatePayment(Guid id, decimal amountPaid)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return null;

            invoice.AmountPaid += amountPaid;

            if (invoice.AmountPaid >= invoice.TotalAmount)
                invoice.PaymentStatus = "Paid";
            else if (invoice.AmountPaid > 0)
                invoice.PaymentStatus = "Partially Paid";

            await _context.SaveChangesAsync();
            return invoice;
        }
    }
}
