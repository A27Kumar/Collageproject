import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip
} from "@mui/material";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";


function NearbyProducts() {

  const [collegeProducts, setCollegeProducts] = useState([]);
  const [cityProducts, setCityProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const decoded = jwtDecode(token);
    const city = decoded.city || "";
    const college = decoded.college || "";

    if (!city && !college) return;

    API.get(`/products/nearby?city=${city}&college=${college}`)
      .then(res => {
        setCollegeProducts(res.data.college || []);
        setCityProducts(res.data.city || []);
      })
      .catch(() => {
        console.log("Failed to load nearby products");
      })
      .finally(() => {
        setLoading(false);
      });
      console.log("Nearby component mounted");

  }, []); // ✅ CLOSED PROPERLY

  // ✅ OUTSIDE useEffect
  const renderProducts = (products, type) => (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Typography variant="h4">Near By Products</Typography>
      {products.slice(0, 6).map(p => (
        <Grid item xs={12} sm={6} md={4} key={p.id}>
          <Card sx={{ borderRadius: 3 }}>
            <CardMedia
              component="img"
              height="160"
              image={p.imageUrl || "https://via.placeholder.com/300"}
            />
            <CardContent>
              <Typography fontWeight="bold">{p.name}</Typography>
              <Typography>₹ {p.price}</Typography>
              <Chip
                label={type === "college" ? "From your college" : "From your city"}
                color={type === "college" ? "success" : "primary"}
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // ✅ CORRECT PLACE
  if (loading) return null;

  return (
    <div style={{ marginTop: "30px" }}>
      {collegeProducts.length > 0 && (
        <>
          <Typography variant="h5" fontWeight="bold">
            Nearby in Your College
          </Typography>
          {renderProducts(collegeProducts, "college")}
        </>
      )}

      {collegeProducts.length === 0 && cityProducts.length > 0 && (
        <>
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 4 }}>
            Nearby in Your City
          </Typography>
          {renderProducts(cityProducts, "city")}
        </>
      )}
    </div>
  );
}

export default NearbyProducts;