import { CartItemDto } from "@/types/dto";
import { apiClient } from "@/lib/apiClient";

export const cartService = {
  // GET /api/cart
  getCart: async (userId: string): Promise<CartItemDto[]> => {
    return apiClient.get<CartItemDto[]>(`/cart?userId=${encodeURIComponent(userId)}`);
  },

  // POST /api/cart
  addToCart: async (productId: number, quantity: number = 1, userId: string): Promise<CartItemDto> => {
    return apiClient.post<CartItemDto>(
      `/cart?userId=${encodeURIComponent(userId)}`,
      { productId, quantity }
    );
  },

  // PUT /api/cart/{itemId}
  updateCartItem: async (itemId: number, quantity: number): Promise<CartItemDto> => {
    return apiClient.put<CartItemDto>(`/cart/${itemId}`, { quantity });
  },

  // DELETE /api/cart/{itemId}
  removeFromCart: async (itemId: number): Promise<void> => {
    return apiClient.delete<void>(`/cart/${itemId}`);
  },

  // DELETE /api/cart
  clearCart: async (userId: string): Promise<void> => {
    return apiClient.delete<void>(`/cart?userId=${encodeURIComponent(userId)}`);
  },
};
