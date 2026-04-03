import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function MyOrdersPage() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "",
    message: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "BUYER") return navigate("/");

      fetchOrders();
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const fetchOrders = () => {
    setLoading(true);

    API.get("/orders/buyer")
      .then(res => setOrders(res.data))
      .catch(() =>
        setSnackbar({ open: true, type: "error", message: "Failed to load orders" })
      )
      .finally(() => setLoading(false));
  };

  const handleCancel = (id) => {
    setCancellingId(id);

    API.put(`/orders/cancel/${id}`)
      .then(() => {
        setSnackbar({ open: true, type: "success", message: "Order cancelled" });
        fetchOrders();
      })
      .catch(() =>
        setSnackbar({ open: true, type: "error", message: "Cancel failed" })
      )
      .finally(() => setCancellingId(null));
  };

  return (
    <Container sx={{ marginTop: 4 }}>

      <Typography variant="h4" fontWeight="bold">My Orders</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>

          {orders.length === 0 ? (
            <Typography>No orders yet 🚀</Typography>
          ) : (
            orders.map(order => (

              <Grid item xs={12} md={6} key={order.id}>

                <Card sx={{ borderRadius: 3 }}>

                  <CardContent>

                    <Typography variant="h6" fontWeight="bold">
                      {order.productName}
                    </Typography>

                    <Typography>₹ {order.price}</Typography>

                    <Typography>
                      {new Date(order.orderDate).toLocaleString()}
                    </Typography>

                    {/* 🔥 PROGRESS TRACKING */}
                   <Box sx={{ display: "flex", gap: 1, mt: 1 }}> 
                      <Chip
                        label="Delivered"
                          color={order.status === "DELIVERED" ? "success" : "default"}
                      />

                    {/* 🔥 CANCELLED STATE */}
                       {order.status === "CANCELLED" && (
                      <Chip label="Cancelled" color="error" />
                       )}

                  </Box>

                    {/* 🔥 CANCEL */}
                    {order.status === "PLACED" && (
                      <Button
                        color="error"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={cancellingId === order.id}
                        onClick={() => handleCancel(order.id)}
                      >
                        Cancel Order
                      </Button>
                    )}

                  </CardContent>
                </Card>

              </Grid>
            ))
          )}

        </Grid>
      )}

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

export default MyOrdersPage;