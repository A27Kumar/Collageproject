import React, { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert,
  Box,
  Grid,
  TextField,
  Rating,
  IconButton,
  Chip
} from "@mui/material";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { jwtDecode } from "jwt-decode";

function ProductDetailsPage() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingRating, setEditingRating] = useState(0);
  const [editingComment, setEditingComment] = useState("");

  const [sortType, setSortType] = useState("latest");
  
  const [replyText, setReplyText] = useState("");
  const [replyingId, setReplyingId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "",
    message: ""
  });

  const [loadingOrder, setLoadingOrder] = useState(false);

  // 🔐 Decode token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setUserId(decoded.userId); // ✅ FIXED (not id)
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  // 🔥 Fetch product
  useEffect(() => {
    API.get(`/products/details/${id}`)
      .then(res => setProduct(res.data));
  }, [id]);

  // 🔥 Fetch reviews
  const fetchReviews = useCallback( () => {
    API.get(`/reviews/${id}?sort=${sortType}`)
      .then(res => setReviews(res.data))
      .catch(() =>
        setSnackbar({ open: true, type: "error", message: "Failed to load reviews" })
      );
  }, [id, sortType]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // 🔥 Buy
  const handleBuy = () => {
    setLoadingOrder(true);

    API.post(`/orders/${id}`)
      .then(() =>
        setSnackbar({ open: true, type: "success", message: "Order placed" })
      )
      .catch(() =>
        setSnackbar({ open: true, type: "error", message: "Order failed" })
      )
      .finally(() => setLoadingOrder(false));
  };

  // 🔥 Add to cart
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.find(p => p.id === product.id)) {
      setSnackbar({ open: true, type: "warning", message: "Already in cart" });
      return;
    }

    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    setSnackbar({ open: true, type: "success", message: "Added to cart" });
  };
    

  // 🔥 Add review
  const handleReview = () => {

    if (rating === 0) {
      setSnackbar({ open: true, type: "error", message: "Select rating" });
      return;
    }

    API.post(`/reviews/${id}?rating=${rating}&comment=${comment}`)
      .then(() => {
        setSnackbar({ open: true, type: "success", message: "Review added" });
        setRating(0);
        setComment("");
        fetchReviews();
      })
      .catch(err =>
        setSnackbar({
          open: true,
          type: "error",
          message: err.response?.data?.message || "Review failed"
        })
      );
  };
   
  //reply
  const handleReply = (reviewId) => {
    API.put(`/reviews/reply/${reviewId}?reply=${replyText}`)
    .then(() => {
      setReplyingId(null);
      setReplyText("");
      fetchReviews();
    })
    .catch(() =>
      setSnackbar({ open: true, type: "error", message: "Reply failed" })
    );
  };

  // 🔥 Like
  const handleLike = (reviewId) => {
    API.put(`/reviews/like/${reviewId}`)
      .then(fetchReviews)
      .catch(() =>
        setSnackbar({ open: true, type: "error", message: "Like failed" })
      );
  };

  // 🔥 Delete
  const handleDelete = (reviewId) => {
    API.delete(`/reviews/${reviewId}`)
      .then(() => {
        setSnackbar({ open: true, type: "success", message: "Deleted" });
        fetchReviews();
      })
      .catch(() =>
        setSnackbar({ open: true, type: "error", message: "Delete failed" })
      );
  };

  // 🔥 Start edit
  const handleEditStart = (r) => {
    setEditingId(r.id);
    setEditingRating(r.rating);
    setEditingComment(r.comment);
  };
 
// 🔥 Delete reply
  const handleDeleteReply = (reviewId) => {
  API.put(`/reviews/reply/${reviewId}?reply=`)
    .then(() => {
      fetchReviews();
      setSnackbar({
        open: true,
        type: "success",
        message: "Reply removed"
      });
    })
    .catch(() =>
      setSnackbar({
        open: true,
        type: "error",
        message: "Delete reply failed"
      })
    );
};

  // 🔥 Save edit
  const handleEditSave = () => {
    API.put(`/reviews/${editingId}?rating=${editingRating}&comment=${editingComment}`)
      .then(() => {
        setEditingId(null);
        fetchReviews();
        setSnackbar({ open: true, type: "success", message: "Updated" });
      })
      .catch(() =>
        setSnackbar({ open: true, type: "error", message: "Update failed" })
      );
  };

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 5 }}>

      {/* PRODUCT */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Grid container spacing={4}>

          <Grid item xs={12} md={5}>
            <img
              src={product.imageUrl || "https://via.placeholder.com/400x300"}
              alt={product.name}
              style={{ width: "100%", height: 350, objectFit: "cover" }}
            />
          </Grid>

          <Grid item xs={12} md={7}>

            <Typography variant="h4" fontWeight="bold">
              {product.name}
            </Typography>

            <Typography color="gray">
              Category: {product.category}
            </Typography>

            <Typography variant="h5" sx={{ mt: 2 }}>
              ₹ {product.price}
            </Typography>

            {/* ⭐ RATING */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Rating value={product.avgRating || 0} precision={0.5} readOnly />
              <Typography variant="body2">
                ({product.totalReviews || 0})
              </Typography>
            </Box>

            <Typography sx={{ mt: 3 }}>
              {product.description}
            </Typography>

            {role === "BUYER" && (
              <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                <Button fullWidth variant="outlined" onClick={handleAddToCart}>
                  Add to Cart
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleBuy}
                  disabled={loadingOrder}
                >
                  {loadingOrder ? "Placing..." : "Buy Now"}
                </Button>
              </Box>
            )}

          </Grid>
        </Grid>
      </Card>

      {/* REVIEWS */}
      <Box sx={{ mt: 4 }}>

        <Typography variant="h5" fontWeight="bold">
          Reviews
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>

     <Button
       variant={sortType === "latest" ? "contained" : "outlined"}
      onClick={() => setSortType("latest")}
     >
       Latest
     </Button>
 
     <Button
      variant={sortType === "top" ? "contained" : "outlined"}
      onClick={() => setSortType("top")}
     >
       Top Rated
     </Button>

     <Button
        variant={sortType === "liked" ? "contained" : "outlined"}
        onClick={() => setSortType("liked")}
      >
        Most Liked
     </Button>

    </Box>

        {/* ADD REVIEW */}
        {role === "BUYER" && (
          <Box sx={{ mt: 2 }}>
            <Rating value={rating} onChange={(e, val) => setRating(val)} />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Write review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Button sx={{ mt: 2 }} variant="contained" onClick={handleReview}>
              Submit Review
            </Button>
          </Box>
        )}

        {/* REVIEW LIST */}
        {reviews.map(r => {

          const isOwner = r.userId === userId;
          const isSeller = role === "SELLER";

          return (
            <Card key={r.id} sx={{ mt: 2 }}>
              <CardContent>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Rating value={r.rating} readOnly />

                  {r.verified && (
                    <Chip label="Verified Buyer" color="success" size="small" />
                  )}
                </Box>

                {editingId === r.id ? (
  <>
    <Rating
      value={editingRating}
      onChange={(e, val) => setEditingRating(val)}
    />

    <TextField
      fullWidth
      multiline
      rows={2}
      value={editingComment}
      onChange={(e) => setEditingComment(e.target.value)}
      sx={{ mt: 1 }}
    />

    <Button sx={{ mt: 1 }} onClick={handleEditSave}>
      Save
    </Button>
  </>
) : (
  <>
    <Typography sx={{ mt: 1 }}>
      {r.comment}
    </Typography>

    <Typography variant="caption">
      {new Date(r.createdAt).toLocaleString()}
    </Typography>

        {/* ✅ SHOW REPLY IF EXISTS */}
{r.sellerReply && (
  <Box sx={{ mt: 2, p: 1, background: "#f5f5f5", borderRadius: 1 }}>
    <Typography variant="subtitle2">Seller Reply:</Typography>
    <Typography>{r.sellerReply}</Typography>
  </Box>
)}

{/* 🔥 SELLER ACTIONS (ALWAYS VISIBLE FOR SELLER) */}
{isSeller && (
  <Box sx={{ mt: 1 }}>

    {replyingId === r.id ? (
      <>
        <TextField
          fullWidth
          size="small"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />

        <Button sx={{ mt: 1 }} onClick={() => handleReply(r.id)}>
          {r.sellerReply ? "Update Reply" : "Add Reply"}
        </Button>
      </>
    ) : (
      <>
        <Button
          size="small"
          onClick={() => {
            setReplyingId(r.id);
            setReplyText(r.sellerReply || "");
          }}
        >
          {r.sellerReply ? "Edit Reply" : "Reply"}
        </Button>

        {r.sellerReply && (
          <Button
            size="small"
            color="error"
            onClick={() => handleDeleteReply(r.id)}
          >
            Delete Reply
          </Button>
        )}
      </>
    )}

  </Box>
)}

                {/* ACTIONS */}
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>

                  <IconButton onClick={() => handleLike(r.id)}>
                    <ThumbUpIcon />
                  </IconButton>

                  <Typography>{r.likes}</Typography>

                  {isOwner && (
                    <>
                      <IconButton onClick={() => handleEditStart(r)}>
                        <EditIcon />
                      </IconButton>

                      <IconButton onClick={() => handleDelete(r.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}

                </Box>
                 </>
                )}
              </CardContent>
            </Card>
          );
        })}

      </Box>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, type: "", message: "" })}
      >
        <Alert severity={snackbar.type} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Container>
  );
}

export default ProductDetailsPage;