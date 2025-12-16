/**
 * Centralized API Client
 * Provides consistent API calls with authentication and error handling
 */

import { API_BASE_URL } from './config';
import { NetworkError, parseApiError } from './errorHandler';
import { secureTokenStorage, getLegacyToken } from './secureStorage';

/**
 * API Client configuration
 */
interface RequestConfig extends RequestInit {
    skipAuth?: boolean;
}

/**
 * Get authentication token from secure storage
 * Falls back to legacy storage for backward compatibility
 */
const getAuthToken = async (): Promise<string | null> => {
    // Try secure storage first
    const secureToken = await secureTokenStorage.getToken();
    if (secureToken) return secureToken;

    // Fallback to legacy storage
    return getLegacyToken();
};

/**
 * Base fetch wrapper with error handling
 */
const baseFetch = async <T>(url: string, config: RequestConfig = {}): Promise<T> => {
    const { skipAuth = false, headers = {}, ...restConfig } = config;

    // Build headers
    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(headers as Record<string, string>),
    };

    // Add auth token if not skipped
    if (!skipAuth) {
        const token = await getAuthToken();
        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...restConfig,
            headers: requestHeaders,
        });

        // Handle non-OK responses
        if (!response.ok) {
            await parseApiError(response);
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return {} as T;
        }

        return await response.json();
    } catch (error) {
        // Network error (no response from server)
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new NetworkError();
        }
        // Re-throw API errors
        throw error;
    }
};

/**
 * API Client methods
 */
export const apiClient = {
    /**
     * GET request
     */
    get: <T>(url: string, config?: RequestConfig): Promise<T> => {
        return baseFetch<T>(url, { ...config, method: 'GET' });
    },

    /**
     * POST request
     */
    post: <T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
        return baseFetch<T>(url, {
            ...config,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    },

    /**
     * PUT request
     */
    put: <T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
        return baseFetch<T>(url, {
            ...config,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    },

    /**
     * DELETE request
     */
    delete: <T>(url: string, config?: RequestConfig): Promise<T> => {
        return baseFetch<T>(url, { ...config, method: 'DELETE' });
    },
};
