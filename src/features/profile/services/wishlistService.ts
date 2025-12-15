import { API_BASE_URL } from "@/lib/config";
import { ProductDto } from "@/types/dto";

/**
 * Get users wishlist
 */
export const getWishlist = async (email: string): Promise<ProductDto[]> => {
    const response = await fetch(`${API_BASE_URL}/wishlist?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
    }
    return response.json();
};

/**
 * Toggle item in wishlist
 * Returns { added: boolean, message: string }
 */
export const toggleWishlist = async (email: string, productId: number): Promise<{ added: boolean, message: string }> => {
    const response = await fetch(`${API_BASE_URL}/wishlist/toggle?email=${encodeURIComponent(email)}&productId=${productId}`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Failed to toggle wishlist item");
    }
    return response.json();
};
