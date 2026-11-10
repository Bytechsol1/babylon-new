import { createSupabaseProxy } from '../server/inquiryProxy.js';
export function createConfigHandler({ env = process.env, fetcher = fetch } = {}) {
  return createSupabaseProxy({ env, fetcher, configuration: true });
}
export default createConfigHandler();
