import ProtectedInstance from "../instances/ProtectedInstance";

// ---- Profile -------------------------------------------------------------
export const getProfile = async () => {
  const response = await ProtectedInstance.get("/users/me");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await ProtectedInstance.put("/users/me", profileData);
  return response.data;
};

// ---- Preferences -----------------------------------------------------------
export const getPreferences = async () => {
  const response = await ProtectedInstance.get("/preferences");
  return response.data;
};

export const updatePreferences = async (preferencesData) => {
  const response = await ProtectedInstance.put("/preferences", preferencesData);
  return response.data;
};

// ---- Notifications ---------------------------------------------------------
// ---- Notifications ---------------------------------------------------------
export const getNotifications = async () => {
  try {
    const response = await ProtectedInstance.get("/notifications");
    
    // Extract array from {"success": true, "result": []}
    if (Array.isArray(response.data?.result)) {
      return response.data.result;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error("userServices getNotifications error:", error);
    throw error;
  }
};

export const markNotificationRead = async (id) => {
  const response = await ProtectedInstance.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await ProtectedInstance.patch("/notifications/read-all");
  return response.data;
};