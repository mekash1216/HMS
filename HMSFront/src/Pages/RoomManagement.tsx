import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import { Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import {
  Paper,
  TextField,
  Button,
  IconButton,
  Drawer,
  Box,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Room } from '../Models/Room';
import { getRooms, addRoom, updateRoom, deleteRoom } from '../Services/Services';
import WarningIcon from '@mui/icons-material/Warning';

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [roomForm, setRoomForm] = useState<Room>({
    id: '',
    roomNumber: '',
    roomType: '',
    status: 'Available',
    pricePerNight: 0
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        const fetchedRooms = await getRooms();
        setRooms(fetchedRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRoomsData();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredRooms = rooms.filter((room) =>
    (room.roomNumber && room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (room.roomType && room.roomType.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (room.status && room.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddRoom = async () => {
    if (!roomForm.roomNumber || !roomForm.roomType || !roomForm.status || roomForm.pricePerNight <= 0) {
      alert('Please fill all required fields correctly!');
      return;
    }

    try {
      const newRoom: Room = {
        id: uuidv4(),
        roomNumber: roomForm.roomNumber.trim(),
        roomType: roomForm.roomType.trim(),
        status: roomForm.status.trim(),
        pricePerNight: roomForm.pricePerNight,
      };

      const addedRoom = await addRoom(newRoom);
      setRooms((prevRooms) => [...prevRooms, addedRoom]);

      setSnackbarMessage('Room successfully registered!');
      setSnackbarOpen(true);

      closeDrawer();
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleUpdateRoom = async (updatedRoom: Room) => {
    if (!updatedRoom.roomNumber || !updatedRoom.roomType || !updatedRoom.status || updatedRoom.pricePerNight <= 0) {
      alert('Please fill all required fields!');
      return;
    }
  
    try {
      // Optimistic Update - Immediately update the room in the state
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === updatedRoom.id ? { ...room, ...updatedRoom } : room
        )
      );
  
      // Call the update API (no need to use updatedData here)
      await updateRoom(updatedRoom.id, updatedRoom);
  
      // After the update API call succeeds, show success message
      setSnackbarMessage('Room successfully updated!');
      setSnackbarOpen(true);
  
      closeDrawer();
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };
  
  const handleDeleteRoom = async () => {
    if (roomToDelete) {
      try {
        await deleteRoom(roomToDelete);
        setRooms(rooms.filter((room) => room.id !== roomToDelete));

        setSnackbarMessage('Room successfully deleted!');
        setSnackbarOpen(true);

        setOpenDeleteDialog(false);
        setRoomToDelete(null);
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoomForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const openDrawer = (room?: Room) => {
    setSelectedRoom(room || null);
    setRoomForm(
      room || {
        id: uuidv4(),
        roomNumber: '',
        roomType: '',
        status: 'Available',
        pricePerNight: 0
      }
    );
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRoom(null);
  };

  const handleSubmit = () => {
    selectedRoom ? handleUpdateRoom(roomForm) : handleAddRoom();
  };

  const columns: GridColDef[] = [
    { field: 'roomNumber', headerName: 'Room Number', flex: 1 },
    { field: 'roomType', headerName: 'Room Type', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'pricePerNight', headerName: 'Price Per Night', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <div className="action-buttons">
          <IconButton onClick={() => openDrawer(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => { setRoomToDelete(params.row.id); setOpenDeleteDialog(true); }}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const tableStyles = {
    '& .MuiDataGrid-row:hover .action-buttons': {
      display: 'flex',
    },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          size="small"
          InputProps={{ startAdornment: (<IconButton><SearchIcon /></IconButton>) }}
        />
        <Button variant="contained" color="primary" onClick={() => openDrawer()} startIcon={<AddIcon />}>Add Room</Button>
      </div>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredRooms}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          checkboxSelection
          sx={tableStyles}
        />
      </Paper>

      {/* Drawer (Side Panel) for Room Form */}
      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        <Box sx={{ width: 350, p: 3 }}>
          <Typography variant="h6">{selectedRoom ? 'Edit Room' : 'Add Room'}</Typography>
          <TextField label="Room Number" name="roomNumber" value={roomForm.roomNumber} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Room Type" name="roomType" value={roomForm.roomType} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Status" name="status" value={roomForm.status} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Price Per Night" name="pricePerNight" value={roomForm.pricePerNight} onChange={handleInputChange} fullWidth margin="normal" type="number" />
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>
            {selectedRoom ? 'Update Room' : 'Add Room'}
          </Button>
        </Box>
      </Drawer>

      {/* Snackbar for success messages */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={2000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)} 
        sx={{ top: 0, position: 'absolute' }}
      >
        <DialogTitle>
          <WarningIcon color="error" sx={{ marginRight: 1 }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this room?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteRoom} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomManagement;
