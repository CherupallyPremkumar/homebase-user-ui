import { CreatePaymentRequestDto, CreatePaymentResponseDto } from "@/types/dto";

// TODO: Replace with actual backend API endpoint
const API_BASE_URL = "/api";

export const paymentService = {
  // POST /api/payment/create
  createPayment: async (request: CreatePaymentRequestDto): Promise<CreatePaymentResponseDto> => {
    // TODO: Implement actual API call to Spring Boot backend
    // This will initiate PhonePe payment gateway integration
    // const response = await fetch(`${API_BASE_URL}/payment/create`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   credentials: 'include',
    //   body: JSON.stringify(request),
    // });
    // if (!response.ok) throw new Error('Failed to create payment');
    // return response.json();
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 80% success rate
        const success = Math.random() > 0.2;
        
        if (success) {
          resolve({
            success: true,
            paymentUrl: `/payment/processing?txn=${Date.now()}`,
            transactionId: `TXN${Date.now()}`,
            merchantTransactionId: `MT${Date.now()}`,
          });
        } else {
          resolve({
            success: false,
            message: "Payment gateway temporarily unavailable",
          });
        }
      }, 1000);
    });
  },

  // POST /api/payment/callback
  // This endpoint will be called by PhonePe after payment completion
  handlePaymentCallback: async (transactionId: string): Promise<{
    success: boolean;
    orderId?: string;
    message?: string;
  }> => {
    // TODO: Implement actual API call to Spring Boot backend
    // Backend will verify payment status with PhonePe and update order
    // const response = await fetch(`${API_BASE_URL}/payment/callback`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   credentials: 'include',
    //   body: JSON.stringify({ transactionId }),
    // });
    // if (!response.ok) throw new Error('Failed to process payment callback');
    // return response.json();
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 90% success rate after reaching payment page
        const success = Math.random() > 0.1;
        
        if (success) {
          resolve({
            success: true,
            orderId: `ORD${Date.now()}`,
          });
        } else {
          resolve({
            success: false,
            message: "Payment verification failed",
          });
        }
      }, 2000);
    });
  },

  // GET /api/payment/status/{transactionId}
  checkPaymentStatus: async (transactionId: string): Promise<{
    status: "PENDING" | "SUCCESS" | "FAILED";
    orderId?: string;
  }> => {
    // TODO: Implement actual API call to Spring Boot backend
    // const response = await fetch(`${API_BASE_URL}/payment/status/${transactionId}`, {
    //   credentials: 'include',
    // });
    // if (!response.ok) throw new Error('Failed to check payment status');
    // return response.json();
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: "SUCCESS",
          orderId: `ORD${Date.now()}`,
        });
      }, 500);
    });
  },
};
