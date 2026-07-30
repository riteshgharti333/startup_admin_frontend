import axiosInstance from "../../lib/axios";
import type { LoginDto } from "../types";

const BASE_URL = "/auth";

export const authApi = {
  login: async (data: LoginDto) => {
    const response = await axiosInstance.post(`${BASE_URL}/login`, data, {
      successMessage: "Login successful!",
    });
    return response.data.data;
  },

  getMe: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/me`);
    return response.data.data;
  },

  logout: async () => {
    const response = await axiosInstance.post(`${BASE_URL}/logout`, null, {
      successMessage: "Logged out successfully!",
    });
    return response.data.data;
  },
};
