/**
 * Optimized Image Component
 * Provides lazy loading, responsive images, and performance optimizations
 */

import { ImgHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean; // For above-the-fold images
    className?: string;
}

export const OptimizedImage = ({
    src,
    alt,
    width,
    height,
    priority = false,
    className,
    ...props
}: OptimizedImageProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setError(true);
        setIsLoading(false);
    };

    // Placeholder for failed images
    if (error) {
        return (
            <div
                className={cn(
                    'bg-muted flex items-center justify-center text-muted-foreground',
                    className
                )}
                style={{ width, height }}
            >
                <span className="text-sm">Image unavailable</span>
            </div>
        );
    }

    return (
        <div className={cn('relative overflow-hidden', className)}>
            {/* Loading placeholder */}
            {isLoading && (
                <div
                    className="absolute inset-0 bg-muted animate-pulse"
                    style={{ width, height }}
                />
            )}

            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'} // Lazy load by default
                decoding="async" // Async decoding for better performance
                onLoad={handleLoad}
                onError={handleError}
                className={cn(
                    'transition-opacity duration-300',
                    isLoading ? 'opacity-0' : 'opacity-100',
                    className
                )}
                {...props}
            />
        </div>
    );
};

/**
 * Product Image Component
 * Specialized for product images with aspect ratio
 */
interface ProductImageProps {
    src: string;
    alt: string;
    priority?: boolean;
    className?: string;
}

export const ProductImage = ({
    src,
    alt,
    priority = false,
    className,
}: ProductImageProps) => {
    return (
        <div className={cn('relative aspect-square overflow-hidden', className)}>
            <OptimizedImage
                src={src}
                alt={alt}
                priority={priority}
                className="w-full h-full object-cover"
            />
        </div>
    );
};
