import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authService";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  socialLogin: (provider: string) => Promise<void>; // Simulated
  googleLogin: (code: string) => Promise<void>; // Real
  logout: () => void;
  getAuthToken: () => string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { },
  socialLogin: async () => { },
  googleLogin: async () => { },
  logout: () => { },
  getAuthToken: () => null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
    const storedToken = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_user");
        sessionStorage.removeItem("auth_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    // Call the actual auth service
    const response = await authService.login(email, password);

    // Mock/Service User Logic
    const authUser: AuthUser = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
    };

    // Store in localStorage or sessionStorage based on rememberMe
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("auth_user", JSON.stringify(authUser));
    storage.setItem("auth_token", response.token);

    setUser(authUser);
  };

  const socialLogin = async (provider: string) => {
    const response = await authService.socialLogin(provider);

    const authUser: AuthUser = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
    };

    // Always store social login in local storage for now (or session)
    localStorage.setItem("auth_user", JSON.stringify(authUser));
    localStorage.setItem("auth_token", response.token);

    setUser(authUser);
  };

  const googleLogin = async (code: string) => {
    const response = await authService.googleLogin(code);

    const authUser: AuthUser = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
    };

    // Store session
    localStorage.setItem("auth_user", JSON.stringify(authUser));
    localStorage.setItem("auth_token", response.token);

    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");
    setUser(null);
    navigate("/");
  };

  const getAuthToken = (): string | null => {
    return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        socialLogin,
        googleLogin,
        logout,
        getAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
