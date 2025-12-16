/**
 * Keyboard Navigation Utilities
 * Helpers for managing focus and keyboard interactions
 */

/**
 * Focus trap for modals and dialogs
 * Keeps focus within a container when Tab is pressed
 */
export const useFocusTrap = (containerRef: React.RefObject<HTMLElement>) => {
    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        container.addEventListener('keydown', handleKeyDown);

        // Focus first element when trap is activated
        firstElement?.focus();

        return () => {
            container.removeEventListener('keydown', handleKeyDown);
        };
    }, [containerRef]);
};

/**
 * Restore focus to previous element when modal closes
 */
export const useFocusReturn = () => {
    const previousFocusRef = React.useRef<HTMLElement | null>(null);

    const saveFocus = () => {
        previousFocusRef.current = document.activeElement as HTMLElement;
    };

    const restoreFocus = () => {
        previousFocusRef.current?.focus();
    };

    return { saveFocus, restoreFocus };
};

/**
 * Handle Escape key to close modals
 */
export const useEscapeKey = (callback: () => void) => {
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                callback();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [callback]);
};

/**
 * Arrow key navigation for lists
 */
export const useArrowNavigation = (
    containerRef: React.RefObject<HTMLElement>,
    options: {
        orientation?: 'vertical' | 'horizontal';
        loop?: boolean;
    } = {}
) => {
    const { orientation = 'vertical', loop = true } = options;

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const items = Array.from(
                container.querySelectorAll<HTMLElement>('[role="option"], [role="menuitem"]')
            );

            const currentIndex = items.findIndex((item) => item === document.activeElement);
            if (currentIndex === -1) return;

            let nextIndex = currentIndex;

            const isVertical = orientation === 'vertical';
            const upKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
            const downKey = isVertical ? 'ArrowDown' : 'ArrowRight';

            if (e.key === upKey) {
                e.preventDefault();
                nextIndex = currentIndex - 1;
                if (nextIndex < 0) {
                    nextIndex = loop ? items.length - 1 : 0;
                }
            } else if (e.key === downKey) {
                e.preventDefault();
                nextIndex = currentIndex + 1;
                if (nextIndex >= items.length) {
                    nextIndex = loop ? 0 : items.length - 1;
                }
            }

            items[nextIndex]?.focus();
        };

        container.addEventListener('keydown', handleKeyDown);
        return () => container.removeEventListener('keydown', handleKeyDown);
    }, [containerRef, orientation, loop]);
};

/**
 * Skip to main content link
 */
export const SkipToContent: React.FC = () => {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
        >
            Skip to main content
        </a>
    );
};

/**
 * Announce to screen readers
 */
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
};

import React from 'react';
