import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/hooks/useTenant";

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
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
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
  const { tenant } = useTenant();
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    const storedToken = localStorage.getItem("auth_token");
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Verify tenant matches
        if (tenant && parsedUser.tenantId === tenant.id) {
          setUser(parsedUser);
        } else {
          // Clear invalid tenant session
          localStorage.removeItem("auth_user");
          localStorage.removeItem("auth_token");
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
    setIsLoading(false);
  }, [tenant]);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    if (!tenant) {
      throw new Error("Tenant not detected");
    }

    // Mock login - replace with actual API call
    // In production: const response = await authService.login(email, password, tenant.id);
    
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
      tenantId: tenant.id,
    };

    const mockToken = "mock_token_" + Math.random().toString(36).substr(2, 16);

    // Store in localStorage
    if (rememberMe) {
      localStorage.setItem("auth_user", JSON.stringify(mockUser));
      localStorage.setItem("auth_token", mockToken);
    } else {
      sessionStorage.setItem("auth_user", JSON.stringify(mockUser));
      sessionStorage.setItem("auth_token", mockToken);
    }

    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");
    setUser(null);
    
    // Redirect to login
    if (tenant) {
      navigate(tenant.urlPath ? `${tenant.urlPath}/login` : "/login");
    }
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
