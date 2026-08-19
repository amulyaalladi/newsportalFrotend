import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  FolderOpen,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { logoutUser } from "../../services/authServices";

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
    const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "News",
      path: "/admin/news",
      icon: Newspaper,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: FolderOpen,
    },
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

   const handleLogout = async () => {
  try {
    await logoutUser(); // clears the httpOnly auth cookie on the backend
  } catch (err) {
    console.error("Logout API call failed:", err);
  } finally {
    dispatch(logout()); // clears Redux state + localStorage
    navigate("/login");
  }
}

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static
          top-0 left-0
          z-40
          h-screen
          w-64
          bg-slate-950
          text-white
          flex flex-col
          transition-transform duration-300
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              📰
            </div>

            <div>
              <h1 className="font-bold text-lg">
                NewsPortal
              </h1>

              <p className="text-xs text-slate-400">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />

                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <LogOut size={19} />
            <span className="text-sm font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;