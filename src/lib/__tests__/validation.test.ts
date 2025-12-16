import { describe, it, expect } from 'vitest';
import {
    loginSchema,
    addressSchema,
    checkoutSchema,
    validateData,
} from '../validation';

describe('Validation Schemas', () => {
    describe('loginSchema', () => {
        it('should validate correct login data', () => {
            const validData = {
                email: 'test@example.com',
                password: 'password123',
            };

            const result = validateData(loginSchema, validData);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validData);
            }
        });

        it('should reject invalid email', () => {
            const invalidData = {
                email: 'not-an-email',
                password: 'password123',
            };

            const result = validateData(loginSchema, invalidData);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors.email).toBeDefined();
            }
        });

        it('should reject short password', () => {
            const invalidData = {
                email: 'test@example.com',
                password: '123',
            };

            const result = validateData(loginSchema, invalidData);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors.password).toContain('at least 6 characters');
            }
        });
    });

    describe('addressSchema', () => {
        it('should validate correct address', () => {
            const validAddress = {
                label: 'Home',
                fullName: 'John Doe',
                phone: '9876543210',
                addressLine1: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',
            };

            const result = validateData(addressSchema, validAddress);

            expect(result.success).toBe(true);
        });

        it('should reject invalid phone number', () => {
            const invalidAddress = {
                label: 'Home',
                fullName: 'John Doe',
                phone: '123', // Invalid
                addressLine1: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',
            };

            const result = validateData(addressSchema, invalidAddress);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors.phone).toBeDefined();
            }
        });

        it('should reject invalid pincode', () => {
            const invalidAddress = {
                label: 'Home',
                fullName: 'John Doe',
                phone: '9876543210',
                addressLine1: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '123', // Invalid - should be 6 digits
            };

            const result = validateData(addressSchema, invalidAddress);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors.pincode).toBeDefined();
            }
        });
    });

    describe('checkoutSchema', () => {
        it('should validate complete checkout data', () => {
            const validCheckout = {
                shippingAddress: {
                    label: 'Home',
                    fullName: 'John Doe',
                    phone: '9876543210',
                    addressLine1: '123 Main Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                },
                email: 'test@example.com',
                phone: '9876543210',
                paymentMethod: 'COD' as const,
                agreeToTerms: true,
            };

            const result = validateData(checkoutSchema, validCheckout);

            expect(result.success).toBe(true);
        });

        it('should reject when terms not agreed', () => {
            const invalidCheckout = {
                shippingAddress: {
                    label: 'Home',
                    fullName: 'John Doe',
                    phone: '9876543210',
                    addressLine1: '123 Main Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                },
                email: 'test@example.com',
                phone: '9876543210',
                paymentMethod: 'COD' as const,
                agreeToTerms: false, // Not agreed
            };

            const result = validateData(checkoutSchema, invalidCheckout);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors.agreeToTerms).toBeDefined();
            }
        });
    });
});
