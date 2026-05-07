import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {

  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(null);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [college, setCollege] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setRole(decoded.role);
        setCity(decoded.city || "");
        setCollege(decoded.college || "");
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);

      if (newToken) {
        const decoded = jwtDecode(newToken);
        setRole(decoded.role);
      } else {
        setRole(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(null);
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>

        {/* Logo */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Marketplace
        </Typography>

        {/* 🔥 SEARCH */}
      <TextField
     size="small"
     placeholder="Search products..."
     value={search}
     onChange={(e) => setSearch(e.target.value)}
     onKeyDown={(e) => {
      if (e.key === "Enter") {
        navigate(`/?search=${search}&city=${city}&college=${college}`);
      }
     }}
     sx={{
        backgroundColor: "white",
        borderRadius: 1,
        marginRight: 2,
        width: "250px"
      }}
      />

        {!token && (
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}

        {role === "SELLER" && (
          <>
            <Button color="inherit" onClick={() => navigate("/add-product")}>
              Add Product
            </Button>
            <Button color="inherit" onClick={() => navigate("/seller-orders")}>
              Manage Orders
            </Button>
            <Button color="inherit" onClick={() => navigate("/seller-dashboard")}>
              Dashboard
            </Button>
          </>
        )}

        {!token && (
       <>
       <Button color="variant" onClick={() => navigate("/register")}>Register</Button>
       </>
         )}

        {role === "BUYER" && (
          <>
            <Button color="inherit" onClick={() => navigate("/my-orders")}>
              My Orders
            </Button>
            <Button color="inherit" onClick={() => navigate("/cart")}>
              Cart
            </Button>
          </>
        )}

        {token && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
        
        {role === "ADMIN" && (
          <Button color="inherit" onClick={() => navigate("/admin")}>
            Admin
          </Button>
        )}

        <Button color="inherit" onClick={() => navigate("/requests")}>
         Requests
        </Button> 

        <Button color="inherit" onClick={() => navigate("/community")}>
        Community
        </Button>

        <Button
         color="inherit"
         onClick={() => navigate("/smart-search")}
         >
         AI Search
        </Button>
        
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;