/**
 * Auth Service
 * Uses shared service from @homebase/shared
 */

import { createAuthService } from '@homebase/shared';
import { apiClient } from '@/lib/apiClient';

export const authService = createAuthService(apiClient);

// Re-export individual methods for backward compatibility
export const login = authService.login;
export const register = authService.register;
export const logout = authService.logout;
export const getGoogleAuthUrl = authService.getGoogleAuthUrl;
export const googleLogin = authService.googleLogin;
export const socialLogin = authService.socialLogin;
