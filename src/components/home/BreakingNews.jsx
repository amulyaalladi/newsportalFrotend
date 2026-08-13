import { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import { getBreakingNews } from "../../services/newsServices"

const BreakingNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadBreakingNews = async () => {
      try {
        const articles = await getBreakingNews({
          signal: controller.signal,
        });
        setNews(articles);
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Error fetching breaking news:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBreakingNews();
    return () => controller.abort();
  }, []);

  if (loading) {
    return <div>Loading News.....</div>;
  }

  const displayNews = [...news, ...news];

  return (
    <div className="bg-slate-900 border-y border-slate-600/30 text-white flex items-center overflow-hidden h-10 select-none">
      <div className="bg-red-600 text-white px-4 py-2 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 z-10 shrink-0 shadow-md">
        <Flame className="h-4 w-4 text-white animate-pulse" />
        Breaking News
      </div>
      <div
        className="relative w-full overflow-hidden flex items-center h-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex whitespace-nowrap gap-8 items-center transition-all ${
            isPaused ? "[animation-play-state:paused]" : ""
          }`}
          style={{ animation: "marquee 20s linear infinite" }}
        >
          {displayNews.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-200 hover:text-red-400 hover:underline transition-colors"
            >
              <span className="w-1.5 h-1 rounded-full bg-red-500 shrink-0"></span>
              {item.author ? item.author : "Unknown Author"}: {item.title}
            </a>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-20%);
          }
        }
      `}</style>
    </div>
  );
};

export default BreakingNews;