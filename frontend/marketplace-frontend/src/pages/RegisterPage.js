import React, { useState } from "react";
import API from "../services/api";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function RegisterPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "BUYER"
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {

    if (!form.name || !form.email || !form.password) {
      setSnackbar({
        open: true,
        type: "error",
        message: "All fields required"
      });
      return;
    }

    API.post("/users/register", form)
      .then(() => {
        setSnackbar({
          open: true,
          type: "success",
          message: "Registered successfully"
        });

        setTimeout(() => navigate("/login"), 1000);
      })
      .catch(err => {
        setSnackbar({
          open: true,
          type: "error",
          message: err.response?.data || "Registration failed"
        });
      });
  };

  return (
    <Container sx={{ mt: 5, maxWidth: 400 }}>

      <Typography variant="h4" gutterBottom>
        Register
      </Typography>

      <TextField
        fullWidth
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        type="password"
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        select
        fullWidth
        label="Role"
        name="role"
        value={form.role}
        onChange={handleChange}
        sx={{ mb: 3 }}
      >
        <MenuItem value="BUYER">Buyer</MenuItem>
        <MenuItem value="SELLER">Seller</MenuItem>
      </TextField>

      <Button
        fullWidth
        variant="contained"
        onClick={handleRegister}
      >
        Register
      </Button>

      <Button
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate("/login")}
      >
        Already have an account? Login
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false })}
      >
        <Alert severity={snackbar.type} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Container>
  );
}

export default RegisterPage;