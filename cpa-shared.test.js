"use strict";
/* The CPA packs own their accounting flavor (packs/cpa-shared.js). This checks the hooks the engine reads. */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function load(section) {
  const win = { ACED_PACK: { id: "cpa-" + section.toLowerCase(), section: section } };
  win.window = win; win.globalThis = win;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "packs", "cpa-shared.js"), "utf8"), win);
  return win;
}

const far = load("FAR");
assert.ok(Array.isArray(far.ACED_TBS_BOSS) && far.ACED_TBS_BOSS.length >= 3, "boss worksheets defined");
far.ACED_TBS_BOSS.forEach(function (b) {
  assert.ok(b.id && b.title && b.rows && b.rows.length >= 3, "boss " + b.id + " has rows");
  b.rows.forEach(function (r) {
    assert.ok(r.amountOptions.indexOf(r.expected) >= 0, b.id + ": " + r.label + " offers the correct amount");
  });
});
assert.ok(far.ACED_BOSS_JOKER_THEMES && Object.keys(far.ACED_BOSS_JOKER_THEMES).length > 0, "boss joker themes");
assert.ok(far.ACED_PACK.vocab && far.ACED_PACK.vocab.yr, "vocab hook");
assert.ok(far.ACED_PACK.win && far.ACED_PACK.win.title && /\$\{money\}/.test(far.ACED_PACK.win.body), "FAR win copy has a money slot");
assert.ok(far.ACED_PACK.lose && far.ACED_PACK.lose.title, "lose copy");
assert.ok(far.ACED_PACK.onboarding && far.ACED_PACK.onboarding.steps.length === 4, "onboarding steps");

const drill = far.ACED_SHOP_DRILL;
assert.ok(drill && typeof drill.make === "function", "shop drill hook");
const shuffle = function (a) { return a.slice().sort(function () { return Math.random() - 0.5; }); };
for (let i = 0; i < 300; i++) {
  const d = drill.make(shuffle);
  assert.strictEqual(d.opts.length, 4, "four options: " + d.q);
  assert.strictEqual(new Set(d.opts).size, 4, "options are unique: " + d.q);
  assert.ok(d.opts.indexOf(d.a) >= 0, "correct answer is among the options: " + d.q);
}

const expectSource = { FAR: "^F\\d+\\.", BAR: "^B\\d+\\.", AUD: "^AUD\\.", REG: "^REG\\." };
Object.keys(expectSource).forEach(function (sec) {
  const w = load(sec);
  assert.strictEqual(w.ACED_PACK.tbsSource, expectSource[sec], sec + " tbsSource");
  assert.ok(w.ACED_PACK.tbsBanks.length > 0, sec + " tbsBanks");
});
console.log("cpa-shared.test.js: ok");
