/**
 * Analytics & Monitoring Configuration
 * Centralized setup for error tracking, performance monitoring, and user analytics
 */

import { config } from './config';

/**
 * Initialize Web Vitals (Core Web Vitals monitoring)
 * Tracks: LCP, FID, CLS, FCP, TTFB
 */
export const initWebVitals = async () => {
    if (!config.IS_PRODUCTION) {
        console.log('Web Vitals: Development mode - metrics logged to console');
    }

    try {
        const { onCLS, onFID, onFCP, onLCP, onTTFB } = await import('web-vitals');

        const sendToAnalytics = (metric: any) => {
            // Log in development
            if (!config.IS_PRODUCTION) {
                console.log(`[Web Vitals] ${metric.name}:`, metric.value);
            }

            // Send to Google Analytics in production
            if (config.IS_PRODUCTION && window.gtag) {
                window.gtag('event', metric.name, {
                    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                    event_category: 'Web Vitals',
                    event_label: metric.id,
                    non_interaction: true,
                });
            }

            // Send to custom analytics endpoint (optional)
            if (config.IS_PRODUCTION) {
                fetch('/api/analytics/vitals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(metric),
                    keepalive: true,
                }).catch(() => {
                    // Silently fail - don't block user experience
                });
            }
        };

        // Register all Core Web Vitals
        onCLS(sendToAnalytics);
        onFID(sendToAnalytics);
        onFCP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
    } catch (error) {
        console.error('Failed to initialize Web Vitals:', error);
    }
};

/**
 * Initialize Error Tracking (Sentry-ready)
 * Configure with your Sentry DSN in production
 */
export const initErrorTracking = async () => {
    if (!config.IS_PRODUCTION) {
        console.log('Error Tracking: Development mode - errors logged to console');
        return;
    }

    // Sentry configuration (install: npm install @sentry/react)
    // Uncomment when ready to use Sentry
    /*
    try {
      const Sentry = await import('@sentry/react');
      
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: config.IS_PRODUCTION ? 'production' : 'development',
        integrations: [
          new Sentry.BrowserTracing(),
          new Sentry.Replay({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        tracesSampleRate: 1.0, // Adjust in production (0.1 = 10%)
        replaysSessionSampleRate: 0.1, // 10% of sessions
        replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
        beforeSend(event, hint) {
          // Filter out sensitive data
          if (event.request?.headers) {
            delete event.request.headers['Authorization'];
          }
          return event;
        },
      });
  
      console.log('Sentry initialized');
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
    */
};

/**
 * Initialize Google Analytics
 */
export const initGoogleAnalytics = () => {
    const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

    if (!GA_MEASUREMENT_ID) {
        console.log('Google Analytics: No measurement ID provided');
        return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false, // We'll send manually for SPA
    });

    console.log('Google Analytics initialized:', GA_MEASUREMENT_ID);
};

/**
 * Track page view (for SPA navigation)
 */
export const trackPageView = (path: string, title?: string) => {
    if (window.gtag) {
        window.gtag('event', 'page_view', {
            page_path: path,
            page_title: title || document.title,
        });
    }

    // Also track in custom analytics
    if (config.IS_PRODUCTION) {
        fetch('/api/analytics/pageview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path, title, timestamp: Date.now() }),
            keepalive: true,
        }).catch(() => { });
    }
};

/**
 * Track custom events
 */
export const trackEvent = (
    eventName: string,
    eventParams?: Record<string, any>
) => {
    // Google Analytics
    if (window.gtag) {
        window.gtag('event', eventName, eventParams);
    }

    // Custom analytics
    if (config.IS_PRODUCTION) {
        fetch('/api/analytics/event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: eventName,
                params: eventParams,
                timestamp: Date.now(),
            }),
            keepalive: true,
        }).catch(() => { });
    }

    // Development logging
    if (!config.IS_PRODUCTION) {
        console.log(`[Analytics] Event: ${eventName}`, eventParams);
    }
};

/**
 * Track errors manually
 */
export const trackError = (error: Error, context?: Record<string, any>) => {
    // Log to console in development
    console.error('Tracked Error:', error, context);

    // Send to Sentry (if initialized)
    if (window.Sentry) {
        window.Sentry.captureException(error, {
            contexts: { custom: context },
        });
    }

    // Send to Google Analytics
    if (window.gtag) {
        window.gtag('event', 'exception', {
            description: error.message,
            fatal: false,
        });
    }

    // Custom error tracking
    if (config.IS_PRODUCTION) {
        fetch('/api/analytics/error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: error.message,
                stack: error.stack,
                context,
                timestamp: Date.now(),
            }),
            keepalive: true,
        }).catch(() => { });
    }
};

/**
 * Initialize all monitoring services
 */
export const initMonitoring = async () => {
    console.log('Initializing monitoring services...');

    // Initialize in parallel
    await Promise.allSettled([
        initErrorTracking(),
        initWebVitals(),
    ]);

    // Initialize Google Analytics (synchronous)
    initGoogleAnalytics();

    console.log('Monitoring services initialized');
};

/**
 * TypeScript declarations for global objects
 */
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
        Sentry?: any;
    }
}

/**
 * Common analytics events (for consistency)
 */
export const AnalyticsEvents = {
    // E-commerce
    PRODUCT_VIEW: 'view_item',
    PRODUCT_ADD_TO_CART: 'add_to_cart',
    PRODUCT_REMOVE_FROM_CART: 'remove_from_cart',
    CHECKOUT_BEGIN: 'begin_checkout',
    PURCHASE: 'purchase',

    // User actions
    SEARCH: 'search',
    LOGIN: 'login',
    SIGNUP: 'sign_up',
    SHARE: 'share',

    // Engagement
    FILTER_APPLIED: 'filter_applied',
    SORT_CHANGED: 'sort_changed',
    WISHLIST_ADD: 'add_to_wishlist',
    REVIEW_SUBMITTED: 'review_submitted',
} as const;
