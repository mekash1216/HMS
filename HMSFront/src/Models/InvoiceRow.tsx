import { Booking } from "./Booking";

export interface InvoiceRow {
  id: string;
  bookingId: string;
  totalAmount: number;
  amountPaid: number;
  paymentStatus: string;
}
