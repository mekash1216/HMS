import { useEffect, useState } from "react";
import { getGuests, addGuest } from "../Services/Services";
import { Guest } from "../Models/Guest";
import { TextField, Button, Autocomplete } from "@mui/material";

const Guestform = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({});

  useEffect(() => {
    const fetchGuests = async () => {
      const guestList = await getGuests();
      setGuests(guestList);
    };
    fetchGuests();
  }, []);

  const handleAddGuest = async () => {
    if (!newGuest.firstName || !newGuest.lastName || !newGuest.email) {
      alert("Please fill all required fields!");
      return;
    }
    const addedGuest = await addGuest(newGuest as Guest);
    setGuests([...guests, addedGuest]);
    setSelectedGuest(addedGuest);
  };

  return (
    <div>
      <h2>Guest Information</h2>
      
      {/* Guest Selection */}
      <Autocomplete
        options={guests}
        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
        value={selectedGuest}
        onChange={(event, newValue) => setSelectedGuest(newValue)}
        renderInput={(params) => <TextField {...params} label="Select Guest" />}
      />

      {/* OR Add New Guest */}
      <h3>New Guest</h3>
      <TextField label="First Name" onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })} />
      <TextField label="Last Name" onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })} />
      <TextField label="Email" onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })} />
      <Button onClick={handleAddGuest}>Add Guest</Button>
    </div>
  );
};

export default Guestform;
