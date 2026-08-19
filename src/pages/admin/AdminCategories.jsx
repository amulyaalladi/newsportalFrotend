import { useEffect, useState } from "react";
import { FolderOpen, Plus, Pencil, Trash2, X, Check } from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import adminService from "../../services/adminService";

const AdminCategories = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [savingId, setSavingId] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminService.getAllCategories();
      setCategories(response.result || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setAdding(true);
      await adminService.addCategory(newName.trim());
      setNewName("");
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add category");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setEditingName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleSaveEdit = async (id) => {
    if (!editingName.trim()) return;

    try {
      setSavingId(id);
      await adminService.updateCategory(id, editingName.trim());
      setEditingId(null);
      setEditingName("");
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update category");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? This cannot be undone.")) {
      return;
    }

    try {
      setDeletingId(id);
      await adminService.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <AdminNavbar setMobileOpen={setMobileOpen} />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Categories
              </h1>
              <p className="mt-1 text-gray-500">
                Manage news categories used across the platform.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">
              <FolderOpen size={18} />
              <span className="text-sm font-medium">
                {categories.length} total
              </span>
            </div>
          </div>

          {/* Add category form */}
          <form
            onSubmit={handleAdd}
            className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New category name (e.g. Technology)"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={adding || !newName.trim()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              {adding ? "Adding..." : "Add Category"}
            </button>
          </form>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* Categories list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-100 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <FolderOpen size={32} className="mx-auto mb-3" />
                <p>No categories yet. Add your first one above.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <li
                    key={category._id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    {editingId === category._id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                        className="flex-1 mr-3 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    )}

                    <div className="flex items-center gap-1.5">
                      {editingId === category._id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(category._id)}
                            disabled={savingId === category._id}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                            title="Save"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            disabled={deletingId === category._id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCategories;