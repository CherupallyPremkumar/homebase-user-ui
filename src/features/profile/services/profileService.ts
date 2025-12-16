import {
  CustomerProfileDto,
  AddressDto,
  NotificationSettingsDto,
  UpdateProfileDto,
} from "@/types/dto";
import { apiClient } from "@/lib/apiClient";

/**
 * Profile Service
 * All profile data comes from backend API
 */

/**
 * Get customer profile
 */
export const getProfile = async (email?: string): Promise<CustomerProfileDto> => {
  const url = email
    ? `/customer/profile?email=${encodeURIComponent(email)}`
    : `/customer/profile`;

  return apiClient.get<CustomerProfileDto>(url);
};

/**
 * Update customer profile
 */
export const updateProfile = async (data: UpdateProfileDto): Promise<CustomerProfileDto> => {
  return apiClient.put<CustomerProfileDto>('/customer/profile', data);
};

/**
 * Add new address
 */
export const addAddress = async (address: Omit<AddressDto, "id">): Promise<AddressDto> => {
  return apiClient.post<AddressDto>('/customer/address', address);
};

/**
 * Update existing address
 */
export const updateAddress = async (addressId: string, address: Partial<AddressDto>): Promise<AddressDto> => {
  return apiClient.put<AddressDto>(`/customer/address/${addressId}`, address);
};

/**
 * Delete address
 */
export const deleteAddress = async (addressId: string): Promise<void> => {
  return apiClient.delete<void>(`/customer/address/${addressId}`);
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (settings: NotificationSettingsDto): Promise<NotificationSettingsDto> => {
  return apiClient.put<NotificationSettingsDto>('/customer/notifications', settings);
};
