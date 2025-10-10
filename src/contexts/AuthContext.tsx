// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom"; // your API service
import { authService } from "@/services/authService";
import { LoginResponse } from "@/services/authService";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  tenantId: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  logout: () => void;
  getAuthToken: () => string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  getAuthToken: () => null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let canceled = false;

    const storedUserKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("auth_user_")
    );

    if (storedUserKeys.length === 0) {
      setIsLoading(false);
      return;
    }

    const storedUser = localStorage.getItem(storedUserKeys[0]);
    const tenantId = storedUserKeys[0].replace("auth_user_", "");
    const storedToken = localStorage.getItem(`auth_token_${tenantId}`);

    if (!storedUser || !storedToken) {
      setIsLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const verifyUser = async () => {
      try {
        const validUser = await authService.verifyToken(storedToken);
        if (!canceled) setUser(validUser);
      } catch {
        if (!canceled) logout();
      } finally {
        if (!canceled) setIsLoading(false);
      }
    };

    verifyUser();

    return () => {
      canceled = true;
    };
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);

      if (!response?.token || !response.user || !response.tenant)
        throw new Error("Invalid credentials");

      const userFromApi: AuthUser = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        tenantId: response.user.tenantId,
      };

      if (rememberMe) {
        localStorage.setItem(
          `auth_user_${userFromApi.tenantId}`,
          JSON.stringify(userFromApi)
        );
        localStorage.setItem(
          `auth_token_${userFromApi.tenantId}`,
          response.token
        );
      } else {
        sessionStorage.setItem(
          `auth_user_${userFromApi.tenantId}`,
          JSON.stringify(userFromApi)
        );
        sessionStorage.setItem(
          `auth_token_${userFromApi.tenantId}`,
          response.token
        );
      }

      setUser(userFromApi);

      return {
        user: userFromApi,
        token: response.token,
        tenant: response.tenant, // <-- now returned
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Object.keys(localStorage)
      .filter(
        (key) => key.startsWith("auth_user_") || key.startsWith("auth_token_")
      )
      .forEach((key) => localStorage.removeItem(key));

    Object.keys(sessionStorage)
      .filter(
        (key) => key.startsWith("auth_user_") || key.startsWith("auth_token_")
      )
      .forEach((key) => sessionStorage.removeItem(key));

    setUser(null);
    navigate("/login");
  };

  const getAuthToken = () => {
    if (!user) return null;
    return (
      localStorage.getItem(`auth_token_${user.tenantId}`) ||
      sessionStorage.getItem(`auth_token_${user.tenantId}`)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        getAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
