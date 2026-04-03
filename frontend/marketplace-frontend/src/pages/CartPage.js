import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import API from "../services/api";

function CartPage() {

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "",
    message: ""
  });

  const hasShown = useRef(false); // 🔥 prevents double snackbar

  // Load cart
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    setSnackbar({ open: false, type: "", message: "" });
  }, []);

  // Remove item
  const handleRemove = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Total
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  // 🔥 helper: show snackbar only once
  const showSnackbarOnce = (type, message) => {
    if (!hasShown.current) {
      setSnackbar({
        open: true,
        type,
        message
      });
      hasShown.current = true;
    }
  };

  // Checkout
  const handleCheckout = async () => {

    if (loading || cart.length === 0) return;

    setLoading(true);

    try {
      const results = await Promise.allSettled(
        cart.map(product => API.post(`/orders/${product.id}`))
      );

      const successCount = results.filter(r => r.status === "fulfilled").length;

      if (successCount === cart.length) {
        localStorage.removeItem("cart");
        setCart([]);

        showSnackbarOnce("success", "All orders placed successfully");

      } else if (successCount > 0) {
        showSnackbarOnce("warning", "Some orders failed");

      } else {
        showSnackbarOnce("error", "Checkout failed");
      }

    } catch (err) {
      console.log(err);
      showSnackbarOnce("error", "Checkout failed");
    }

    setLoading(false);
  };

  return (
    <Container sx={{ marginTop: 4 }}>

      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {cart.length === 0 ? (
        <Typography>Cart is empty</Typography>
      ) : (
        <>
          <Grid container spacing={3}>

            {cart.map(item => (

              <Grid item xs={12} md={6} key={item.id}>

                <Card
                  sx={{
                    borderRadius: 3,
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent>

                    <Typography variant="h6">
                      {item.name}
                    </Typography>

                    <Typography sx={{ marginTop: 1 }}>
                      ₹ {item.price}
                    </Typography>

                    <Button
                      color="error"
                      sx={{ marginTop: 2 }}
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </Button>

                  </CardContent>
                </Card>

              </Grid>

            ))}

          </Grid>

          {/* Total + Checkout */}
          <Box sx={{ marginTop: 4 }}>

            <Typography variant="h6">
              Total: ₹ {totalPrice}
            </Typography>

            <Button
              variant="contained"
              sx={{ marginTop: 2 }}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Checkout"}
            </Button>

          </Box>
        </>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => {
          setSnackbar({ open: false, type: "", message: "" });
          hasShown.current = false; // 🔥 reset for next checkout
        }}
      >
        <Alert severity={snackbar.type} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Container>
  );
}

export default CartPage;

//error occuring due to restrict mode in index.js, to avoid that remove the strict mode from index.js file and then check the cart page.