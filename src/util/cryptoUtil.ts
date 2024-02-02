import * as fs from 'fs';
import * as crypto from 'crypto';

// Para una app de prd las llaves deben estar en un baul de secretos
function loadKeyFromFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export function encryptData(data: string): string {
  const publicKey = loadKeyFromFile('keys/public_key.pem');
  const encryptedData = crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(data, 'utf8')
  );

  return encryptedData.toString('base64');
}

export function decryptData(encryptedData: string): string {
  const privateKey = loadKeyFromFile('keys/private_key.pem');
  const decryptedData = crypto.privateDecrypt(
    { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(encryptedData, 'base64')
  );

  return decryptedData.toString('utf8');
}
