import { useState, useEffect } from "react";
import { fetchTopHeadlines } from "../../services/newsServices"

const CATEGORIES = [
  {id:"business",label:"business"},
  {id:"sports",label:"sports"},
  {id:"technology", label:"technology"},
  {id:"apple" ,label:"apple"}
];

const CategoryNews = () => {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadNews = async () => {
      setIsLoading(true);
      setError("");

      try {
        const articles = await fetchTopHeadlines({
          category: selectedCategory,
          pageSize: 12,
          signal: controller.signal,
        });
        setNews(articles);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching category news:", err);
        setNews([]);
        setError(err.message || "Failed to fetch articles.");
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
    return () => controller.abort();
  }, [selectedCategory]);
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const selectedLabel = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

  return (
  <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Category News</h1>

        {/* Category Select Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="category-select" style={{ fontWeight: 'bold' }}>
            Category:
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: '#fff'
            }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* State Renderers */}
      {loading && <p style={{ color: '#666' }}>Loading news for {selectedCategory}...</p>}
      
      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>
          Error: {error}
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <p>No articles found for this category.</p>
      )}

      {/* News Feed Grid */}
      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {news.map((article, index) => (
            <article
              key={article.url || index}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#f9fafb'
              }}
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '4px' }}
                />
              )}
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: '#1d4ed8' }}
                  >
                    {article.title}
                  </a>
                </h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4b5563' }}>
                  {article.description}
                </p>
                <small style={{ color: '#9ca3af' }}>
                  {article.source?.name} • {new Date(article.publishedAt).toLocaleDateString()}
                </small>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryNews;
