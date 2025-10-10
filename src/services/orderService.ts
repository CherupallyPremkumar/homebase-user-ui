import { OrderDto, OrderStatus } from "@/types/dto";
import { API_ENDPOINTS, DEFAULT_TENANT_ID, buildUrl, getFetchOptions, handleApiError } from "@/config/api";
import productVase from "@/assets/product-vase.jpg";
import productWallHanging from "@/assets/product-wall-hanging.jpg";
import productCushion from "@/assets/product-cushion.jpg";

// Mock orders for development
const mockOrders: OrderDto[] = [
  {
    id: "ORD1234567890",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+919876543210",
    shippingAddress: "123 Green Street, Meadow Lane, Mumbai, Maharashtra, 400001",
    items: [
      {
        productId: 1,
        productName: "Ceramic Vase Collection",
        productImage: productVase,
        price: 3499,
        quantity: 1,
        subtotal: 3499,
      },
      {
        productId: 4,
        productName: "Velvet Cushion Cover",
        productImage: productCushion,
        price: 1299,
        quantity: 2,
        subtotal: 2598,
      },
    ],
    subtotal: 6097,
    tax: 1097,
    shippingCost: 150,
    total: 7344,
    status: OrderStatus.DELIVERED,
    paymentStatus: "PAID",
    transactionId: "TXN1234567890",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:20:00Z",
  },
  {
    id: "ORD0987654321",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "+919876543211",
    shippingAddress: "456 Oak Avenue, Garden City, Delhi, 110001",
    items: [
      {
        productId: 2,
        productName: "Woven Wall Hanging",
        productImage: productWallHanging,
        price: 2799,
        quantity: 1,
        subtotal: 2799,
      },
    ],
    subtotal: 2799,
    tax: 504,
    shippingCost: 100,
    total: 3403,
    status: OrderStatus.SHIPPED,
    paymentStatus: "PAID",
    transactionId: "TXN0987654321",
    createdAt: "2024-02-01T15:45:00Z",
    updatedAt: "2024-02-05T09:10:00Z",
  },
];

/**
 * Get all orders for the current user
 */
export const getOrders = async (tenantId: string): Promise<OrderDto[]> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/orders?tenantId=${tenantId}`);
  // return await response.json();

  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockOrders;
};

export const orderService = {
  /**
   * GET /api/user/order?customerId={customerId}&tenantId={tenantId}
   * Get all orders for the current customer
   */
  getAllOrders: async (customerId: number, tenantId: string = DEFAULT_TENANT_ID): Promise<OrderDto[]> => {
    try {
      const url = buildUrl(API_ENDPOINTS.user.order, { customerId, tenantId });
      const response = await fetch(url, getFetchOptions('GET'));
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Fallback to mock data in development
      if (import.meta.env.DEV) {
        return mockOrders;
      }
      throw error;
    }
  },

  /**
   * GET /api/user/order/{orderNumber}?tenantId={tenantId}
   * Get order details by order number
   */
  getOrderById: async (orderNumber: string, tenantId: string = DEFAULT_TENANT_ID): Promise<OrderDto | null> => {
    try {
      const url = buildUrl(`${API_ENDPOINTS.user.order}/${orderNumber}`, { tenantId });
      const response = await fetch(url, getFetchOptions('GET'));
      
      if (!response.ok) {
        if (response.status === 404) return null;
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch order:', error);
      // Fallback to mock data in development
      if (import.meta.env.DEV) {
        return mockOrders.find(o => o.id === orderNumber) || null;
      }
      throw error;
    }
  },

  /**
   * POST /api/user/order?tenantId={tenantId}
   * Create order from cart (Checkout)
   * 
   * Request body should include:
   * - customerId (optional if creating new customer)
   * - customerName, customerEmail, customerPhone
   * - shippingAddress, city, state, pincode
   * - paymentMethod
   */
  createOrder: async (orderData: any, tenantId: string = DEFAULT_TENANT_ID): Promise<OrderDto> => {
    try {
      const url = buildUrl(API_ENDPOINTS.user.order, { tenantId });
      const response = await fetch(url, getFetchOptions('POST', orderData));
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create order:', error);
      // Fallback to mock data in development
      if (import.meta.env.DEV) {
        const newOrder: OrderDto = {
          id: `ORD${Date.now()}`,
          orderNumber: `ORD${Date.now()}`,
          customerName: orderData.customerName || "",
          customerEmail: orderData.customerEmail || "",
          customerPhone: orderData.customerPhone || "",
          shippingAddress: `${orderData.shippingAddress}, ${orderData.city}, ${orderData.state}, ${orderData.pincode}`,
          items: [],
          subtotal: 0,
          tax: 0,
          shippingCost: 0,
          total: 0,
          status: OrderStatus.PENDING,
          paymentStatus: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockOrders.unshift(newOrder);
        return newOrder;
      }
      throw error;
    }
  },

  /**
   * POST /api/user/order/{orderNumber}/cancel?tenantId={tenantId}
   * Cancel an order (only if not shipped)
   */
  cancelOrder: async (orderNumber: string, tenantId: string = DEFAULT_TENANT_ID): Promise<void> => {
    try {
      const url = buildUrl(`${API_ENDPOINTS.user.order}/${orderNumber}/cancel`, { tenantId });
      const response = await fetch(url, getFetchOptions('POST'));
      
      if (!response.ok) {
        await handleApiError(response);
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  },
};
