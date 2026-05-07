import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import AddProductPage from "./pages/AddProductPage";
import SellerOrdersPage from "./pages/SellersOrdersPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import SellerDashboardPage from "./pages/SellerDashboard";
import UpdateProductPage from "./pages/UpdateProductPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminRoute from "./pages/AdminRoute";
import RequestsPage from "./pages/RequestsPage";
import CommunityPage from "./pages/CommunityPage";
import DiscussionPage from "./pages/DiscussionPage";
import GlobalSearchPage from "./pages/GlobalSearchPage";



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/seller-orders" element={<SellerOrdersPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
        <Route path="/update-product/:id" element={<UpdateProductPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={  <AdminRoute>   <AdminDashboardPage /> </AdminRoute>  }/> 
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/post/:id" element={<DiscussionPage />} />
        <Route path="/smart-search" element={<GlobalSearchPage />} />
        </Routes>
    </Router>
  );
}

export default App;


