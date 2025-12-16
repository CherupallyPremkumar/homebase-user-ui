/**
 * Profile Service
 * Uses shared service from @homebase/shared
 */

import { createProfileService } from '@homebase/shared';
import { apiClient } from '@/lib/apiClient';

export const profileService = createProfileService(apiClient);

// Re-export individual methods for backward compatibility
export const getProfile = profileService.getProfile;
export const updateProfile = profileService.updateProfile;
export const addAddress = profileService.addAddress;
export const updateAddress = profileService.updateAddress;
export const deleteAddress = profileService.deleteAddress;

// Note: updateNotificationSettings is not in the shared service
// This might need to be added to the shared service or kept as a custom function
export const updateNotificationSettings = async (settings: any) => {
  // TODO: Implement this in shared service or keep as custom
  return apiClient.put('/customer/notifications', settings);
};
