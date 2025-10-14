import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PublicNavbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(90deg, #4facfe, #00f2fe)",
        width: "100%",      // full width
        left: 0,            // align to left
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "1200px", // optional: limit content width
          margin: "0 auto",   // center navbar content
          width: "100%",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          MyCompany
        </Typography>

        <Box display="flex" gap={3}>
          <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
          <Button color="inherit" onClick={() => navigate("/about")}>About</Button>
          <Button color="inherit" onClick={() => navigate("/contact")}>Contact</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#fff", color: "#1976d2", fontWeight: "bold" }}
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PublicNavbar;
