// In development, Vite proxy handles /api -> localhost:3000
// In production (GitHub Pages), we need the full backend URL
const API_BASE = import.meta.env.PROD
  ? "https://vibely-backend-delta.vercel.app/api"
  : "/api";

async function apiRequest(endpoint, options = {}) {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Send cookies
    ...options,
  };

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "API request failed");
    error.code = data.code || "";
    error.status = response.status;
    throw error;
  }

  return data;
}

// Auth API
export const authAPI = {
  sendOTP: (email) =>
    apiRequest("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  verifyOTP: (email, otp) =>
    apiRequest("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),

  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiRequest("/auth/logout", {
      method: "POST",
    }),
};

// User API
export const userAPI = {
  getMe: () => apiRequest("/user/me"),

  updateProfile: (data) =>
    apiRequest("/user/update", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  discover: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const query = params.toString();
    return apiRequest(`/user/discover${query ? `?${query}` : ""}`);
  },

  blockUser: (userId) =>
    apiRequest(`/user/block/${userId}`, {
      method: "POST",
    }),

  reportUser: (reportData) =>
    apiRequest("/user/report", {
      method: "POST",
      body: JSON.stringify(reportData),
    }),
};

export default apiRequest;
