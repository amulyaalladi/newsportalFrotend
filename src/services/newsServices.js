// Centralized NewsAPI client.
// All news-fetching components should go through here instead of
// calling `fetch()` directly, so the API key and base URL live in one place.

const BASE_URL = "https://newsapi.org/v2";
const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

if (!API_KEY) {
  // Fails loudly in dev instead of silently returning empty results.
  console.warn(
    "[newsService] VITE_NEWS_API_KEY is not set. Add it to a .env file — see .env.example."
  );
}

/**
 * Fetch top headlines.
 * @param {Object} options
 * @param {string} [options.country="us"]
 * @param {string} [options.category] - e.g. "business", "technology"
 * @param {number} [options.pageSize=20]
 * @param {AbortSignal} [options.signal] - pass an AbortController signal to allow cancellation
 * @returns {Promise<Array>} articles array (empty array on failure)
 */
export async function fetchTopHeadlines({
  country = "us",
  category,
  pageSize = 20,
  signal,
} = {}) {
  const params = new URLSearchParams({
    country,
    pageSize: String(pageSize),
    apiKey: API_KEY ?? "",
  });

  if (category) params.set("category", category);

  const url = `${BASE_URL}/top-headlines?${params.toString()}`;

  const response = await fetch(url, { signal });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Unable to fetch news articles.");
  }

  return data.articles || [];
}
