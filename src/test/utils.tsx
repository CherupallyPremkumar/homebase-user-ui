import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

/**
 * Create a new QueryClient for each test to avoid state leakage
 */
export const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0, // Updated from cacheTime for React Query v5
            },
            mutations: {
                retry: false,
            },
        },
    });

/**
 * Custom render function that includes common providers
 */
export function renderWithProviders(
    ui: ReactElement,
    {
        queryClient = createTestQueryClient(),
        ...renderOptions
    }: RenderOptions & { queryClient?: QueryClient } = {}
) {
    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>{children}</BrowserRouter>
            </QueryClientProvider>
        );
    }

    return {
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
        queryClient,
    };
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { renderWithProviders as render };
