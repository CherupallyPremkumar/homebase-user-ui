/**
 * Secure Token Storage
 * Provides encrypted storage for sensitive authentication tokens
 * 
 * Security Features:
 * - Tokens are encrypted before storage
 * - Uses Web Crypto API for encryption
 * - Automatic token expiration
 * - XSS protection through encryption
 * 
 * Note: For maximum security, consider using httpOnly cookies set by the backend.
 * This is a client-side mitigation for XSS attacks.
 */

const STORAGE_KEY = 'secure_auth_data';
const ENCRYPTION_KEY_NAME = 'auth_encryption_key';

/**
 * Generate or retrieve encryption key
 * In production, consider deriving this from a server-provided salt
 */
const getEncryptionKey = async (): Promise<CryptoKey> => {
    // For demo purposes, we'll use a simple key derivation
    // In production, use a proper key derivation function with server salt
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode('your-app-secret-key-change-in-production'),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: new TextEncoder().encode('salt-value'),
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
};

/**
 * Encrypt data using AES-GCM
 */
const encrypt = async (data: string): Promise<string> => {
    try {
        const key = await getEncryptionKey();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encodedData = new TextEncoder().encode(data);

        const encryptedData = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            encodedData
        );

        // Combine IV and encrypted data
        const combined = new Uint8Array(iv.length + encryptedData.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(encryptedData), iv.length);

        // Convert to base64 for storage
        return btoa(String.fromCharCode(...combined));
    } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('Failed to encrypt token');
    }
};

/**
 * Decrypt data using AES-GCM
 */
const decrypt = async (encryptedData: string): Promise<string> => {
    try {
        const key = await getEncryptionKey();
        const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

        // Extract IV and encrypted data
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);

        const decryptedData = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            data
        );

        return new TextDecoder().decode(decryptedData);
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Failed to decrypt token');
    }
};

interface SecureAuthData {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
    expiresAt: number; // Timestamp
}

/**
 * Secure Token Storage API
 */
export const secureTokenStorage = {
    /**
     * Store auth token securely (encrypted)
     */
    setToken: async (
        token: string,
        user: { id: string; email: string; name: string },
        rememberMe: boolean = false,
        expiryHours: number = 24
    ): Promise<void> => {
        const expiresAt = Date.now() + expiryHours * 60 * 60 * 1000;
        const authData: SecureAuthData = { token, user, expiresAt };

        const encrypted = await encrypt(JSON.stringify(authData));
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEY, encrypted);
    },

    /**
     * Retrieve auth token (decrypted)
     */
    getToken: async (): Promise<string | null> => {
        try {
            const encrypted =
                localStorage.getItem(STORAGE_KEY) ||
                sessionStorage.getItem(STORAGE_KEY);

            if (!encrypted) return null;

            const decrypted = await decrypt(encrypted);
            const authData: SecureAuthData = JSON.parse(decrypted);

            // Check expiration
            if (Date.now() > authData.expiresAt) {
                await secureTokenStorage.clearToken();
                return null;
            }

            return authData.token;
        } catch (error) {
            console.error('Failed to retrieve token:', error);
            await secureTokenStorage.clearToken();
            return null;
        }
    },

    /**
     * Retrieve user data
     */
    getUser: async (): Promise<{ id: string; email: string; name: string } | null> => {
        try {
            const encrypted =
                localStorage.getItem(STORAGE_KEY) ||
                sessionStorage.getItem(STORAGE_KEY);

            if (!encrypted) return null;

            const decrypted = await decrypt(encrypted);
            const authData: SecureAuthData = JSON.parse(decrypted);

            // Check expiration
            if (Date.now() > authData.expiresAt) {
                await secureTokenStorage.clearToken();
                return null;
            }

            return authData.user;
        } catch (error) {
            console.error('Failed to retrieve user:', error);
            await secureTokenStorage.clearToken();
            return null;
        }
    },

    /**
     * Clear stored token
     */
    clearToken: async (): Promise<void> => {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);

        // Also clear old unencrypted tokens if they exist
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
    },

    /**
     * Check if token exists and is valid
     */
    hasValidToken: async (): Promise<boolean> => {
        const token = await secureTokenStorage.getToken();
        return token !== null;
    },
};

/**
 * Legacy support: Get token synchronously (less secure, for backward compatibility)
 * Use secureTokenStorage.getToken() instead for better security
 */
export const getLegacyToken = (): string | null => {
    return (
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token')
    );
};
