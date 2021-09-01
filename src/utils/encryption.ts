import crypto from 'crypto';

const ALGORITHM = process.env.ENCRYPTION_ALGO || '';
const IV = process.env.ENCRYPTION_IV || '';
const KEY = process.env.ENCRYPTION_KEY || '';

export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(KEY, 'base64'),
    Buffer.from(IV, 'base64')
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

export function decrypt(text: string) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(KEY, 'base64'),
    Buffer.from(IV, 'base64')
  );
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
