import {
  CustomerProfileDto,
  AddressDto,
  NotificationSettingsDto,
  UpdateProfileDto,
} from "@/types/dto";
import { API_BASE_URL } from "@/lib/config";

// Mock profile data for development
const mockProfile: CustomerProfileDto = {
  id: "customer_123",
  name: "John Doe",
  email: "john@example.com",
  phone: "+91-9876543210",
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
export const getProfile = async (): Promise<CustomerProfileDto> => {
  const response = await fetch(`${API_BASE_URL}/customer/profile`);
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
};

/**
 * Update customer profile
 */
export const updateProfile = async (
  data: UpdateProfileDto
): Promise<CustomerProfileDto> => {
  const response = await fetch(`${API_BASE_URL}/customer/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update profile");
  return response.json();
};

/**
 * Add new address
 */
export const addAddress = async (
  address: Omit<AddressDto, "id">
): Promise<AddressDto> => {
  const response = await fetch(`${API_BASE_URL}/customer/address`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  });
  if (!response.ok) throw new Error("Failed to add address");
  return response.json();
};

/**
 * Update address
 */
export const updateAddress = async (
  addressId: string,
  address: Partial<AddressDto>
): Promise<AddressDto> => {
  const response = await fetch(`${API_BASE_URL}/customer/address/${addressId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  });
  if (!response.ok) throw new Error("Failed to update address");
  return response.json();
};

/**
 * Delete address
 */
export const deleteAddress = async (addressId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/customer/address/${addressId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete address");
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (
  settings: NotificationSettingsDto
): Promise<NotificationSettingsDto> => {
  const response = await fetch(`${API_BASE_URL}/customer/notifications`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!response.ok) throw new Error("Failed to update notifications");
  return response.json();
};
