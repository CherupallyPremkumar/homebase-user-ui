import { CreatePaymentRequestDto, CreatePaymentResponseDto } from "@/types/dto";
import { API_ENDPOINTS, buildUrl, getFetchOptions, getTenantId, handleApiError } from "@/config/api";

export const paymentService = {
  /**
   * Initiate payment for an order
   */
  createPayment: async (request: CreatePaymentRequestDto): Promise<CreatePaymentResponseDto> => {
    const tenantId = getTenantId();
    const url = buildUrl(`${API_ENDPOINTS.user.payment}/create`, { tenantId });
    const response = await fetch(url, getFetchOptions('POST', request));

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  /**
   * Check payment status
   */
  checkPaymentStatus: async (
    transactionId: string
  ): Promise<{
    success: boolean;
    status: "PENDING" | "SUCCESS" | "FAILED";
    orderId?: string;
    amount?: number;
    message?: string;
  }> => {
    const tenantId = getTenantId();
    const url = buildUrl(`${API_ENDPOINTS.user.payment}/status/${transactionId}`, { tenantId });
    const response = await fetch(url, getFetchOptions('GET'));

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },
};