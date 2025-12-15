import { CreatePaymentRequestDto, CreatePaymentResponseDto } from "@/types/dto";
import { API_BASE_URL } from "@/lib/config";

export const paymentService = {
  // POST /api/payment/create
  createPayment: async (
    request: CreatePaymentRequestDto
  ): Promise<CreatePaymentResponseDto> => {
    const response = await fetch(`${API_BASE_URL}/payment/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Failed to create payment");
    return response.json();
  },

  // POST /api/payment/callback
  handlePaymentCallback: async (
    transactionId: string
  ): Promise<{
    success: boolean;
    orderId?: string;
    message?: string;
  }> => {
    const response = await fetch(`${API_BASE_URL}/payment/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    });
    if (!response.ok) throw new Error("Failed to process payment callback");
    return response.json();
  },

  // GET /api/payment/status/{transactionId}
  checkPaymentStatus: async (
    transactionId: string
  ): Promise<{
    status: "PENDING" | "SUCCESS" | "FAILED";
    orderId?: string;
  }> => {
    const response = await fetch(
      `${API_BASE_URL}/payment/status/${transactionId}`
    );
    if (!response.ok) throw new Error("Failed to check payment status");
    return response.json();
  },
};
