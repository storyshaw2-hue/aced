// Standalone validation for the v13 subject-agnostic joker core.
// Loads packs/core-jokers.js in a fake browser global and asserts internal consistency.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const sandbox = { window: {}, Math, console, Date };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

function load(rel) {
  vm.runInContext(fs.readFileSync(path.join(root, rel), 'utf8'), sandbox, { filename: rel });
}

load('packs/core-jokers.js');

const CORE = sandbox.window.ACED_CORE_JOKERS;
let fail = 0;
const ok = (cond, msg) => { if (!cond) { console.log('  FAIL: ' + msg); fail++; } };

ok(!!CORE, 'window.ACED_CORE_JOKERS is set');
const JK = CORE.doctrines || [];
console.log('jokers defined: ' + JK.length);

// --- structural integrity ---
const ids = JK.map(j => j.id);
const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
ok(dupes.length === 0, 'duplicate joker ids: ' + [...new Set(dupes)].join(', '));
JK.forEach(j => {
  ok(!!j.id, 'joker missing id: ' + JSON.stringify(j).slice(0, 60));
  ok(!!j.n, 'joker ' + j.id + ' missing name');
  ok(!!j.d, 'joker ' + j.id + ' missing description');
  ok(typeof j.apply === 'function', 'joker ' + j.id + ' apply is not a function');
  ok(['common', 'uncommon', 'rare', 'legendary'].includes(j.rarity), 'joker ' + j.id + ' bad rarity: ' + j.rarity);
});

// --- cross-table consistency ---
const idSet = new Set(ids);
Object.keys(CORE.codexHints || {}).forEach(k => ok(idSet.has(k), 'codexHint for unknown joker: ' + k));
Object.keys(CORE.unlockConditions || {}).forEach(k => ok(idSet.has(k), 'unlockCondition for unknown joker: ' + k));
(CORE.starter || []).forEach(k => ok(idSet.has(k), 'starter references unknown joker: ' + k));
(CORE.starterUnlocks || []).forEach(k => ok(idSet.has(k), 'starterUnlock references unknown joker: ' + k));

const missingHint = ids.filter(i => !(CORE.codexHints || {})[i]);
if (missingHint.length) console.log('  note: ' + missingHint.length + ' jokers have no codex hint: ' + missingHint.slice(0, 8).join(', '));

// --- behavioural test: every apply() must run without throwing ---
function makeCtx() {
  const played = [
    { n: 'A', el: 'REV', v: 30, tags: ['cash'], moduleKey: 'm1' },
    { n: 'B', el: 'EXP', v: 20, tags: ['def'], moduleKey: 'm2' },
    { n: 'C', el: 'ASSET', v: 40, tags: ['inv', 'oci'], moduleKey: 'm1' },
    { n: 'W', el: 'EXP', v: 0, tags: ['weakness'], moduleKey: null, weakness: true }
  ];
  const store = {};
  const log = [];
  return {
    played, hand: { name: 'Pair', mult: 2, chips: 10 },
    el: { REV: 1, EXP: 2, ASSET: 1, LIAB: 0, EQUITY: 0 },
    cats: { m1: 2, m2: 1 }, conv: { m1: 1, m2: 0 }, topics: ['m1', 'm2'],
    handsThisBlind: 1, handsLeft: 2, discLeft: 1, money: 20, ante: 2,
    deckSize: 50, deckElMax: 9, deckCats: 4, topElCount: 3, playedCats: 2,
    isFirstHand: true, isLastHand: false, isBoss: false,
    weaknessCount: 1, chargedCount: 2, closesCleared: 2, convTotal: 1,
    masteredCount: 1, redeemedCount: 1, passedLastAudit: true,
    t: tag => played.filter(x => x.tags.includes(tag)).length,
    hasRev: true, hasExp: true,
    // mirror of the real engine ctx in study.html (~line 1325)
    jokerCount: 4, jokerIndex: 1, leftId: 'a', rightId: 'b', leftRarity: 'common', rightRarity: 'rare',
    _avgMastery: 55, _money: 0,
    mastery: () => 60,
    deckEl: () => 8,
    earn(n, l) { this._money += n; log.push(['earn', n, l]); },
    copyNeighbor(off) { log.push(['copy', off]); },
    addChips: (n, s) => log.push(['chips', n, s]),
    addMult: (n, s) => log.push(['mult', n, s]),
    xMult: (n, s) => log.push(['xmult', n, s]),
    st: id => (store[id] = store[id] || {}),
    _log: log
  };
}
const G = { jokers: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }], handsThisBlind: 2, ante: 2, money: 20 };

let fired = 0;
JK.forEach(j => {
  const ctx = makeCtx();
  try { j.apply(ctx, j, G); if (ctx._log.length) fired++; }
  catch (e) { console.log('  FAIL: apply() threw for ' + j.id + ': ' + e.message); fail++; }
});
console.log('apply() ran for all ' + JK.length + ' jokers; ' + fired + ' produced scoring on the sample hand');

// unlock conditions must not throw either
Object.entries(CORE.unlockConditions || {}).forEach(([k, fn]) => {
  try { fn(makeCtx(), G); }
  catch (e) { console.log('  FAIL: unlockCondition threw for ' + k + ': ' + e.message); fail++; }
});
console.log('unlock conditions evaluated: ' + Object.keys(CORE.unlockConditions || {}).length);

// Every joker must be reachable: unlocked from the start or via an unlock condition.
const unlockable = new Set([...(CORE.starterUnlocks || []), ...Object.keys(CORE.unlockConditions || {})]);
const unreachable = ids.filter(i => !unlockable.has(i));
ok(unreachable.length === 0, 'jokers with no unlock path: ' + unreachable.join(', '));

// The engine calls j.apply(ctx, j) with only two args, so no joker may depend on a third param.
JK.forEach(j => ok(j.apply.length <= 2, 'joker ' + j.id + ' apply() expects ' + j.apply.length + ' args; engine passes 2'));

// --- packs must no longer ship their own jokers ---
['cpa-far', 'cpa-aud', 'cpa-bar', 'cpa-reg'].forEach(p => {
  const s = Object.assign(vm.createContext({ window: {}, Math, console, Date }));
  try {
    vm.runInContext(fs.readFileSync(path.join(root, 'packs', p + '.js'), 'utf8'), s, { filename: p });
    const PACK = s.window.ACED_PACK;
    ok(!!PACK, p + ': window.ACED_PACK not set');
    if (PACK) {
      ok(!PACK.doctrines, p + ': still ships its own doctrines');
      ok(!PACK.bosses, p + ': still ships its own bosses');
      ok(!PACK.handTypes, p + ': still ships its own handTypes');
      ok(Array.isArray(PACK.cards) && PACK.cards.length > 0, p + ': has no cards');

      // The starter loadout must resolve to real jokers (mirrors STARTER_DOCTRINES in study.html).
      const ALLJK = JK.concat(PACK.doctrines || []);
      const have = new Set(ALLJK.map(j => j.id));
      const packStart = (PACK.starter && Array.isArray(PACK.starter.doctrines)) ? PACK.starter.doctrines : [];
      packStart.forEach(id => ok(have.has(id), p + ': starter joker "' + id + '" does not exist'));
      const resolved = packStart.filter(id => have.has(id)).length
        ? packStart.filter(id => have.has(id))
        : (CORE.starter || []).filter(id => have.has(id));
      ok(resolved.length > 0, p + ': starter loadout resolves to zero jokers');

      // Inert leftovers are fine, but a pack key must never shadow a core joker id.
      Object.keys(PACK.unlockConditions || {}).forEach(k =>
        ok(!idSet.has(k) , p + ': unlockCondition "' + k + '" shadows a core joker'));

      console.log('  ' + p + ': ' + PACK.cards.length + ' cards, starter=[' + resolved.join(', ') + '], jokers inherited from core');
    }
  } catch (e) { console.log('  FAIL: ' + p + ' threw on load: ' + e.message); fail++; }
});

console.log(fail === 0 ? '\nALL CHECKS PASSED' : '\n' + fail + ' CHECK(S) FAILED');
process.exit(fail === 0 ? 0 : 1);
