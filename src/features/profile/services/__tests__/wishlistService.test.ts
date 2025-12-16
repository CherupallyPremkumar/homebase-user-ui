import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getWishlist, toggleWishlist } from '../wishlistService';
import { apiClient } from '@/lib/apiClient';

vi.mock('@/lib/apiClient');

describe('wishlistService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getWishlist', () => {
        it('should return empty array when no email provided', async () => {
            const result = await getWishlist(undefined);

            expect(result).toEqual([]);
            expect(apiClient.get).not.toHaveBeenCalled();
        });

        it('should fetch wishlist for user', async () => {
            const mockWishlist = [
                { id: 1, name: 'Product 1', price: 1000 },
                { id: 2, name: 'Product 2', price: 2000 },
            ];
            vi.mocked(apiClient.get).mockResolvedValue(mockWishlist);

            const result = await getWishlist('test@example.com');

            expect(apiClient.get).toHaveBeenCalledWith('/wishlist?email=test@example.com');
            expect(result).toEqual(mockWishlist);
        });

        it('should return empty array on error', async () => {
            vi.mocked(apiClient.get).mockRejectedValue(new Error('API Error'));
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const result = await getWishlist('test@example.com');

            expect(result).toEqual([]);
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('toggleWishlist', () => {
        it('should add product to wishlist', async () => {
            const mockResponse = { added: true, message: 'Added to wishlist' };
            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await toggleWishlist('test@example.com', 123);

            expect(apiClient.post).toHaveBeenCalledWith(
                '/wishlist/toggle?email=test@example.com&productId=123'
            );
            expect(result).toEqual(mockResponse);
        });

        it('should remove product from wishlist', async () => {
            const mockResponse = { added: false, message: 'Removed from wishlist' };
            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await toggleWishlist('test@example.com', 123);

            expect(result).toEqual(mockResponse);
        });
    });
});
