const API_BASE = import.meta.env.VITE_API_BASE_URL;
import Instances from "../instances/Instances";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      ...options,
    });
  } catch {
    throw new Error(
      "Couldn't reach the backend. Connect your Netlify function to make this live."
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // no JSON body
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data;
}

// Expected shape from POST /auth/login and POST /auth/register:
// { name, email, role }
export const loginUser = (credentials) =>
  request("/auth/login", { method: "POST", body: JSON.stringify(credentials) });

export const registerUser = (data) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(data) });
export const forgotPassword = async (email) => {
    const response = await Instances.post('/auth/forgot-password', { email });
    return response.data;
};


export const getMe = () => request("/auth/me");
export const logoutUser = () => request("/auth/logout", { method: "POST" });

// Used to restore session on page refresh — expected shape same as login.
export const getCurrentUser = () => request("/auth/me");