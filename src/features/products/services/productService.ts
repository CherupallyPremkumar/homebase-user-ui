/**
 * Product Service
 * Uses shared service from @homebase/shared
 */

import { createProductService } from '@homebase/shared';
import { apiClient } from '@/lib/apiClient';

export const productService = createProductService(apiClient);

// Re-export types for convenience
export type { PaginatedResponse } from '@homebase/shared';
