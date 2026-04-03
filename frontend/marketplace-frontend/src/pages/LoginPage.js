import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // 🔥 Prevent logged-in users from seeing login page
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/");
    }
  }, [navigate]);

  // 🔥 Login handler (clean + no double trigger)
  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    API.post("/users/login", { email, password })
      .then(res => {
        const token = res.data;

        localStorage.setItem("token", token);

        // ✅ Redirect after login
        navigate("/");
        window.location.reload(); // Force reload to sync Navbar
      })
      .catch(err => {
        const message =
          err.response?.data?.message ||
          err.response?.data ||
          "Invalid credentials";

        alert(message);
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, marginTop: 8 }}>

        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        {/* 🔥 FORM (handles Enter automatically) */}
        <Box
          component="form"
          onSubmit={handleLogin}
          display="flex"
          flexDirection="column"
          gap={2}
        >

          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
          >
            Login
          </Button>

        </Box>

      </Paper>
    </Container>
  );
}

export default LoginPage;



