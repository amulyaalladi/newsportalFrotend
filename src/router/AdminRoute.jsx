// src/router/AdminRoute.jsx
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  // Grab state directly inside the component
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // 1. If auth is still loading (e.g., checking token on refresh), don't redirect yet
  if (loading) {
    return <div>Loading...</div>;
  }

  // 2. Debugging log - open your browser console to check these values!
  console.log("Admin Check:", { isAuthenticated, role: user?.role });

  // 3. Check if user is authenticated and is an admin
  const isAdmin = isAuthenticated && user?.role === "admin";

  // If not admin, redirect to home page or login
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // Render child routes (<AdminDashboard />, <Users />, etc.)
  return <Outlet />;
};

export default AdminRoute;