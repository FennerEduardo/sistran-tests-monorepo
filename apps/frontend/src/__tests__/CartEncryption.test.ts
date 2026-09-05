import { describe, it, expect, beforeEach } from 'vitest';
import CryptoJS from 'crypto-js';

// We simulate the AES encryption process used in CartContext
const CART_SECRET_KEY = 'Sistran_Secure_Cart_Key_2026';
const CART_STORAGE_KEY = 'sistran_cart_data';

describe('Ecommerce Cart Encryption', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should encrypt cart data securely', () => {
        const mockCart = [{ product: { id: 1, title: 'Laptop' }, quantity: 1 }];
        
        // Encrypt
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(mockCart), CART_SECRET_KEY).toString();
        
        // Assert ciphertext is not the raw JSON
        expect(ciphertext).not.toContain('Laptop');
        expect(ciphertext).not.toEqual(JSON.stringify(mockCart));
        
        // Decrypt
        const bytes = CryptoJS.AES.decrypt(ciphertext, CART_SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        
        // Assert decrypted data matches original
        expect(decryptedData).toEqual(mockCart);
    });

    it('should return empty array if decryption fails (tampered data)', () => {
        // Tamper with data
        const tamperedCiphertext = 'U2FsdGVkX1+badbadbadbadbadbad';
        
        let decryptedData = [];
        try {
            const bytes = CryptoJS.AES.decrypt(tamperedCiphertext, CART_SECRET_KEY);
            const str = bytes.toString(CryptoJS.enc.Utf8);
            if (str) {
                decryptedData = JSON.parse(str);
            }
        } catch (e) {
            decryptedData = [];
        }
        
        expect(decryptedData).toEqual([]);
    });
});
