using AutoMapper;
using HotelManagementAPI.Interfaces;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceRepository _repo;
    private readonly IMapper _mapper;

    public InvoicesController(IInvoiceRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetInvoices()
    {
        var invoices = await _repo.GetAllInvoices();
        return Ok(_mapper.Map<IEnumerable<InvoiceDto>>(invoices));
    }

    [HttpPost]
    public async Task<IActionResult> CreateInvoice([FromBody] InvoiceDto dto)
    {
        var invoice = _mapper.Map<Invoice>(dto);
        var created = await _repo.CreateInvoice(invoice);
        return Ok(_mapper.Map<InvoiceDto>(created));
    }

    [HttpPut("{id}/payment")]
    public async Task<IActionResult> AddPayment(Guid id, [FromBody] UpdatePaymentDto paymentDto)
    {
        var updated = await _repo.UpdatePayment(id, paymentDto.AmountPaid);
        if (updated == null)
            return NotFound(new { message = "Invoice not found" });

        return Ok(_mapper.Map<InvoiceDto>(updated));
    }
}
