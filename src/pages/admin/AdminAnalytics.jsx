import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Newspaper, FolderOpen } from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import adminService from "../../services/adminService";

const AdminAnalytics = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [registrations, setRegistrations] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [newsStats, setNewsStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [regRes, catRes, newsRes] = await Promise.all([
          adminService.getUserRegistrationStats(),
          adminService.getCategoryStats(),
          adminService.getNewsStats(),
        ]);

        setRegistrations(regRes.data || []);
        setCategoryStats(catRes.data || []);
        setNewsStats(newsRes.data || null);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  // Last 14 data points for the registration trend so the bar chart stays readable
  const recentRegistrations = registrations.slice(-14);
  const maxRegCount = Math.max(1, ...recentRegistrations.map((r) => r.count));

  const maxCategoryCount = Math.max(
    1,
    ...categoryStats.map((c) => c.subscribers)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <AdminNavbar setMobileOpen={setMobileOpen} />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Analytics
            </h1>
            <p className="mt-1 text-gray-500">
              Registration trends, category preferences, and content stats.
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* Top summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Newspaper className="text-blue-600" size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total News</p>
                {loading ? (
                  <div className="mt-1 h-7 w-16 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {newsStats?.total ?? 0}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <FolderOpen className="text-purple-600" size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Categories Tracked</p>
                {loading ? (
                  <div className="mt-1 h-7 w-16 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {categoryStats.length}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Registration trend */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                User Registrations (recent days)
              </h2>
            </div>

            {loading ? (
              <div className="h-40 bg-gray-100 animate-pulse rounded-xl" />
            ) : recentRegistrations.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">
                No registration data yet.
              </p>
            ) : (
              <div className="flex items-end gap-2 h-40">
                {recentRegistrations.map((r, i) => {
                  const heightPct = (r.count / maxRegCount) * 100;
                  const label = `${r._id.month}/${r._id.day}`;

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center justify-end h-full group"
                    >
                      <div
                        className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all relative"
                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                        title={`${r.count} registrations on ${label}`}
                      >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition">
                          {r.count}
                        </span>
                      </div>
                      <span className="mt-2 text-[10px] text-gray-400">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category preferences */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={18} className="text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Category Preferences
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-100 animate-pulse rounded"
                  />
                ))}
              </div>
            ) : categoryStats.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">
                No category subscription data yet.
              </p>
            ) : (
              <div className="space-y-4">
                {categoryStats.map((c, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">
                        {c._id}
                      </span>
                      <span className="text-gray-400">
                        {c.subscribers} subscribers
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all"
                        style={{
                          width: `${(c.subscribers / maxCategoryCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;