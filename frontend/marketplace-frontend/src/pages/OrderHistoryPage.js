
import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Pagination
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function ProductsPage() {

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const token = localStorage.getItem("token");

  let role = null;

  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
  }

  const fetchProducts = (pageNumber) => {
    API.get(`/products?page=${pageNumber - 1}&size=6`)
      .then(res => {
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handlePlaceOrder = (productId) => {

    API.post(`/orders?productId=${productId}`)
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.log(err);
      });

  };

  return (
    <Container sx={{ marginTop: 4 }}>

      <Typography variant="h4" gutterBottom>
        Marketplace Products
      </Typography>

      <Grid container spacing={3}>

        {products.map(product => (

          <Grid item xs={12} sm={6} md={4} key={product.id}>

            <Card>

              <CardContent>

                <Typography variant="h6">
                  {product.name}
                </Typography>

                <Typography color="text.secondary">
                  {product.category}
                </Typography>

                <Typography variant="body1" sx={{ marginTop: 1 }}>
                  ₹ {product.price}
                </Typography>

                {role === "BUYER" && (
                  <Button
                    variant="contained"
                    sx={{ marginTop: 2 }}
                    onClick={() => handlePlaceOrder(product.id)}
                  >
                    Place Order
                  </Button>
                )}

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>

      <Pagination
        sx={{ marginTop: 4 }}
        count={totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" variant="filled">
          Order placed successfully
        </Alert>
      </Snackbar>

    </Container>
  );
}

export default ProductsPage;