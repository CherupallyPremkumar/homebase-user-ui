import { OrderDto, OrderPreviewDto } from "@/types/dto";
import { apiClient } from "@/lib/apiClient";

export const orderService = {
  getAllOrders: async (): Promise<OrderDto[]> => {
    return apiClient.get<OrderDto[]>('/order');
  },

  getOrderById: async (orderId: string): Promise<OrderDto> => {
    return apiClient.get<OrderDto>(`/order/${orderId}`);
  },

  createOrder: async (orderData: Partial<OrderDto>): Promise<OrderDto> => {
    return apiClient.post<OrderDto>('/order', orderData);
  },

  getOrderPreview: async (cartItems: any[]): Promise<OrderPreviewDto> => {
    return apiClient.post<OrderPreviewDto>('/order/preview', { items: cartItems });
  },
};

// Legacy export for backwards compatibility
export const getOrders = orderService.getAllOrders;
