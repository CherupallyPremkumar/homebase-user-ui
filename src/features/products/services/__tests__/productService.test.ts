import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productService } from '../productService';
import { apiClient } from '@/lib/apiClient';

vi.mock('@/lib/apiClient');

describe('productService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllProducts', () => {
        it('should fetch products with pagination', async () => {
            const mockResponse = {
                data: [{ id: 1, name: 'Product 1' }],
                pagination: {
                    page: 1,
                    pageSize: 24,
                    totalItems: 50,
                    totalPages: 3,
                    hasNextPage: true,
                    hasPreviousPage: false,
                },
            };
            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await productService.getAllProducts(null, 1, 24);

            expect(apiClient.get).toHaveBeenCalledWith('/products?page=1&pageSize=24');
            expect(result).toEqual(mockResponse);
        });

        it('should include city parameter when provided', async () => {
            vi.mocked(apiClient.get).mockResolvedValue({ data: [], pagination: {} });

            await productService.getAllProducts('Mumbai', 1, 24);

            expect(apiClient.get).toHaveBeenCalledWith(
                expect.stringContaining('&city=Mumbai')
            );
        });

        it('should use default page and pageSize', async () => {
            vi.mocked(apiClient.get).mockResolvedValue({ data: [], pagination: {} });

            await productService.getAllProducts();

            expect(apiClient.get).toHaveBeenCalledWith('/products?page=1&pageSize=24');
        });
    });

    describe('getProductById', () => {
        it('should fetch product with reviews', async () => {
            const mockProduct = {
                product: { id: 1, name: 'Test Product' },
                reviews: [{ id: '1', rating: 5, comment: 'Great!' }],
            };
            vi.mocked(apiClient.get).mockResolvedValue(mockProduct);

            const result = await productService.getProductById(1);

            expect(apiClient.get).toHaveBeenCalledWith('/products/1');
            expect(result).toEqual(mockProduct);
        });
    });

    describe('getProductsByCategory', () => {
        it('should fetch products by category with pagination', async () => {
            const mockResponse = {
                data: [{ id: 1, category: 'Food' }],
                pagination: {},
            };
            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await productService.getProductsByCategory('Food', 1, 24);

            expect(apiClient.get).toHaveBeenCalledWith(
                '/products?category=Food&page=1&pageSize=24'
            );
            expect(result).toEqual(mockResponse);
        });
    });
});
