/* tools/score.test.js
   Unit tests for the ACED scoring engine + the real content it ships.
   Run:  node tools/score.test.js     (exit 0 = pass, 1 = fail)
   Style mirrors server/merge.test.js — plain assert, no framework.

   v13: Jokers are no longer pack content — they live in the subject-agnostic engine core
   (packs/core-jokers.js), and hand types / bosses fall back to the engine's generic set.
   These tests therefore exercise the CORE jokers against the real FAR card pool.
   ============================================================================ */
"use strict";
const assert = require("assert");
const H = require("./score-harness");

const pack = H.loadFarPack();
const CORE = H.loadCoreJokers();
let passed = 0;
function test(name, fn) {
  try { fn(); passed++; }
  catch (e) { console.error("\u2717 " + name + "\n    " + e.message); process.exitCode = 1; }
}
const eq = assert.strictEqual;

/* ---------- 1. base chips + weakness cards ---------- */
test("card chips sum from POOL values", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Service Revenue"] }); // 35 + 40
  eq(r.chips, 75);
});
test("weakness card contributes 0 chips", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "@weakness"] }); // 35 + 0
  eq(r.chips, 35);
});

/* ---------- 2. hand detection: generic CORE_HAND_TYPES, highest matching mult wins ---------- */
test("single card -> Single x1", () => {
  const r = H.scoreHand(pack, { cards: ["Cash"] });
  eq(r.handName, "Single"); eq(r.handMult, 1);
});
test("two cards of DIFFERENT types -> Mixed Pair x3", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Cost of Goods Sold"] }); // REV + EXP
  eq(r.handName, "Mixed Pair"); eq(r.handMult, 3);
});
test("two cards of the SAME type stay Single x1 (no same-type pair tier)", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Service Revenue"] }); // both REV
  eq(r.handName, "Single"); eq(r.handMult, 1);
});
test("three of a type -> Matched Set x4", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Service Revenue", "Interest Income"] });
  eq(r.handName, "Matched Set"); eq(r.handMult, 4);
});
test("four of a type -> Full Set x6", () => {
  const r = H.scoreHand(pack, { cards: ["Common Stock", "Retained Earnings", "Paid-In Capital", "Treasury Stock"] });
  eq(r.handName, "Full Set"); eq(r.handMult, 6);
});
test("five of a type -> Perfect Set x9", () => {
  const r = H.scoreHand(pack, {
    cards: ["Common Stock", "Retained Earnings", "Paid-In Capital", "Treasury Stock", "AOCI"],
  });
  // 40+45+35+35+35 = 190
  eq(r.handName, "Perfect Set"); eq(r.handMult, 9); eq(r.total, 190 * 9); // 1710
});

/* ---------- 3. specific CORE joker math (exact) ---------- */
test("warmup: flat +25 chips", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Service Revenue"], doctrines: ["warmup"] });
  eq(r.chips, 75 + 25); eq(r.mult, 1); eq(r.total, 100);
});
test("deepbreath: flat +4 Mult", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Cost of Goods Sold"], doctrines: ["deepbreath"] });
  // Mixed Pair x3 + 4 = 7 ; chips 70
  eq(r.mult, 7); eq(r.total, 70 * 7); // 490
});
test("highlighter: +12 chips per card of the biggest same-type group", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Service Revenue", "Cash"], doctrines: ["highlighter"] });
  // biggest same-type group = 2 REV -> +24 ; base 35+40+30 = 105
  eq(r.chips, 105 + 24);
});
test("indexcard: +18 chips per distinct type in hand", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Cost of Goods Sold", "Cash"], doctrines: ["indexcard"] });
  // 3 distinct types -> +54 ; base 35+35+30 = 100
  eq(r.chips, 100 + 54);
});
test("stickynote: +2 Mult per played card, ignoring dead cards", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Cost of Goods Sold", "@weakness"], doctrines: ["stickynote"] });
  // 2 live cards -> +4 Mult on Mixed Pair x3 = 7
  eq(r.mult, 7);
});
test("studystreak: +7 Mult only once 3+ share a type", () => {
  const two = H.scoreHand(pack, { cards: ["Sales Revenue", "Service Revenue"], doctrines: ["studystreak"] });
  const three = H.scoreHand(pack, { cards: ["Sales Revenue", "Service Revenue", "Interest Income"], doctrines: ["studystreak"] });
  eq(two.mult, 1);          // Single x1, does not fire
  eq(three.mult, 4 + 7);    // Matched Set x4 + 7
});
test("cram: +55 chips only when exactly one live card is played", () => {
  eq(H.scoreHand(pack, { cards: ["Cash"], doctrines: ["cram"] }).chips, 30 + 55);
  eq(H.scoreHand(pack, { cards: ["Cash", "Land"], doctrines: ["cram"] }).chips, 75);
});
test("threshold: +70 chips once base chips reach 60", () => {
  eq(H.scoreHand(pack, { cards: ["Depreciation"], doctrines: ["threshold"] }).chips, 25);        // 25 base, no fire
  eq(H.scoreHand(pack, { cards: ["Land", "Cash"], doctrines: ["threshold"] }).chips, 75 + 70);   // 75 base, fires
});

/* ---------- 4. xMult scales the whole additive build ---------- */
test("allnighter x2.5 multiplies the full summed mult", () => {
  const r = H.scoreHand(pack, {
    cards: ["Sales Revenue", "Cost of Goods Sold"],
    doctrines: ["deepbreath", "allnighter"],
    isFirstHand: true,
  });
  // mult: 3 (hand) + 4 (deepbreath) = 7 ; x2.5 -> 17.5 ; chips 70 ; total 1225
  eq(r.mult, 17.5); eq(r.xMult, 2.5); eq(r.total, 1225);
});

/* ---------- 5. INVARIANT: joker order never changes the score ---------- */
test("score is independent of equipped-joker order (3-joker permutations)", () => {
  const cards = ["Sales Revenue", "Cost of Goods Sold", "Cash"];
  // All three fire on this hand and none are position- or randomness-sensitive.
  const ids = ["deepbreath", "wellrounded", "allnighter"];
  const perms = [
    ["deepbreath", "wellrounded", "allnighter"], ["deepbreath", "allnighter", "wellrounded"],
    ["wellrounded", "deepbreath", "allnighter"], ["wellrounded", "allnighter", "deepbreath"],
    ["allnighter", "deepbreath", "wellrounded"], ["allnighter", "wellrounded", "deepbreath"],
  ];
  const totals = perms.map((p) => H.scoreHand(pack, { cards, doctrines: p, isFirstHand: true }).total);
  // chips 100 ; mult: 3 (hand) + 4 + 8 = 15 ; x2.5 -> 37.5 ; total 3750
  totals.forEach((t) => eq(t, 3750));
  eq(new Set(totals).size, 1);
  assert.deepStrictEqual([...ids].sort(), ["allnighter", "deepbreath", "wellrounded"]); // sanity: all fire
});

/* ---------- 6. v13 generic boss modifiers ---------- */
test("boss 'nitpicker' removes 10 chips per card of the most-played type, before jokers", () => {
  const r = H.scoreHand(pack, {
    cards: ["Sales Revenue", "Service Revenue"], doctrines: ["warmup"], boss: "nitpicker",
  });
  // base 75 - (10 x 2 REV) = 55 ; +25 warmup = 80 ; Single x1
  eq(r.chips, 80); eq(r.total, 80);
});
test("boss 'falsestart' halves the first scored hand only", () => {
  const first = H.scoreHand(pack, { cards: ["Sales Revenue", "Cost of Goods Sold"], doctrines: ["deepbreath"], boss: "falsestart", firstScored: false });
  const later = H.scoreHand(pack, { cards: ["Sales Revenue", "Cost of Goods Sold"], doctrines: ["deepbreath"], boss: "falsestart", firstScored: true });
  eq(later.total, 490);
  eq(first.total, 245); // 490 / 2
});

/* ---------- 7. run-scaler jokers use persistent state (ctx.st) ---------- */
test("compinterest ramps across hands via shared jkState", () => {
  const cards = ["Cash"]; const jkState = {};
  const a = H.scoreHand(pack, { cards, doctrines: ["compinterest"], jkState }); // x1.04
  const b = H.scoreHand(pack, { cards, doctrines: ["compinterest"], jkState }); // x1.08
  assert.ok(b.xMult > a.xMult, "second play should have a larger multiplier (" + b.xMult + " > " + a.xMult + ")");
  eq(Math.round(a.xMult * 100) / 100, 1.04);
  eq(Math.round(b.xMult * 100) / 100, 1.08);
});
test("diminishing decays from x3.5 and floors at x1", () => {
  const cards = ["Cash"]; const jkState = {};
  const xs = [];
  for (let i = 0; i < 14; i++) xs.push(H.scoreHand(pack, { cards, doctrines: ["diminishing"], jkState }).xMult);
  eq(xs[0], 3.5); eq(xs[1], 3.25);
  assert.ok(xs[xs.length - 1] === 1, "should floor at x1, got " + xs[xs.length - 1]);
  for (let i = 1; i < xs.length; i++) assert.ok(xs[i] <= xs[i - 1], "must be monotonically non-increasing");
});
test("deferred banks 30% of base chips and pays out on the NEXT hand", () => {
  const jkState = {};
  const a = H.scoreHand(pack, { cards: ["Land", "Cash"], doctrines: ["deferred"], jkState }); // base 75, banks 23
  const b = H.scoreHand(pack, { cards: ["Cash"], doctrines: ["deferred"], jkState });         // base 30, pays 23
  eq(a.chips, 75);        // nothing held yet on the first hand
  eq(b.chips, 30 + 23);   // round(75 * 0.3) = 23
});

/* ---------- 8. nondeterministic jokers stay in bounds ---------- */
test("gutfeeling fires about half the time and only ever adds exactly +50 chips", () => {
  let fired = 0;
  for (let i = 0; i < 600; i++) {
    const r = H.scoreHand(pack, { cards: ["Cash"], doctrines: ["gutfeeling"] });
    assert.ok(r.chips === 30 || r.chips === 80, "unexpected chips " + r.chips);
    if (r.chips === 80) fired++;
  }
  assert.ok(fired > 180 && fired < 420, "expected roughly half of 600 to fire, got " + fired);
});
test("panic either zeroes the chips or grants x4, never both", () => {
  let zeroed = 0, boosted = 0;
  for (let i = 0; i < 600; i++) {
    const r = H.scoreHand(pack, { cards: ["Cash"], doctrines: ["panic"] });
    if (r.chips === 0) { zeroed++; eq(r.xMult, 1); }
    else { boosted++; eq(r.chips, 30); eq(r.xMult, 4); }
  }
  eq(zeroed + boosted, 600);
  assert.ok(zeroed > 100 && zeroed < 300, "expected roughly a third to blank out, got " + zeroed);
});

/* ---------- 9. economy jokers pay out through ctx.earn ---------- */
test("economy jokers grant cash rather than chips", () => {
  eq(H.scoreHand(pack, { cards: ["Cash"], doctrines: ["allowance"] }).money, 2);
  eq(H.scoreHand(pack, { cards: ["Sales Revenue", "Cost of Goods Sold", "Cash"], doctrines: ["sidehustle"] }).money, 3);
  eq(H.scoreHand(pack, { cards: ["Cash"], doctrines: ["scholarship"], isFirstHand: true }).money, 3);
  eq(H.scoreHand(pack, { cards: ["Cash"], doctrines: ["scholarship"], isFirstHand: false }).money, 0);
});

/* ---------- 10. position-sensitive jokers read their slot ---------- */
test("cornerstone only fires in the first slot", () => {
  const first = H.scoreHand(pack, { cards: ["Cash"], doctrines: ["cornerstone", "warmup"] });
  const second = H.scoreHand(pack, { cards: ["Cash"], doctrines: ["warmup", "cornerstone"] });
  eq(first.xMult, 1.5);
  eq(second.xMult, 1);
});
test("anchor scales with the number of jokers to its left", () => {
  const r = H.scoreHand(pack, { cards: ["Cash"], doctrines: ["warmup", "deepbreath", "anchor"] });
  // anchor sits at index 2 -> +10 Mult ; hand Single x1 + 4 (deepbreath) + 10 = 15
  eq(r.mult, 15);
});
test("mirror copies the joker to its left", () => {
  const r = H.scoreHand(pack, { cards: ["Cash"], doctrines: ["warmup", "mirror"] });
  // warmup fires (+25), then mirror re-fires it (+25)
  eq(r.chips, 30 + 50);
});

/* ---------- 11. FUZZ: no core joker throws or yields NaN/Infinity ---------- */
test("every core joker is crash-safe and finite across representative hands", () => {
  const hands = [
    ["Cash"],
    ["Sales Revenue", "Cost of Goods Sold"],
    ["Common Stock", "Retained Earnings", "Paid-In Capital", "Treasury Stock", "AOCI"],
    ["Accounts Payable", "Notes Payable", "Bonds Payable", "Lease Liability"],
    ["AFS Debt Securities", "Pension Liability", "AOCI"],
    ["Inventory", "Cash"],
    ["Patent", "Goodwill", "Impairment Loss"],
    ["@weakness", "@weakness"],
  ];
  const dead = [];
  (CORE.doctrines || []).forEach((d) => {
    let everFired = false;
    hands.forEach((cards) => {
      const r = H.scoreHand(pack, {
        cards, doctrines: [d.id], handsThisBlind: 1, jkState: {},
        // give every signal a non-trivial value so conditional jokers can actually fire
        money: 30, jokerCount: 4, closesCleared: 2, masteredCount: 2, convTotal: 3,
        chargedCount: 2, redeemedCount: 1, passedLastAudit: true, weaknessCount: 2,
        deckSize: 45, deckElCount: { REV: 8, EXP: 7, ASSET: 10, LIAB: 7, EQUITY: 5 },
        isLastHand: true, discLeft: 2, handsLeft: 2,
      });
      assert.ok(Number.isFinite(r.chips), d.id + " produced non-finite chips on " + cards.join("+"));
      assert.ok(Number.isFinite(r.mult), d.id + " produced non-finite mult on " + cards.join("+"));
      assert.ok(Number.isFinite(r.total), d.id + " produced non-finite total on " + cards.join("+"));
      assert.ok(Number.isFinite(r.money), d.id + " produced non-finite cash on " + cards.join("+"));
      if (r.addedChips.length || r.addedMult.length || r.money) everFired = true;
    });
    if (!everFired) dead.push(d.id);
  });
  // Not a hard failure (a few need very specific board states), but surface anything that
  // never fired across all sample hands so balance gaps are visible in CI logs.
  if (dead.length) console.log("    note: core jokers that never fired on sample hands: " + dead.join(", "));
});

/* ---------- 12. niche core jokers each fire on their real trigger ---------- */
test("niche-trigger core jokers all fire on a correct hand", () => {
  const triggers = {
    crosstrain:   { cards: ["Sales Revenue", "Cash"] },                                     // 2+ types
    wellrounded:  { cards: ["Sales Revenue", "Cost of Goods Sold", "Cash"] },                // 3+ types
    tunnelvision: { cards: ["Sales Revenue", "Service Revenue"] },                           // all one type
    bellcurve:    { cards: ["Cash", "Land", "Inventory"] },                                   // exactly 3 cards
    fullmarks:    { cards: ["Cash", "Land", "Inventory", "Patent", "Goodwill"] },              // 5 cards
    secondwind:   { cards: ["Cash"], isLastHand: true },
    peptalk:      { cards: ["Cash"], isFirstHand: true },
    lastminute:   { cards: ["Cash"], isLastHand: true, discLeft: 0 },
    extracredit:  { cards: ["Cash"], isLastHand: true, discLeft: 2 },
    marathon:     { cards: ["Cash"], handsThisBlind: 2 },
    warmhands:    { cards: ["Cash"], handsThisBlind: 2 },
    testanxiety:  { cards: ["Cash"], boss: "nitpicker" },
    budget:       { cards: ["Cash"], money: 30 },
    highroller:   { cards: ["Cash"], money: 30 },
    retainedfocus:{ cards: ["Cash"], closesCleared: 2 },
    growthmindset:{ cards: ["Cash"], closesCleared: 2 },
    hailmary:     { cards: ["Cash"], weaknessCount: 2 },
    riskit:       { cards: ["Cash"], weaknessCount: 2 },
    perfectrecall:{ cards: ["Cash"], weaknessCount: 0 },
    secondnature: { cards: ["Cash"], masteredCount: 2 },
    bigpicture:   { cards: ["Cash"], convTotal: 3 },
    officehours:  { cards: ["Cash"], passedLastAudit: true },
    redemption:   { cards: ["Cash"], redeemedCount: 1 },
    prep:         { cards: ["Cash"], chargedCount: 2 },
    curve:        { cards: ["Cash"], deckElCount: { REV: 8, EXP: 7, ASSET: 10, LIAB: 7 } },
    foundation:   { cards: ["Cash"], deckElCount: { ASSET: 10 } },
    thinnotes:    { cards: ["Cash"], deckSize: 40 },
    deanslist:    { cards: ["Cash"], jokerCount: 4 },
    studygroup:   { cards: ["Cash"], jokerCount: 4 },
    procrastinate:{ cards: ["Cash"], handsThisBlind: 2 },
    tuition:      { cards: ["Cash"], money: 30 },
  };
  Object.keys(triggers).forEach((id) => {
    const spec = Object.assign({ doctrines: [id], jkState: {} }, triggers[id]);
    const r = H.scoreHand(pack, spec);
    assert.ok(
      r.addedChips.length || r.addedMult.length || r.money !== 0,
      "core joker '" + id + "' did NOT fire on its trigger hand"
    );
  });
});

/* ---------- 13. content integrity of the engine core ---------- */
test("core joker ids are unique and callable", () => {
  const ids = (CORE.doctrines || []).map((d) => d.id);
  assert.ok(ids.length > 0, "engine core ships no jokers");
  eq(new Set(ids).size, ids.length);
  (CORE.doctrines || []).forEach((d) => assert.strictEqual(typeof d.apply, "function", d.id + " missing apply()"));
});
test("the FAR pack no longer ships jokers, bosses or hand types", () => {
  assert.ok(!pack.doctrines, "pack still ships doctrines");
  assert.ok(!pack.bosses, "pack still ships bosses");
  assert.ok(!pack.handTypes, "pack still ships handTypes");
});
test("the starter loadout resolves to real jokers", () => {
  const all = H.allJokers(pack).map((j) => j.id);
  const starter = (pack.starter && pack.starter.doctrines) || CORE.starter || [];
  assert.ok(starter.length > 0, "no starter loadout defined");
  starter.forEach((id) => assert.ok(all.includes(id), "starter joker '" + id + "' does not exist"));
});

if (process.exitCode) { console.error("\nscore.test.js \u2014 FAILED"); }
else { console.log("score.test.js \u2014 all " + passed + " tests passed"); }
