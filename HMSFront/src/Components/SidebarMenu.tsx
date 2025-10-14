import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, Hotel, Event, AccountCircle, Settings, Book, People, Key, Login } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { hasPermission } from "../Utils/permissions";

interface SidebarMenuProps {
  open: boolean;
}

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/" },
  { text: "Role Management", icon: <Key />, path: "/roles", permission: "canManageRoles" },
  { text: "User Management", icon: <People />, path: "/users", permission: "canManageUsers" },
  { text: "Rooms", icon: <Hotel />, path: "/rooms", permission: "canManageRooms" },
  { text: "Bookings", icon: <Book />, path: "/bookings", permission: "canManageBookings" },
  { text: "Guests", icon: <AccountCircle />, path: "/guests", permission: "canManageGuests" },
  { text: "Settings", icon: <Settings />, path: "/settings", permission: "canAccessSettings" }
];

const SidebarMenu: React.FC<SidebarMenuProps> = ({ open }) => {
  return (
    <List>
      {menuItems
        .filter(item => !item.permission || hasPermission(item.permission))  
        .map(({ text, icon, path }) => (
          <ListItemButton key={text} component={Link} to={path}>
            <ListItemIcon>{icon}</ListItemIcon>
            {open && <ListItemText primary={text} />}
          </ListItemButton>
        ))}
    </List>
  );
};

export default SidebarMenu;
