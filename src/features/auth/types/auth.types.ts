export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
}
