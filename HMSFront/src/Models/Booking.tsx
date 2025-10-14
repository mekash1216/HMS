export interface Booking {
    id?: string;
    guestId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
  }
  export interface BookingDetails {
      id: string;
      guestFullName: string;
      roomDetails: string;
      checkInDate: string;
      checkOutDate: string;
      totalPrice: number;
  }
  