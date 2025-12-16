import { CreatePaymentRequestDto, CreatePaymentResponseDto } from "@/types/dto";
import { apiClient } from "@/lib/apiClient";

export const paymentService = {
  // POST /api/payment/create
  createPayment: async (
    request: CreatePaymentRequestDto
  ): Promise<CreatePaymentResponseDto> => {
    return apiClient.post<CreatePaymentResponseDto>('/payment/create', request);
  },

  // POST /api/payment/callback
  handlePaymentCallback: async (
    transactionId: string
  ): Promise<{
    success: boolean;
    orderId?: string;
    message?: string;
  }> => {
    return apiClient.post('/payment/callback', { transactionId });
  },

  // GET /api/payment/status/{transactionId}
  checkPaymentStatus: async (
    transactionId: string
  ): Promise<{
    status: "PENDING" | "SUCCESS" | "FAILED";
    orderId?: string;
  }> => {
    return apiClient.get(`/payment/status/${transactionId}`);
  },
};
