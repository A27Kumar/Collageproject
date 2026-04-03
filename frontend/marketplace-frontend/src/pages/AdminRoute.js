import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AdminRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);

    if (decoded.role !== "ADMIN") {
      return <Navigate to="/" />;
    }

    return children;

  } catch {
    return <Navigate to="/login" />;
  }
}

export default AdminRoute;