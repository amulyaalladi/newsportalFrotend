import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Users, FileText, UserCheck, Check, X } from "lucide-react";
import {getAllUsers,approveEditor,rejectEditor,approveNews,rejectNews,deleteNews,deleteUser} from "../../services/adminService"

const ROLES = ["user", "editor", "admin"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [editorRequests, setEditorRequests] = useState([]);
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAll = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [statsData, requestsData, usersData] = await Promise.all([
        getStats(),
        getEditorRequests(),
        getUsers(),
      ]);
      setStats(statsData);
      setEditorRequests(requestsData || []);
      setUsers(usersData || []);
    } catch (err) {
      console.error("Error loading admin dashboard:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleApprove = async (id) => {
    const previous = editorRequests;
    setEditorRequests((prev) => prev.filter((item) => item.id !== id));
    try {
      await approveEditorRequest(id);
      toast.success("Editor request approved.");
    } catch (err) {
      console.error("Error approving request:", err);
      toast.error(err.message || "Couldn't approve request.");
      setEditorRequests(previous);
    }
  };

  const handleReject = async (id) => {
    const previous = editorRequests;
    setEditorRequests((prev) => prev.filter((item) => item.id !== id));
    try {
      await rejectEditorRequest(id);
      toast.success("Editor request rejected.");
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast.error(err.message || "Couldn't reject request.");
      setEditorRequests(previous);
    }
  };

  const handleRoleChange = async (id, role) => {
    const previous = users;
    setUsers((prev) => prev.map((item) => (item.id === id ? { ...item, role } : item)));
    try {
      await updateUserRole(id, role);
      toast.success("Role updated.");
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error(err.message || "Couldn't update role.");
      setUsers(previous);
    }
  };

  const statCards = [
    { key: "totalUsers", label: "Total users", icon: Users },
    { key: "totalArticles", label: "Total articles", icon: FileText },
    { key: "pendingEditorRequests", label: "Pending editor requests", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-50">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="mt-2 text-slate-400">Manage editor requests, users, and site activity.</p>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-600/40 bg-slate-900 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {statCards.map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="rounded-xl bg-cyan-500/10 p-3">
                    <Icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{stats?.[key] ?? "—"}</p>
                    <p className="text-xs text-slate-400">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Editor requests */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold">Editor requests</h2>
              <div className="mt-4 space-y-3">
                {editorRequests.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-sm text-slate-400">
                    No pending requests.
                  </div>
                ) : (
                  editorRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{req.name}</p>
                        <p className="truncate text-xs text-slate-400">{req.email}</p>
                        {req.message && (
                          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{req.message}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(req.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(req.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-red-900/40 hover:text-red-300"
                        >
                          <X className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Users */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold">Users</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3 text-slate-100">{user.name}</td>
                          <td className="px-4 py-3 text-slate-400">{user.email}</td>
                          <td className="px-4 py-3">
                            <select
                              value={user.role}
                              onChange={(event) => handleRoleChange(user.id, event.target.value)}
                              className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-500"
                            >
                              {ROLES.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
