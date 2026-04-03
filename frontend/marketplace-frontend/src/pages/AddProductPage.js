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
import { jwtDecode } from "jwt-decode";

function AddProductPage() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Route Protection
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.role !== "SELLER") {
        navigate("/",{ state: { refresh: true } });
      }
    } catch (err) {
      console.log("Invalid token");
      localStorage.removeItem("token");
      navigate("/login");
    }

  }, [navigate]);

  // ✅ Submit handler
  const handleSubmit = () => {

    // Validation
    if (!name || !description || !price || !category) {
      alert("All fields are required");
      return;
    }

    if (price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    setLoading(true);

    API.post("/products", {
      name,
      description,
      price,
      category,
      imageUrl  // Placeholder image
    })
    .then(() => {
      navigate("/");
    })
    .catch(err => {
      console.log(err);
      alert(err.response?.data || "Error adding product");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, marginTop: 8 }}>

        <Typography variant="h4" gutterBottom>
          Add Product
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          
          <TextField
            label="Image URL"
            fullWidth
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <TextField
            label="Product Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <TextField
            label="Category"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </Button>

        </Box>

      </Paper>
    </Container>
  );
}

export default AddProductPage;