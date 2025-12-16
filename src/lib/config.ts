/**
 * API Configuration
 * Uses environment variables for different deployment environments
 * 
 * Development: http://localhost:8080/api
 * Production: https://api.yourdomain.com/api
 */

// Vite exposes env variables via import.meta.env
// All client-side env vars must be prefixed with VITE_
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Validate that API_BASE_URL is set
if (!import.meta.env.VITE_API_BASE_URL) {
    console.warn('⚠️ VITE_API_BASE_URL is not set. Using default: http://localhost:8080/api');
}

// Feature Flags (optional)
export const FEATURES = {
    SOCIAL_LOGIN: import.meta.env.VITE_ENABLE_SOCIAL_LOGIN === 'true',
    WISHLIST: import.meta.env.VITE_ENABLE_WISHLIST === 'true',
} as const;

// Environment info
export const IS_PRODUCTION = import.meta.env.PROD;
export const IS_DEVELOPMENT = import.meta.env.DEV;
