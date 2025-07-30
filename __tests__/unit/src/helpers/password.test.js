import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword, generateSalt } from '../../../../src/helpers/password.js';

describe('PasswordHelper', () => {
    it('hashPassword - returns expected hash for fixed input', async () => {
        const hashedPassword = await hashPassword('password', '7796b0b16628f80faf45b9a4d7ccde55');

        const expectedHashedPassword = 'b52737f68ae0b4a1b78ae0104b55bc72443acbdd986bf84513009c1bae42eb469e8d66a74be725bd0297fcee6fdd372f9d3baba0db9c46d6c55e42e4db94ae33';

        expect(hashedPassword).toBe(expectedHashedPassword);
    });

    describe('comparePassword', () => {
        it('should returns true for correct password', async () => {
            const password = 'password';
            const salt = '7796b0b16628f80faf45b9a4d7ccde55';
            const hashedPassword = await hashPassword(password, salt);

            const isPasswordsEqual = await comparePassword(password, hashedPassword, salt);

            expect(isPasswordsEqual).toBeTruthy();
        });

        it('should return false for different passwords', async () => {
            const differentPassword = 'differentPassword';
            const salt = '7796b0b16628f80faf45b9a4d7ccde55';
            const hashedPassword = await hashPassword('password', salt);

            const isPasswordsEqual = await comparePassword(differentPassword, hashedPassword, salt);

            expect(isPasswordsEqual).toBeFalsy();
        });
    });

    describe('generateSalt', () => {
        it('should return a 32-character hex string', () => {
            const salt = generateSalt();

            expect(typeof salt).toBe('string');
            expect(salt.length).toBe(32);
            expect(salt).toMatch(/^[a-f0-9]+$/i);
        });

        it('should return different salts on multiple calls', () => {
            const salt1 = generateSalt();
            const salt2 = generateSalt();

            expect(salt1).not.toBe(salt2);
        });
    });
});
