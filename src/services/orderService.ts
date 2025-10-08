import { OrderDto, OrderStatus } from "@/types/dto";
import productVase from "@/assets/product-vase.jpg";
import productWallHanging from "@/assets/product-wall-hanging.jpg";
import productCushion from "@/assets/product-cushion.jpg";

// TODO: Replace with actual backend API endpoint
const API_BASE_URL = "/api";

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

export const orderService = {
  // GET /api/orders?tenantId={tenantId}
  getAllOrders: async (tenantId?: string): Promise<OrderDto[]> => {
    // TODO: Implement actual API call to Spring Boot backend
    // This will fetch all orders for the logged-in user within the tenant
    // const response = await fetch(`${API_BASE_URL}/orders?tenantId=${tenantId}`, {
    //   credentials: 'include',
    // });
    // if (!response.ok) throw new Error('Failed to fetch orders');
    // return response.json();
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockOrders), 500);
    });
  },

  // GET /api/order/{id}?tenantId={tenantId}
  getOrderById: async (orderId: string, tenantId?: string): Promise<OrderDto | null> => {
    // TODO: Implement actual API call to Spring Boot backend
    // const response = await fetch(`${API_BASE_URL}/order/${orderId}?tenantId=${tenantId}`, {
    //   credentials: 'include',
    // });
    // if (!response.ok) throw new Error('Failed to fetch order');
    // return response.json();
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = mockOrders.find(o => o.id === orderId);
        resolve(order || null);
      }, 300);
    });
  },

  // POST /api/order?tenantId={tenantId}
  createOrder: async (orderData: Partial<OrderDto>, tenantId?: string): Promise<OrderDto> => {
    // TODO: Implement actual API call to Spring Boot backend
    // This will create a new order from cart items
    // const response = await fetch(`${API_BASE_URL}/order?tenantId=${tenantId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   credentials: 'include',
    //   body: JSON.stringify(orderData),
    // });
    // if (!response.ok) throw new Error('Failed to create order');
    // return response.json();
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder: OrderDto = {
          id: `ORD${Date.now()}`,
          customerName: orderData.customerName || "",
          customerEmail: orderData.customerEmail || "",
          customerPhone: orderData.customerPhone || "",
          shippingAddress: orderData.shippingAddress || "",
          items: orderData.items || [],
          subtotal: orderData.subtotal || 0,
          tax: orderData.tax || 0,
          shippingCost: orderData.shippingCost || 0,
          total: orderData.total || 0,
          status: OrderStatus.PENDING,
          paymentStatus: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockOrders.unshift(newOrder);
        resolve(newOrder);
      }, 500);
    });
  },
};
