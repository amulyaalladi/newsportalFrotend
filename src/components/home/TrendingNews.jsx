import { useState, useEffect } from "react";
import { fetchTopHeadlines } from "../../services/newsServices"


const TrendingNews = () => {
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadTrendingNews = async () => {
      try {
        const articles = await fetchTopHeadlines({ signal: controller.signal });
        setTrendingNews(articles);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching trending news:", err);
        setError(err.message || "Failed to fetch trending news.");
      } finally {
        setLoading(false);
      }
    };

    loadTrendingNews();
    return () => controller.abort();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-4">Trending News</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingNews.map((article) => (
            <div key={article.url} className="bg-slate-800 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-white mb-2">{article.title}</h3>
              <p className="text-slate-300">{article.description}</p>
              <div className="h-56 overflow-hidden bg-slate-800">
                    <img
                      src={article.urlToImage || "https://via.placeholder.com/640x360?text=News+Image"}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400"
              >
                Read more
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingNews;
