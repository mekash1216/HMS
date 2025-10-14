import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import { Box } from "@mui/material";

const PublicLayout: React.FC = () => {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh", margin: 0, padding: 0 }}>
      <PublicNavbar />
      <Box component="main" sx={{ width: "100%", margin: 0, padding: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default PublicLayout;
