import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import Dashboard from "../components/home/Dashboard";
import NewsDetails from "../pages/News/NewsDetails";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import EditorRegister from "../pages/Editor/EditorRegister";
import EditorDashboard from "../pages/Editor/EditorDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Profile from "../components/profile/Profile";
import Preferences from "../components/profile/Preferences";
import Notifications from "../components/profile/Notifications";
import UserDashboard from "../pages/user/userDashboard";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  //{ path: "/dashboard/:category", element: <Dashboard /> },
  { path: "/news/:id", element: <NewsDetails /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  {path:"/dashboard", element:<UserDashboard/>},
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/editor-register", element: <EditorRegister /> },
  { path: "/editor-dashboard", element: <EditorDashboard /> },
  { path: "/admin-dashboard", element: <AdminDashboard /> },
  { path: "/profile", element: <Profile /> },
  { path: "/preferences", element: <Preferences /> },
  { path: "/notifications", element: <Notifications /> },
]);
