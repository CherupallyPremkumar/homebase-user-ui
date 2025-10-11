import { OrderDto, OrderStatus } from "@/types/dto";
import {
  API_ENDPOINTS,
  buildUrl,
  getFetchOptions,
  getTenantId,
  handleApiError,
} from "@/config/api";

/**
 * Service to handle all order-related API calls
 */
export const orderService = {
  /**
   * GET /api/user/order?customerId={customerId}&tenantId={tenantId}
   * Get all orders for the current customer
   */
  getAllOrders: async (
    customerId: string
  ): Promise<OrderDto[]> => {
    try {
      const tenantId = getTenantId();
      const url = buildUrl(API_ENDPOINTS.user.order, { customerId, tenantId });
      const response = await fetch(url, getFetchOptions("GET"));

      if (!response.ok) await handleApiError(response);

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      if (import.meta.env.DEV) {
        // optional: return empty array in dev
        return [];
      }
      throw error;
    }
  },

  /**
   * GET /api/user/order/{orderNumber}?tenantId={tenantId}
   * Get order details by order number
   */
  getOrderById: async (
    orderNumber: string
  ): Promise<OrderDto | null> => {
    try {
      const tenantId = getTenantId();
      const url = buildUrl(`${API_ENDPOINTS.user.order}/${orderNumber}`, { tenantId });
      const response = await fetch(url, getFetchOptions("GET"));

      if (!response.ok) {
        if (response.status === 404) return null;
        await handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch order:", error);
      if (import.meta.env.DEV) return null;
      throw error;
    }
  },

  /**
   * POST /api/user/order?tenantId={tenantId}
   * Create a new order (checkout)
   * 
   * orderData must include:
   * - customerId
   * - customerName, customerEmail, customerPhone
   * - shippingAddress, city, state, pincode
   * - paymentMethod
   */
  createOrder: async (orderData: any): Promise<OrderDto> => {
    try {
      const tenantId = getTenantId();
      const url = buildUrl(API_ENDPOINTS.user.order, { tenantId });
      const response = await fetch(url, getFetchOptions("POST", orderData));

      if (!response.ok) await handleApiError(response);

      return await response.json();
    } catch (error) {
      console.error("Failed to create order:", error);
      if (import.meta.env.DEV) {
        // Optional fallback: return dummy order for dev
        return {
          id: `ORD${Date.now()}`,
          orderNumber: `ORD${Date.now()}`,
          customerName: orderData.customerName || "",
          customerEmail: orderData.customerEmail || "",
          customerPhone: orderData.customerPhone || "",
          shippingAddress: `${orderData.shippingAddress}, ${orderData.city}, ${orderData.state}, ${orderData.pincode}`,
          items: orderData.items || [],
          subtotal: orderData.items?.reduce((sum: number, item: any) => sum + item.subtotal, 0) || 0,
          tax: orderData.tax || 0,
          shippingCost: orderData.shippingCost || 0,
          total: orderData.total || 0,
          status: OrderStatus.PENDING,
          paymentStatus: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      throw error;
    }
  },

  /**
   * POST /api/user/order/{orderNumber}/cancel?tenantId={tenantId}
   * Cancel an order (if allowed by backend)
   */
  cancelOrder: async (orderNumber: string): Promise<void> => {
    try {
      const tenantId = getTenantId();
      const url = buildUrl(`${API_ENDPOINTS.user.order}/${orderNumber}/cancel`, { tenantId });
      const response = await fetch(url, getFetchOptions("POST"));

      if (!response.ok) await handleApiError(response);
    } catch (error) {
      console.error("Failed to cancel order:", error);
      throw error;
    }
  },
};