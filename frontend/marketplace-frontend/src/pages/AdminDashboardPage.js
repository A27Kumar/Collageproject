

import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip
} from "@mui/material";

function AdminDashboardPage() {

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchPending();
  }, []);

  const fetchStats = () => {
    API.get("/admin/stats")
      .then(res => setStats(res.data));
  };

  const fetchUsers = () => {
    API.get("/admin/users")
      .then(res => setUsers(res.data));
  };

  const fetchPending = () => {
    API.get("/admin/pending-products")
      .then(res => setPendingProducts(res.data));
  };

  const banUser = (id) => {
    API.put("/admin/ban/" + id).then(fetchUsers);
  };

  const unbanUser = (id) => {
    API.put("/admin/unban/" + id).then(fetchUsers);
  };

  const approveProduct = (id) => {
    API.put("/admin/approve/" + id).then(fetchPending);
  };

  return (
    <Container sx={{ mt: 4 }}>

      <Typography variant="h4" fontWeight="bold">
        Admin Dashboard
      </Typography>

      {/* 🔥 STATS */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {[
          { label: "Users", value: stats.users },
          { label: "Products", value: stats.products },
          { label: "Orders", value: stats.orders },
          { label: "Revenue", value: "₹ " + stats.revenue }
        ].map((item, i) => (
          <Grid item xs={12} md={3} key={i}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.label}</Typography>
                <Typography variant="h4">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔥 USERS */}
      <Typography variant="h5" sx={{ mt: 4 }}>
        Users
      </Typography>

      {users.map(u => (
        <Card key={u.id} sx={{ mt: 1, p: 2 }}>
          {u.email} ({u.role})

          <Chip
            label={u.banned ? "BANNED" : "ACTIVE"}
            color={u.banned ? "error" : "success"}
            sx={{ ml: 2 }}
          />

          <Button
            sx={{ ml: 2 }}
            onClick={() => u.banned ? unbanUser(u.id) : banUser(u.id)}
          >
            {u.banned ? "Unban" : "Ban"}
          </Button>
        </Card>
      ))}

      {/* 🔥 PENDING PRODUCTS */}
      <Typography variant="h5" sx={{ mt: 4 }}>
        Pending Products
      </Typography>

      {pendingProducts.map(p => (
        <Card key={p.id} sx={{ mt: 1, p: 2 }}>
          {p.name} - ₹ {p.price}

          <Button
            sx={{ ml: 2 }}
            variant="contained"
            onClick={() => approveProduct(p.id)}
          >
            Approve
          </Button>
        </Card>
      ))}

    </Container>
  );
}

export default AdminDashboardPage;