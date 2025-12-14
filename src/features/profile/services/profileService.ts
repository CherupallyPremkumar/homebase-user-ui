import { CustomerProfileDto, AddressDto, NotificationSettingsDto, UpdateProfileDto } from "@/types/dto";

/**
 * Profile Service - Mock implementation
 * Replace with actual API endpoints
 */

// Mock profile data
const mockProfile: CustomerProfileDto = {
  id: "customer_123",
  name: "John Doe",
  email: "john@example.com",
  phone: "+91-9876543210",
  tenantId: "havenhome",
  addresses: [
    {
      id: "addr_1",
      label: "Home",
      fullName: "John Doe",
      phone: "+91-9876543210",
      addressLine1: "123 Main Street",
      addressLine2: "Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true,
    },
    {
      id: "addr_2",
      label: "Office",
      fullName: "John Doe",
      phone: "+91-9876543210",
      addressLine1: "456 Business Park",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400002",
      isDefault: false,
    },
  ],
  notificationSettings: {
    orderUpdates: true,
    promotions: true,
    newsletter: false,
  },
};

/**
 * Get customer profile
 */
export const getProfile = async (tenantId: string): Promise<CustomerProfileDto> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/customer/profile?tenantId=${tenantId}`);
  // return await response.json();

  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ...mockProfile, tenantId };
};

/**
 * Update customer profile
 */
export const updateProfile = async (
  tenantId: string,
  data: UpdateProfileDto
): Promise<CustomerProfileDto> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/customer/profile?tenantId=${tenantId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // return await response.json();

  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    ...mockProfile,
    name: data.name,
    phone: data.phone,
    tenantId,
  };
};

/**
 * Add new address
 */
export const addAddress = async (
  tenantId: string,
  address: Omit<AddressDto, "id">
): Promise<AddressDto> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/customer/address?tenantId=${tenantId}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(address),
  // });
  // return await response.json();

  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    ...address,
    id: `addr_${Date.now()}`,
  };
};

/**
 * Update address
 */
export const updateAddress = async (
  tenantId: string,
  addressId: string,
  address: Partial<AddressDto>
): Promise<AddressDto> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/customer/address/${addressId}?tenantId=${tenantId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(address),
  // });
  // return await response.json();

  await new Promise((resolve) => setTimeout(resolve, 500));
  const existingAddress = mockProfile.addresses.find((a) => a.id === addressId);
  return {
    ...existingAddress!,
    ...address,
  };
};

/**
 * Delete address
 */
export const deleteAddress = async (
  tenantId: string,
  addressId: string
): Promise<void> => {
  // TODO: Replace with actual API call
  // await fetch(`/api/customer/address/${addressId}?tenantId=${tenantId}`, {
  //   method: 'DELETE',
  // });

  await new Promise((resolve) => setTimeout(resolve, 500));
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (
  tenantId: string,
  settings: NotificationSettingsDto
): Promise<NotificationSettingsDto> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/customer/notifications?tenantId=${tenantId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(settings),
  // });
  // return await response.json();

  await new Promise((resolve) => setTimeout(resolve, 500));
  return settings;
};
