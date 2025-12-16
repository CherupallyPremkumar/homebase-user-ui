/**
 * Application Constants
 * Centralized location for all magic numbers and configuration values
 */

/**
 * Cache Times for React Query
 * Controls how long data is considered "fresh" before refetching
 */
export const CACHE_TIMES = {
    ALWAYS_FRESH: 0,                    // Always refetch (e.g., cart, real-time data)
    SHORT: 5 * 60 * 1000,               // 5 minutes (e.g., products, search results)
    MEDIUM: 15 * 60 * 1000,             // 15 minutes (e.g., user profile)
    LONG: 60 * 60 * 1000,               // 1 hour (e.g., static content)
    VERY_LONG: 24 * 60 * 60 * 1000,     // 24 hours (e.g., categories, rarely changing data)
} as const;

/**
 * Pagination Configuration
 */
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,              // Default items per page
    PRODUCTS_PER_PAGE: 24,              // Products grid (divisible by 2, 3, 4, 6)
    ORDERS_PER_PAGE: 10,                // Order history
    REVIEWS_PER_PAGE: 10,               // Product reviews
    MAX_PAGE_SIZE: 100,                 // Maximum allowed page size
    INFINITE_SCROLL_THRESHOLD: 0.8,     // Load more when 80% scrolled
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
    /** Request timeout in milliseconds */
    TIMEOUT: 30000, // 30 seconds

    /** Maximum retry attempts for failed requests */
    MAX_RETRIES: 3,

    /** Delay between retries (exponential backoff) */
    RETRY_DELAY: 1000, // 1 second base
} as const;


/**
 * Validation Rules
 */
export const VALIDATION = {
    /** Minimum password length */
    MIN_PASSWORD_LENGTH: 8,

    /** Maximum product name length */
    MAX_PRODUCT_NAME_LENGTH: 100,

    /** Maximum review comment length */
    MAX_REVIEW_LENGTH: 500,

    /** Phone number regex (Indian format) */
    PHONE_REGEX: /^[6-9]\d{9}$/,
} as const;

/**
 * UI Constants
 */
export const UI = {
    /** Debounce delay for search input (ms) */
    SEARCH_DEBOUNCE: 300,

    /** Toast notification duration (ms) */
    TOAST_DURATION: 3000,

    /** Animation duration (ms) */
    ANIMATION_DURATION: 200,
} as const;

/**
 * Business Rules
 */
export const BUSINESS = {
    /** Minimum order amount for free shipping */
    FREE_SHIPPING_THRESHOLD: 50000, // ₹500 in paise

    /** Maximum items in cart */
    MAX_CART_ITEMS: 50,

    /** Maximum quantity per product */
    MAX_QUANTITY_PER_PRODUCT: 10,
} as const;

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    GUEST_ID: 'guest_id',
    USER_LOCATION: 'user_location',
    WISHLIST: 'wishlist',
    RECENT_SEARCHES: 'recent_searches',
} as const;
