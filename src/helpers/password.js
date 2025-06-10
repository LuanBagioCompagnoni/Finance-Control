import { scrypt, randomBytes, timingSafeEqual } from 'crypto';

export function hashPassword(password, salt) {
    return new Promise((resolve, reject) => {
        scrypt(password.normalize(), salt, 64, (err, hashedPassword) => {
            if (err) return reject(err);

            resolve(hashedPassword.toString('hex').normalize());
        });
    })
}

export function generateSalt() {
    return randomBytes(16).toString('hex').normalize();
}

export async function comparePassword(password, hashedPassword, salt) {
    const inputHashedPassword = await hashPassword(password, salt);

    return timingSafeEqual(
        Buffer.from(inputHashedPassword, 'hex'),
        Buffer.from(hashedPassword, 'hex')
    );
}
