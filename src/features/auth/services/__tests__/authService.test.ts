import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, socialLogin, googleLogin, getGoogleAuthUrl, logout } from '../authService';
import { apiClient } from '@/lib/apiClient';

vi.mock('@/lib/apiClient');

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('login', () => {
        it('should login with email and password', async () => {
            const mockResponse = {
                token: 'test-token',
                user: { id: '1', email: 'test@example.com', name: 'Test User' },
            };
            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await login('test@example.com', 'password123');

            expect(apiClient.post).toHaveBeenCalledWith(
                '/customer/login',
                { email: 'test@example.com', password: 'password123' },
                { skipAuth: true }
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('socialLogin', () => {
        it('should login with social provider', async () => {
            const mockResponse = {
                token: 'social-token',
                user: { id: '1', email: 'test@example.com', name: 'Test User' },
            };
            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await socialLogin('google');

            expect(apiClient.get).toHaveBeenCalledWith(
                '/customer/login/google',
                { skipAuth: true }
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('googleLogin', () => {
        it('should login with Google authorization code', async () => {
            const mockResponse = {
                token: 'google-token',
                user: { id: '1', email: 'test@example.com', name: 'Test User' },
            };
            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await googleLogin('auth-code-123');

            expect(apiClient.post).toHaveBeenCalledWith(
                '/customer/login/google',
                { code: 'auth-code-123' },
                { skipAuth: true }
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getGoogleAuthUrl', () => {
        it('should get Google auth URL', async () => {
            const mockResponse = { url: 'https://accounts.google.com/...' };
            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await getGoogleAuthUrl();

            expect(apiClient.get).toHaveBeenCalledWith(
                '/customer/login/url/google',
                { skipAuth: true }
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('logout', () => {
        it('should logout user', async () => {
            vi.mocked(apiClient.post).mockResolvedValue(undefined);

            await logout();

            expect(apiClient.post).toHaveBeenCalledWith('/customer/logout');
        });
    });
});
