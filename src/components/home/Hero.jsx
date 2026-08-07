import { useState } from "react";
import { BellRing, ChevronDown } from "lucide-react";
import { CATEGORY_OPTIONS } from "../../components/common/categories";
import { fetchTopHeadlines } from "../../services/newsServices"
import BreakingNews from "./BreakingNews";

const fetchForOption = (option, signal) =>
  fetchTopHeadlines({ category: option.key, pageSize: 9, signal });

const Hero = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [subscribed, setSubscribed] = useState([]);

  // "category" | "subscribed" | null
  const [activeView, setActiveView] = useState(null);
  const [activeCategoryKey, setActiveCategoryKey] = useState(null);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSubscribed = (key, event) => {
    event.stopPropagation();
    setSubscribed((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleCategoryClick = async (option) => {
    setIsCategoriesOpen(false);
    setActiveView("category");
    setActiveCategoryKey(option.key);
    setIsLoading(true);
    setError("");

    try {
      const articles = await fetchForOption(option);
      setNews(articles);
    } catch (err) {
      console.error("Error fetching category news:", err);
      setError(err.message || "Failed to load news for this category.");
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribedClick = async () => {
    setIsCategoriesOpen(false);

    if (subscribed.length === 0) {
      setActiveView("subscribed");
      setActiveCategoryKey(null);
      setNews([]);
      setError("You haven't subscribed to any categories yet. Open Categories and tap the star to subscribe.");
      return;
    }

    setActiveView("subscribed");
    setActiveCategoryKey(null);
    setIsLoading(true);
    setError("");

    try {
      const options = CATEGORY_OPTIONS.filter((option) => subscribed.includes(option.key));
      const results = await Promise.all(options.map((option) => fetchForOption(option)));
      const merged = results
        .flat()
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      setNews(merged);
    } catch (err) {
      console.error("Error fetching subscribed news:", err);
      setError(err.message || "Failed to load your subscribed news.");
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeLabel =
    activeView === "category"
      ? CATEGORY_OPTIONS.find((option) => option.key === activeCategoryKey)?.label
      : activeView === "subscribed"
      ? "Subscribed"
      : null;

  return (
    <section className="bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-2 lg:px-10">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="text-cyan-400">Welcome to</span> Daily
              <span className="text-red-600">Pulse</span>
            </h1>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSubscribedClick}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-800 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700"
              >
                <span>Subscribed</span>
                <BellRing className="h-4 w-4 text-white" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoriesOpen((prev) => !prev)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-800 px-6 py-3 text-sm font-medium text-white transition hover:bg-cyan-700"
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`h-4 w-4 text-white transition-transform ${
                      isCategoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isCategoriesOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCategoriesOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
                      {CATEGORY_OPTIONS.map((option) => (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => handleCategoryClick(option)}
                          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800"
                        >
                          <span>{option.label}</span>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(event) => toggleSubscribed(option.key, event)}
                            className="rounded-full p-1 transition hover:bg-slate-700"
                            title={
                              subscribed.includes(option.key)
                                ? "Remove from subscribed"
                                : "Add to subscribed"
                            }
                          >
                            <BellRing
                              className={`h-4 w-4 ${
                                subscribed.includes(option.key)
                                  ? "fill-cyan-400 text-cyan-400"
                                  : "text-slate-500"
                              }`}
                            />
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            
          </div>
          <BreakingNews/>

          {activeView && (
            <div>
              <h2 className="text-lg font-semibold text-slate-200">
                Dashboard — {activeView === "subscribed" ? "Your subscribed news" : activeLabel}
              </h2>

              <div className="mt-4">
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
                    {news.slice(0, 9).map((article, index) => (
                      <article
                        key={`${article.url}-${index}`}
                        className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
                      >
                        <div className="h-44 overflow-hidden bg-slate-800">
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
                          <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">
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
          )}
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
