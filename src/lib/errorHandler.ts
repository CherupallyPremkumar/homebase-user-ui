/**
 * Centralized Error Handler
 * Provides consistent error handling and user-friendly messages
 */

import { toast } from '@/hooks/useToast';
import {
    ApiError,
    NetworkError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ValidationError,
    ServerError,
} from './errors';

// Re-export for convenience
export { NetworkError } from './errors';

/**
 * User-friendly error messages based on error type
 */
const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
    NetworkError: {
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please check your internet connection.',
    },
    AuthenticationError: {
        title: 'Authentication Required',
        description: 'Please log in to continue.',
    },
    AuthorizationError: {
        title: 'Access Denied',
        description: 'You do not have permission to perform this action.',
    },
    NotFoundError: {
        title: 'Not Found',
        description: 'The requested resource could not be found.',
    },
    ValidationError: {
        title: 'Validation Error',
        description: 'Please check your input and try again.',
    },
    ServerError: {
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
    },
    default: {
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
    },
};

/**
 * Handle errors and show appropriate toast messages
 */
export const handleError = (error: unknown, context?: string): void => {
    // Log error for debugging (in development)
    if (import.meta.env.DEV) {
        console.error(`[Error Handler${context ? ` - ${context}` : ''}]:`, error);
    }

    // TODO: Send to error monitoring service (Sentry, etc.)
    // logErrorToMonitoring(error, context);

    let errorMessage = ERROR_MESSAGES.default;

    // Determine error type and get appropriate message
    if (error instanceof NetworkError) {
        errorMessage = ERROR_MESSAGES.NetworkError;
    } else if (error instanceof AuthenticationError) {
        errorMessage = ERROR_MESSAGES.AuthenticationError;
        // Optionally redirect to login
        // window.location.href = '/?login=true';
    } else if (error instanceof AuthorizationError) {
        errorMessage = ERROR_MESSAGES.AuthorizationError;
    } else if (error instanceof NotFoundError) {
        errorMessage = ERROR_MESSAGES.NotFoundError;
    } else if (error instanceof ValidationError) {
        errorMessage = ERROR_MESSAGES.ValidationError;
        // Use custom message if provided
        if (error.message) {
            errorMessage.description = error.message;
        }
    } else if (error instanceof ServerError) {
        errorMessage = ERROR_MESSAGES.ServerError;
    } else if (error instanceof ApiError) {
        // Generic API error
        errorMessage = {
            title: 'Request Failed',
            description: error.message || ERROR_MESSAGES.default.description,
        };
    } else if (error instanceof Error) {
        // Generic JavaScript error
        errorMessage = {
            title: 'Error',
            description: error.message || ERROR_MESSAGES.default.description,
        };
    }

    // Show toast notification
    toast({
        title: errorMessage.title,
        description: errorMessage.description,
        variant: 'destructive',
    });
};

/**
 * Parse API error response and throw appropriate error
 */
export const parseApiError = async (response: Response): Promise<never> => {
    const { status } = response;

    let errorData: { message?: string; details?: unknown } = {};
    try {
        errorData = await response.json();
    } catch {
        // Response body is not JSON
    }

    const message = errorData.message || response.statusText;

    switch (status) {
        case 400:
            throw new ValidationError(message, errorData.details as Record<string, string>);
        case 401:
            throw new AuthenticationError(message);
        case 403:
            throw new AuthorizationError(message);
        case 404:
            throw new NotFoundError(message);
        case 500:
        case 502:
        case 503:
        case 504:
            throw new ServerError(message);
        default:
            throw new ApiError(status, message, errorData.details);
    }
};

/**
 * Wrapper for async operations with error handling
 */
export const withErrorHandling = async <T>(
    operation: () => Promise<T>,
    context?: string
): Promise<T | null> => {
    try {
        return await operation();
    } catch (error) {
        handleError(error, context);
        return null;
    }
};
