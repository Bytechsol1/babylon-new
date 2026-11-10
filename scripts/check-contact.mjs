import { loadEnv } from 'vite';
import { proxyConfigIssues, proxyRequiredEnv, callInquiryFunction } from '../server/inquiryProxy.js';

try {
  const env = { ...loadEnv(process.env.NODE_ENV || 'development', process.cwd(), ''), ...process.env };
  const issues = proxyConfigIssues(env);
  const report = { backend: 'supabase_database', required: proxyRequiredEnv, ...issues, proxyConfigurationValid: !issues.missing.length && !issues.invalid.length, edgeFunction: 'not_checked', database: 'unverified', emailDeliveryUsed: false };
  if (report.proxyConfigurationValid) {
    try {
      const response = await callInquiryFunction({ env, method: 'GET', purpose: 'audit' });
      report.edgeFunction = response.status === 404 ? 'not_deployed' : response.status === 401 || response.status === 403 ? 'signature_or_gateway_rejected' : response.ok ? 'reachable' : 'unavailable';
      const body = await response.json();
      if (response.ok && body?.diagnostics?.database) report.database = body.diagnostics.database;
    } catch { report.edgeFunction = 'unavailable'; }
  }
  console.log(JSON.stringify(report, null, 2));
  if (!report.proxyConfigurationValid || report.edgeFunction !== 'reachable' || report.database !== 'configured') process.exitCode = 1;
} catch {
  console.error('Contact database configuration check could not complete. No inquiry was submitted.');
  process.exitCode = 1;
}
