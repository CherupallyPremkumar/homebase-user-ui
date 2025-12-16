/**
 * Payment Service
 * Uses shared service from @homebase/shared
 */

import { createPaymentService } from '@homebase/shared';
import { apiClient } from '@/lib/apiClient';

export const paymentService = createPaymentService(apiClient);

// Re-export individual methods for backward compatibility
export const createPayment = paymentService.createPayment;
export const handlePaymentCallback = paymentService.handlePaymentCallback;
export const checkPaymentStatus = paymentService.checkPaymentStatus;
