import { useEffect, useState } from "react";

import {
  Users,
  UserCheck,
  UserX,
  Newspaper,
  UserPlus,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import StatCard from "../../components/admin/StatCard";
import { useSelector } from "react-redux";

import adminService from "../../services/adminService";

const AdminDashboard = () => {
     const user = useSelector((state) => state.auth.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await adminService.getDashboardStats();

        setStats(response.data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const users = stats?.users || {};

  const news = stats?.news || {};

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0">
        <AdminNavbar
          setMobileOpen={setMobileOpen}
        />

        <main className="p-4 md:p-6 lg:p-8">

          {/* Page heading */}

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, Admin 👋
            </h1>

            <p className="mt-1 text-gray-500">
              Here's what's happening with your
              news portal today.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Statistics */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">

            <StatCard
              title="Total Users"
              value={users.total}
              icon={<Users size={24} />}
              description="Registered users"
              loading={loading}
            />

            <StatCard
              title="Active Users"
              value={users.active}
              icon={<UserCheck size={24} />}
              description="Currently active"
              loading={loading}
            />

            <StatCard
              title="Blocked Users"
              value={users.blocked}
              icon={<UserX size={24} />}
              description="Blocked accounts"
              loading={loading}
            />

            <StatCard
              title="New Today"
              value={users.newToday}
              icon={<UserPlus size={24} />}
              description="Registered today"
              loading={loading}
            />

            <StatCard
              title="Published News"
              value={news.published}
              icon={<Newspaper size={24} />}
              description="Published articles"
              loading={loading}
            />

          </div>

          {/* Second section */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

            {/* Monthly users */}

            <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    User Registrations
                  </h2>

                  <p className="text-sm text-gray-400">
                    New users registered this month
                  </p>
                </div>

                <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-sm">
                  This Month
                </span>

              </div>

              {/* Chart will go here */}

              <div className="h-72 flex items-center justify-center border border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-400">
                  Registration chart
                </p>
              </div>

            </div>

            {/* Quick stats */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <h2 className="text-lg font-semibold text-gray-900">
                Quick Overview
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Portal statistics
              </p>

              <div className="mt-6 space-y-5">

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Users this month
                  </span>

                  <span className="font-semibold text-gray-900">
                    {loading
                      ? "..."
                      : users.newThisMonth ?? 0}
                  </span>
                </div>

                <div className="border-t border-gray-100" />

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Published news
                  </span>

                  <span className="font-semibold text-gray-900">
                    {loading
                      ? "..."
                      : news.published ?? 0}
                  </span>
                </div>

                <div className="border-t border-gray-100" />

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Total categories
                  </span>

                  <span className="font-semibold text-gray-900">
                    {loading
                      ? "..."
                      : stats?.categories?.total ?? 0}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;