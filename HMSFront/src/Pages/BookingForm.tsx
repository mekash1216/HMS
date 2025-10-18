import { useEffect, useState } from "react";
import {
  getGuests,
  addGuest,
  getAvailableRooms,
  createBooking,
  getBookings,
  cancelBooking,
} from "../Services/Services";
import { Guest } from "../Models/Guest";
import { Room } from "../Models/Room";
import { Booking } from "../Models/Booking";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  TextField,
  Button,
  Autocomplete,
  MenuItem,
  Divider,
  Box,
  Stack,
  Typography,
  Snackbar,
  Alert,
  Drawer,
  Grid,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const BookingForm = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGuestForm, setShowGuestForm] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    const fetchData = async () => {
      const guests = await getGuests();
      const rooms = await getAvailableRooms();
      const bookings = await getBookings();
      setGuests(guests);
      setRooms(rooms);
      setBookings(bookings);
    };
    fetchData();
  }, []);

  const handleAddGuest = async () => {
    if (
      !newGuest.firstName ||
      !newGuest.lastName ||
      !newGuest.email ||
      !newGuest.phone ||
      !newGuest.address
    ) {
      alert("Please fill all guest fields!");
      return;
    }

    const existing = guests.find(
      (g) => g.email.toLowerCase() === newGuest.email?.toLowerCase()
    );

    if (existing) {
      setSelectedGuest(existing);
      setSnackbarMsg("Existing guest selected.");
      setSnackbarOpen(true);
    } else {
      const added = await addGuest(newGuest as Guest);
      setGuests([...guests, added]);
      setSelectedGuest(added);
      setSnackbarMsg("Guest registered successfully!");
      setSnackbarOpen(true);
    }

    setShowGuestForm(false);
    setNewGuest({});
  };

  const handleSelectExistingGuest = (guest: Guest | null) => {
    if (guest) {
      setSelectedGuest(guest);
      setShowGuestForm(false);
    }
  };

const handleBooking = async () => {
  if (!selectedGuest || !selectedRoom || !checkInDate || !checkOutDate) {
    alert("Please fill all booking fields!");
    return;
  }

  const totalDays =
    (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
    (1000 * 3600 * 24);

  const totalPrice = totalDays * selectedRoom.pricePerNight;

  const booking: Booking = {
    guestId: selectedGuest.id,
    roomId: selectedRoom.id,
    checkInDate,
    checkOutDate,
    totalPrice,
  };

  try {
    // 🟢 Try to create booking
    await createBooking(booking);

    // Refresh bookings after successful creation
    const updatedBookings = await getBookings();
    setBookings(updatedBookings);

    // Show success snackbar
    setSnackbarMsg("Booking successful!");
    setSnackbarOpen(true);

    // Clear form
    setSelectedRoom(null);
    setCheckInDate("");
    setCheckOutDate("");
  } catch (error: any) {
    // 🔴 Handle conflict or server error messages
    if (error.response && error.response.status === 409) {
      // Show backend message: “This room is already booked for the selected dates.”
      setSnackbarMsg(error.response.data.message);
    } else if (error.response && error.response.data?.message) {
      // Other backend errors
      setSnackbarMsg(error.response.data.message);
    } else {
      // Unexpected error
      setSnackbarMsg("Failed to create booking. Please try again.");
    }
    setSnackbarOpen(true);
  }
};


  const filteredBookings = bookings.filter((b) => {
    const guest = guests.find((g) => g.id === b.guestId);
    return guest
      ? `${guest.firstName} ${guest.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : false;
  });

  const rows = filteredBookings
    .filter((b) => b.id && b.id !== "")
    .map((b, index) => {
      const guest = guests.find((g) => g.id === b.guestId);
      const room = rooms.find((r) => r.id === b.roomId);
      const checkIn = new Date(b.checkInDate);
      const checkOut = new Date(b.checkOutDate);
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      const price = room ? room.pricePerNight * nights : 0;
      const formattedPrice = new Intl.NumberFormat("en-ET", {
        style: "currency",
        currency: "ETB",
      }).format(price);

      return {
        id: b.id,
        guestName: guest ? `${guest.firstName} ${guest.lastName}` : "N/A",
        room: room ? `${room.roomNumber} - ${room.roomType}` : "N/A",
        checkIn: checkIn.toLocaleDateString(),
        checkOut: checkOut.toLocaleDateString(),
        totalPrice: formattedPrice,
      };
    });

  const columns: GridColDef[] = [
    { field: "guestName", headerName: "Guest Name", flex: 1 },
    { field: "room", headerName: "Room", flex: 1 },
    { field: "checkIn", headerName: "Check-In", flex: 1 },
    { field: "checkOut", headerName: "Check-Out", flex: 1 },
    { field: "totalPrice", headerName: "Total Price (Br)", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleEdit = (id: string | number) => {
    const booking = bookings.find((b) => b.id === id); // Find the booking by ID
    if (!booking) return;

    const guest = guests.find((g) => g.id === booking.guestId); // Get guest by guestId
    const room = rooms.find((r) => r.id === booking.roomId); // Get room by roomId

    // Set selected guest and room and booking dates in the state
    setSelectedGuest(guest || null);
    setSelectedRoom(room || null);
    setCheckInDate(booking.checkInDate);
    setCheckOutDate(booking.checkOutDate);

    setDrawerOpen(true); // Open the drawer for editing the booking
  };

  const handleDelete = async (id: string | number) => {
    const stringId = String(id);

    if (stringId.startsWith("fallback-")) {
      console.warn("Skipping delete: not a real booking ID.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      console.log(`Attempting to delete booking with ID: ${stringId}`);
      await cancelBooking(stringId);
      const updatedBookings = await getBookings();
      setBookings(updatedBookings);

      // Show success snackbar
      setSnackbarMsg("Booking deleted!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to delete booking:", error);
      setSnackbarMsg("Failed to delete booking.");
      setSnackbarOpen(true);
    }
  };
  const tableStyles = {
    "& .MuiDataGrid-row:hover .action-buttons": {
      display: "flex",
    },
  };

  return (
    <Box sx={{ px: 4, pt: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<MenuIcon />}
            onClick={() => setDrawerOpen(true)}
          >
            Open Booking Form
          </Button>
        </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search guest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Booking Records
      </Typography>
      <Box sx={{ height: 450, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          checkboxSelection
          sx={tableStyles}
        />
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 400, padding: 3 } }}
      >
        <Typography variant="h5" gutterBottom>
          Guest Booking Form
        </Typography>

        <Autocomplete
          options={guests}
          getOptionLabel={(g) => `${g.firstName} ${g.lastName}`}
          value={selectedGuest}
          onChange={(e, newVal) => handleSelectExistingGuest(newVal)}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.firstName} {option.lastName}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Select Existing Guest" fullWidth />
          )}
          sx={{ mb: 2 }}
        />

        <Divider>OR</Divider>

        {showGuestForm && (
          <Box>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Add New Guest
            </Typography>
            <Stack spacing={2} mt={1}>
              <TextField
                label="First Name"
                value={newGuest.firstName || ""}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, firstName: e.target.value })
                }
              />
              <TextField
                label="Last Name"
                value={newGuest.lastName || ""}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, lastName: e.target.value })
                }
              />
              <TextField
                label="Email"
                value={newGuest.email || ""}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, email: e.target.value })
                }
              />
              <TextField
                label="Phone"
                value={newGuest.phone || ""}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, phone: e.target.value })
                }
              />
              <TextField
                label="Address"
                value={newGuest.address || ""}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, address: e.target.value })
                }
              />
              <Button variant="outlined" onClick={handleAddGuest}>
                Add Guest
              </Button>
            </Stack>
          </Box>
        )}

        {selectedGuest && !showGuestForm && (
          <>
            <Divider sx={{ my: 3 }}>Booking Details</Divider>
            <TextField
              select
              label="Select Room"
              value={selectedRoom?.id || ""}
              onChange={(e) => {
                const roomId = e.target.value;
                const room = rooms.find((r) => r.id === roomId);
                setSelectedRoom(room || null);
              }}
              fullWidth
              sx={{ mb: 2 }}
            >
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.roomNumber} - {room.roomType} ({room.pricePerNight}{" "}
                    ETB/night)
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No rooms available</MenuItem>
              )}
            </TextField>

            <TextField
              type="date"
              label="Check-in Date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              type="date"
              label="Check-out Date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <Button
              onClick={handleBooking}
              variant="contained"
              color="primary"
              fullWidth
            >
              Book Room
            </Button>
          </>
        )}
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookingForm;
