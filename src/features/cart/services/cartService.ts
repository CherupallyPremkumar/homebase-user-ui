import { CartItemDto } from "@/types/dto";
import { productService } from "@/features/products/services/productService";

// TODO: Replace with actual backend API endpoint
const API_BASE_URL = "/api";

// Mock cart storage (in real app, this would be backend state)
let mockCart: CartItemDto[] = [];

export const cartService = {
  // GET /api/cart?tenantId={tenantId}
  getCart: async (tenantId?: string): Promise<CartItemDto[]> => {
    // TODO: Implement actual API call to Spring Boot backend
    // Include tenant ID to get tenant-specific cart
    // const response = await fetch(`${API_BASE_URL}/cart?tenantId=${tenantId}`, {
    //   credentials: 'include',
    // });
    // if (!response.ok) throw new Error('Failed to fetch cart');
    // return response.json();

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockCart]), 300);
    });
  },

  // POST /api/cart?tenantId={tenantId}
  addToCart: async (productId: number, quantity: number = 1, tenantId?: string): Promise<CartItemDto> => {
    // TODO: Implement actual API call to Spring Boot backend
    // const response = await fetch(`${API_BASE_URL}/cart?tenantId=${tenantId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   credentials: 'include',
    //   body: JSON.stringify({ productId, quantity }),
    // });
    // if (!response.ok) throw new Error('Failed to add to cart');
    // return response.json();

    // Mock implementation
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const existingItem = mockCart.find(item => item.productId === productId);

        if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.subtotal = existingItem.price * existingItem.quantity;
          resolve(existingItem);
        } else {
          // Get product details for cart item
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
          resolve(newItem);
        }
      }, 300);
    });
  },

  // PUT /api/cart/{itemId}?tenantId={tenantId}
  updateCartItem: async (itemId: number, quantity: number, tenantId?: string): Promise<CartItemDto> => {
    // TODO: Implement actual API call to Spring Boot backend
    // const response = await fetch(`${API_BASE_URL}/cart/${itemId}?tenantId=${tenantId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   credentials: 'include',
    //   body: JSON.stringify({ quantity }),
    // });
    // if (!response.ok) throw new Error('Failed to update cart item');
    // return response.json();

    // Mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const item = mockCart.find(i => i.id === itemId);
        if (item) {
          item.quantity = quantity;
          item.subtotal = item.price * quantity;
          resolve(item);
        } else {
          reject(new Error('Cart item not found'));
        }
      }, 300);
    });
  },

  // DELETE /api/cart/{itemId}?tenantId={tenantId}
  removeFromCart: async (itemId: number, tenantId?: string): Promise<void> => {
    // TODO: Implement actual API call to Spring Boot backend
    // const response = await fetch(`${API_BASE_URL}/cart/${itemId}?tenantId=${tenantId}`, {
    //   method: 'DELETE',
    //   credentials: 'include',
    // });
    // if (!response.ok) throw new Error('Failed to remove from cart');

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        mockCart = mockCart.filter(item => item.id !== itemId);
        resolve();
      }, 300);
    });
  },

  // DELETE /api/cart?tenantId={tenantId}
  clearCart: async (tenantId?: string): Promise<void> => {
    // TODO: Implement actual API call to Spring Boot backend
    // const response = await fetch(`${API_BASE_URL}/cart?tenantId=${tenantId}`, {
    //   method: 'DELETE',
    //   credentials: 'include',
    // });
    // if (!response.ok) throw new Error('Failed to clear cart');

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        mockCart = [];
        resolve();
      }, 300);
    });
  },
};
