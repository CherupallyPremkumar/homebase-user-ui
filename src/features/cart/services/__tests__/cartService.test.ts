import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cartService } from '../cartService';
import { apiClient } from '@/lib/apiClient';

vi.mock('@/lib/apiClient');

describe('cartService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getCart', () => {
        it('should fetch cart items for a user', async () => {
            const mockCart = [
                { id: 1, productId: 1, quantity: 2, price: 1000 },
            ];
            vi.mocked(apiClient.get).mockResolvedValue(mockCart);

            const result = await cartService.getCart('user123');

            expect(apiClient.get).toHaveBeenCalledWith('/cart?userId=user123');
            expect(result).toEqual(mockCart);
        });

        it('should encode userId in URL', async () => {
            vi.mocked(apiClient.get).mockResolvedValue([]);

            await cartService.getCart('user@example.com');

            expect(apiClient.get).toHaveBeenCalledWith(
                expect.stringContaining('user%40example.com')
            );
        });
    });

    describe('addToCart', () => {
        it('should add item to cart', async () => {
            const mockItem = { id: 1, productId: 123, quantity: 1 };
            vi.mocked(apiClient.post).mockResolvedValue(mockItem);

            const result = await cartService.addToCart(123, 1, 'user123');

            expect(apiClient.post).toHaveBeenCalledWith(
                '/cart?userId=user123',
                { productId: 123, quantity: 1 }
            );
            expect(result).toEqual(mockItem);
        });

        it('should use default quantity of 1', async () => {
            vi.mocked(apiClient.post).mockResolvedValue({});

            await cartService.addToCart(123, undefined, 'user123');

            expect(apiClient.post).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ quantity: 1 })
            );
        });
    });

    describe('updateCartItem', () => {
        it('should update cart item quantity', async () => {
            const mockItem = { id: 1, quantity: 5 };
            vi.mocked(apiClient.put).mockResolvedValue(mockItem);

            const result = await cartService.updateCartItem(1, 5);

            expect(apiClient.put).toHaveBeenCalledWith('/cart/1', { quantity: 5 });
            expect(result).toEqual(mockItem);
        });
    });

    describe('removeFromCart', () => {
        it('should remove item from cart', async () => {
            vi.mocked(apiClient.delete).mockResolvedValue(undefined);

            await cartService.removeFromCart(1);

            expect(apiClient.delete).toHaveBeenCalledWith('/cart/1');
        });
    });

    describe('clearCart', () => {
        it('should clear all cart items for user', async () => {
            vi.mocked(apiClient.delete).mockResolvedValue(undefined);

            await cartService.clearCart('user123');

            expect(apiClient.delete).toHaveBeenCalledWith('/cart?userId=user123');
        });
    });
});
