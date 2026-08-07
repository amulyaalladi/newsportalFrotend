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

/**
 * Search articles by keyword (not currently used by Hero.jsx since it now
 * only uses fixed categories, but kept here in case you add
 * company/topic-based search back in later).
 * @param {Object} options
 * @param {string} options.q - search term
 * @param {number} [options.pageSize=9]
 * @param {AbortSignal} [options.signal]
 */
export async function fetchEverything({ q, pageSize = 9, signal } = {}) {
  const params = new URLSearchParams({
    q,
    pageSize: String(pageSize),
    sortBy: "publishedAt",
    language: "en",
    apiKey: API_KEY ?? "",
  });

  const url = `${BASE_URL}/everything?${params.toString()}`;

  const response = await fetch(url, { signal });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Unable to search articles.");
  }

  return data.articles || [];
}

/**
 * Search top headlines with keyword + category + country + pagination.
 * Used by the Home page's search bar and filters. Returns totalResults too,
 * since NewsAPI's top-headlines endpoint supports pagination but only
 * returns article arrays per page — you need the total to build page numbers.
 * Note: NewsAPI's free tier caps results at 100 articles total regardless
 * of pageSize/page combination.
 * @param {Object} options
 * @param {string} [options.q] - keyword search
 * @param {string} [options.category]
 * @param {string} [options.country="us"]
 * @param {number} [options.page=1]
 * @param {number} [options.pageSize=12]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<{articles: Array, totalResults: number}>}
 */
export async function searchNews({
  q,
  category,
  country = "us",
  page = 1,
  pageSize = 12,
  signal,
} = {}) {
  const params = new URLSearchParams({
    country,
    page: String(page),
    pageSize: String(pageSize),
    apiKey: API_KEY ?? "",
  });

  if (category) params.set("category", category);
  if (q) params.set("q", q);

  const url = `${BASE_URL}/top-headlines?${params.toString()}`;

  const response = await fetch(url, { signal });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Unable to fetch news articles.");
  }

  return {
    articles: data.articles || [],
    totalResults: data.totalResults || 0,
  };
}