/**
 * Authentication Service
 * Handles customer login/logout
 */

import { API_BASE_URL } from "@/lib/config";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Login customer
 * @param email - Customer email
 * @param password - Customer password
 * @returns Authentication token and user data
 */
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/customer/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Login failed");
  }

  return response.json();
};

/**
 * Login with Social Provider (Simulated)
 * @param provider - 'google' | 'github'
 */
export const socialLogin = async (
  provider: string
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/customer/login/${provider}`, {
    method: "GET", // Backend uses GET for simulation, normally this is a redirect
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `${provider} login failed`);
  }

  return response.json();
};

/**
 * Login with Google Code (Real)
 * @param code - Authorization Code from Google
 */
export const googleLogin = async (
  code: string
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/customer/login/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Google login failed");
  }

  return response.json();
};

/**
 * Get Google Auth URL from Backend
 */
export const getGoogleAuthUrl = async (): Promise<{ url: string }> => {
  const response = await fetch(`${API_BASE_URL}/customer/login/url/google`);
  if (!response.ok) {
    throw new Error("Failed to get Google Auth URL");
  }
  return response.json();
};

/**
 * Logout customer and clear session
 */
export const logout = async (): Promise<void> => {
  await fetch(`${API_BASE_URL}/customer/logout`, { method: "POST" });
};
