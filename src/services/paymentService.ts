import { CreatePaymentRequestDto, CreatePaymentResponseDto } from "@/types/dto";
import { API_ENDPOINTS, DEFAULT_TENANT_ID, buildUrl, getFetchOptions, handleApiError } from "@/config/api";

export const paymentService = {
  /**
   * POST /api/user/payment/create?tenantId={tenantId}
   * Initiate payment for an order
   */
  createPayment: async (request: CreatePaymentRequestDto, tenantId: string = DEFAULT_TENANT_ID): Promise<CreatePaymentResponseDto> => {
    try {
      const url = buildUrl(`${API_ENDPOINTS.user.payment}/create`, { tenantId });
      const response = await fetch(url, getFetchOptions('POST', request));
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create payment:', error);
      // Fallback to mock data in development
      if (import.meta.env.DEV) {
        const success = Math.random() > 0.2;
        return {
          success,
          paymentUrl: success ? `/payment/processing?txn=${Date.now()}` : undefined,
          transactionId: success ? `TXN${Date.now()}` : undefined,
          merchantTransactionId: success ? `MT${Date.now()}` : undefined,
          message: success ? "Payment initiated successfully" : "Payment gateway temporarily unavailable",
        };
      }
      throw error;
    }
  },

  /**
   * GET /api/user/payment/status/{transactionId}?tenantId={tenantId}
   * Check payment status
   */
  checkPaymentStatus: async (transactionId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<{
    success: boolean;
    status: "PENDING" | "SUCCESS" | "FAILED";
    orderId?: string;
    amount?: number;
    message?: string;
  }> => {
    try {
      const url = buildUrl(`${API_ENDPOINTS.user.payment}/status/${transactionId}`, { tenantId });
      const response = await fetch(url, getFetchOptions('GET'));
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to check payment status:', error);
      // Fallback to mock data in development
      if (import.meta.env.DEV) {
        return {
          success: true,
          status: "SUCCESS",
          orderId: `ORD${Date.now()}`,
        };
      }
      throw error;
    }
  },
};
