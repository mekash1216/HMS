public interface IBookingRepository
{
    Task<IEnumerable<Booking>> GetAllAsync();
    Task<Booking> CreateAsync(Booking booking);
    Task<Booking?> UpdateAsync(Booking updatedBooking);
    Task<bool> DeleteAsync(Guid id);
    Task<List<Guid>> GetBookedRoomIdsBetweenDates(DateTime checkIn, DateTime checkOut);

}
