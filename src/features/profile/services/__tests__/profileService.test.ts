import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProfile, updateProfile, addAddress, updateAddress, deleteAddress } from '../profileService';
import { apiClient } from '@/lib/apiClient';

vi.mock('@/lib/apiClient');

describe('profileService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getProfile', () => {
        it('should fetch profile without email', async () => {
            const mockProfile = { id: '1', name: 'John Doe', email: 'john@example.com' };
            vi.mocked(apiClient.get).mockResolvedValue(mockProfile);

            const result = await getProfile();

            expect(apiClient.get).toHaveBeenCalledWith('/customer/profile');
            expect(result).toEqual(mockProfile);
        });

        it('should fetch profile with email parameter', async () => {
            const mockProfile = { id: '1', name: 'John Doe' };
            vi.mocked(apiClient.get).mockResolvedValue(mockProfile);

            const result = await getProfile('john@example.com');

            expect(apiClient.get).toHaveBeenCalledWith(
                expect.stringContaining('email=john%40example.com')
            );
            expect(result).toEqual(mockProfile);
        });
    });

    describe('updateProfile', () => {
        it('should update profile data', async () => {
            const updateData = { name: 'Jane Doe', phone: '9876543210' };
            const mockResponse = { id: '1', ...updateData };
            vi.mocked(apiClient.put).mockResolvedValue(mockResponse);

            const result = await updateProfile(updateData);

            expect(apiClient.put).toHaveBeenCalledWith('/customer/profile', updateData);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('addAddress', () => {
        it('should add new address', async () => {
            const newAddress = {
                label: 'Home',
                fullName: 'John Doe',
                phone: '9876543210',
                addressLine1: '123 Main St',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',
            };
            const mockResponse = { id: 'addr_1', ...newAddress };
            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await addAddress(newAddress);

            expect(apiClient.post).toHaveBeenCalledWith('/customer/address', newAddress);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('updateAddress', () => {
        it('should update existing address', async () => {
            const updates = { city: 'Delhi' };
            const mockResponse = { id: 'addr_1', ...updates };
            vi.mocked(apiClient.put).mockResolvedValue(mockResponse);

            const result = await updateAddress('addr_1', updates);

            expect(apiClient.put).toHaveBeenCalledWith('/customer/address/addr_1', updates);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('deleteAddress', () => {
        it('should delete address', async () => {
            vi.mocked(apiClient.delete).mockResolvedValue(undefined);

            await deleteAddress('addr_1');

            expect(apiClient.delete).toHaveBeenCalledWith('/customer/address/addr_1');
        });
    });
});
