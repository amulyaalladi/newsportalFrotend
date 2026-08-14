import { useState } from "react";
import { Link } from "react-router";
import { CircleUserRound, User, LayoutDashboard } from "lucide-react";

const MENU_ITEMS = [
  { key: "dashboard", label: "Dashboard", to: "/user-dashboard", icon: LayoutDashboard },
  { key: "profile", label: "Profile", to: "/profile", icon: User },
];

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {/* User Avatar Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center rounded-full p-1 text-slate-200 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        aria-label="Open user menu"
      >
        <CircleUserRound className="h-8 w-8" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown on outside click */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown Menu - Perfectly aligned to the right edge */}
          <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
            <div className="py-1">
              {MENU_ITEMS.map(({ key, label, to, icon: Icon }) => (
                <Link
                  key={key}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-200 transition duration-150 hover:bg-slate-800 hover:text-white"
                >
                  {Icon && <Icon className="h-4 w-4 text-cyan-500" />}
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;