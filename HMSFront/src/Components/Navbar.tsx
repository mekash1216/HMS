import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Switch,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  ListItemIcon,
} from "@mui/material";
import { Brightness4, Brightness7, Logout, Notifications, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { logout } from "../Services/Services";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, sidebarOpen }) => {
  const navigate = useNavigate();

  // For profile menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // You can replace this with your real notification count
  const [notificationCount, setNotificationCount] = useState(3);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
  const sessionToken = localStorage.getItem("sessionToken");
  if (!sessionToken) {
    navigate("/login");
    return;
  }
  try {
    await logout(sessionToken); // Your API call to logout
  } catch (err) {
    console.error(err);
  }
  localStorage.removeItem("sessionToken");
  
  navigate("/login", { replace: true });
  
  // Force reload to prevent back navigation caching
  window.location.reload();
};


  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sidebarOpen ? 240 : 70}px)`,
        ml: `${sidebarOpen ? 240 : 70}px`,
        transition: "all 0.3s ease-in-out",
        backgroundColor: darkMode ? "#333" : "#fff",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box p={2} display="flex" alignItems="center">
          <Avatar
            alt="User"
            src="/images/SKH.jpg"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              marginRight: 1,
            }}
          />
          <Typography variant="h6" sx={{ marginLeft: 1 }}>
            Dashboard
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            icon={<Brightness7 />}
            checkedIcon={<Brightness4 />}
          />

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton size="large" color="inherit">
              <Badge badgeContent={notificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Dropdown */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              color="inherit"
            >
              <Avatar
                alt="User"
                src="/images/SKH.jpg"
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1.5,
                minWidth: 180,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={() => navigate("/profile")}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
