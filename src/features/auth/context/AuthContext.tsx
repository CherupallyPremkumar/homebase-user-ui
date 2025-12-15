import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

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
  logout: () => void;
  getAuthToken: () => string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { },
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
    // TODO: Replace with actual API call
    // const response = await authService.login(email, password);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (password.length < 6) {
      throw new Error("Invalid email or password");
    }

    // Mock user and token
    const mockUser: AuthUser = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
    };

    const mockToken = "mock_token_" + Math.random().toString(36).substr(2, 16);

    // Store in localStorage or sessionStorage based on rememberMe
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("auth_user", JSON.stringify(mockUser));
    storage.setItem("auth_token", mockToken);

    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");
    setUser(null);
    navigate("/login");
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
        logout,
        getAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
