import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function SellerDashboardPage() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Delete dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  //notification state
  const [notifications, setNotifications] = useState([]);


  // 🔥 Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "",
    message: ""
  });

  // 🔥 Fetch products
  const fetchProducts = () => {
    setLoading(true);

    API.get("/products/seller")
      .then(res => {
        setProducts(res.data);
      })
      .catch(() => {
        setSnackbar({
          open: true,
          type: "error",
          message: "Failed to load products"
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
    //fetch notification
  const fetchNotifications = () => {

    API.get("/products/seller/notifications")
      .then(res => setNotifications(res.data))
      .catch(() => {
        setSnackbar({
          open: true,
          type: "error",
          message: "Failed to load notifications"
        });
      });
    };
    
    useEffect(() => {
    fetchNotifications();
  }, []);

  // 🔥 Open delete dialog
  const handleOpenDialog = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  // 🔥 Confirm delete
  const handleConfirmDelete = () => {
    API.delete("/products/" + selectedId)
      .then(() => {
        setSnackbar({
          open: true,
          type: "success",
          message: "Product deleted"
        });
        fetchProducts();
      })
      .catch(() => {
        setSnackbar({
          open: true,
          type: "error",
          message: "Delete failed"
        });
      });

    setOpenDialog(false);
  };

  return (
    <Container sx={{ marginTop: 4 }}>

      <Typography variant="h4" gutterBottom>
        My Products
      </Typography>
      
      {notifications.length > 0 && (
     <Box sx={{ mb: 2 }}>
        {notifications.map(n => (
      <Alert
        key={n.id}
        severity="success"
        onClose={() => {
          API.put("/products/seller/notify-read/" + n.id);
          fetchNotifications();
        }}
        sx={{ mb: 1 }}
      >
        Your product "{n.name}" is approved 🎉
      </Alert>
       ))}
      </Box>
      )}

       
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3}>

          {products.length === 0 ? (
            <Typography>No products added yet</Typography>
          ) : (
            products.map(product => (

              <Grid item xs={12} sm={6} md={4} key={product.id}>

                <Card
                  sx={{
                    borderRadius: 3,
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-5px)"
                    }
                  }}
                >

                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      product.imageUrl ||
                      "https://via.placeholder.com/400x300"
                    }
                  />

                  <CardContent>

                    <Chip 
                        label={product.approved ? "Approved" : "Pending"}
                        color={product.approved ? "success" : "warning"}
                        size="small"
                        sx={{ marginBottom: 1 }}
                    />

                    <Typography variant="h6" fontWeight="bold">
                      {product.name}
                    </Typography>

                    <Typography color="text.secondary">
                      ₹ {product.price}
                    </Typography>

                    {/* 🔥 ACTION BUTTONS */}
                    <Grid container spacing={1} sx={{ marginTop: 1 }}>

                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/update-product/" + product.id);
                          }}
                        >
                          Update
                        </Button>
                      </Grid>

                      <Grid item xs={6}>
                        <Button
                          color="error"
                          fullWidth
                          onClick={() => handleOpenDialog(product.id)}
                        >
                          Delete
                        </Button>
                      </Grid>

                    </Grid>

                  </CardContent>

                </Card>

              </Grid>

            ))
          )}

        </Grid>
      )}

      {/* 🔥 DELETE CONFIRMATION DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔥 SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar({ open: false, type: "", message: "" })
        }
      >
        <Alert severity={snackbar.type} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Container>
  );
}

export default SellerDashboardPage;