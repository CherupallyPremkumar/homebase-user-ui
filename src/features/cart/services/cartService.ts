import { CartItemDto } from "@/types/dto";
import { API_BASE_URL } from "@/lib/config";

export const cartService = {
  // GET /api/cart
  getCart: async (): Promise<CartItemDto[]> => {
    const response = await fetch(`${API_BASE_URL}/cart`);
    if (!response.ok) throw new Error("Failed to fetch cart");
    return response.json();
  },

  // POST /api/cart
  addToCart: async (productId: number, quantity: number = 1): Promise<CartItemDto> => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) throw new Error("Failed to add to cart");
    return response.json();
  },

  // PUT /api/cart/{itemId}
  updateCartItem: async (itemId: number, quantity: number): Promise<CartItemDto> => {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error("Failed to update cart item");
    return response.json();
  },

  // DELETE /api/cart/{itemId}
  removeFromCart: async (itemId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to remove from cart");
  },

  // DELETE /api/cart
  clearCart: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to clear cart");
  },
};
