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
  const handTypes = pack.handTypes;
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
  if (boss === "conservative") baseChips -= 10 * (byEl.REV || 0);

  const ctx = {
    played, hand, el: byEl, t: tagCount,
    hasRev: played.some((c) => c.el === "REV"),
    hasExp: played.some((c) => c.el === "EXP"),
    handsThisBlind,
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

  // doctrines, in equipped order (play() wraps each in try/catch — so do we)
  (jokers || []).forEach((j) => { try { j.apply(ctx, j); } catch (e) {} });

  if (ctx.chips < 0) ctx.chips = 0;
  // the crux: ALL additive +Mult is summed first, then the multiplicative _x is
  // applied once to that sum — so ×Mult scales the whole build and doctrine ORDER
  // cannot change the result.
  if (ctx._x !== 1) ctx.mult = Math.round(ctx.mult * ctx._x * 100) / 100;

  let total = Math.round(ctx.chips * ctx.mult);
  if (boss === "restate" && !opts.firstScored) total = Math.round(total / 2);

  return {
    handName: hand.name,
    handMult: hand.mult,
    chips: ctx.chips,
    mult: ctx.mult,
    xMult: ctx._x,
    total,
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

function getDoctrines(pack, ids) {
  return ids.map((id) => {
    const d = (pack.doctrines || []).find((x) => x.id === id);
    if (!d) throw new Error("No doctrine with id '" + id + "' in pack");
    return d;
  });
}

module.exports = {
  loadFarPack, makeCard, weaknessCard, detectHand,
  score, scoreHand, getDoctrines,
};
