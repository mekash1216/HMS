import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Import images from assets
import heroImage from "../assets/1.jpg";
import wifiImage from "../assets/2.jpg";
import roomServiceImage from "../assets/3.jpg";
import poolImage from "../assets/4.jpg";
import room1Image from "../assets/5.jpg";
import room2Image from "../assets/6.jpg";
import room3Image from "../assets/1.jpg";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", backgroundColor: "#f9f9f9", overflowX: "hidden" }}>
      {/* Transparent Sticky Navbar */}
     <AppBar
        position="fixed"
        sx={{
            backgroundColor: "rgba(242, 243, 241, 0.3)", // darker glassy effect
            boxShadow: "none",
            backdropFilter: "blur(10px)",
        }}
        >

        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
          }}
        >
       <Box
  sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
  onClick={() => navigate("/")}
>
  <img
    src={room2Image}
    alt="Logo"
        style={{ width: 40, height: 40, marginRight: 8,borderRadius:100 }}
    />
    <Typography
        variant="h6"
        sx={{
        fontWeight: "bold",
        color: "#FFD700",
        textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
        }}
    >
        MyHotel
    </Typography>
    </Box>

          <Box display="flex" gap={3}>
            {["Home", "About", "Contact"].map((item) => (
            <Button
            key={item}
            sx={{
                color: "#FFD700",           // golden color for contrast
                fontWeight: 700,
                fontFamily: "Roboto, Arial, sans-serif",
                "&:hover": {
                backgroundColor: "rgba(255, 215, 0, 0.2)", // subtle hover glow
                transform: "scale(1.1)",
                transition: "0.3s",
                },
            }}
            onClick={() => navigate(item.toLowerCase())}
            >
            {item}
            </Button>


            ))}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFD700",
                color: "#000",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#e1d9c1ff",
                  transform: "scale(1.05)",
                },
              }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center",
          px: 2,
          margin: 0,
          mt: "64px", // height of AppBar
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
        >
          Welcome to MyHotel
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            maxWidth: 600,
            textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
          }}
        >
          Experience luxury, comfort, and world-class services at unbeatable prices.
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 4,
            background: "linear-gradient(90deg, #FFD700, #FFC107)",
            color: "#000",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            "&:hover": {
              background: "linear-gradient(90deg, #FFC107, #FFD700)",
              transform: "scale(1.05)",
            },
          }}
          onClick={() => navigate("/login")}
        >
          Get Started
        </Button>
      </Box>

      {/* Services Section */}
      <Box sx={{ width: "100%", py: 8, textAlign: "center", px: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="body1" sx={{ mb: 5 }}>
          We provide exceptional facilities to make your stay memorable.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[{ title: "Free Wi-Fi", img: wifiImage },
            { title: "24/7 Room Service", img: roomServiceImage },
            { title: "Swimming Pool", img: poolImage }].map((service, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={service.img}
                  alt={service.title}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {service.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Rooms Section */}
      <Box sx={{ width: "100%", py: 8, backgroundColor: "#fff", textAlign: "center", px: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Our Rooms
        </Typography>
        <Typography variant="body1" sx={{ mb: 5 }}>
          Choose from a variety of rooms designed for your comfort.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[{ title: "Deluxe Room", price: "$120/night", img: room1Image },
            { title: "Suite", price: "$200/night", img: room2Image },
            { title: "Single Room", price: "$80/night", img: room3Image }].map((room, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={room.img}
                  alt={room.title}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {room.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {room.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer */}
      <Box sx={{ width: "100%", py: 4, textAlign: "center", backgroundColor: "#222", color: "#fff" }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} MyHotel. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
