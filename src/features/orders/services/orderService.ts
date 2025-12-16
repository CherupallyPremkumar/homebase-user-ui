/**
 * Order Service
 * Uses shared service from @homebase/shared
 */

import { createOrderService } from '@homebase/shared';
import { apiClient } from '@/lib/apiClient';

const baseOrderService = createOrderService(apiClient);

// Export service with additional methods
export const orderService = {
  ...baseOrderService,
  previewOrder: baseOrderService.getOrderPreview, // Alias for backward compatibility
};

// Re-export individual methods for backward compatibility
export const getAllOrders = orderService.getAllOrders;
export const getOrderById = orderService.getOrderById;
export const createOrder = orderService.createOrder;
export const getOrderPreview = orderService.getOrderPreview;

// Aliases for backward compatibility
export const getOrders = getAllOrders;
export const previewOrder = getOrderPreview;
