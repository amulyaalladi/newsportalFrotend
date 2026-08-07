// Example API client for user data (profile, preferences, notifications).
// Points at Netlify Functions by default. Once you deploy real functions,
// they should live at /.netlify/functions/<name> and this will "just work" —
// no other file needs to change. Override the base URL via .env if needed:
//   VITE_API_BASE_URL=https://your-site.netlify.app/.netlify/functions

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/.netlify/functions";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch (networkError) {
    // Most likely cause during development: the Netlify function doesn't
    // exist yet, or you're not running `netlify dev`.
    throw new Error(
      "Couldn't reach the backend. If it's not deployed yet, this is expected — connect your Netlify function to make this live."
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // no JSON body — fine for e.g. 204 responses
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data;
}

// ---- Profile -------------------------------------------------------------

// Expected shape from GET /profile:
// { name: string, email: string, bio: string, avatarUrl: string }
export const getProfile = () => request("/profile");

export const updateProfile = (profile) =>
  request("/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });

// ---- Preferences -----------------------------------------------------------

// Expected shape from GET /preferences:
// {
//   emailNewsletter: boolean,
//   darkMode: boolean,
//   preferredCategories: string[],
//   notificationFrequency: "immediate" | "hourly" | "daily" | "off"
// }
export const getPreferences = () => request("/preferences");

export const updatePreferences = (preferences) =>
  request("/preferences", {
    method: "PUT",
    body: JSON.stringify(preferences),
  });

// ---- Notifications ---------------------------------------------------------

// Expected shape from GET /notifications:
// [{ id: string, title: string, message: string, createdAt: string, read: boolean }]
export const getNotifications = () => request("/notifications");

export const markNotificationRead = (id) =>
  request(`/notifications/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ read: true }),
  });

export const markAllNotificationsRead = () =>
  request("/notifications/read-all", { method: "PATCH" });