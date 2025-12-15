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
 * Logout customer and clear session
 */
export const logout = async (): Promise<void> => {
  await fetch(`${API_BASE_URL}/customer/logout`, { method: "POST" });
};
