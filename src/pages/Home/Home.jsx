import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Navbar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";
import BreakingNews from "../../components/home/BreakingNews";
import { searchNews } from "../../services/newsServices";


const PAGE_SIZE_OPTIONS = [12, 24, 36];

  

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    search: "",
    category: "",
  });
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = useSelector((state) => state.auth?.user);
  const navigate = useNavigate();
  useEffect(() => {
    // If Redux has no user, send them back to login
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const fetchNews = async (filters = searchParams) => {
    try {
      setLoading(true);
      const { articles, totalResults } = await searchNews({
        q: filters.search || undefined,
        category: filters.category || undefined,
        page: currentPage,
        pageSize,
      });

      setNews(articles);
      // NewsAPI's free tier caps total results at 100 regardless of query.
      setTotalPages(Math.max(1, Math.ceil(Math.min(totalResults, 100) / pageSize)));
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error(error.message || "Failed to fetch news.");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (article) => {
    window.open(article.url, "_blank", "noopener,noreferrer");
  };

  const handleCategoryChange = (value) => {
    // "All" -> empty string, matching fetchNews's `filters.category || undefined`.
    // Backend's searchNews does an exact match, so this must be lowercase
    // to match how categories are actually stored (e.g. "technology").
    const category = value === "All" ? "" : value.toLowerCase();
    const updated = { ...searchParams, category };
    setSearchParams(updated);
    setCurrentPage(1);
    // Explicit call needed: if currentPage was already 1, setCurrentPage(1)
    // won't change it, so the [currentPage, pageSize] useEffect won't fire
    // on its own — this fetch is what actually applies the new filter.
    fetchNews(updated);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: "bg-stone-700 text-stone-200",
      business: "bg-blue-100 text-blue-800",
      technology: "bg-purple-100 text-purple-800",
      sports: "bg-green-100 text-green-800",
      entertainment: "bg-pink-100 text-pink-800",
      health: "bg-red-100 text-red-800",
      science: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-50">
      <Navbar />

      

      <BreakingNews />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-800 to-stone-900 py-16 text-white">
  <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-4 md:flex-row">
    
    {/* Left Side: Hero Text */}
    <div className="text-center md:text-left">
      <h1 className="text-4xl font-bold md:text-6xl">
        Stay Informed. Stay Ahead.
      </h1>
      <p className="mt-4 text-xl text-red-100 md:text-2xl">
        Discover the latest news from trusted sources worldwide
      </p>
    </div>

    {/* Right Side: Category Dropdown */}
    <div className="w-full max-w-xs sm:w-64">
      <label htmlFor="category-select" className="mb-2 block text-sm font-medium text-red-100">
        Filter by Category
      </label>
      <select
        id="category-select"
        value={searchParams.category || "All"}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="w-full rounded-xl border border-red-700/50 bg-stone-900/80 px-4 py-3 text-white shadow-lg backdrop-blur-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20"
      >
        <option value="All">All Categories</option>
        <option value="general">General</option>
        <option value="business">Business</option>
        <option value="technology">Technology</option>
        <option value="sports">Sports</option>
        <option value="entertainment">Entertainment</option>
        <option value="health">Health</option>
        <option value="science">Science</option>
      </select>
    </div>

  </div>
</div>

      {/* News Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Latest News</h2>
          <div className="flex items-center gap-4">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-stone-200 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-red-600"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="mb-2 text-xl font-semibold text-stone-300">No news found</h3>
            <p className="text-stone-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article, index) => (
                <div
                  key={`${article.url}-${index}`}
                  onClick={() => handleArticleClick(article)}
                  className="cursor-pointer overflow-hidden rounded-xl border border-stone-800 bg-stone-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-red-600/40 hover:shadow-xl"
                >
                  <div className="h-48 overflow-hidden bg-stone-800">
                    <img
                      src={article.image || article.urlToImage || "https://placehold.co/640x360/1e293b/ffffff?text=News+Image"}
                      alt={article.title}
                       className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {article.category && (
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getCategoryColor(
                            article.category
                          )}`}
                        >
                          {article.category}
                        </span>
                      )}
                     {article.author && (
                        <span className="rounded-full bg-stone-800 px-2 py-1 text-xs font-medium text-stone-300">
                         {article.author}
                          </span>
                      )}
                    </div>

                    <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-white">
                      {article.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-sm text-stone-400">
                      {article.description || "No description available."}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-500">
                        {article.author || "Unknown author"}
                      </span>
                      <span className="text-xs text-stone-500">
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-stone-700 px-4 py-2 text-stone-200 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`rounded-lg border px-4 py-2 ${
                            currentPage === page
                              ? "border-red-700 bg-red-700 text-white"
                              : "border-stone-700 text-stone-200 hover:bg-stone-800"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 py-2 text-stone-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-stone-700 px-4 py-2 text-stone-200 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;