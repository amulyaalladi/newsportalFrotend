// Centralized client for the app's own news endpoints.
//
// Previously this called NewsAPI.org directly from the browser. That has
// two problems: NewsAPI's free tier only allows requests from localhost
// (it'll 426/CORS-fail on any real deployment), and it exposes the API key
// client-side. This version calls our own backend (newsController.js /
// newsRouter.js) instead, which serves articles from our own MongoDB.
//
// NOTE: assumes newsRouter is mounted at `/news` in server.js
// (e.g. `app.use('/news', newsRouter)`), and that `instance`'s baseURL
// already includes the `/api/v1` prefix (see instances.js). Adjust the
// paths below if newsRouter is mounted somewhere else.
//
// These routes are all public (no auth required per newsRouter.js), so we
// use the plain `instance` client, not `protectedInstance`.

import instance from "../instances/Instances";
import protectedInstance from "../instances/ProtectedInstance";

const extractErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

/**
 * Fetch a single category's articles from the backend.
 * @param {Object} options
 * @param {string} options.category - e.g. "business", "technology"
 * @param {number} [options.pageSize=20]
 * @param {number} [options.page=1]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<Array>} articles array
 */
export async function fetchTopHeadlines({ category, pageSize = 20, page = 1, signal } = {}) {
  try {
    const response = await instance.get(`/news/category/${encodeURIComponent(category)}`, {
      params: { pageSize, page },
      signal,
    });
    return response.data.articles || [];
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to fetch news articles."));
  }
}

/**
 * Keyword search against the backend's News collection.
 * @param {Object} options
 * @param {string} options.q - search term
 * @param {number} [options.pageSize=9]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<Array>} articles array
 */
export async function fetchEverything({ q, pageSize = 9, signal } = {}) {
  try {
    const response = await instance.get("/news/search", {
      params: { q, pageSize },
      signal,
    });
    return response.data.articles || [];
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to search articles."));
  }
}

/**
 * Search + paginate news. Used by the Home page's search bar and filters.
 * @param {Object} options
 * @param {string} [options.q] - keyword search
 * @param {string} [options.category]
 * @param {number} [options.page=1]
 * @param {number} [options.pageSize=12]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<{articles: Array, totalResults: number}>}
 */

export const searchNews = async (params = {}) => {
  // Converts params { q, category, page, pageSize } to query string
  const response = await instance.get("/news/search", { params });
  return response.data; // Returns { articles, totalResults }
};

/**
 * Latest breaking news, for the BreakingNews ticker on the Home page.
 * @returns {Promise<Array>} articles array
 */

export async function getBreakingNews({ signal } = {}) {
  try {
    const response = await instance.get("/news/breaking", { signal });
    // Handles both { result: [...] }, { articles: [...] }, or a raw array [...]
    return response.data.result || response.data.articles || response.data || [];
  } catch (error) {
    console.error("Breaking news detailed error:", error.response?.data || error);
    throw new Error(extractErrorMessage(error, "Unable to fetch breaking news."));
  }
}

/**
 * Trending news.
 * @returns {Promise<Array>} articles array
 */
export async function getTrendingNews({ signal } = {}) {
  try {
    const response = await instance.get("/news/trending", { signal });
    return response.data.result || [];
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to fetch trending news."));
  }
}

/**
 * Trigger the backend to pull fresh articles from NewsAPI and store them.
 * Admin/editor only — uses protectedInstance since it requires the auth
 * cookie. Wire this to a button in AdminDashboard/EditorDashboard.
 * @param {Object} [options]
 * @param {string} [options.category] - omit to ingest every category
 */
export async function triggerNewsIngestion({ category } = {}) {
  try {
    const response = await protectedInstance.post("/news/fetch-external", null, {
      params: category ? { category } : undefined,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to fetch external news."));
  }
}