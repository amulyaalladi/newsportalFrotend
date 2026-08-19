import { useEffect, useState } from "react";

import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import UserDetails from "./UserDetails";

import adminService from "../../services/adminService";

const Users = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });

  const [selectedUser, setSelectedUser] = useState(null);

  const [actionLoading, setActionLoading] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminService.getUsers({
        search,
        page,
        limit: 10,
      });

      setUsers(response.data.users);

      setPagination(response.data.pagination);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  // Search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // View user
  const handleViewUser = async (id) => {
    try {
      setActionLoading(id);

      const response =
        await adminService.getUserById(id);

      setSelectedUser(response.data);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to load user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Block
  const handleBlock = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to block this user?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);

      await adminService.blockUser(id);

      await fetchUsers();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to block user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Unblock
  const handleUnblock = async (id) => {
    try {
      setActionLoading(id);

      await adminService.unblockUser(id);

      await fetchUsers();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to unblock user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this user?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);

      await adminService.deleteUser(id);

      await fetchUsers();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main */}
      <div className="flex-1 min-w-0">
        <AdminNavbar
          setMobileOpen={setMobileOpen}
        />

        <main className="p-4 md:p-6 lg:p-8">

          {/* Heading */}
          <div className="mb-7">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <UsersIcon size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Users
                </h1>

                <p className="text-sm text-gray-500">
                  Manage registered users
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Toolbar */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

                {/* Search */}
                <div className="relative w-full md:max-w-md">
                  <Search
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Count */}
                <div className="text-sm text-gray-500">
                  Total users:{" "}
                  <span className="font-semibold text-gray-800">
                    {pagination.totalUsers}
                  </span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">

              {loading ? (
                <div className="p-10 text-center">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

                  <p className="mt-3 text-sm text-gray-400">
                    Loading users...
                  </p>
                </div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center">
                  <UsersIcon
                    size={40}
                    className="mx-auto text-gray-300"
                  />

                  <h3 className="mt-3 font-semibold text-gray-700">
                    No users found
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Try changing your search.
                  </p>
                </div>
              ) : (
                <table className="w-full min-w-[850px]">

                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        User
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Email
                      </th>

                     

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Joined
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 transition"
                      >

                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">

                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                                {user.name
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}

                            <div>
                              <p className="font-medium text-gray-800">
                                {user.name}
                              </p>

                              <p className="text-xs text-gray-400">
                                User
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {user.email}
                          </span>
                        </td>

                        {/* Verification */}
                        

                        {/* Status */}
                        <td className="px-6 py-4">
                          {user.isBlocked ? (
                            <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                              Blocked
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                              Active
                            </span>
                          )}
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500">
                            {user.createdAt
                              ? new Date(
                                  user.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "N/A"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">

                            {/* View */}
                            <button
                              onClick={() =>
                                handleViewUser(
                                  user._id
                                )
                              }
                              title="View user"
                              className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
                            >
                              <Eye size={17} />
                            </button>

                            {/* Block / Unblock */}
                            {user.isBlocked ? (
                              <button
                                onClick={() =>
                                  handleUnblock(
                                    user._id
                                  )
                                }
                                disabled={
                                  actionLoading ===
                                  user._id
                                }
                                title="Unblock user"
                                className="p-2 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 transition disabled:opacity-50"
                              >
                                <CheckCircle
                                  size={17}
                                />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleBlock(
                                    user._id
                                  )
                                }
                                disabled={
                                  actionLoading ===
                                  user._id
                                }
                                title="Block user"
                                className="p-2 rounded-lg text-orange-600 bg-orange-50 hover:bg-orange-100 transition disabled:opacity-50"
                              >
                                <Ban size={17} />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() =>
                                handleDelete(
                                  user._id
                                )
                              }
                              disabled={
                                actionLoading ===
                                user._id
                              }
                              title="Delete user"
                              className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition disabled:opacity-50"
                            >
                              <Trash2 size={17} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}

                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {!loading &&
              users.length > 0 && (
                <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">

                  <p className="text-sm text-gray-500">
                    Page{" "}
                    <span className="font-medium text-gray-800">
                      {pagination.currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-800">
                      {pagination.totalPages}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">

                    <button
                      disabled={page <= 1}
                      onClick={() =>
                        setPage((prev) =>
                          Math.max(prev - 1, 1)
                        )
                      }
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      disabled={
                        page >=
                        pagination.totalPages
                      }
                      onClick={() =>
                        setPage((prev) =>
                          Math.min(
                            prev + 1,
                            pagination.totalPages
                          )
                        )
                      }
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={18} />
                    </button>

                  </div>
                </div>
              )}
          </div>
        </main>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
        />
      )}
    </div>
  );
};

export default Users;