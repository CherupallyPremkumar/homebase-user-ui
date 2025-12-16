import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/features/products/services/productService";
import { useUserLocation } from "@/hooks/useUserLocation";
import { CACHE_TIMES, PAGINATION } from "@/lib/constants";

/**
 * Simple products hook - loads all products (for backward compatibility)
 * Use useInfiniteProducts for better scalability
 */
export const useProducts = () => {
    const { city } = useUserLocation();

    return useQuery({
        queryKey: ["products", city],
        queryFn: async () => {
            // Load first page only
            const response = await productService.getAllProducts(city, 1, PAGINATION.PRODUCTS_PER_PAGE);
            return response.data; // Return just the products array
        },
        staleTime: CACHE_TIMES.SHORT,
    });
};

/**
 * Infinite scroll hook for products
 * Automatically loads more products as user scrolls
 */
export const useInfiniteProducts = () => {
    const { city } = useUserLocation();

    return useInfiniteQuery({
        queryKey: ["products", "infinite", city],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await productService.getAllProducts(
                city,
                pageParam,
                PAGINATION.PRODUCTS_PER_PAGE
            );
            return response;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage
                ? lastPage.pagination.page + 1
                : undefined;
        },
        staleTime: CACHE_TIMES.SHORT,
        initialPageParam: 1,
    });
};

/**
 * Single product hook
 */
export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => productService.getProductById(id),
        enabled: !!id,
        staleTime: CACHE_TIMES.SHORT,
    });
};
