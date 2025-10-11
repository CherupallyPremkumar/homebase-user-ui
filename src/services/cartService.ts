// src/services/cartService.ts
import { CartItemDto } from "@/types/dto";
import { API_ENDPOINTS, buildUrl, getFetchOptions, getTenantId, handleApiError } from "@/config/api";

export const cartService = {
  /**
   * Get cart items for a customer
   */
  getCart: async (customerId: string): Promise<CartItemDto[]> => {
    const tenantId = getTenantId();
    const url = buildUrl(API_ENDPOINTS.user.cart, { customerId, tenantId });
    const response = await fetch(url, getFetchOptions('GET'));

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  /**
   * Add item to cart
   */
  addToCart: async (productId: number, quantity: number = 1): Promise<CartItemDto> => {
    const tenantId = getTenantId();
    const url = buildUrl(API_ENDPOINTS.user.cart, {tenantId });
    const response = await fetch(url, getFetchOptions('POST', { productId, quantity }));

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (itemId: number, quantity: number): Promise<CartItemDto> => {
    const tenantId = getTenantId();
    const url = buildUrl(`${API_ENDPOINTS.user.cart}/${itemId}`, { tenantId });
    const response = await fetch(url, getFetchOptions('PUT', { quantity }));

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (itemId: number): Promise<void> => {
    const tenantId = getTenantId();
    const url = buildUrl(`${API_ENDPOINTS.user.cart}/${itemId}`, { tenantId });
    const response = await fetch(url, getFetchOptions('DELETE'));

    if (!response.ok) {
      await handleApiError(response);
    }
  },

  /**
   * Clear all items from cart for a customer
   */
  clearCart: async (customerId: number): Promise<void> => {
    const tenantId = getTenantId();
    const url = buildUrl(API_ENDPOINTS.user.cart, { customerId, tenantId });
    const response = await fetch(url, getFetchOptions('DELETE'));

    if (!response.ok) {
      await handleApiError(response);
    }
  },
};