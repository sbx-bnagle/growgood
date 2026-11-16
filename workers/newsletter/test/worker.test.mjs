// Tests for the newsletter Worker, with Google and MailerLite replaced by stand-ins.
// Run: node --test workers/newsletter/test/

import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';

const ENV = { MAILERLITE_TOKEN: 'test-mailerlite-token', RECAPTCHA_SECRET: 'test-recaptcha-secret', ALLOWED_HOSTS: 'growgoodgardens.com' };
const HUMAN = { success: true, score: 0.9, action: 'subscribe', hostname: 'growgoodgardens.com' };

let calls;
let captcha;
let mailerliteStatus;
beforeEach(() => {
  calls = [];
  captcha = HUMAN;
  mailerliteStatus = 201;
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).startsWith('https://www.google.com/recaptcha/api/siteverify')) return new Response(JSON.stringify(captcha), { headers: { 'Content-Type': 'application/json' } });
    if (String(url) === 'https://connect.mailerlite.com/api/subscribers') return new Response('{}', { status: mailerliteStatus });
    throw new Error(`unexpected fetch ${url}`);
  };
});

const post = (body, headers = { Origin: 'https://growgoodgardens.com' }) =>
  new Request('https://growgoodgardens.com/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
const run = async (req, env = ENV) => {
  const res = await worker.fetch(req, env);
  return { status: res.status, body: await res.json() };
};

test('adds a subscriber after a passing reCAPTCHA check', async () => {
  const r = await run(post({ email: ' reader@example.com ', token: 'tok' }));
  assert.deepEqual(r, { status: 200, body: { ok: true } });
  assert.equal(calls.length, 2);
  const verify = new URLSearchParams(calls[0].init.body);
  assert.equal(verify.get('secret'), 'test-recaptcha-secret');
  assert.equal(verify.get('response'), 'tok');
  assert.equal(calls[1].init.headers.Authorization, 'Bearer test-mailerlite-token');
  assert.deepEqual(JSON.parse(calls[1].init.body), { email: 'reader@example.com' });
});

test('adds the group when one is set', async () => {
  await run(post({ email: 'reader@example.com', token: 'tok' }), { ...ENV, MAILERLITE_GROUP_ID: '12345' });
  assert.deepEqual(JSON.parse(calls[1].init.body), { email: 'reader@example.com', groups: ['12345'] });
});

test('refuses anything but POST', async () => {
  const r = await run(new Request('https://growgoodgardens.com/api/newsletter'));
  assert.equal(r.status, 405);
  assert.equal(calls.length, 0);
});

test('refuses another site', async () => {
  const r = await run(post({ email: 'reader@example.com', token: 'tok' }, { Origin: 'https://elsewhere.example' }));
  assert.deepEqual(r, { status: 403, body: { ok: false, error: 'origin' } });
  assert.equal(calls.length, 0);
});

test('refuses a bad email without calling out', async () => {
  for (const email of ['', 'no-at-sign', 'a@b', 'x'.repeat(250) + '@example.com']) {
    const r = await run(post({ email, token: 'tok' }));
    assert.deepEqual(r, { status: 400, body: { ok: false, error: 'email' } }, email);
  }
  assert.equal(calls.length, 0);
});

test('refuses a missing token, a malformed body, and missing secrets', async () => {
  assert.equal((await run(post({ email: 'reader@example.com' }))).body.error, 'captcha');
  assert.equal((await run(post('not json'))).body.error, 'body');
  assert.equal((await run(post({ email: 'reader@example.com', token: 'tok' }), { ALLOWED_HOSTS: 'growgoodgardens.com' })).body.error, 'config');
  assert.equal(calls.length, 0);
});

test('refuses a failed, low-scoring, wrong-action or wrong-host reCAPTCHA', async () => {
  for (const bad of [
    { ...HUMAN, success: false },
    { ...HUMAN, score: 0.2 },
    { ...HUMAN, action: 'login' },
    { ...HUMAN, hostname: 'elsewhere.example' },
  ]) {
    captcha = bad;
    const r = await run(post({ email: 'reader@example.com', token: 'tok' }));
    assert.deepEqual(r, { status: 403, body: { ok: false, error: 'captcha' } }, JSON.stringify(bad));
  }
  assert.ok(calls.every((c) => !c.url.includes('mailerlite')));
});

test('reports MailerLite rejections', async () => {
  mailerliteStatus = 422;
  assert.deepEqual(await run(post({ email: 'reader@example.com', token: 'tok' })), { status: 400, body: { ok: false, error: 'email' } });
  mailerliteStatus = 500;
  assert.deepEqual(await run(post({ email: 'reader@example.com', token: 'tok' })), { status: 502, body: { ok: false, error: 'upstream' } });
});
