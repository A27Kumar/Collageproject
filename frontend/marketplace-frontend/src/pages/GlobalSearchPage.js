import React, { useState } from "react";

import API from "../services/api";

import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip
} from "@mui/material";

import { useNavigate } from "react-router-dom";

function GlobalSearchPage() {

  const [query, setQuery] = useState("");

  const [results, setResults] = useState(null);

  const navigate = useNavigate();

  const search = () => {

    if (!query) return;

    API.get("/search/global", {
      params: { query }
    }).then(res => {
      setResults(res.data);
    });
  };

  return (
    <Container sx={{ mt: 4 }}>

      <Typography variant="h4">
        AI Smart Search
      </Typography>

      <TextField
        fullWidth
        label="Search anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mt: 3 }}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={search}
      >
        Search
      </Button>

      {/* PRODUCTS */}
      {results?.products?.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 5 }}>
            Products
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>

            {results.products.map(product => (

              <Grid item xs={12} md={4} key={product.id}>

                <Card sx={{ borderRadius: 3 }}>

                  <CardContent>

                    <Typography fontWeight="bold">
                      {product.name}
                    </Typography>

                    <Typography>
                      ₹ {product.price}
                    </Typography>

                    <Button
                      sx={{ mt: 2 }}
                      onClick={() =>
                        navigate(`/product/${product.id}`)
                      }
                    >
                      View Product
                    </Button>

                  </CardContent>

                </Card>

              </Grid>

            ))}

          </Grid>
        </>
      )}

      {/* REQUESTS */}
      {results?.requests?.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 5 }}>
            Requests
          </Typography>

          {results.requests.map(req => (

            <Card
              key={req.id}
              sx={{ mt: 2, borderRadius: 3 }}
            >

              <CardContent>

                <Typography fontWeight="bold">
                  {req.title}
                </Typography>

                <Typography>
                  {req.description}
                </Typography>

              </CardContent>

            </Card>

          ))}
        </>
      )}

      {/* POSTS */}
      {results?.posts?.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 5 }}>
            Discussions
          </Typography>

          {results.posts.map(post => (

            <Card
              key={post.id}
              sx={{ mt: 2, borderRadius: 3 }}
            >

              <CardContent>

                <Typography fontWeight="bold">
                  {post.title}
                </Typography>

                <Typography>
                  {post.content}
                </Typography>

                <Chip
                  label={post.category}
                  sx={{ mt: 2 }}
                />

                <Button
                  sx={{ mt: 2 }}
                  onClick={() =>
                    navigate(`/community/post/${post.id}`)
                  }
                >
                  Open Discussion
                </Button>

              </CardContent>

            </Card>

          ))}
        </>
      )}

    </Container>
  );
}

export default GlobalSearchPage;