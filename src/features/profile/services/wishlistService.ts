/**
 * Wishlist Service
 * Uses shared service from @homebase/shared
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createWishlistService } from '@homebase/shared';
import { apiClient } from '@/lib/apiClient';
import { CACHE_TIMES } from '@/lib/constants';

export const wishlistService = createWishlistService(apiClient);

/**
 * React Query hook for wishlist
 */
export const useWishlistQuery = (email?: string) => {
    return useQuery({
        queryKey: ['wishlist', email],
        queryFn: () => wishlistService.getWishlist(email),
        enabled: !!email,
        staleTime: CACHE_TIMES.MEDIUM,
        gcTime: CACHE_TIMES.MEDIUM,
    });
};

/**
 * React Query mutation for toggling wishlist
 */
export const useWishlistToggleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ email, productId }: { email: string; productId: number }) =>
            wishlistService.toggleWishlist(email, productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });
};
