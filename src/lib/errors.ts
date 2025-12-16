/**
 * Custom Error Classes
 * Provides structured error handling with specific error types
 */

/**
 * Base API Error class
 */
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

/**
 * Network/Connection Error
 */
export class NetworkError extends Error {
    constructor(message: string = 'Network connection failed') {
        super(message);
        this.name = 'NetworkError';
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends ApiError {
    constructor(message: string = 'Authentication required') {
        super(401, message);
        this.name = 'AuthenticationError';
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

/**
 * Authorization Error (Forbidden)
 */
export class AuthorizationError extends ApiError {
    constructor(message: string = 'Access denied') {
        super(403, message);
        this.name = 'AuthorizationError';
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}

/**
 * Not Found Error
 */
export class NotFoundError extends ApiError {
    constructor(resource: string = 'Resource') {
        super(404, `${resource} not found`);
        this.name = 'NotFoundError';
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * Validation Error
 */
export class ValidationError extends ApiError {
    constructor(
        message: string = 'Validation failed',
        public fields?: Record<string, string>
    ) {
        super(400, message, fields);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * Server Error
 */
export class ServerError extends ApiError {
    constructor(message: string = 'Server error occurred') {
        super(500, message);
        this.name = 'ServerError';
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}
