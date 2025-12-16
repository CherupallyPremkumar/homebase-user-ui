import { OrderDto } from "@/types/dto";
import { API_BASE_URL } from "@/lib/config";

export const orderService = {
  // GET /api/orders
  getAllOrders: async (): Promise<OrderDto[]> => {
    const response = await fetch(`${API_BASE_URL}/order`);
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  // GET /api/order/{id}
  getOrderById: async (orderId: string): Promise<OrderDto | null> => {
    const response = await fetch(`${API_BASE_URL}/order/${orderId}`);
    if (!response.ok) throw new Error("Failed to fetch order");
    return response.json();
  },

  // POST /api/order
  createOrder: async (orderData: Partial<OrderDto>): Promise<OrderDto> => {
    const response = await fetch(`${API_BASE_URL}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Failed to create order");
    return response.json();
  },

  // POST /api/order/preview
  previewOrder: async (items: any[]): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/order/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
    if (!response.ok) throw new Error("Failed to calculate checkout totals");
    return response.json();
  },
};

// Legacy export for backwards compatibility
export const getOrders = orderService.getAllOrders;
