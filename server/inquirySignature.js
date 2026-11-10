import { createHmac, timingSafeEqual } from 'node:crypto';
import { Buffer } from 'node:buffer';
export const signatureLifetime = 60000;
export function signInquiry({ method, timestamp, origin, ip = '', body = '', purpose = 'status' }, secret) {
  return createHmac('sha256', secret).update(['babylon-inquiry-transport-v1', method, purpose, String(timestamp), origin, ip, body].join('\n')).digest('hex');
}
export function verifyInquirySignature(fields, signature, secret, now = Date.now()) {
  if (typeof secret !== 'string' || Buffer.byteLength(secret) < 32 || !/^[a-f0-9]{64}$/.test(signature || '') || !/^\d{13}$/.test(String(fields.timestamp))) return false;
  if (Math.abs(now - Number(fields.timestamp)) > signatureLifetime) return false;
  const expected = Buffer.from(signInquiry(fields, secret), 'hex');
  return timingSafeEqual(expected, Buffer.from(signature, 'hex'));
}
