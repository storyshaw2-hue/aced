'use strict';

// Tests for aced-analytics.js (CYCLE-0-BET, Slice 1: outbound boundary).
// Run: node aced-analytics.test.js

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'aced-analytics.js'), 'utf8');
const flagLine = 'const ACED_ANALYTICS_ENABLED = false;';
assert.equal(source.split(flagLine).length, 2, 'flag must be exactly one literal false in source');

function load(flag, options = {}) {
  const calls = [];
  let listeners = 0;
  let writes = 0;
  const storage = {
    getItem() { throw Error('storage unavailable'); },
    setItem() { writes++; throw Error('storage full'); }
  };
  const root = {
    ACED_ANALYTICS_ENABLED: options.globalFlag,
    localStorage: storage,
    location: { href: 'https://acedhq.com/study.html?pack=pack-my-notes-ab12cd34#notes=secret' },
    document: { referrer: 'https://example.com/private?email=person@example.com' },
    addEventListener() { listeners++; },
    fetch(url, init) {
      calls.push({ url, init });
      if (options.fetchThrows) throw Error('offline');
      return options.fetchRejects ? Promise.reject(Error('offline')) : Promise.resolve({ ok: true });
    }
  };
  const code = source.replace(flagLine, 'const ACED_ANALYTICS_ENABLED = ' + flag + ';');
  vm.runInNewContext(code, { window: root }, { filename: 'aced-analytics.js' });
  return { api: root.ACEDAnalytics, calls, listeners: () => listeners, writes: () => writes };
}

function emit(env, name, props, p = '/study.html') { env.api.emit(name, props, p); }

// Test 1: only the source-code literal `true` enables outbound analytics.
for (const globalFlag of [undefined, false, 'true', null, { value: true }, true]) {
  const env = load('false', { globalFlag });
  assert.equal(env.api.enabled, false);
  emit(env, 'run_started', { pack_kind: 'starter' });
  assert.equal(env.calls.length, 0);
  assert.equal(env.listeners(), 0);
  assert.equal(env.writes(), 0);
}
for (const malformed of ['undefined', 'null', '"true"', '({ value: true })', '1']) {
  const env = load(malformed);
  assert.equal(env.api.enabled, false);
  emit(env, 'landing_viewed', undefined, '/index.html');
  assert.equal(env.calls.length, 0);
  assert.equal(env.listeners(), 0);
  assert.equal(env.writes(), 0);
}
console.log('PASS Test 1: OFF flag, zero side effects');

// Test 2: fixed schema, fixed URL, privacy-preserving request options.
const env = load('true');
assert.equal(env.api.enabled, true);
const valid = [
  ['landing_viewed', undefined, '/index.html'],
  ['demo_started', {}, '/aced-arcade.html'],
  ['demo_finished', {}, '/aced-arcade.html'],
  ['deck_compiled', { source: 'paste', count_bucket: '2-5' }, '/importer.html'],
  ['run_started', { pack_kind: 'user_pack' }, '/study.html'],
  ['run_finished', { pack_kind: 'demo' }, '/aced-arcade.html'],
  ['returned', { dayIndex: 7, segment: 'byo' }, '/study.html'],
  ['byo_repeat', { days_bucket: '3+' }, '/study.html'],
  ['email_captured', { source: 'home' }, '/index.html'],
  ['library_pack_started', { library_id: 'cpa-far' }, '/library.html']
];
for (const [n, pr, p] of valid) emit(env, n, pr, p);
assert.equal(env.calls.length, valid.length);

const hostile = [
  ['quiz_answered', { topic: 'private notes' }, '/study.html'],
  ['tbs_completed', {}, '/study.html'],
  ['run_start', {}, '/study.html'],
  ['run_started', { pack_kind: 'pack-my-notes-ab12cd34' }, '/study.html'],
  ['run_started', { pack_kind: 'starter', topic: 'private notes' }, '/study.html'],
  ['email_captured', { source: 'person@example.com' }, '/index.html'],
  ['deck_compiled', { source: 'my-file.csv', count_bucket: '1' }, '/importer.html'],
  ['landing_viewed', { email: 'person@example.com' }, '/index.html'],
  ['landing_viewed', { nested: { notes: 'private' } }, '/index.html'],
  ['returned', { dayIndex: '7', segment: 'byo' }, '/study.html'],
  ['run_started', { pack_kind: 'starter' }, '/study.html?pack=secret'],
  ['landing_viewed', {}, '/index.html#notes=secret'],
  ['landing_viewed', {}, 'https://acedhq.com/index.html?pack=secret'],
  ['deck_compiled', { source: 'paste', count_bucket: '1', filename: 'notes.csv' }, '/importer.html'],
  ['landing_viewed', [], '/index.html'],
  ['landing_viewed', null, '/index.html'],
  ['__proto__', {}, '/index.html'],
  ['toString', {}, '/index.html'],
  ['run_started', Object.create({ pack_kind: 'starter' }), '/study.html']
];
for (const [n, pr, p] of hostile) {
  assert.equal(env.api.validate(n, pr, p), null, 'should reject: ' + n + ' ' + JSON.stringify(pr) + ' ' + p);
  emit(env, n, pr, p);
}
assert.equal(env.calls.length, valid.length, 'invalid inputs must not reach fetch');

for (let i = 0; i < valid.length; i++) {
  const req = env.calls[i];
  const [n, pr, p] = valid[i];
  assert.equal(req.url, 'https://plausible.io/api/event');
  assert.equal(req.init.method, 'POST');
  assert.equal(req.init.credentials, 'omit');
  assert.equal(req.init.referrerPolicy, 'no-referrer');
  assert.equal(req.init.headers['Content-Type'], 'application/json');
  const body = JSON.parse(req.init.body);
  assert.deepEqual(Object.keys(body).sort(), ['domain', 'name', 'props', 'url']);
  assert.equal(body.domain, 'acedhq.com');
  assert.equal(body.name, n);
  assert.equal(body.url, 'https://acedhq.com' + p);
  assert.deepEqual(body.props, pr || {});
  assert.equal(/pack-my-notes|person@example\.com|private notes|[?#]/.test(req.init.body), false);
}
assert.equal(env.listeners(), 0);
assert.equal(env.writes(), 0);
console.log('PASS Test 2: strict outbound boundary');

// Test 4: failed transport or unavailable storage never throws, retries or queues.
(async function () {
  for (const options of [{ fetchThrows: true }, { fetchRejects: true }]) {
    const failed = load('true', options);
    assert.doesNotThrow(() => emit(failed, 'run_started', { pack_kind: 'starter' }));
    await new Promise((r) => setImmediate(r));
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(failed.calls.length, 1, 'no retry');
    assert.equal(failed.listeners(), 0);
    assert.equal(failed.writes(), 0);
  }
  console.log('PASS Test 4: failure is silent; no retry or queue');
})().catch((e) => { console.error(e); process.exitCode = 1; });
