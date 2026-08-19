// src/router/router.jsx
import { createBrowserRouter, redirect } from "react-router";
import { useSelector } from "react-redux";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ResetPassword from "../pages/Auth/ResetPassword";

import Home from "../pages/Home/Home";
import UserDashboard from "../pages/user/userDashboard";
import Profile from "../components/profile/Profile";
import AdminDashboard from "../pages/admin/AdminDashboard";
import guestLoader from "../loaders/guestLoader";
import authLoader from "../loaders/authLoader";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Users from "../pages/admin/Users";
import { Store } from "lucide-react";

 
export const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/login"),
  },

  // Public / Guest Routes
  { path: "/login", element: <Login />, loader: guestLoader },
  { path: "/register", element: <Register />, loader: guestLoader },
  {path:"/forgot-password", element:<ForgotPassword />},
      
     
  {path:"/reset-password/:token", element:<ResetPassword />},

  // Protected / Authenticated Routes
  { path: "/home", element: <Home />, loader: authLoader },
  { path: "/dashboard", element: <UserDashboard />, loader: authLoader },
  { path: "/profile", element: <Profile />, loader: authLoader },
  {path:"/admin",element:
         
            <AdminDashboard />
         
         
          
          },
          {path:"/admin/users", element: <Users />},
  

  // Catch-all redirect
  {
    path: "*",
    loader: () => redirect("/login"),
  },
]);

export default router;