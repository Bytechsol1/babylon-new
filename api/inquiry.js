import { createSupabaseProxy } from '../server/inquiryProxy.js';

export function createInquiryHandler(options = {}) {
  const env = options.env || process.env;
  return createSupabaseProxy({ ...options, env });
}
export default createInquiryHandler();
