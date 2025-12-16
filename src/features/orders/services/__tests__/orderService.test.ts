import { describe, it, expect, vi, beforeEach } from 'vitest';
import { orderService } from '../orderService';
import { apiClient } from '@/lib/apiClient';

vi.mock('@/lib/apiClient');

describe('orderService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllOrders', () => {
        it('should fetch all orders', async () => {
            const mockOrders = [
                { id: '1', total: 5000, status: 'PENDING' },
                { id: '2', total: 3000, status: 'DELIVERED' },
            ];
            vi.mocked(apiClient.get).mockResolvedValue(mockOrders);

            const result = await orderService.getAllOrders();

            expect(apiClient.get).toHaveBeenCalledWith('/order');
            expect(result).toEqual(mockOrders);
        });
    });

    describe('getOrderById', () => {
        it('should fetch order by ID', async () => {
            const mockOrder = { id: '123', total: 5000 };
            vi.mocked(apiClient.get).mockResolvedValue(mockOrder);

            const result = await orderService.getOrderById('123');

            expect(apiClient.get).toHaveBeenCalledWith('/order/123');
            expect(result).toEqual(mockOrder);
        });
    });

    describe('createOrder', () => {
        it('should create a new order', async () => {
            const orderData = {
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                total: 5000,
            };
            const mockResponse = { id: '123', ...orderData };
            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await orderService.createOrder(orderData);

            expect(apiClient.post).toHaveBeenCalledWith('/order', orderData);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getOrderPreview', () => {
        it('should get order preview', async () => {
            const cartItems = [{ productId: 1, quantity: 2 }];
            const mockPreview = { subtotal: 2000, tax: 360, total: 2360 };
            vi.mocked(apiClient.post).mockResolvedValue(mockPreview);

            const result = await orderService.getOrderPreview(cartItems);

            expect(apiClient.post).toHaveBeenCalledWith('/order/preview', {
                items: cartItems,
            });
            expect(result).toEqual(mockPreview);
        });
    });
});
