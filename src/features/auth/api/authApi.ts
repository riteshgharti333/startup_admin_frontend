import axiosInstance from "../../../lib/axios";
import type { LoginRequest, User } from "../types/auth.types";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

interface MeResponse {
  success: boolean;
  message: string;
  data: User;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      "/auth/login",
      data,
    );
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<MeResponse>("/auth/me", {
      skipToast: true,
    });
    return response.data.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await axiosInstance.post<LogoutResponse>(
      "/auth/logout",
      {},
      { skipToast: true },
    );
    return response.data;
  },
};
