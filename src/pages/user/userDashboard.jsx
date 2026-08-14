import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Navbar from "../../components/common/NavBar";
import { getProfile, getPreferences, updatePreferences } from "../../services/userServices";
import ProtectedInstance from "../../instances/ProtectedInstance";
import { CATEGORY_OPTIONS } from "../../components/common/categories";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [subscribedCategories, setSubscribedCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Get user profile
      const profile = await getProfile();
      setUser(profile);

      // 2. Safely get user preferences
      let categories = [];
      try {
        const preferences = await getPreferences();
        categories = preferences?.preferredCategories || [];
      } catch (prefErr) {
        console.warn("Could not load preferences, defaulting to empty:", prefErr);
        categories = [];
      }

      setSubscribedCategories(categories);

      // 3. Fetch news for subscribed categories from backend
    if (categories.length > 0) {
  const results = await Promise.all(
   categories.map((catKey) =>
  ProtectedInstance.get(`/news/category/${catKey}`)
    .then((res) => {
      const list = Array.isArray(res.data) ? res.data
        : Array.isArray(res.data?.data) ? res.data.data
        : Array.isArray(res.data?.articles) ? res.data.articles
        : [];
      return list.map((a) => ({ ...a, _category: catKey })); // tag with the key, not backend's field
    })
    .catch((err) => {
      console.error(`Failed to load news for category ${catKey}:`, err);
      return [];
    })
)
  );
       const merged = results
    .flat()
    .filter((article) => article && (article.title || article.heading)) // Check for valid article objects
    .map((article) => ({
      ...article,
      _category: article.category || "General",
    }))
    .sort((a, b) => new Date(b.createdAt || b.publishedAt || 0) - new Date(a.createdAt || a.publishedAt || 0));

  console.log("Merged articles ready for state:", merged); // 👈 Debug log to verify
  setArticles(merged);
} else {
  setArticles([]);
}

  } catch (err) {
    console.error("Error loading user dashboard:", err);
    if (err.status === 401 || err.response?.status === 401) {
      toast.error("Please log in to view your dashboard.");
      navigate("/login", { replace: true });
      return;
    }
    setError(err.message || "Failed to load your dashboard.");
  } finally {
    setLoading(false);
  }
};

     

  const handleUnsubscribe = async (key) => {
    const updatedCategories = subscribedCategories.filter((item) => item !== key);
    const previous = subscribedCategories;
    setSubscribedCategories(updatedCategories);
    setArticles((prev) => prev.filter((article) => article._category !== key));

    try {
      await updatePreferences({ preferredCategories: updatedCategories });
      toast.success("Unsubscribed.");
    } catch (err) {
      console.error("Error unsubscribing:", err);
      toast.error(err.message || "Couldn't update preferences.");
      setSubscribedCategories(previous);
    }
  };

  const categoryLabel = (key) =>
    CATEGORY_OPTIONS.find((option) => option.key === key)?.label || key;

  const uniqueSourceCount = new Set(
    articles.map((article) => article.source?.name || "News Portal").filter(Boolean)
  ).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Welcome back{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-gray-600">Catch up on news from the categories you follow</p>
        </div>

        {error && (
          <div className="mb-8 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-2xl font-bold text-gray-800">{subscribedCategories.length}</div>
            <div className="text-sm text-gray-600">Subscribed Categories</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-2xl font-bold text-cyan-600">{articles.length}</div>
            <div className="text-sm text-gray-600">Articles Loaded</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-2xl font-bold text-purple-600">{uniqueSourceCount}</div>
            <div className="text-sm text-gray-600">Sources Covered</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-2xl font-bold text-green-600">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-sm text-gray-600">Last Refreshed</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/home")}
              className="rounded-lg bg-cyan-600 px-6 py-3 text-white transition duration-200 hover:bg-cyan-700"
            >
              Browse News
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="rounded-lg bg-green-600 px-6 py-3 text-white transition duration-200 hover:bg-green-700"
            >
              Manage Preferences
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="rounded-lg bg-purple-600 px-6 py-3 text-white transition duration-200 hover:bg-purple-700"
            >
              View Notifications
            </button>
          </div>
        </div>

        {/* Subscribed categories chips */}
        {subscribedCategories.length > 0 && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Your Categories</h2>
            <div className="flex flex-wrap gap-2">
              {subscribedCategories.map((key) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700"
                >
                  {categoryLabel(key)}
                  <button
                    type="button"
                    onClick={() => handleUnsubscribe(key)}
                    className="text-cyan-500 hover:text-cyan-800"
                    title="Unsubscribe"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Subscribed News Section */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b p-6">
            <h2 className="text-xl font-semibold">Your Subscribed News</h2>
          </div>

          {subscribedCategories.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="mb-2 text-xl font-semibold text-gray-600">
                You haven't subscribed to any categories yet
              </h3>
              <p className="mb-6 text-gray-500">
                Pick a few categories to see personalized news here
              </p>
              <button
                onClick={() => navigate("/profile")}
                className="rounded-lg bg-cyan-600 px-6 py-3 text-white hover:bg-cyan-700"
              >
                Manage Preferences
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="mb-2 text-xl font-semibold text-gray-600">No articles found</h3>
              <p className="text-gray-500">Check back later for updates</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                 
                 // ✅ Guarantees a unique key whether using MongoDB _id, url, or index
{articles.map((article, index) => (
  <tr key={article._id || article.url || `article-${index}`} className="hover:bg-gray-50">
    <td className="max-w-xs px-6 py-4">
      <div className="truncate text-sm font-medium text-gray-900">
        {article.title || "Untitled Article"}
      </div>
    </td>
    <td className="whitespace-nowrap px-6 py-4">
      <span className="inline-flex rounded-full bg-cyan-100 px-2 text-xs font-semibold leading-5 text-cyan-800">
        {categoryLabel(article._category)}
      </span>
    </td>
    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
      {article.source?.name || article.source || "News Portal"}
    </td>
    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
      {new Date(article.createdAt || article.publishedAt || Date.now()).toLocaleDateString()}
    </td>
    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
      <a
        href={article.url || "#"}
        target="_blank"
        rel="noreferrer"
        className="text-cyan-600 hover:text-cyan-900"
      >
        Read
      </a>
    </td>
  </tr>
))}
                 
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;