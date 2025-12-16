/**
 * Authentication Service
 * Handles customer login/logout
 */

import { apiClient } from "@/lib/apiClient";

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
  return apiClient.post<LoginResponse>(
    '/customer/login',
    { email, password },
    { skipAuth: true } // Login doesn't require existing auth
  );
};

/**
 * Login with Social Provider (Simulated)
 * @param provider - 'google' | 'github'
 */
export const socialLogin = async (
  provider: string
): Promise<LoginResponse> => {
  return apiClient.get<LoginResponse>(
    `/customer/login/${provider}`,
    { skipAuth: true }
  );
};

/**
 * Login with Google Code (Real)
 * @param code - Authorization Code from Google
 */
export const googleLogin = async (
  code: string
): Promise<LoginResponse> => {
  return apiClient.post<LoginResponse>(
    '/customer/login/google',
    { code },
    { skipAuth: true }
  );
};

/**
 * Get Google Auth URL from Backend
 */
export const getGoogleAuthUrl = async (): Promise<{ url: string }> => {
  return apiClient.get<{ url: string }>(
    '/customer/login/url/google',
    { skipAuth: true }
  );
};

/**
 * Logout customer and clear session
 */
export const logout = async (): Promise<void> => {
  return apiClient.post<void>('/customer/logout');
};
