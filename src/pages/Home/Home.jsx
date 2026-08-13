import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Navbar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";
import BreakingNews from "../../components/home/BreakingNews";
import { searchNews } from "../../services/newsServices";
import { CATEGORY_OPTIONS } from "../../components/common/categories";


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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNews();
  };

  const handleArticleClick = (article) => {
    window.open(article.url, "_blank", "noopener,noreferrer");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: "bg-slate-700 text-slate-200",
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
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />

      

      <BreakingNews />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-700 to-slate-900 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold md:text-6xl">
            Stay Informed. Stay Ahead.
          </h1>
          <p className="mb-8 mt-4 text-xl text-cyan-100 md:text-2xl">
            Discover the latest news from trusted sources worldwide
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mx-auto max-w-4xl">
            <div className="rounded-lg bg-white p-4 shadow-lg">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Keywords, topics..."
                  value={searchParams.search}
                  onChange={(e) => setSearchParams({ ...searchParams, search: e.target.value })}
                  className="rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <select
                  value={searchParams.category}
                  onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
                  className="rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">All Categories</option>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-600 px-6 py-2 font-semibold text-white transition duration-200 hover:bg-cyan-700"
                >
                  Search News
                </button>
              </div>
            </div>
          </form>
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
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="mb-2 text-xl font-semibold text-slate-300">No news found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article, index) => (
                <div
                  key={`${article.url}-${index}`}
                  onClick={() => handleArticleClick(article)}
                  className="cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl"
                >
                  <div className="h-48 overflow-hidden bg-slate-800">
                    <img
                      src={article.urlToImage || "https://via.placeholder.com/640x360?text=News+Image"}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {searchParams.category && (
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getCategoryColor(
                            searchParams.category
                          )}`}
                        >
                          {searchParams.category}
                        </span>
                      )}
                      {article.source?.name && (
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300">
                          {article.source.name}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-white">
                      {article.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-sm text-slate-400">
                      {article.description || "No description available."}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {article.author || "Unknown author"}
                      </span>
                      <span className="text-xs text-slate-500">
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
                    className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                              ? "border-cyan-600 bg-cyan-600 text-white"
                              : "border-slate-700 text-slate-200 hover:bg-slate-800"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 py-2 text-slate-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
