import axios from "axios";

const API_URL = "https://newsportalbackend-oatr.onrender.com/api/v1";

const adminService = {
  getDashboardStats: async () => {
    const response = await axios.get(`${API_URL}/admin/dashboard`, {
      withCredentials: true,
    });

    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await axios.get(`${API_URL}/admin/users`, {
      params,
      withCredentials: true,
    });

    return response.data;
  },

  getUserById: async (id) => {
    const response = await axios.get(`${API_URL}/admin/users/${id}`, {
      withCredentials: true,
    });

    return response.data;
  },

  blockUser: async (id) => {
    const response = await axios.patch(
      `${API_URL}/users/${id}/block`,
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  },

  unblockUser: async (id) => {
    const response = await axios.patch(
      `${API_URL}/users/${id}/unblock`,
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axios.delete(
      `${API_URL}/users/${id}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  },
  getUserRegistrationStats: async () => {
    const response = await axios.get(
      `${API_URL}/news/analytics/users`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  },

  // Category preference chart
  getCategoryStats: async () => {
    const response = await axios.get(
      `${API_URL}/news/analytics/categories`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  },

  // Published news count
  getNewsStats: async () => {
    const response = await axios.get(
      `${API_URL}/analytics/news`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  },

  // --- Category management (CRUD) ---
  // NOTE: these live at /categories, not /admin/categories — that's how
  // categoryRouter.js is mounted in the backend (app.js).

  getAllCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`, {
      withCredentials: true,
    });

    return response.data;
  },

  addCategory: async (name) => {
    const response = await axios.post(
      `${API_URL}/categories`,
      { name },
      {
        withCredentials: true,
      }
    );

    return response.data;
  },

  updateCategory: async (id, name) => {
    const response = await axios.put(
      `${API_URL}/categories/${id}`,
      { name },
      {
        withCredentials: true,
      }
    );

    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await axios.delete(`${API_URL}/categories/${id}`, {
      withCredentials: true,
    });

    return response.data;
  },
};

export default adminService;