import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Add token before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//  Catch expired/invalid token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message;

      // Handle expired token or unauthorized
      if (
        message?.toLowerCase().includes("expired") ||
        error.response.status === 401
      ) {
        // Show backend message in toast
        toast.error(message || "Session expired, please log in again");

        // Remove token and redirect after 2 seconds (so user can see toast)
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }, 2000);
      } else if (message) {
        // Any other backend message
        toast.error(message);
      }
    } else {
      // Handle network or unknown errors
      toast.error("Network error. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default api;
