import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Pagination,
  CircularProgress,
  CardMedia,
  TextField,
  Box,
  MenuItem,
  Rating
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import NearbyProducts from "../components/NearbyProducts";

function ProductsPage() {

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const searchFromUrl = query.get("search") || "";
  const city = query.get("city") || "";
  const college = query.get("college") || "";

  const fetchProducts = (pageNumber) => {
    setLoading(true);

    API.get("/products", {
    params: {
  page: pageNumber - 1,
  size: 6,
  ...(searchFromUrl && { search: searchFromUrl }),
  ...(category && { category }),
  ...(minPrice && { minPrice }),
  ...(maxPrice && { maxPrice }),
  ...(minRating && { minRating }),
  ...(sortBy && { sortBy }),
  ...(city && { city }),
  ...(college && { college })
  }
    })
      .then(res => {
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page, location.search, category, minPrice, maxPrice, minRating, sortBy]);

  return (
    <Container sx={{ mt: 4 }}>

    <Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    justifyContent: "space-between",
    mb: 3
  }}
>

  <Typography variant="h4">Marketplace Products</Typography>
  
 

  <TextField
    select
    label="Category"
    value={category}
    onChange={(e) => {
      setCategory(e.target.value);
      setPage(1);
    }}
    sx={{ minWidth: 150 }}
  >
    <MenuItem value="">All</MenuItem>
    <MenuItem value="Electronics">Electronics</MenuItem>
    <MenuItem value="Clothing">Clothing</MenuItem>
    <MenuItem value="Books">Books</MenuItem>
    <MenuItem value="Home">Home</MenuItem>
    <MenuItem value="Smartphone">Smartphone</MenuItem>
  </TextField>

  {/* 🔥 NEW FILTERS */}

  <TextField
    label="Min Price"
    value={minPrice}
    onChange={(e) => setMinPrice(e.target.value)}
    sx={{ width: 120 }}
  />

  <TextField
    label="Max Price"
    value={maxPrice}
    onChange={(e) => setMaxPrice(e.target.value)}
    sx={{ width: 120 }}
  />

    <TextField
      label="Min Rating"
      value={minRating}
      onChange={(e) => setMinRating(e.target.value)}
      sx={{ width: 120 }}
     />

     <TextField
       select
       label="Sort"
       value={sortBy}
       onChange={(e) => setSortBy(e.target.value)}
       sx={{ minWidth: 150 }}
      >
      <MenuItem value="">None</MenuItem>
      <MenuItem value="priceLow">Price Low → High</MenuItem>
      <MenuItem value="priceHigh">Price High → Low</MenuItem>
      <MenuItem value="rating">Top Rated</MenuItem>
      </TextField>

      </Box>

        <NearbyProducts />

      {loading ? (
        <CircularProgress />
      ) : (

         

        <Grid container spacing={3}>

          {products.map(product => (

            <Grid item xs={12} sm={6} md={4} key={product.id}>

              <Card
                onClick={() => navigate(`/product/${product.id}`)}
                sx={{ cursor: "pointer", borderRadius: 3 }}
              >

                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl || "https://via.placeholder.com/400x300"}
                />

                <CardContent>

                  <Typography fontWeight="bold">
                    {product.name}
                  </Typography>

                  <Typography color="text.secondary">
                    {product.category}
                  </Typography>

                  <Typography>₹ {product.price}</Typography>

                  {/* 🔥 FUTURE: AVG RATING */}
                  <Box sx = {{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>

                  <Rating value={product.avgRating || 0} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({product.totalReviews || 0})
                  </Typography>
                  </Box>

                  <Button
                    fullWidth
                    sx={{ mt: 2 }}
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product.id}`);
                    }}
                  >
                    View Product
                  </Button>

                </CardContent>

              </Card>

            </Grid>

          ))}

        </Grid>
      )}

      <Pagination
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
        count={totalPages}
        page={page}
        onChange={(e, v) => setPage(v)}
      />

    </Container>
  );
}

export default ProductsPage;