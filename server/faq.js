import { getApprovedFAQ } from '../src/content.js';
import { FAQ_MAX_LENGTH } from '../src/faqPolicy.js';

export const faqRequiredEnv = ['SITE_ORIGIN', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'RATE_LIMIT_SECRET'];

export function faqConfigured(env = process.env) {
  if (!faqRequiredEnv.every(key => typeof env[key] === 'string' && env[key].trim())) return false;
  try {
    const origin = new URL(env.SITE_ORIGIN);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname);
    return (origin.protocol === 'https:' || (local && origin.protocol === 'http:'))
      && origin.pathname === '/' && !origin.search && !origin.hash && !origin.username && !origin.password
      && new URL(env.UPSTASH_REDIS_REST_URL).protocol === 'https:'
      && Buffer.byteLength(env.RATE_LIMIT_SECRET.trim()) >= 32;
  } catch { return false; }
}

export function approvedEntries(entries) {
  return getApprovedFAQ(entries).filter(entry => typeof entry.id === 'string' && entry.id.trim() && entry.id.length <= 120
    && typeof entry.question === 'string' && entry.question.trim() && entry.question.trim().length <= FAQ_MAX_LENGTH);
}

export function normalizeQuestion(value) {
  return value.normalize('NFKC').toLowerCase().replace(/[‘’]/g, "'")
    .replace(/[‐‑‒–—]/g, '-').replace(/\s+/g, ' ').trim().replace(/[?!.]+$/, '').trim();
}

export function matchApprovedFAQ(message, questionId, entries) {
  const question = normalizeQuestion(message);
  // Do not guess intent, search other pages, or accept a client-supplied answer.
  // Ambiguous duplicates also require a human handoff.
  const matches = approvedEntries(entries).filter(entry => normalizeQuestion(entry.question) === question);
  if (matches.length !== 1 || (questionId !== undefined && questionId !== matches[0].id)) return null;
  return matches[0];
}
