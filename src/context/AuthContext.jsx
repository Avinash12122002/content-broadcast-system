"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("auth_token");
        const userStr = localStorage.getItem("auth_user");
        if (token && userStr) {
          const parsedUser = JSON.parse(userStr);
          setUser(parsedUser);
        }
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(
    async (credentials) => {
      const { token, user: loggedInUser } =
        await authService.login(credentials);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      if (loggedInUser.role === "principal") {
        router.push(ROUTES.PRINCIPAL_DASHBOARD);
      } else {
        router.push(ROUTES.TEACHER_DASHBOARD);
      }
      return loggedInUser;
    },
    [router],
  );

  const logout = useCallback(async () => {
    await authService.logout().catch(() => {});
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    router.push(ROUTES.AUTH);
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
