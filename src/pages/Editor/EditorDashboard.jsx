import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
 myNews,dashboard
} from "../../services/editorServices";
import { CATEGORY_OPTIONS } from "../../components/common/categories";

const EMPTY_FORM = {
  title: "",
  category: CATEGORY_OPTIONS[0]?.key || "general",
  excerpt: "",
  imageUrl: "",
  status: "draft",
};

const EditorDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const loadArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getMyArticles();
      setArticles(data || []);
    } catch (err) {
      console.error("Error loading articles:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const openNewForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
  };

  const openEditForm = (article) => {
    setEditingId(article.id);
    setForm({
      title: article.title || "",
      category: article.category || EMPTY_FORM.category,
      excerpt: article.excerpt || "",
      imageUrl: article.imageUrl || "",
      status: article.status || "draft",
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      if (editingId) {
        const updated = await updateArticle(editingId, form);
        setArticles((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...updated } : item))
        );
        toast.success("Article updated!");
      } else {
        const created = await createArticle(form);
        setArticles((prev) => [created, ...prev]);
        toast.success("Article created!");
      }
      closeForm();
    } catch (err) {
      console.error("Error saving article:", err);
      toast.error(err.message || "Couldn't save article.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const previous = articles;
    setArticles((prev) => prev.filter((item) => item.id !== id));

    try {
      await deleteArticle(id);
      toast.success("Article deleted.");
    } catch (err) {
      console.error("Error deleting article:", err);
      toast.error(err.message || "Couldn't delete article.");
      setArticles(previous);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-50">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Editor Dashboard</h1>
            <p className="mt-2 text-slate-400">Manage the articles you've written.</p>
          </div>
          <button
            type="button"
            onClick={openNewForm}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <Plus className="h-4 w-4" />
            New Article
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-600/40 bg-slate-900 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit article" : "New article"}
            </h2>

            <div>
              <label className="block text-sm text-slate-400" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={form.title}
                onChange={handleChange("title")}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-400" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={handleChange("category")}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={handleChange("status")}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400" htmlFor="imageUrl">
                Image URL
              </label>
              <input
                id="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange("imageUrl")}
                placeholder="https://..."
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400" htmlFor="excerpt">
                Excerpt / content
              </label>
              <textarea
                id="excerpt"
                rows={5}
                required
                value={form.excerpt}
                onChange={handleChange("excerpt")}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : editingId ? "Save changes" : "Create article"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl bg-slate-800 px-6 py-3 text-sm text-slate-200 transition hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 space-y-3">
          {isLoading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              Loading articles...
            </div>
          ) : articles.length === 0 && !error ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              You haven't written any articles yet.
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        article.status === "published"
                          ? "bg-cyan-500/20 text-cyan-300"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {article.status}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="mt-1 truncate text-base font-semibold text-white">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditForm(article)}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-cyan-400"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(article.id)}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorDashboard;
