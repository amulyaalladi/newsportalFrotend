// src/router/router.jsx
import { createBrowserRouter, redirect } from "react-router";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";

import Home from "../pages/Home/Home";
import UserDashboard from "../pages/user/userDashboard";
import Profile from "../components/profile/Profile";

import guestLoader from "../loaders/guestLoader";
import authLoader from "../loaders/authLoader";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/login"),
  },

  // Public / Guest Routes
  { path: "/login", element: <Login />, loader: guestLoader },
  { path: "/register", element: <Register />, loader: guestLoader },
  { path: "/forgot-password", element: <ForgotPassword />, loader: guestLoader },

  // Protected / Authenticated Routes
  { path: "/home", element: <Home />, loader: authLoader },
  { path: "/dashboard", element: <UserDashboard />, loader: authLoader },
  { path: "/profile", element: <Profile />, loader: authLoader },

  // Catch-all redirect
  {
    path: "*",
    loader: () => redirect("/login"),
  },
]);

export default router;