export const models = ['OEM', 'ODM', 'Co-development', 'Not sure'];
export const productTypes = ['Creams', 'Lotions', 'Serums', 'Cleansers', 'Other'];
export const formulaStatuses = ['Have one', 'Need one', 'Want to improve one'];
// Planning ranges only. These are not minimum order quantities or accepted order sizes.
export const quantities = ['Under 1,000 units', '1,000–4,999 units', '5,000–9,999 units', '10,000–24,999 units', '25,000+ units', 'Not sure yet'];
export const markets = ['US', 'EU', 'UK', 'Canada', 'Other'];
export function isEmailAddress(value) {
  if (typeof value !== 'string' || value.length > 254 || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(value)) return false;
  const local = value.slice(0, value.indexOf('@'));
  return local.length <= 64 && !local.startsWith('.') && !local.endsWith('.') && !local.includes('..');
}
export function normalizeInquiry(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
  const normalized = { ...data };
  for (const field of ['otherProduct', 'formula', 'quantity', 'launch', 'message', 'website']) if (normalized[field] === undefined) normalized[field] = '';
  if (normalized.markets === undefined) normalized.markets = [];
  for (const field of ['name', 'email', 'company', 'otherProduct', 'message', 'website']) if (typeof normalized[field] === 'string') normalized[field] = normalized[field].trim();
  return normalized;
}
export function validateInquiry(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'Please complete the required project details.';
  for (const [field, max] of [['name', 120], ['email', 254], ['company', 160], ['message', 3000]]) {
    if (typeof data[field] !== 'string' || data[field].length > max || (field !== 'message' && !data[field].trim())) return `Please check the ${field === 'company' ? 'brand/company' : field} field.`;
  }
  if (['name', 'email', 'company'].some(field => /[\x00-\x1f\x7f]/.test(data[field]))) return 'Please keep your name, email, and brand/company on a single line.';
  if (!isEmailAddress(data.email)) return 'Please enter a valid work email address.';
  if (!models.includes(data.model)) return 'Please choose how you want to work.';
  if (!productTypes.includes(data.product)) return 'Please choose a product type.';
  if (typeof data.otherProduct !== 'string' || data.otherProduct.length > 160 || (data.product === 'Other' && !data.otherProduct.trim())) return 'Please describe your other product type.';
  if (typeof data.formula !== 'string' || (data.formula && !formulaStatuses.includes(data.formula))) return 'Please check the formula status.';
  if (typeof data.quantity !== 'string' || (data.quantity && !quantities.includes(data.quantity))) return 'Please choose a quantity range.';
  if (typeof data.launch !== 'string') return 'Please check the target launch month and year.';
  if (data.launch && (typeof data.launch !== 'string' || !/^20\d{2}-(0[1-9]|1[0-2])$/.test(data.launch))) return 'Please check the target launch month and year.';
  if (!Array.isArray(data.markets) || data.markets.length > markets.length || data.markets.some(market => !markets.includes(market))) return 'Please check the selected markets.';
  if (typeof data.website !== 'string' || data.website.length > 200) return 'This inquiry could not be processed.';
  return null;
}
export function inquiryText(data) {
  return ['BABYLON — PROJECT INQUIRY', '', `Name: ${data.name}`, `Work email: ${data.email}`, `Brand/company: ${data.company}`, `Way of working: ${data.model}`, `Product: ${data.product}${data.product === 'Other' ? ` — ${data.otherProduct}` : ''}`, `Formula: ${data.formula || 'Not provided'}`, `First order estimate: ${data.quantity || 'Not provided'}`, `Target launch: ${data.launch || 'Not provided'}`, `Markets: ${data.markets.join(', ') || 'Not provided'}`, '', 'MESSAGE', data.message || 'Not provided'].join('\n');
}
