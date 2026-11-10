import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInquiry, validateInquiry } from '../src/inquirySchema.js';

const valid = () => ({ name: 'Owner', email: 'owner@example.com', company: 'Brand', model: 'OEM', product: 'Creams', otherProduct: '', formula: '', quantity: '', launch: '', markets: [], message: '', website: '' });

test('only the five business fields are required and optional fields normalize safely', () => {
  assert.equal(validateInquiry(valid()), null);
  const normalized = normalizeInquiry({ name: ' Owner ', email: 'owner@example.com', company: ' Brand ', model: 'OEM', product: 'Creams' });
  assert.equal(normalized.name, 'Owner'); assert.equal(normalized.company, 'Brand'); assert.deepEqual(normalized.markets, []);
  assert.equal(validateInquiry(normalized), null);
});

test('required fields, allowlists, lengths and email format are enforced', () => {
  for (const change of [{ name: '' }, { email: 'bad' }, { company: '' }, { model: 'Unsupported' }, { product: 'Unsupported' }, { message: 'x'.repeat(3001) }, { launch: 'tomorrow' }, { markets: ['Unknown'] }]) {
    assert.equal(typeof validateInquiry({ ...valid(), ...change }), 'string');
  }
});

test('honeypot shape and conditional other-product field remain validated', () => {
  assert.equal(typeof validateInquiry({ ...valid(), website: 'bot'.repeat(100) }), 'string');
  assert.equal(typeof validateInquiry({ ...valid(), product: 'Other', otherProduct: '' }), 'string');
  assert.equal(validateInquiry({ ...valid(), product: 'Other', otherProduct: 'Balm' }), null);
});
