/**
 * Authentication Service
 * Handles customer login/logout with multi-tenant support
 */

export interface LoginRequest {
  email: string;
  password: string;
  tenantId: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    tenantId: string;
  };
}

/**
 * Login customer with tenant-specific credentials
 * @param email - Customer email
 * @param password - Customer password
 * @param tenantId - Tenant identifier
 * @returns Authentication token and user data
 */
export const login = async (
  email: string,
  password: string,
  tenantId: string
): Promise<LoginResponse> => {
  // TODO: Replace with actual API endpoint
  // const response = await fetch(`/api/customer/login?tenantId=${tenantId}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }),
  // });
  // return await response.json();

  // Mock implementation
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (password.length < 6) {
    throw new Error("Invalid email or password");
  }

  // Mock successful login
  return {
    token: `mock_token_${tenantId}_${Date.now()}`,
    user: {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name: email.split("@")[0],
      tenantId,
    },
  };
};

/**
 * Logout customer and clear session
 */
export const logout = async (): Promise<void> => {
  // TODO: Replace with actual API endpoint
  // await fetch('/api/customer/logout', { method: 'POST' });

  // Mock implementation
  await new Promise((resolve) => setTimeout(resolve, 200));
};
