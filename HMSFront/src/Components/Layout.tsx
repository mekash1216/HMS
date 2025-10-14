import  { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
          <Box
          sx={{
            display: "flex",
            bgcolor: darkMode ? "#ddd" : "#f4f4f4",
            width: "100vw",
            minHeight: "100vh",
            overflowX: "hidden",
          }}
        >
        
      <CssBaseline />
      <Sidebar darkmode={darkMode} setDarkMode={setDarkMode} open={sidebarOpen} setOpen={setSidebarOpen} />
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: `${sidebarOpen ? 40 : 30}px`, 
          transition: "all 0.3s ease-in-out",
          overflowX: "hidden",
          
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
