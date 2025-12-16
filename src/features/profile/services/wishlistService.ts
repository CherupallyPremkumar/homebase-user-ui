import { API_BASE_URL } from "@/lib/config";
import { ProductDto } from "@/types/dto";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface WishlistToggleResponse {
    added: boolean;
    message: string;
}

export const getWishlist = async (email: string | undefined): Promise<ProductDto[]> => {
    if (!email) return [];
    try {
        const response = await fetch(`${API_BASE_URL}/wishlist?email=${email}`);
        if (!response.ok) throw new Error("Failed to fetch wishlist");
        return await response.json();
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
};

export const toggleWishlist = async (email: string, productId: number): Promise<WishlistToggleResponse> => {
    const response = await fetch(`${API_BASE_URL}/wishlist/toggle?email=${email}&productId=${productId}`, {
        method: "POST",
    });
    if (!response.ok) throw new Error("Failed to toggle wishlist item");
    return await response.json();
};

export const useWishlistQuery = (email: string | undefined) => {
    return useQuery({
        queryKey: ['wishlist', email],
        queryFn: () => getWishlist(email),
        enabled: !!email,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
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
