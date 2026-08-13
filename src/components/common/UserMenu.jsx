import { useState } from "react";
import { Link } from "react-router";
import { CircleUserRound, User, Settings, Bell } from "lucide-react";

const MENU_ITEMS = [
  {key:"dashboard", label:"Dashboard", to:"/user-dashboard"},
  { key: "profile", label: "Profile", to: "/profile", icon: User },

];

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center rounded-full p-1 text-slate-200 transition hover:bg-slate-800"
        aria-label="Open user menu"
      >
        <CircleUserRound className="h-8 w-8" />
      </button>

      {isOpen && (
        <>
          {/* backdrop to close the dropdown on outside click */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            {MENU_ITEMS.map(({ key, label, to, icon: Icon }) => (
              <Link
                key={key}
                to={to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
              >
                <Icon className="h-4 w-4 text-slate-400" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
