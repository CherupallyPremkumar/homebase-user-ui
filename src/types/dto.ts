// DTOs matching Spring Boot backend

export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  createdAt?: string;
}

export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CreatePaymentRequestDto {
  amount: number;
  currency: string;
  orderId: string;
  customerPhone: string;
  customerName: string;
  redirectUrl: string;
  callbackUrl: string;
}

export interface CreatePaymentResponseDto {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  merchantTransactionId?: string;
  message?: string;
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  PAYMENT_FAILED = "PAYMENT_FAILED"
}

export interface OrderDto {
  id: string;
  customerId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItemDto[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentStatus: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
}
