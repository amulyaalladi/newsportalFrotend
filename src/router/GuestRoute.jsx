import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const GuestRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/home"} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;