import { Buffer } from "node:buffer";
import { timingSafeEqual, createHmac } from "node:crypto";
import { isIP } from "node:net";
const models = ["OEM", "ODM", "Co-development", "Not sure"];
const productTypes = ["Creams", "Lotions", "Serums", "Cleansers", "Other"];
const formulaStatuses = ["Have one", "Need one", "Want to improve one"];
const quantities = ["Under 1,000 units", "1,000–4,999 units", "5,000–9,999 units", "10,000–24,999 units", "25,000+ units", "Not sure yet"];
const markets = ["US", "EU", "UK", "Canada", "Other"];
function isEmailAddress(value) {
  if (typeof value !== "string" || value.length > 254 || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(value)) return false;
  const local = value.slice(0, value.indexOf("@"));
  return local.length <= 64 && !local.startsWith(".") && !local.endsWith(".") && !local.includes("..");
}
function normalizeInquiry(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return data;
  const normalized = { ...data };
  for (const field of ["otherProduct", "formula", "quantity", "launch", "message", "website"]) if (normalized[field] === void 0) normalized[field] = "";
  if (normalized.markets === void 0) normalized.markets = [];
  for (const field of ["name", "email", "company", "otherProduct", "message", "website"]) if (typeof normalized[field] === "string") normalized[field] = normalized[field].trim();
  return normalized;
}
function validateInquiry(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "Please complete the required project details.";
  for (const [field, max] of [["name", 120], ["email", 254], ["company", 160], ["message", 3e3]]) {
    if (typeof data[field] !== "string" || data[field].length > max || field !== "message" && !data[field].trim()) return `Please check the ${field === "company" ? "brand/company" : field} field.`;
  }
  if (["name", "email", "company"].some((field) => /[\x00-\x1f\x7f]/.test(data[field]))) return "Please keep your name, email, and brand/company on a single line.";
  if (!isEmailAddress(data.email)) return "Please enter a valid work email address.";
  if (!models.includes(data.model)) return "Please choose how you want to work.";
  if (!productTypes.includes(data.product)) return "Please choose a product type.";
  if (typeof data.otherProduct !== "string" || data.otherProduct.length > 160 || data.product === "Other" && !data.otherProduct.trim()) return "Please describe your other product type.";
  if (typeof data.formula !== "string" || data.formula && !formulaStatuses.includes(data.formula)) return "Please check the formula status.";
  if (typeof data.quantity !== "string" || data.quantity && !quantities.includes(data.quantity)) return "Please choose a quantity range.";
  if (typeof data.launch !== "string") return "Please check the target launch month and year.";
  if (data.launch && (typeof data.launch !== "string" || !/^20\d{2}-(0[1-9]|1[0-2])$/.test(data.launch))) return "Please check the target launch month and year.";
  if (!Array.isArray(data.markets) || data.markets.length > markets.length || data.markets.some((market) => !markets.includes(market))) return "Please check the selected markets.";
  if (typeof data.website !== "string" || data.website.length > 200) return "This inquiry could not be processed.";
  return null;
}
const signatureLifetime = 6e4;
function signInquiry({ method, timestamp, origin, ip = "", body = "", purpose = "status" }, secret) {
  return createHmac("sha256", secret).update(["babylon-inquiry-transport-v1", method, purpose, String(timestamp), origin, ip, body].join("\n")).digest("hex");
}
function verifyInquirySignature(fields, signature, secret, now = Date.now()) {
  if (typeof secret !== "string" || Buffer.byteLength(secret) < 32 || !/^[a-f0-9]{64}$/.test(signature || "") || !/^\d{13}$/.test(String(fields.timestamp))) return false;
  if (Math.abs(now - Number(fields.timestamp)) > signatureLifetime) return false;
  const expected = Buffer.from(signInquiry(fields, secret), "hex");
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}
function respond(status, body, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers } });
}
async function readBody(request) {
  if (Number(request.headers.get("content-length") || 0) > 12e3) throw new Error("too_large");
  const chunks = [];
  let size = 0;
  const reader = request.body?.getReader();
  if (!reader) return "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 12e3) {
        await reader.cancel();
        throw new Error("too_large");
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks).toString("utf8");
}
function databaseKey(env) {
  if (env?.SUPABASE_SECRET_KEYS) {
    try {
      const values = Object.values(JSON.parse(env.SUPABASE_SECRET_KEYS));
      const key = values.find((value) => typeof value === "string" && value.startsWith("sb_secret_"));
      if (key) return key;
    } catch {
    }
  }
  return env?.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
}
function databaseReady(env) {
  try {
    return new URL(env?.SUPABASE_URL).protocol === "https:" && Boolean(databaseKey(env));
  } catch {
    return false;
  }
}
function digest(value, secret) {
  return createHmac("sha256", secret).update(value).digest("hex");
}
async function storeInquiry({ env, fetcher, data, ip }) {
  const key = databaseKey(env);
  const sessionHash = digest(data.sessionId, env.RATE_LIMIT_SECRET.trim());
  const sourceHash = digest(ip, env.RATE_LIMIT_SECRET.trim());
  const submissionKey = digest(JSON.stringify({ ...data, website: void 0, sessionId: void 0 }), `${env.RATE_LIMIT_SECRET.trim()}:${data.sessionId}`);
  const headers = { apikey: key, "Content-Type": "application/json", Prefer: "return=representation" };
  if (!key.startsWith("sb_secret_")) headers.Authorization = `Bearer ${key}`;
  const response = await fetcher(new URL("/rest/v1/rpc/submit_contact_inquiry", env.SUPABASE_URL), {
    method: "POST",
    headers,
    signal: AbortSignal.timeout(15e3),
    body: JSON.stringify({
      p_name: data.name,
      p_work_email: data.email,
      p_brand_company: data.company,
      p_work_model: data.model,
      p_product_type: data.product,
      p_other_product_type: data.otherProduct || null,
      p_formula_status: data.formula || null,
      p_quantity_estimate: data.quantity || null,
      p_target_launch: data.launch || null,
      p_target_markets: data.markets,
      p_message: data.message || null,
      p_submission_key: submissionKey,
      p_source_ip_hash: sourceHash,
      p_session_hash: sessionHash
    })
  });
  const text = await response.text();
  let result = null;
  try {
    result = text ? JSON.parse(text) : null;
  } catch {
  }
  if (response.ok && (typeof result === "number" || Array.isArray(result) || result?.id)) return { success: true };
  if (response.status === 429 || result?.message === "contact_rate_limited") return { rateLimited: true };
  return { success: false };
}
function createSupabaseInquiryHandler({ env, fetcher = fetch, now = Date.now } = {}) {
  return async (request) => {
    if (!["GET", "POST"].includes(request.method)) return respond(405, { error: "Method not allowed." }, { Allow: "GET, POST" });
    if (!env?.RATE_LIMIT_SECRET || Buffer.byteLength(env.RATE_LIMIT_SECRET.trim()) < 32) return respond(503, { error: "Secure submission is not configured." });
    let body;
    try {
      body = request.method === "POST" ? await readBody(request) : "";
    } catch {
      return respond(413, { error: "The request is too large." });
    }
    const origin = request.headers.get("x-inquiry-origin") || "";
    const ip = request.headers.get("x-inquiry-ip") || "";
    const purpose = request.headers.get("x-inquiry-purpose") || "status";
    if (!["status", "audit"].includes(purpose)) return respond(401, { error: "Unauthorized request." });
    const fields = { method: request.method, timestamp: request.headers.get("x-inquiry-timestamp"), origin, ip, body, purpose };
    if (!verifyInquirySignature(fields, request.headers.get("x-inquiry-signature"), env.RATE_LIMIT_SECRET.trim(), now())) return respond(401, { error: "Unauthorized request." });
    if (origin !== env.SITE_ORIGIN?.trim()) return respond(403, { error: "This request origin is not allowed." });
    if (request.method === "GET") return respond(200, { mode: databaseReady(env) ? "live" : "preview", ...purpose === "audit" ? { diagnostics: { database: databaseReady(env) ? "configured" : "missing_configuration" } } : {} });
    if (purpose !== "status") return respond(401, { error: "Unauthorized request." });
    if (!isIP(ip)) return respond(400, { error: "Secure request identity is missing." });
    if (!databaseReady(env)) return respond(503, { error: "Secure inquiry storage is not configured." });
    let data;
    try {
      data = normalizeInquiry(JSON.parse(body));
    } catch {
      return respond(400, { error: "Please check your project details." });
    }
    const invalid = validateInquiry(data);
    if (invalid) return respond(400, { error: invalid });
    if (data.website) return respond(400, { error: "This inquiry could not be processed." });
    if (typeof data.sessionId !== "string" || !/^[a-zA-Z0-9-]{16,80}$/.test(data.sessionId)) return respond(400, { error: "Please refresh the form and try again." });
    try {
      const stored = await storeInquiry({ env, fetcher, data, ip });
      if (stored.success) return respond(200, { success: true });
      if (stored.rateLimited) return respond(429, { error: "Too many attempts. Please try again in 15 minutes." }, { "Retry-After": "900" });
    } catch {
    }
    return respond(503, { error: "Your inquiry could not be saved. Please try again." });
  };
}
export {
  createSupabaseInquiryHandler
};
