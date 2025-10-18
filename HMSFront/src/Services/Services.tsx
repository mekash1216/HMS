import axios from "axios";
import { Room } from "../Models/Room";
import { Guest } from "../Models/Guest";
import { environment } from "../environment";
import { Booking } from "../Models/Booking";
import { RegisterUser, User } from "../Models/User";
import { Role } from "../Models/Role";
import { LoginResponse } from "../Models/LoginResponse";
import { InvoiceRow } from "../Models/InvoiceRow";

const API_URI = environment.apiUrl;

//LOGIN $ LOGOUT

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const res = await axios.post<LoginResponse>(`${API_URI}/Auth/login`, {
    username,
    password,
  });
  return res.data;
};

export const logout = async (sessionToken: string) => {
  const res = await axios.post(`${API_URI}/Auth/logout`, { sessionToken });
  return res.data;
};

//USER MGT
export const getUsers = async (): Promise<User[]> => {
  const res = await axios.get<User[]>(`${API_URI}/UserRole`);
  return res.data;
};

export const registerUser = async (userData: RegisterUser) => {
  const res = await axios.post(`${API_URI}/UserRole/register`, userData);
  return res.data;
};

export const getRoles = async (): Promise<Role[]> => {
  const res = await axios.get<Role[]>(`${API_URI}/Role`);
  return res.data;
};

export const createRole = async (roleName: string) => {
  const res = await axios.post(`${API_URI}/Role/create`, `"${roleName}"`, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const assignRoleToUser = async (userId: string, roleName: string) => {
  const res = await axios.post(
    `${API_URI}/UserRole/${userId}/assign`,
    `"${roleName}"`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};

export const removeRoleFromUser = async (userId: string, roleName: string) => {
  const res = await axios.post(
    `${API_URI}/UserRole/${userId}/remove`,
    `"${roleName}"`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};

//PERMISSION
export const getAllPermissions = async (): Promise<
  { id: number; name: string }[]
> => {
  const res = await axios.get<{ id: number; name: string }[]>(
    `${API_URI}/Permission`
  );
  return res.data;
};

export const getRolePermissions = async (roleId: string): Promise<string[]> => {
  const res = await axios.get<string[]>(
    `${API_URI}/Role/${roleId}/permissions`
  );
  return res.data;
};

export const addNewPermission = async (permission: string) => {
  const res = await axios.post(
    `${API_URI}/Permission/create`,
    JSON.stringify(permission),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};
export const addPermissionToRole = async (
  roleId: string,
  permissionId: number
) => {
  const res = await axios.post(
    `${API_URI}/Role/${roleId}/permissions`,
    permissionId,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};
export const getUserPermissions = async (userId: string): Promise<string[]> => {
  const response = await axios.get<string[]>(
    `${API_URI}/UserPermission/${userId}/permissions`
  );
  return response.data;
};

export const removePermissionFromRole = async (
  roleId: string,
  permission: string
) => {
  const res = await axios.delete(
    `${API_URI}/Role/${roleId}/permissions/${encodeURIComponent(permission)}`
  );
  return res.data;
};

export const assignPermissionToUser = async (
  userId: string,
  permissionId: number
) => {
  return await axios.post(
    `${API_URI}/UserPermission/${userId}/permissions`,
    permissionId,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const removePermissionFromUser = async (
  userId: string,
  permissionName: string
) => {
  return await axios.delete(
    `${API_URI}/User/${userId}/permissions/${encodeURIComponent(
      permissionName
    )}`
  );
};

// 🏨 ROOM SERVICES

export const getRooms = async (): Promise<Room[]> => {
  const response = await axios.get<Room[]>(`${API_URI}/rooms`);
  return response.data;
};

export const getRoomById = async (id: string): Promise<Room> => {
  const response = await axios.get<Room>(`${API_URI}/rooms/${id}`);
  return response.data;
};

export const addRoom = async (room: Room): Promise<Room> => {
  const response = await axios.post<Room>(`${API_URI}/rooms`, room);
  return response.data;
};

export const updateRoom = async (id: string, room: Room): Promise<Room> => {
  const response = await axios.put<Room>(`${API_URI}/rooms/${id}`, room);
  return response.data;
};

export const deleteRoom = async (id: string): Promise<void> => {
  await axios.delete(`${API_URI}/rooms/${id}`);
};
export const getAvailableRooms = async (): Promise<Room[]> => {
  const response = await axios.get<Room[]>(`${API_URI}/rooms`);
  return response.data;
};
// Services.ts
export const getAvailableRoomsByDate = async (
  checkIn: string,
  checkOut: string
): Promise<Room[]> => {
  const response = await axios.get<Room[]>(
    `${API_URI}/rooms/availability?checkIn=${checkIn}&checkOut=${checkOut}`
  );
  return response.data;
};

// 👤 GUEST SERVICES

export const getGuests = async (): Promise<Guest[]> => {
  const response = await axios.get<Guest[]>(`${API_URI}/guests`);
  return response.data;
};

export const addGuest = async (guest: Guest): Promise<Guest> => {
  const response = await axios.post<Guest>(`${API_URI}/guests`, guest);
  return response.data;
};

// 📅 BOOKING SERVICES
export const getBookings = async (): Promise<Booking[]> => {
  const response = await axios.get<Booking[]>(`${API_URI}/booking`);
  return response.data;
};

export const createBooking = async (booking: Booking): Promise<Booking> => {
  const response = await axios.post<Booking>(`${API_URI}/booking`, booking);
  return response.data;
};

export const getBookingById = async (id: string): Promise<Booking> => {
  const response = await axios.get<Booking>(`${API_URI}/bookings/${id}`);
  return response.data;
};
export const updateBookings = async (
  id: string,
  book: Booking
): Promise<Booking> => {
  const response = await axios.put<Booking>(`${API_URI}/bookings/${id}`, book);
  return response.data;
};

export const cancelBooking = async (id: string): Promise<void> => {
  await axios.delete(`${API_URI}/Booking/${id}`);
};

// INVOICE SERVICES
export const getInvoices = async (): Promise<InvoiceRow[]> => {
  try {
    const response = await axios.get<InvoiceRow[]>(`${API_URI}/Invoices`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
};

// ---------------------
// Add payment to invoice
// ---------------------
export const addPayment = async (
  invoiceId: string,
  payment: { amountPaid: number }
): Promise<InvoiceRow> => {
  try {
    const response = await axios.put<InvoiceRow>(
      `${API_URI}/Invoices/${invoiceId}/payment`,
      payment
    );
    return response.data;
  } catch (error) {
    console.error("Error adding payment:", error);
    throw error;
  }
};
