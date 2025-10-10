import { CartItemDto } from "@/types/dto";
import { API_ENDPOINTS, DEFAULT_TENANT_ID, buildUrl, getFetchOptions, handleApiError } from "@/config/api";
import { productService } from "./productService";

// Mock cart storage for development fallback
let mockCart: CartItemDto[] = [];

export const cartService = {
  /**
   * GET /api/user/cart?customerId={customerId}&tenantId={tenantId}
   * Get cart items for a customer
   */
  getCart: async (customerId: number, tenantId: string = DEFAULT_TENANT_ID): Promise<CartItemDto[]> => {
    try {
      const url = buildUrl(API_ENDPOINTS.user.cart, { customerId, tenantId });
      const response = await fetch(url, getFetchOptions('GET'));
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Fallback to mock data in development
      if (import.meta.env.DEV) {
        return [...mockCart];
      }
      throw error;
    }
  },

  /**
   * POST /api/user/cart?customerId={customerId}&tenantId={tenantId}
   * Add item to cart
   */
  addToCart: async (customerId: number, productId: number, quantity: number = 1, tenantId: string = DEFAULT_TENANT_ID): Promise<CartItemDto> => {
    try {
      const url = buildUrl(API_ENDPOINTS.user.cart, { customerId, tenantId });
      const response = await fetch(url, getFetchOptions('POST', { productId, quantity }));
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Fallback to mock data in development
      if (import.meta.env.DEV) {
        const existingItem = mockCart.find(item => item.productId === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.subtotal = existingItem.price * existingItem.quantity;
          return existingItem;
        } else {
          const product = await productService.getProductById(productId, tenantId);
          if (!product) throw new Error('Product not found');
          
          const newItem: CartItemDto = {
            id: Date.now(),
            productId,
            productName: product.name,
            productImage: product.imageUrl,
            price: product.price,
            quantity,
            subtotal: product.price * quantity,
          };
          mockCart.push(newItem);
          return newItem;
        }
      }
      throw error;
    }
  },

  /**
   * PUT /api/user/cart/{itemId}?tenantId={tenantId}
   * Update cart item quantity
   */
  updateCartItem: async (itemId: number, quantity: number, tenantId: string = DEFAULT_TENANT_ID): Promise<CartItemDto> => {
    try {
      const url = buildUrl(`${API_ENDPOINTS.user.cart}/${itemId}`, { tenantId });
      const response = await fetch(url, getFetchOptions('PUT', { quantity }));
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to update cart item:', error);
      // Fallback to mock data in development
      if (import.meta.env.DEV) {
        const item = mockCart.find(i => i.id === itemId);
        if (item) {
          item.quantity = quantity;
          item.subtotal = item.price * quantity;
          return item;
        }
        throw new Error('Cart item not found');
      }
      throw error;
    }
  },

  /**
   * DELETE /api/user/cart/{itemId}?tenantId={tenantId}
   * Remove item from cart
   */
  removeFromCart: async (itemId: number, tenantId: string = DEFAULT_TENANT_ID): Promise<void> => {
    try {
      const url = buildUrl(`${API_ENDPOINTS.user.cart}/${itemId}`, { tenantId });
      const response = await fetch(url, getFetchOptions('DELETE'));
      
      if (!response.ok) {
        await handleApiError(response);
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      // Fallback to mock data in development
      if (import.meta.env.DEV) {
        mockCart = mockCart.filter(item => item.id !== itemId);
        return;
      }
      throw error;
    }
  },

  /**
   * DELETE /api/user/cart?customerId={customerId}&tenantId={tenantId}
   * Clear all items from cart
   */
  clearCart: async (customerId: number, tenantId: string = DEFAULT_TENANT_ID): Promise<void> => {
    try {
      const url = buildUrl(API_ENDPOINTS.user.cart, { customerId, tenantId });
      const response = await fetch(url, getFetchOptions('DELETE'));
      
      if (!response.ok) {
        await handleApiError(response);
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Fallback to mock data in development
      if (import.meta.env.DEV) {
        mockCart = [];
        return;
      }
      throw error;
    }
  },
};
