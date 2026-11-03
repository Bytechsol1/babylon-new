import { faq, company } from '../src/content.js';
import { FAQ_MAX_LENGTH, FAQ_REQUEST_LIMIT, FAQ_WINDOW_SECONDS } from '../src/faqPolicy.js';
import { approvedEntries, faqConfigured, matchApprovedFAQ, normalizeQuestion } from '../server/faq.js';
import { matchFAQWithOpenAI } from '../server/faqOpenAI.js';
import { checkOrigin, reply, readJSON, rateLimit, redis } from '../server/security.js';

const handoff = { handoff: '/contact', email: company.email };
const prototypeError = 'The FAQ assistant is a prototype and is not live. Approved FAQ answers and a configured backend are required.';

export function createFAQHandler({ env = process.env, fetcher = fetch, entries = faq, now = Date.now } = {}) {
  let lastHealthyAt = null;

  return async function handler(req, res) {
    if (!['GET', 'POST'].includes(req.method)) {
      res.setHeader('Allow', 'GET, POST');
      return reply(res, 405, { error: 'Method not allowed.' });
    }
    const approved = approvedEntries(entries);
    const configured = faqConfigured(env);

    if (req.method === 'GET') {
      const readiness = { approvedFAQ: approved.length > 0, backendConfigured: configured };
      if (!approved.length || !configured) return reply(res, 200, {
        mode: 'prototype', readiness, approvedCount: approved.length, questions: [],
        maxMessageLength: FAQ_MAX_LENGTH, message: prototypeError, ...handoff,
      });
      try {
        // Report ready only after the actual server-side rate-limit service responds.
        // Cache only successful health checks briefly to keep public status requests cheap.
        if (lastHealthyAt === null || now() - lastHealthyAt >= 30000) {
          if (await redis(['PING'], env, fetcher) !== 'PONG') throw new Error('Health check failed');
          lastHealthyAt = now();
        }
        return reply(res, 200, {
          mode: 'ready', readiness, approvedCount: approved.length,
          usesAI: Boolean(env.OPENAI_API_KEY?.trim()),
          questions: approved.map(({ id, question }) => ({ id, question })),
          maxMessageLength: FAQ_MAX_LENGTH, ...handoff,
        });
      } catch {
        lastHealthyAt = null;
        return reply(res, 503, { mode: 'unavailable', error: 'The FAQ service is temporarily unavailable. Please contact Babylon.', ...handoff });
      }
    }

    if (!approved.length || !configured) return reply(res, 503, { code: 'FAQ_NOT_READY', mode: 'prototype', error: prototypeError, ...handoff });
    if (!checkOrigin(req, env)) return reply(res, 403, { error: 'This request origin is not allowed.', ...handoff });
    try {
      const data = await readJSON(req);
      if (!data || typeof data.message !== 'string' || !data.message.trim() || data.message.length > FAQ_MAX_LENGTH) {
        return reply(res, 400, { error: `Questions must contain 1–${FAQ_MAX_LENGTH} characters.`, ...handoff });
      }
      if (typeof data.sessionId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(data.sessionId)
        || (data.questionId !== undefined && (typeof data.questionId !== 'string' || data.questionId.length > 120))) {
        return reply(res, 400, { error: 'Please refresh the assistant and try again.', ...handoff });
      }
      if (!await rateLimit(req, data.sessionId, 'faq', FAQ_REQUEST_LIMIT, FAQ_WINDOW_SECONDS, env, fetcher)) {
        res.setHeader('Retry-After', String(FAQ_WINDOW_SECONDS));
        return reply(res, 429, { code: 'FAQ_RATE_LIMITED', retryAfter: FAQ_WINDOW_SECONDS, error: 'The question limit has been reached. Please contact Babylon or try again later.', ...handoff });
      }
      lastHealthyAt = now();
      let entry = matchApprovedFAQ(data.message.trim(), data.questionId, approved);
      // Explicit IDs and ambiguous exact matches cannot be overridden by AI.
      if (!entry && data.questionId === undefined && !approved.some(item => normalizeQuestion(item.question) === normalizeQuestion(data.message))) {
        entry = await matchFAQWithOpenAI(data.message.trim(), approved, env, fetcher);
      }
      if (entry) return reply(res, 200, { matched: true, answer: entry.answer, reviewedAt: entry.reviewedAt, faqId: entry.id });
      // Redis contains counters only. No application question/history logs are written.
      return reply(res, 200, { matched: false, answer: null, message: 'No approved FAQ answer is available for this question. Please contact Babylon.', ...handoff });
    } catch (error) {
      lastHealthyAt = null;
      return reply(res, error.status || 503, {
        ...(error.status ? {} : { mode: 'unavailable' }),
        error: error.status ? error.message : 'The FAQ service is temporarily unavailable. Please contact Babylon.', ...handoff,
      });
    }
  };
}

export default createFAQHandler();
