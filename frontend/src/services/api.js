import axios from "axios";

/* ---------------- BASE API INSTANCE ---------------- */

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
/* Attach JWT token automatically */

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("cw_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
/* Handle global auth errors */

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cw_token");
      localStorage.removeItem("cw_user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/* ---------------- AUTH API ---------------- */

export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const updateProfile = (data) => API.put("/auth/profile", data);

/* ---------------- CREDIT API ---------------- */

export const calculateScore = (data) => API.post("/credit/calculate", data);
export const getHistory = () => API.get("/credit/history");
export const getLatestScore = () => API.get("/credit/latest");
export const getCreditStats = () => API.get("/credit/stats");

/* ---------------- ADMIN API ---------------- */

export const getAdminStats = () => API.get("/admin/stats");
export const getAdminUsers = (params) => API.get("/admin/users", { params });
export const toggleUserStatus = (id) =>
  API.put(`/admin/users/${id}/toggle`);

/* ---------------- EXPORT ---------------- */

export default API;
