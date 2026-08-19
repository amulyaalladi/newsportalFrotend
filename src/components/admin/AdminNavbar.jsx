import { Menu, Bell } from "lucide-react";

const AdminNavbar = ({ setMobileOpen }) => {
   

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8">
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
      >
        <Menu size={22} />
      </button>

      <div className="hidden lg:block">
        <h2 className="text-xl font-semibold text-gray-800">
          Admin Dashboard
        </h2>

        <p className="text-sm text-gray-400">
          Manage your news portal
        </p>
      </div>

      <div className="flex items-center gap-5 ml-auto">
        <button className="relative p-2 rounded-xl hover:bg-gray-100">
          <Bell size={21} className="text-gray-600" />

          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            A
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800">
              Admin
            </p>

            <p className="text-xs text-gray-400">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;