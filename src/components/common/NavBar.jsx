import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { clearUser } from "../../redux/authSlice";
import { logoutUser } from "../../services/authServices";
import { Menu, X, ChevronDown, User as UserIcon, LogOut, Settings } from "lucide-react";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <nav className="sticky top-0 z-50 w-full border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-1 text-2xl font-black tracking-tight text-white transition hover:opacity-90"
          >
            <span>Daily</span>
            <span className="rounded-md bg-red-600 px-2 py-0.5 text-white">Pulse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-stone-300 transition hover:text-white"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 active:scale-95"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="group relative inline-block text-left">
                <button className="flex items-center gap-2.5 rounded-full border border-stone-800 bg-stone-900/80 px-3 py-1.5 transition hover:border-stone-700 hover:bg-stone-800">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-amber-600 text-xs font-bold text-white shadow-inner">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                  <span className="text-sm font-medium text-stone-200">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-stone-400 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                {/* Dropdown Menu */}
                <div className="invisible absolute right-0 top-full z-50 w-52 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="overflow-hidden rounded-xl border border-stone-800 bg-stone-900 shadow-2xl backdrop-blur-xl">
                    <div className="border-b border-stone-800 px-4 py-3">
                      <p className="text-xs text-stone-400">Signed in as</p>
                      <p className="truncate text-sm font-semibold text-white">
                        {user?.email || user?.name || "Account"}
                      </p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-stone-300 transition hover:bg-stone-800 hover:text-white"
                      >
                        <UserIcon className="h-4 w-4 text-stone-400" />
                        Profile
                      </Link>
                      
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              aria-label="Toggle menu"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-lg border border-stone-800 bg-stone-900/80 p-2 text-stone-300 transition hover:bg-stone-800 hover:text-white"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {menuOpen && (
        <div className="border-b border-stone-800 bg-stone-950 px-4 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-base font-medium text-stone-300 transition hover:bg-stone-900 hover:text-white"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-red-600 px-3 py-2.5 text-center text-base font-semibold text-white shadow-md shadow-red-600/20"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <div className="mb-2 flex items-center gap-3 border-b border-stone-800 pb-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-amber-600 font-bold text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{user?.name || "User"}</p>
                    <p className="text-xs text-stone-400">{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-stone-300 transition hover:bg-stone-900 hover:text-white"
                >
                  <UserIcon className="h-5 w-5 text-stone-400" />
                  Profile
                </Link>
                <Link
                  to="/preferences"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-stone-300 transition hover:bg-stone-900 hover:text-white"
                >
                  <Settings className="h-5 w-5 text-stone-400" />
                  Preferences
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-base font-medium text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;