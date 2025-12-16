import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authService";
import { secureTokenStorage } from "@/lib/secureStorage";

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
  socialLogin: (provider: string) => Promise<void>;
  googleLogin: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { },
  socialLogin: async () => { },
  googleLogin: async () => { },
  logout: async () => { },
  getAuthToken: async () => null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from secure storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await secureTokenStorage.getUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Failed to load user from secure storage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const response = await authService.login(email, password);

    const authUser: AuthUser = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
    };

    // Store securely with encryption
    await secureTokenStorage.setToken(
      response.token,
      authUser,
      rememberMe,
      rememberMe ? 24 * 7 : 24 // 7 days if remember me, else 24 hours
    );

    setUser(authUser);
  };

  const socialLogin = async (provider: string) => {
    const response = await authService.socialLogin(provider);

    const authUser: AuthUser = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
    };

    // Store securely (default 24 hours)
    await secureTokenStorage.setToken(response.token, authUser, true, 24);

    setUser(authUser);
  };

  const googleLogin = async (code: string) => {
    const response = await authService.googleLogin(code);

    const authUser: AuthUser = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
    };

    // Store securely (default 24 hours)
    await secureTokenStorage.setToken(response.token, authUser, true, 24);

    setUser(authUser);
  };

  const logout = async () => {
    await secureTokenStorage.clearToken();
    setUser(null);
    navigate("/");
  };

  const getAuthToken = async (): Promise<string | null> => {
    return secureTokenStorage.getToken();
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
