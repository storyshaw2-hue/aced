/* tools/score-harness.js
   ============================================================================
   A dependency-free, headless reproduction of the hand-scoring math in
   study.html's play() — so the scoring engine and the real content pack
   (cards, doctrines, hand types) can be unit-tested in Node/CI without a
   browser, a build step, or any npm install.

   It loads the SAME pack file that ships to the browser (via the existing
   tools/lib/load-banks.js window-shim), so the doctrine apply() functions and
   hand-type conditions under test are the real ones, not copies.

   What is reproduced here is only the pure scoring ORCHESTRATION (the ~15 lines
   of math in play()), with all DOM / audio / particle / mastery side-effects
   stripped out. Keep this in sync with study.html's scoring block (search for
   "Multiplicative payoffs apply after every +Mult addition"). The cleanest
   long-term fix is to extract that block from study.html into a shared
   scoring.js that both the page and this harness require — see score.test.js.

   Usage:
     const H = require("./score-harness");
     const pack = H.loadFarPack();
     const r = H.scoreHand(pack, {
       cards:   ["Sales Revenue", "Cost of Goods Sold"],
       doctrines: ["match"]
     });
     // r => { handName, handMult, chips, mult, xMult, total, addedChips, addedMult }
   ============================================================================ */
"use strict";

const path = require("path");
const { loadPack } = require("./lib/load-banks");

function loadFarPack() {
  return loadPack("packs/cpa-far.js");
}

/* v13: Jokers live in the engine core, not the pack. Load packs/core-jokers.js the same
   window-shim way and cache window.ACED_CORE_JOKERS. */
let _core = null;
function loadCoreJokers() {
  if (_core) return _core;
  const fs = require("fs");
  const vm = require("vm");
  const file = path.join(__dirname, "..", "packs", "core-jokers.js");
  const sandbox = { window: {}, Math, console, Date, JSON };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: "packs/core-jokers.js" });
  _core = sandbox.window.ACED_CORE_JOKERS;
  if (!_core) throw new Error("packs/core-jokers.js did not set window.ACED_CORE_JOKERS");
  return _core;
}

/* v13: subject-agnostic hand types, mirroring CORE_HAND_TYPES in study.html. Used whenever
   a pack does not ship its own handTypes. */
function maxSameType(cs) {
  const e = {};
  cs.forEach((c) => { e[c.el] = (e[c.el] || 0) + 1; });
  return Math.max(0, ...Object.values(e), 0);
}
const CORE_HAND_TYPES = [
  { name: "Single",      condition: () => true,                                    mult: 1 },
  { name: "Mixed Pair",  condition: (cs) => new Set(cs.map((c) => c.el)).size >= 2, mult: 3 },
  { name: "Matched Set", condition: (cs) => maxSameType(cs) >= 3,                   mult: 4 },
  { name: "Full Set",    condition: (cs) => maxSameType(cs) >= 4,                   mult: 6 },
  { name: "Perfect Set", condition: (cs) => maxSameType(cs) >= 5,                   mult: 9 }
];

/* Build a normalized card instance from the pack POOL by display name, mirroring
   study.html's mk(): tags is ALWAYS an array, weakness defaults false. */
function makeCard(pack, name) {
  const proto = (pack.cards || []).find((c) => c.n === name);
  if (!proto) throw new Error("No card named '" + name + "' in pack POOL");
  return {
    n: proto.n,
    el: proto.el,
    v: proto.v,
    tags: proto.tags ? proto.tags.slice() : [],
    moduleKey: proto.moduleKey || null,
    weakness: !!proto.weakness,
  };
}

/* The weakness card (polluted in on a missed Audit Moment): EXP, 0 chips. */
function weaknessCard(pack) {
  const w = pack.weaknessCard || { n: "Unstudied Topic", el: "EXP", v: 0, tags: ["weakness"], weakness: true };
  return { n: w.n, el: w.el, v: w.v || 0, tags: (w.tags || []).slice(), moduleKey: null, weakness: true };
}

/* Faithful reproduction of study.html detectHand(): the highest-mult hand type
   whose condition matches; Single Posting (always true) is the floor. */
function detectHand(pack, cards) {
  const handTypes = (pack.handTypes && pack.handTypes.length) ? pack.handTypes : CORE_HAND_TYPES;
  let best = null;
  handTypes.forEach((h) => {
    let ok = false;
    try { ok = h.condition(cards); } catch (e) { ok = false; }
    if (ok && (!best || h.mult > best.mult)) best = { name: h.name, mult: h.mult };
  });
  return best || { name: handTypes[0].name, mult: handTypes[0].mult };
}

/* Score one hand. `played` is an array of card instances (use makeCard); `jokers`
   is an array of doctrine objects (use getDoctrines). Options mirror the bits of
   game state play() reads:
     handsThisBlind : int   (some doctrines scale with hands already played)
     boss           : null | "conservative" | "restate"
     firstScored    : bool  ("restate" only halves the FIRST scored hand)
     jkState        : obj   (persistent per-doctrine state for run-scalers; ctx.st)
     finishEffects  : [{chips?,mult?,x?}]  (card "finish" foils; applied pre-doctrine)
*/
function score(pack, played, jokers, opts) {
  opts = opts || {};
  const handsThisBlind = opts.handsThisBlind || 0;
  const boss = opts.boss || null;
  const jkState = opts.jkState || {};

  const hand = detectHand(pack, played);

  const byEl = {};
  played.forEach((c) => { byEl[c.el] = (byEl[c.el] || 0) + 1; });
  const tagCount = (t) => played.filter((c) => c.tags.includes(t)).length;

  let baseChips = played.reduce((s, c) => s + (c.weakness ? 0 : c.v), 0);
  // v13 generic boss: "nitpicker" docks 10 chips per card of the most-played TYPE.
  if (boss === "nitpicker") baseChips -= 10 * maxSameType(played);

  const live = played.filter((c) => !c.weakness);
  const deckElCount = opts.deckElCount || {};

  const ctx = {
    played, hand, el: byEl, t: tagCount,
    hasRev: played.some((c) => c.el === "REV"),
    hasExp: played.some((c) => c.el === "EXP"),
    handsThisBlind,
    // ---- v13 subject-agnostic signals (mirrors the ctx built in study.html play()) ----
    topElCount: maxSameType(played),
    playedCats: new Set(live.map((c) => c.el)).size,
    deckSize: opts.deckSize === undefined ? 52 : opts.deckSize,
    deckElMax: Math.max(0, ...Object.values(deckElCount), 0),
    deckCats: Object.keys(deckElCount).length,
    deckEl(e) { return deckElCount[e] || 0; },
    weaknessCount: opts.weaknessCount === undefined ? 0 : opts.weaknessCount,
    handsLeft: opts.handsLeft === undefined ? 4 : opts.handsLeft,
    discLeft: opts.discLeft === undefined ? 3 : opts.discLeft,
    isFirstHand: opts.isFirstHand === undefined ? handsThisBlind === 0 : !!opts.isFirstHand,
    isLastHand: !!opts.isLastHand,
    isBoss: !!boss,
    money: opts.money === undefined ? 4 : opts.money,
    _money: 0,
    earn(n) { this._money += n; },
    jokerCount: opts.jokerCount === undefined ? (jokers || []).length || 1 : opts.jokerCount,
    jokerIndex: 0, leftId: null, rightId: null, leftRarity: null, rightRarity: null,
    copyNeighbor() {},
    closesCleared: opts.closesCleared || 0,
    passedLastAudit: !!opts.passedLastAudit,
    masteredCount: opts.masteredCount || 0,
    convTotal: opts.convTotal || 0,
    conv: opts.conv || {},
    topics: [...new Set(live.map((c) => c.moduleKey).filter(Boolean))],
    chargedCount: opts.chargedCount || 0,
    redeemedCount: opts.redeemedCount || 0,
    _avgMastery: opts._avgMastery || 0,
    chips: baseChips, mult: hand.mult, _x: 1,
    addChips(n, l) { this.chips += n; this._c.push(l); },
    addMult(n, l) { this.mult += n; this._m.push(l); },
    xMult(n, l) { this._x *= n; this._m.push(l); },
    st(id) { return jkState[id] || (jkState[id] = {}); },
    _c: [], _m: [], _callout: null,
  };

  // card finishes (foils) apply before doctrines, exactly as in play()
  (opts.finishEffects || []).forEach((F) => {
    if (F.chips) ctx.addChips(F.chips, F.tag || "finish");
    if (F.mult) ctx.addMult(F.mult, F.tag || "finish");
    if (F.x && F.x !== 1) ctx.xMult(F.x, F.tag || "finish");
  });

  // doctrines, in equipped order (play() wraps each in try/catch — so do we).
  // v13: expose slot position + a guarded neighbour copy, exactly as play() does.
  const list = jokers || [];
  for (let i = 0; i < list.length; i++) {
    const j = list[i];
    const L = i > 0 ? list[i - 1] : null;
    const R = i < list.length - 1 ? list[i + 1] : null;
    ctx.jokerIndex = i;
    ctx.leftId = L ? L.id : null; ctx.rightId = R ? R.id : null;
    ctx.leftRarity = L ? L.rarity : null; ctx.rightRarity = R ? R.rarity : null;
    ctx.copyNeighbor = function (off) {
      if ((ctx._copyDepth || 0) >= 3) return;
      const nb = list[i + off];
      if (nb) { ctx._copyDepth = (ctx._copyDepth || 0) + 1; try { nb.apply(ctx, nb); } catch (e) {} ctx._copyDepth--; }
    };
    try { j.apply(ctx, j); } catch (e) {}
  }

  if (ctx.chips < 0) ctx.chips = 0;
  // the crux: ALL additive +Mult is summed first, then the multiplicative _x is
  // applied once to that sum — so ×Mult scales the whole build and doctrine ORDER
  // cannot change the result.
  if (ctx._x !== 1) ctx.mult = Math.round(ctx.mult * ctx._x * 100) / 100;

  let total = Math.round(ctx.chips * ctx.mult);
  // v13 generic boss: "falsestart" halves only the FIRST scored hand of the round.
  if (boss === "falsestart" && !opts.firstScored) total = Math.round(total / 2);

  return {
    handName: hand.name,
    handMult: hand.mult,
    chips: ctx.chips,
    mult: ctx.mult,
    xMult: ctx._x,
    total,
    money: ctx._money,
    addedChips: ctx._c.slice(),
    addedMult: ctx._m.slice(),
    callout: ctx._callout,
  };
}

/* Convenience wrapper that takes card NAMES and doctrine IDS. */
function scoreHand(pack, spec) {
  spec = spec || {};
  const played = (spec.cards || []).map((c) =>
    c === "@weakness" ? weaknessCard(pack) : makeCard(pack, c)
  );
  const jokers = getDoctrines(pack, spec.doctrines || []);
  return score(pack, played, jokers, spec);
}

/* v13: resolve joker ids against the engine core FIRST, then any pack-specific additions —
   the same merge study.html does (ALLJK = core.doctrines.concat(PACK.doctrines||[])). */
function allJokers(pack) {
  return (loadCoreJokers().doctrines || []).concat((pack && pack.doctrines) || []);
}

function getDoctrines(pack, ids) {
  const all = allJokers(pack);
  return ids.map((id) => {
    const d = all.find((x) => x.id === id);
    if (!d) throw new Error("No joker with id '" + id + "' in the engine core or pack");
    return d;
  });
}

module.exports = {
  loadFarPack, loadCoreJokers, allJokers, CORE_HAND_TYPES, maxSameType,
  makeCard, weaknessCard, detectHand,
  score, scoreHand, getDoctrines,
};
