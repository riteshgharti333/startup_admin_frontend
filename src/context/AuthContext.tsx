import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AuthService from "../services/auth.service";
import axiosInstance from "../services/axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Get token from sessionStorage
  const getToken = () => sessionStorage.getItem("token");

  // Fetch current user from /me endpoint using Axios
  const fetchCurrentUser = async (token: string) => {
    try {
      // Set token in axios instance
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      const result = await AuthService.getMe();

      if (result.success) {
        setUser(result.data);
        return true;
      } else {
        sessionStorage.removeItem("token");
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      sessionStorage.removeItem("token");
      setUser(null);
      return false;
    }
  };

  // Check for existing token on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        await fetchCurrentUser(token);
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  // Login function using Axios
  const login = async (email: string, password: string) => {
    try {
      const result = await AuthService.login(email, password);

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      const { token } = result.data;

      // Store token
      sessionStorage.setItem("token", token);
      
      // Set default auth header for future requests
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch full user data from /me
      await fetchCurrentUser(token);

      toast.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || error.message || "Login failed");
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    sessionStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};