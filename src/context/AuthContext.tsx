import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  AuthContextType,
  User,
  LoginRequest,
} from "../features/auth/types/auth.types";
import { authApi } from "../features/auth/api/authApi";
import Loader from "../components/Loader";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Cookie is auto-sent, just call /me
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (error) {
        // Not authenticated or token expired
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authApi.login(data);
    setUser(response.data.user);
    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if API fails, clear user state
    }
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  if (isLoading) {
    return <Loader fullScreen text="Loading your account..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
