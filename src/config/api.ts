/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */

// Backend API base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Default tenant ID (can be overridden per request)
export const DEFAULT_TENANT_ID = import.meta.env.VITE_TENANT_ID || 'default';

// API Endpoints
export const API_ENDPOINTS = {
  // User-facing endpoints
  user: {
    cart: `${API_BASE_URL}/user/cart`,
    wishlist: `${API_BASE_URL}/user/wishlist`,
    order: `${API_BASE_URL}/user/order`,
    payment: `${API_BASE_URL}/user/payment`,
    products: `${API_BASE_URL}/user/products`,
  },
  
  // Admin endpoints (if needed)
  admin: {
    products: `${API_BASE_URL}/products`,
    orders: `${API_BASE_URL}/orders`,
    customers: `${API_BASE_URL}/customers`,
  },
};

/**
 * Build URL with query parameters
 */
export const buildUrl = (baseUrl: string, params?: Record<string, string | number | undefined>): string => {
  if (!params) return baseUrl;
  
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Common fetch options
 */
export const getFetchOptions = (method: string = 'GET', body?: any): RequestInit => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for session management
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  return options;
};

/**
 * Handle API errors
 */
export const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = `API Error: ${response.status} ${response.statusText}`;
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch {
    // If response is not JSON, use default error message
  }
  
  throw new Error(errorMessage);
};
