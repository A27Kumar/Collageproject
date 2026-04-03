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
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function SellerOrdersPage() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

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
      if (decoded.role !== "SELLER") return navigate("/");

      fetchOrders();
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const fetchOrders = () => {
    setLoading(true);

    API.get("/orders/seller")
      .then(res => setOrders(res.data))
      .catch(() =>
        setSnackbar({ open: true, type: "error", message: "Failed to load orders" })
      )
      .finally(() => setLoading(false));
  };

  const handleConfirm = (id) => {
    setProcessingId(id);

    API.put('/orders/confirm/' + id)
      .then(() => {
        setSnackbar({ open: true, type: "success", message: "Order confirmed" });
        fetchOrders();
      })
      .catch(() =>
        setSnackbar({ open: true, type: "error", message: "Confirm failed" })
      )
      .finally(() => setProcessingId(null));
  };

  const handleDeliver = (id) => {
    setProcessingId(id);

    API.put('/orders/deliver/' + id)
      .then(() => {
        setSnackbar({ open: true, type: "success", message: "Order delivered" });
        fetchOrders();
      })
      .catch(() =>
        setSnackbar({ open: true, type: "error", message: "Delivery failed" })
      )
      .finally(() => setProcessingId(null));
  };

  return (
    <Container sx={{ marginTop: 4 }}>

      <Typography variant="h4" fontWeight="bold">Seller Orders</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>

          {orders.length === 0 ? (
            <Typography>No orders yet 📦</Typography>
          ) : (
            orders.map(order => (

              <Grid item xs={12} md={6} key={order.id}>

                <Card sx={{ borderRadius: 3, p: 1 }}>

                  <CardContent>

                    <Typography variant="h6" fontWeight="bold">
                      {order.productName}
                    </Typography>

                    <Typography>₹ {order.price}</Typography>

                    <Typography>
                      {new Date(order.orderDate).toLocaleString()}
                    </Typography>

                    {/* 🔥 STATUS */}
                    <Chip
                      label={order.status}
                      color={
                        order.status === "DELIVERED"
                          ? "success"
                          : order.status === "CONFIRMED"
                          ? "primary"
                          : order.status === "PLACED"
                          ? "warning"
                          : "error"
                      }
                      sx={{ mt: 1 }}
                    />

                    {/* 🔥 ACTIONS */}
                    {order.status === "PLACED" && (
                      <Button
                        fullWidth
                        sx={{ mt: 2 }}
                        variant="contained"
                        disabled={processingId === order.id}
                        onClick={() => handleConfirm(order.id)}
                      >
                        Confirm
                      </Button>
                    )}

                    {order.status === "CONFIRMED" && (
                      <Button
                        fullWidth
                        sx={{ mt: 1 }}
                        variant="outlined"
                        disabled={processingId === order.id}
                        onClick={() => handleDeliver(order.id)}
                      >
                        Deliver
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

export default SellerOrdersPage;