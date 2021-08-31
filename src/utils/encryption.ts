import crypto from 'crypto';

const ALGORITHM = process.env.ENCRYPTION_ALGO || '';
const IV = process.env.ENCRYPTION_IV || '';
const KEY = process.env.ENCRYPTION_KEY || '';

export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted.toString('utf-8');
}

export function decrypt(text: string) {
  const encryptedText = Buffer.from(text, 'utf-8');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
