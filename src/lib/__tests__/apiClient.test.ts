import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../apiClient';
import { secureTokenStorage } from '../secureStorage';

// Mock secureTokenStorage
vi.mock('../secureStorage', () => ({
    secureTokenStorage: {
        getToken: vi.fn(),
    },
    getLegacyToken: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

describe('apiClient', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET requests', () => {
        it('should make a GET request with auth token', async () => {
            const mockToken = 'test-token';
            const mockResponse = { data: 'test' };

            vi.mocked(secureTokenStorage.getToken).mockResolvedValue(mockToken);
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            } as Response);

            const result = await apiClient.get('/test');

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/test'),
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'Authorization': `Bearer ${mockToken}`,
                        'Content-Type': 'application/json',
                    }),
                })
            );
            expect(result).toEqual(mockResponse);
        });

        it('should make a GET request without auth when skipAuth is true', async () => {
            const mockResponse = { data: 'test' };

            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            } as Response);

            await apiClient.get('/test', { skipAuth: true });

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.not.objectContaining({
                        'Authorization': expect.any(String),
                    }),
                })
            );
        });

        it('should throw error on failed request', async () => {
            vi.mocked(fetch).mockResolvedValue({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Not found' }),
            } as Response);

            await expect(apiClient.get('/test')).rejects.toThrow();
        });
    });

    describe('POST requests', () => {
        it('should make a POST request with data', async () => {
            const mockData = { name: 'test' };
            const mockResponse = { id: 1, ...mockData };

            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            } as Response);

            const result = await apiClient.post('/test', mockData);

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(mockData),
                })
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('Error handling', () => {
        it('should handle network errors', async () => {
            vi.mocked(fetch).mockRejectedValue(new TypeError('Failed to fetch'));

            await expect(apiClient.get('/test')).rejects.toThrow();
        });

        it('should handle 204 No Content', async () => {
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                status: 204,
            } as Response);

            const result = await apiClient.delete('/test');

            expect(result).toEqual({});
        });
    });
});
