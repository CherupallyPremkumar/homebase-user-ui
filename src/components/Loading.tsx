/**
 * Global Loading Component
 * Reusable loading state for the entire application
 */

import { Loader2 } from 'lucide-react';

interface LoadingProps {
    message?: string;
    fullScreen?: boolean;
}

export const Loading = ({ message = 'Loading...', fullScreen = false }: LoadingProps) => {
    const containerClass = fullScreen
        ? 'min-h-screen bg-background flex items-center justify-center'
        : 'flex items-center justify-center py-20';

    return (
        <div className={containerClass}>
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">{message}</p>
            </div>
        </div>
    );
};

/**
 * Inline Loading Spinner
 * For smaller loading states within components
 */
export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    return <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />;
};
