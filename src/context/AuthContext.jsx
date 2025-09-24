import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const queryClient = useQueryClient();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const { data } = await axios.post(`${baseUri}/users/login`, credentials);
      setToken(data.token);
      setUserId(data.user.id);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    queryClient.removeQueries(); // removes all queries
    queryClient.clear();
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
