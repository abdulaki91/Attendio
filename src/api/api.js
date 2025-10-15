// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // your backend URL
});

// Add the token before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Catch expired or invalid token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const msg = error.response.data?.message;
      if (msg === "jwt expired" || error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login"; // redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default api;
