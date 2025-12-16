import { describe, it, expect, vi, beforeEach } from 'vitest';
import { paymentService } from '../paymentService';
import { apiClient } from '@/lib/apiClient';

vi.mock('@/lib/apiClient');

describe('paymentService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createPayment', () => {
        it('should create payment request', async () => {
            const paymentRequest = {
                orderId: 'order_123',
                amount: 5000,
                currency: 'INR',
            };
            const mockResponse = {
                paymentId: 'pay_123',
                redirectUrl: 'https://payment-gateway.com/...',
            };
            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await paymentService.createPayment(paymentRequest);

            expect(apiClient.post).toHaveBeenCalledWith('/payment/create', paymentRequest);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('handlePaymentCallback', () => {
        it('should handle successful payment callback', async () => {
            const mockResponse = {
                success: true,
                orderId: 'order_123',
                message: 'Payment successful',
            };
            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await paymentService.handlePaymentCallback('txn_123');

            expect(apiClient.post).toHaveBeenCalledWith('/payment/callback', {
                transactionId: 'txn_123',
            });
            expect(result).toEqual(mockResponse);
        });

        it('should handle failed payment callback', async () => {
            const mockResponse = {
                success: false,
                message: 'Payment failed',
            };
            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await paymentService.handlePaymentCallback('txn_456');

            expect(result.success).toBe(false);
        });
    });

    describe('checkPaymentStatus', () => {
        it('should check payment status', async () => {
            const mockResponse = {
                status: 'SUCCESS' as const,
                orderId: 'order_123',
            };
            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await paymentService.checkPaymentStatus('txn_123');

            expect(apiClient.get).toHaveBeenCalledWith('/payment/status/txn_123');
            expect(result).toEqual(mockResponse);
        });

        it('should handle pending payment status', async () => {
            const mockResponse = {
                status: 'PENDING' as const,
            };
            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await paymentService.checkPaymentStatus('txn_456');

            expect(result.status).toBe('PENDING');
        });
    });
});
