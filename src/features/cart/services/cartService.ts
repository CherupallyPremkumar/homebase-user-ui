/**
 * Cart Service
 * Uses shared service from @homebase/shared
 */

import { createCartService } from '@homebase/shared';
import { apiClient } from '@/lib/apiClient';

export const cartService = createCartService(apiClient);

// Re-export individual methods for backward compatibility
export const getCart = cartService.getCart;
export const addToCart = cartService.addToCart;
export const updateCartItem = cartService.updateCartItem;
export const removeFromCart = cartService.removeFromCart;
export const clearCart = cartService.clearCart;
