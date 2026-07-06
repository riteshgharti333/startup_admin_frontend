import axios from "axios";
import { toast } from "react-hot-toast";

// Extend axios config to support skipToast
declare module "axios" {
  export interface AxiosRequestConfig {
    skipToast?: boolean;
    successMessage?: string;
  }
}

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Show success toast only if not skipped and not GET request
    if (!response.config.skipToast && response.config.method !== "get") {
      const message =
        response.config.successMessage || response.data?.message || "Success";
      toast.success(message);
    }
    return response;
  },
  (error) => {
    // Skip toast for login requests and when skipToast is true
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (error.config?.skipToast || isLoginRequest) {
      return Promise.reject(error);
    }

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          toast.error("Session expired. Please login again.");

          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          break;

        case 403:
          toast.error(
            data?.message || "Access denied. You don't have permission.",
          );
          break;

        case 404:
          toast.error(data?.message || "Resource not found.");
          break;

        case 409:
          toast.error(data?.message || "Conflict error.");
          break;

        case 422:
          toast.error(data?.message || "Validation error.");
          break;

        case 500:
          toast.error(data?.message || "Internal server error.");
          break;

        default:
          toast.error(data?.message || "Something went wrong.");
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
