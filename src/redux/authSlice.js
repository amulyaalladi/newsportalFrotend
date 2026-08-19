import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage so page refreshes don't wipe auth state
const token = localStorage.getItem("token");
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  isAuthenticated: !!token,
  user: user,
  token: token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Save to localStorage for persistence
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("sessionExpiresAt", Date.now() + 3600000);
    },

    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      // Clear storage on logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;