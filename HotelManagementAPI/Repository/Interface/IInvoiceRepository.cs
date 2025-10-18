using HotelManagementAPI.Models;

namespace HotelManagementAPI.Interfaces
{
    public interface IInvoiceRepository
    {
        public Task<Invoice> CreateInvoice(Invoice invoice);
        public Task<IEnumerable<Invoice>> GetAllInvoices();
        public Task<Invoice?> GetInvoiceById(Guid id);
        public Task<Invoice?> UpdatePayment(Guid id, decimal amountPaid);

    }

}
