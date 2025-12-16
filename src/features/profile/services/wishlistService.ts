import { ProductDto } from "@/types/dto";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_TIMES } from "@/lib/constants";
import { apiClient } from "@/lib/apiClient";

interface WishlistToggleResponse {
    added: boolean;
    message: string;
}

export const getWishlist = async (email: string | undefined): Promise<ProductDto[]> => {
    if (!email) return [];
    try {
        return await apiClient.get<ProductDto[]>(`/wishlist?email=${email}`);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
};

export const toggleWishlist = async (email: string, productId: number): Promise<WishlistToggleResponse> => {
    return apiClient.post<WishlistToggleResponse>(
        `/wishlist/toggle?email=${email}&productId=${productId}`
    );
};

export const useWishlistQuery = (email: string | undefined) => {
    return useQuery({
        queryKey: ['wishlist', email],
        queryFn: () => getWishlist(email),
        enabled: !!email,
        staleTime: CACHE_TIMES.SHORT, // 5 minutes
    });
};

export const useWishlistToggleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ email, productId }: { email: string; productId: number }) =>
            toggleWishlist(email, productId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', variables.email] });
        },
    });
};
