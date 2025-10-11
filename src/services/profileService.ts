import { CustomerProfileDto, AddressDto, NotificationSettingsDto, UpdateProfileDto } from "@/types/dto";
import { API_ENDPOINTS, buildUrl, getFetchOptions, handleApiError, getTenantId } from "@/config/api";

/**
 * Profile Service - Production Ready
 */
export const profileService = {
  /**
   * Get customer profile by customer ID
   */
  getProfile: async (customerId: string): Promise<CustomerProfileDto> => {
    const tenantId = getTenantId();
    const url = buildUrl(API_ENDPOINTS.user.profile, { customerId, tenantId });
    const response = await fetch(url, getFetchOptions('GET'));

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  /**
   * Update customer profile
   */
  updateProfile: async (customerId: string, data: UpdateProfileDto): Promise<CustomerProfileDto> => {
    const tenantId = getTenantId();
    const url = buildUrl(API_ENDPOINTS.user.profile, { customerId, tenantId });
    const response = await fetch(url, getFetchOptions('PUT', data));

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  /**
   * Add new address
   */
  addAddress: async (customerId: string, address: Omit<AddressDto, "id">): Promise<AddressDto> => {
    const tenantId = getTenantId();
    const url = buildUrl(API_ENDPOINTS.user.address, { customerId, tenantId });
    const response = await fetch(url, getFetchOptions('POST', address));

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  /**
   * Update address
   */
  updateAddress: async (customerId: string, addressId: string, address: Partial<AddressDto>): Promise<AddressDto> => {
    const tenantId = getTenantId();
    const url = buildUrl(`${API_ENDPOINTS.user.address}/${addressId}`, { customerId, tenantId });
    const response = await fetch(url, getFetchOptions('PUT', address));

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  /**
   * Delete address
   */
  deleteAddress: async (customerId: string, addressId: string): Promise<void> => {
    const tenantId = getTenantId();
    const url = buildUrl(`${API_ENDPOINTS.user.address}/${addressId}`, { customerId, tenantId });
    const response = await fetch(url, getFetchOptions('DELETE'));

    if (!response.ok) {
      await handleApiError(response);
    }
  },

  /**
   * Update notification settings
   */
  updateNotificationSettings: async (customerId: string, settings: NotificationSettingsDto): Promise<NotificationSettingsDto> => {
    const tenantId = getTenantId();
    const url = buildUrl(API_ENDPOINTS.user.notifications, { customerId, tenantId });
    const response = await fetch(url, getFetchOptions('PUT', settings));

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },
};