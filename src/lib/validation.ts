/**
 * Validation Schemas
 * Centralized validation using Zod for type-safe form validation
 */

import { z } from 'zod';

/**
 * Common validation patterns
 */
const phoneRegex = /^[6-9]\d{9}$/;
const pincodeRegex = /^\d{6}$/;

/**
 * Authentication Schemas
 */
export const loginSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long'),
    rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name is too long')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password is too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    phone: z.string()
        .regex(phoneRegex, 'Invalid phone number (must be 10 digits starting with 6-9)')
        .optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

/**
 * Address Schema
 */
export const addressSchema = z.object({
    label: z.string()
        .min(1, 'Address label is required')
        .max(50, 'Label is too long'),
    fullName: z.string()
        .min(2, 'Full name is required')
        .max(100, 'Name is too long'),
    phone: z.string()
        .regex(phoneRegex, 'Invalid phone number (must be 10 digits starting with 6-9)'),
    addressLine1: z.string()
        .min(5, 'Address must be at least 5 characters')
        .max(200, 'Address is too long'),
    addressLine2: z.string()
        .max(200, 'Address is too long')
        .optional(),
    city: z.string()
        .min(2, 'City is required')
        .max(100, 'City name is too long'),
    state: z.string()
        .min(2, 'State is required')
        .max(100, 'State name is too long'),
    pincode: z.string()
        .regex(pincodeRegex, 'Invalid pincode (must be 6 digits)'),
    isDefault: z.boolean().optional(),
});

/**
 * Checkout Schema
 */
export const checkoutSchema = z.object({
    // Shipping Address
    shippingAddress: addressSchema,

    // Billing Address (optional, uses shipping if not provided)
    useSameAddress: z.boolean().optional(),
    billingAddress: addressSchema.optional(),

    // Contact Info
    email: z.string()
        .email('Invalid email address'),
    phone: z.string()
        .regex(phoneRegex, 'Invalid phone number'),

    // Payment
    paymentMethod: z.enum(['COD', 'ONLINE'], {
        errorMap: () => ({ message: 'Please select a payment method' }),
    }),

    // Terms
    agreeToTerms: z.boolean()
        .refine((val) => val === true, {
            message: 'You must agree to terms and conditions',
        }),
});

/**
 * Profile Update Schema
 */
export const profileUpdateSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name is too long')
        .optional(),
    email: z.string()
        .email('Invalid email address')
        .optional(),
    phone: z.string()
        .regex(phoneRegex, 'Invalid phone number')
        .optional(),
});

/**
 * Review Schema
 */
export const reviewSchema = z.object({
    rating: z.number()
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating cannot exceed 5'),
    comment: z.string()
        .min(10, 'Review must be at least 10 characters')
        .max(1000, 'Review is too long'),
    userName: z.string()
        .min(2, 'Name is required')
        .max(100, 'Name is too long'),
});

/**
 * Contact Form Schema
 */
export const contactSchema = z.object({
    name: z.string()
        .min(2, 'Name is required')
        .max(100, 'Name is too long'),
    email: z.string()
        .email('Invalid email address'),
    subject: z.string()
        .min(5, 'Subject must be at least 5 characters')
        .max(200, 'Subject is too long'),
    message: z.string()
        .min(20, 'Message must be at least 20 characters')
        .max(2000, 'Message is too long'),
});

/**
 * Search Schema
 */
export const searchSchema = z.object({
    query: z.string()
        .min(2, 'Search query must be at least 2 characters')
        .max(100, 'Search query is too long'),
    category: z.string().optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
}).refine((data) => {
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
    }
    return true;
}, {
    message: 'Minimum price cannot be greater than maximum price',
    path: ['minPrice'],
});

/**
 * Type exports for TypeScript
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SearchInput = z.infer<typeof searchSchema>;

/**
 * Validation helper function
 */
export const validateData = <T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
    });

    return { success: false, errors };
};
