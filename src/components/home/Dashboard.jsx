import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { fetchTopHeadlines } from "../../services/newsServices"
import { CATEGORY_OPTIONS } from "../../components/common/categories";

const Dashboard = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();

  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const isSubscribedView = category === "subscribed";
  const subscribedKeys = isSubscribedView
    ? (searchParams.get("categories") || "").split(",").filter(Boolean)
    : [];

  const heading = isSubscribedView
    ? "Your subscribed news"
    : CATEGORY_OPTIONS.find((option) => option.key === category)?.label || category;

  useEffect(() => {
    const controller = new AbortController();

    const loadNews = async () => {
      setIsLoading(true);
      setError("");

      try {
        if (isSubscribedView) {
          if (subscribedKeys.length === 0) {
            setNews([]);
            setError("You haven't subscribed to any categories yet. Go back and tap the star on a category to subscribe.");
            return;
          }

          const results = await Promise.all(
            subscribedKeys.map((key) =>
              fetchTopHeadlines({ category: key, pageSize: 9, signal: controller.signal })
            )
          );
          const merged = results
            .flat()
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
          setNews(merged);
        } else {
          const articles = await fetchTopHeadlines({
            category,
            pageSize: 12,
            signal: controller.signal,
          });
          setNews(articles);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching dashboard news:", err);
        setError(err.message || "Failed to load news.");
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, searchParams]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        
        <h1 className="mt-4 text-3xl font-semibold capitalize">{heading}</h1>

        <div className="mt-8">
          {isLoading ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              Loading news...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-600/40 bg-slate-900 p-8 text-center text-red-300">
              {error}
            </div>
          ) : news.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              No articles found.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {news.map((article, index) => (
                <article
                  key={`${article.url}-${index}`}
                  className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
                >
                  <div className="h-48 overflow-hidden bg-slate-800">
                    <img
                      src={article.urlToImage || "https://via.placeholder.com/640x360?text=News+Image"}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-white line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-3">
                      {article.description || "No description available."}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        Read more
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
