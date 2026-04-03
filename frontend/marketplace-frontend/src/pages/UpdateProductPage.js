import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function UpdateProductPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: ""
  });

  // 🔥 Load product details
  useEffect(() => {
    API.get('/products/details/' + id)
      .then(res => {
        setProduct(res.data);
      })
      .catch(() => {
        alert("Failed to load product");
      });
  }, [id]);

  // 🔥 Handle change
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 Update product
  const handleUpdate = () => {
    API.put('/products/' + id, product)
      .then(() => {
        alert("Product updated");
        navigate("/seller-dashboard");
      })
      .catch(() => {
        alert("Update failed");
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, marginTop: 8 }}>

        <Typography variant="h4" gutterBottom>
          Update Product
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>

          <TextField
            label="Name"
            name="name"
            value={product.name}
            onChange={handleChange}
          />

          <TextField
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
          />

          <TextField
            label="Price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
          />

          <TextField
            label="Category"
            name="category"
            value={product.category}
            onChange={handleChange}
          />

          <TextField
            label="Image URL"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
          />

          <Button
            variant="contained"
            onClick={handleUpdate}
          >
            Update Product
          </Button>

        </Box>

      </Paper>
    </Container>
  );
}

export default UpdateProductPage;