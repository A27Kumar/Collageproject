import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function RequestsPage() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [requests, setRequests] = useState([]);

  const [city, setCity] = useState("");
  const [college, setCollege] = useState("");

  const [matches, setMatches] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const navigate = useNavigate();

  // 🔥 Get location from token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const decoded = jwtDecode(token);

    setCity(decoded.city || "");
    setCollege(decoded.college || "");
    
    if (decoded.city || decoded.college) {
    fetchRequests(decoded.city, decoded.college);
    }
  }, []);

  // 🔥 Fetch nearby requests
  const fetchRequests = (city, college) => {
    if (!city && !college) return;
    API.get("/requests/nearby", {
      params: { city, college }
    }).then(res => {
      setRequests(res.data);
    });
  };

  const fetchMatches = (requestId) => {

  API.get(`/requests/${requestId}/matches`)
    .then(res => {
      setMatches(res.data);
      setSelectedRequest(requestId);
    })
    .catch(() => {
      console.log("Failed to fetch matches");
    });
  };

  // 🔥 Create request
  const handleCreate = () => {

    if (!title) return;

    API.post("/requests", {
      title,
      description
    }).then(() => {

      setTitle("");
      setDescription("");

      fetchRequests(city, college);
    });
  };

  return (
    <Container sx={{ mt: 4 }}>

      {/* 🔥 CREATE REQUEST */}
      <Typography variant="h4" gutterBottom>
        Request an Item
      </Typography>

      <TextField
        fullWidth
        label="Title (e.g. Need Java Book)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleCreate}>
        Post Request
      </Button>

      {/* 🔥 REQUEST LIST */}
      <Typography variant="h5" sx={{ mt: 4 }}>
        Nearby Requests
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>

        {requests.map(req => (

          <Grid item xs={12} md={6} key={req.id}>
            <Card sx={{ borderRadius: 3 }}>

              <CardContent>

                <Typography fontWeight="bold">
                  {req.title}
                </Typography>

                <Typography color="text.secondary">
                  {req.description}
                </Typography>

                <Chip
                  label="Nearby"
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />

                <Button
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => fetchMatches(req.id)}
                  >
                  View Matching Products
                </Button>

              </CardContent>

            </Card>
          </Grid>

         
        ))}

      </Grid>


       {selectedRequest && (
  <>
    <Typography variant="h5" sx={{ mt: 5 }}>
      Matching Products
    </Typography>

    <Grid container spacing={2} sx={{ mt: 2 }}>

      {matches.map(product => (

        <Grid item xs={12} md={4} key={product.id}>

          <Card sx={{ borderRadius: 3 }}>

            <CardContent>

              <Typography fontWeight="bold">
                {product.name}
              </Typography>

              <Typography color="text.secondary">
                {product.category}
              </Typography>

              <Typography>
                ₹ {product.price}
              </Typography>

              <Chip
                label="Matched"
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />

            </CardContent>

            <Button
          fullWidth
          sx={{ mt: 2 }}
          variant="outlined"
          onClick={() => navigate(`/product/${product.id}`)}
          >
            View Product
          </Button>

          </Card>

        </Grid>

      ))}

    </Grid>
  </>
   )}


    </Container>
  );
}

export default RequestsPage;