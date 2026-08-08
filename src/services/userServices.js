// API client for user data (profile, preferences, notifications).
// Update VITE_API_BASE_URL in your .env to point at your backend, e.g.:
//   VITE_API_BASE_URL=https://api.yourdomain.com

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      ...options,
    });
  } catch (networkError) {
    throw new Error(
      "Couldn't reach the backend. Check VITE_API_BASE_URL and make sure the server is running."
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // no JSON body — fine for e.g. 204 responses
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}

// ---- Profile -------------------------------------------------------------

// Expected shape from GET /profile:
// { name: string, email: string, bio: string, avatarUrl: string, role: "user" | "editor" | "admin" }
export const getProfile = () => request("/auth/me");

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