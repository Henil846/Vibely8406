// Use local backend in dev mode, Vercel backend in production
const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:3000/api"
  : "https://vibely-backend-delta.vercel.app/api";

// Token management — store JWT in localStorage for cross-origin auth
function getToken() {
  return localStorage.getItem("vibely_token");
}

export function setToken(token) {
  if (token) {
    localStorage.setItem("vibely_token", token);
  }
}

export function removeToken() {
  localStorage.removeItem("vibely_token");
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Still send cookies as fallback
    ...options,
  };

  // Attach Bearer token if available
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

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

// Social API
export const socialAPI = {
  // Search
  searchUsers: (username) => apiRequest(`/social/search?username=${encodeURIComponent(username)}`),

  // Friend Requests
  sendFriendRequest: (userId) =>
    apiRequest(`/social/friend-request/send/${userId}`, { method: "POST" }),

  acceptFriendRequest: (requestId) =>
    apiRequest(`/social/friend-request/accept/${requestId}`, { method: "POST" }),

  rejectFriendRequest: (requestId) =>
    apiRequest(`/social/friend-request/reject/${requestId}`, { method: "POST" }),

  cancelFriendRequest: (requestId) =>
    apiRequest(`/social/friend-request/cancel/${requestId}`, { method: "POST" }),

  getReceivedFriendRequests: () => apiRequest("/social/friend-requests/received"),

  getSentFriendRequests: () => apiRequest("/social/friend-requests/sent"),

  getFriends: () => apiRequest("/social/friends"),

  unfriend: (userId) =>
    apiRequest(`/social/unfriend/${userId}`, { method: "POST" }),

  // Follow
  followUser: (userId) =>
    apiRequest(`/social/follow/${userId}`, { method: "POST" }),

  unfollowUser: (userId) =>
    apiRequest(`/social/unfollow/${userId}`, { method: "POST" }),

  acceptFollowRequest: (requestId) =>
    apiRequest(`/social/follow-request/accept/${requestId}`, { method: "POST" }),

  rejectFollowRequest: (requestId) =>
    apiRequest(`/social/follow-request/reject/${requestId}`, { method: "POST" }),

  getFollowRequests: () => apiRequest("/social/follow-requests"),

  getFollowers: () => apiRequest("/social/followers"),

  getFollowing: () => apiRequest("/social/following"),

  // Relationship status
  getRelationshipStatus: (userId) => apiRequest(`/social/status/${userId}`),
};

export default apiRequest;
