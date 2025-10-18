using HotelManagementAPI.Data;
using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

public class BookingRepository : IBookingRepository
{
    public readonly ApplicationDbContext _context;
    public BookingRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<IEnumerable<Booking>> GetAllAsync()
    {
        return await _context.Bookings
        .Include(b => b.Guest)
        .Include(b => b.Room)
        .ToListAsync();
    }
    public async Task<Booking> CreateAsync(Booking booking)
    {
        var room = await _context.Rooms.FindAsync(booking.RoomId);
        if (room == null)
            throw new Exception("Room not found");

        var totalDays = (booking.CheckOutDate - booking.CheckInDate).Days;
        booking.TotalPrice = totalDays * room.PricePerNight;

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        // ✅ After booking is saved, create a corresponding invoice
        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            BookingId = booking.Id,
            TotalAmount = booking.TotalPrice,
            AmountPaid = 0,
            PaymentStatus = "Unpaid"
        };

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();

        var savedBooking = await _context.Bookings
            .Include(b => b.Guest)
            .Include(b => b.Room)
            .FirstOrDefaultAsync(b => b.Id == booking.Id);

        return savedBooking!;
    }



    public async Task<Booking?> UpdateAsync(Booking updatedBooking)
    {
        var existing = await _context.Bookings.FindAsync(updatedBooking.Id);
        if (existing == null)
            return null;

        // ✅ Check room availability excluding the current booking
        bool isAvailable = !await _context.Bookings
            .AnyAsync(b =>
                b.Id != updatedBooking.Id &&
                b.RoomId == updatedBooking.RoomId &&
                b.CheckInDate < updatedBooking.CheckOutDate &&
                b.CheckOutDate > updatedBooking.CheckInDate
            );

        if (!isAvailable)
            throw new Exception("Room is already booked for the selected dates.");

        existing.GuestId = updatedBooking.GuestId;
        existing.RoomId = updatedBooking.RoomId;
        existing.CheckInDate = updatedBooking.CheckInDate;
        existing.CheckOutDate = updatedBooking.CheckOutDate;

        var room = await _context.Rooms.FindAsync(updatedBooking.RoomId);
        if (room == null)
            throw new Exception("Room not found");

        var totalDays = (updatedBooking.CheckOutDate - updatedBooking.CheckInDate).Days;
        existing.TotalPrice = totalDays * room.PricePerNight;

        await _context.SaveChangesAsync();

        return existing;
    }


    public async Task<List<Guid>> GetBookedRoomIdsBetweenDates(DateTime checkIn, DateTime checkOut)
    {
        // fetch all RoomIds where booking overlaps with the given date range
        return await _context.Bookings
            .Where(b => b.CheckInDate < checkOut && b.CheckOutDate > checkIn)
            .Select(b => b.RoomId)
            .Distinct()
            .ToListAsync();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking == null)
            return false;

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<bool> IsRoomAvailableAsync(Guid roomId, DateTime checkIn, DateTime checkOut)
    {
        return !await _context.Bookings
            .AnyAsync(b =>
                b.RoomId == roomId &&
                b.CheckInDate < checkOut &&
                b.CheckOutDate > checkIn
            );
    }




}