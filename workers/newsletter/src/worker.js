// Newsletter sign-up for growgoodgardens.com, served at /api/newsletter (see wrangler.toml).
//
// The site's subscribe forms post { email, token } here. The Worker checks the reCAPTCHA token
// with Google, then adds the subscriber in MailerLite. The MailerLite API token and the
// reCAPTCHA secret are Worker secrets, set with `npx wrangler secret put`, so neither is ever in
// the site's code or the browser.
//
// Replies with JSON: { ok: true } or { ok: false, error } where error is one of
// method, origin, body, email, captcha, config, upstream. Each refusal past the email check is
// logged with its reason (see `wrangler tail`); the email address and the token never are.

const SITEVERIFY = 'https://www.google.com/recaptcha/api/siteverify';
const MAILERLITE = 'https://connect.mailerlite.com/api/subscribers';
const ACTION = 'subscribe';     // the action the site passes to grecaptcha.execute
const MIN_SCORE = 0.5;          // reCAPTCHA v3 score below which a sign-up is refused
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...headers } });

const refuse = (reason, detail) => console.log(JSON.stringify({ refused: reason, ...detail }));

const allowedHosts = (env) =>
  String(env.ALLOWED_HOSTS || 'growgoodgardens.com').split(',').map((h) => h.trim()).filter(Boolean);

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405, { Allow: 'POST' });

    const hosts = allowedHosts(env);
    const origin = request.headers.get('Origin');
    if (origin) {
      let host = '';
      try { host = new URL(origin).hostname; } catch { /* malformed origin */ }
      if (!hosts.includes(host)) { refuse('origin', { host }); return json({ ok: false, error: 'origin' }, 403); }
    }

    if (!env.MAILERLITE_TOKEN || !env.RECAPTCHA_SECRET) {
      refuse('config', { mailerlite: !!env.MAILERLITE_TOKEN, recaptcha: !!env.RECAPTCHA_SECRET });
      return json({ ok: false, error: 'config' }, 500);
    }

    let body;
    try { body = await request.json(); } catch { return json({ ok: false, error: 'body' }, 400); }
    const email = String((body && body.email) || '').trim();
    const token = String((body && body.token) || '');
    if (!EMAIL.test(email) || email.length > 254) return json({ ok: false, error: 'email' }, 400);
    if (!token) return json({ ok: false, error: 'captcha' }, 400);

    const verify = await fetch(SITEVERIFY, {
      method: 'POST',
      body: new URLSearchParams({
        secret: env.RECAPTCHA_SECRET,
        response: token,
        remoteip: request.headers.get('CF-Connecting-IP') || '',
      }),
    });
    const check = await verify.json().catch(() => ({}));
    const human = check.success === true
      && hosts.includes(check.hostname)
      && (check.score === undefined || (check.score >= MIN_SCORE && check.action === ACTION));
    if (!human) {
      refuse('captcha', { success: check.success, score: check.score, action: check.action, hostname: check.hostname, errors: check['error-codes'] });
      return json({ ok: false, error: 'captcha' }, 403);
    }

    const subscriber = { email };
    if (env.MAILERLITE_GROUP_ID) subscriber.groups = [String(env.MAILERLITE_GROUP_ID)];
    const added = await fetch(MAILERLITE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${env.MAILERLITE_TOKEN}`,
      },
      body: JSON.stringify(subscriber),
    });
    if (!added.ok) {
      const reply = await added.text().catch(() => '');
      let message = '';
      try { message = JSON.parse(reply).message || ''; } catch { /* not JSON */ }
      refuse('mailerlite', { status: added.status, message: String(message).slice(0, 200) });
      return added.status === 422 ? json({ ok: false, error: 'email' }, 400) : json({ ok: false, error: 'upstream' }, 502);
    }
    return json({ ok: true });
  },
};
