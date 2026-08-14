import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { clearUser } from "../../redux/authSlice";
import { logoutUser } from "../../services/authServices";
import UserDashboard from "../../pages/user/userDashboard";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  //const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === "admin"
      ? "/admin-dashboard"
      : user?.role === "editor"
      ? "/editor-dashboard"
      : "/user-dashboard";

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearUser());
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Error logging out");
      dispatch(clearUser());
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="w-full bg-slate-950 text-slate-50 shadow-md shadow-slate-950/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="rounded-lg px-3 py-1 text-2xl font-bold tracking-wider text-white shadow-md hover:bg-cyan-700"
          >
            Daily<span className="text-red-600">Pulse</span>
          </Link>

          <div className="hidden items-center space-x-3 md:flex">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-slate-200 transition hover:text-cyan-400">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="group relative inline-block text-left">
                <button className="flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-white/5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-600 text-sm font-semibold text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                  <span className="text-sm font-medium text-slate-200">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs capitalize text-slate-500">{user?.role}</span>
                </button>

                <div className="invisible absolute right-0 z-20 mt-2 w-48 rounded-md border border-slate-700 bg-slate-900 opacity-0 shadow-lg transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="py-1">
                   
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                    >
                      Profile
                    </Link>
                    <Link 
                    to="/userDashboard"
                    className="block px-4 py-2 text-sm text-slaate-200 hover:bg-slate-800"
                    >
                      Dashboard
                      </Link>

                    
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              aria-label="Toggle menu"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-md bg-white/5 p-2 text-slate-100 transition hover:bg-white/10"
            >
              
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
