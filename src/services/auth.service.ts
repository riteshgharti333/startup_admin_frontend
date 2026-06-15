import ApiService from "./api.service";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    token: string;
  };
}

interface MeResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await ApiService.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return response;
  },

  getMe: async (): Promise<MeResponse> => {
    const response = await ApiService.get<MeResponse>("/auth/me");
    return response;
  },
};

export default AuthService;