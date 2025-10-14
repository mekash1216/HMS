import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { AccountCircle, Lock, Person } from "@mui/icons-material";
import { login } from "../Services/Services";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/1.jpg"; // 🖼️ Use the same hero image

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    setError("");
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem("sessionToken", data.sessionToken);
      localStorage.setItem("userRoles", JSON.stringify(data.roles));
      localStorage.setItem("userPermissions", JSON.stringify(data.permissions));
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error(err);
      const msg =
        err.response?.data ||
        err.message ||
        "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${heroImage})`, // 🌆 Background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Overlay for better contrast */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.5)", // semi-transparent dark overlay
          backdropFilter: "blur(5px)", // frosted glass effect
          zIndex: 1,
        }}
      />

      <Paper
        elevation={12}
        sx={{
          p: 4,
          width: "90%",
          maxWidth: 420,
          minHeight: 400,
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.9)", // glassy card
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          zIndex: 2,
          backdropFilter: "blur(10px)",
        }}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: "#1976d2" }}>
            <Person fontSize="large" />
          </Avatar>
        </Box>

        <Typography
          variant="h5"
          mb={2}
          textAlign="center"
          fontWeight="medium"
          color="text.primary"
        >
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            background: "linear-gradient(to right, #4facfe, #00f2fe)",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: 2,
            "&:hover": {
              background: "linear-gradient(to right, #00f2fe, #4facfe)",
            },
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
