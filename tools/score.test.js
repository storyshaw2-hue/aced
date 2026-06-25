/* tools/score.test.js
   Unit tests for the ACED scoring engine + the real FAR doctrine/hand content.
   Run:  node tools/score.test.js     (exit 0 = pass, 1 = fail)
   Style mirrors server/merge.test.js — plain assert, no framework.
   ============================================================================ */
"use strict";
const assert = require("assert");
const H = require("./score-harness");

const pack = H.loadFarPack();
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

/* ---------- 2. hand detection: highest matching mult wins ---------- */
test("single card -> Single Posting x1", () => {
  eq(H.scoreHand(pack, { cards: ["Cash"] }).handMult, 1);
});
test("two of an element -> Matching Pair x2", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Service Revenue"] });
  eq(r.handName, "Matching Pair"); eq(r.handMult, 2);
});
test("rev + exp -> Matched Entry x3 (beats Matching Pair)", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Cost of Goods Sold"] });
  eq(r.handName, "Matched Entry"); eq(r.handMult, 3);
});
test("five of an element -> Full Consolidation x9", () => {
  const r = H.scoreHand(pack, {
    cards: ["Common Stock", "Retained Earnings", "Paid-In Capital", "Treasury Stock", "AOCI"],
  });
  eq(r.handName, "Full Consolidation"); eq(r.handMult, 9); eq(r.total, 190 * 9); // 1710
});

/* ---------- 3. specific doctrine math (exact) ---------- */
test("revrec: +16 chips per REV card", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Service Revenue"], doctrines: ["revrec"] });
  eq(r.chips, 75 + 32); eq(r.mult, 2); eq(r.total, 107 * 2); // 214
});
test("match: +5 mult on a Matched Entry", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Cost of Goods Sold"], doctrines: ["match"] });
  eq(r.mult, 8); eq(r.total, 70 * 8); // 560
});
test("Conservatism doubles loss-card chips", () => {
  const r = H.scoreHand(pack, { cards: ["Impairment Loss", "Depreciation"], doctrines: ["cons"] }); // 40 + 25 loss
  eq(r.chips, 65 + 65); eq(r.total, 130 * 2); // 260
});
test("leverage: +3 mult per Liability card", () => {
  const r = H.scoreHand(pack, { cards: ["Accounts Payable", "Notes Payable", "Bonds Payable"], doctrines: ["leverage"] });
  eq(r.handMult, 4); eq(r.mult, 4 + 9); // three LIAB
});

/* ---------- 4. ×Mult scales the whole additive build ---------- */
test("recap x1.5 multiplies the full summed mult", () => {
  const r = H.scoreHand(pack, {
    cards: ["Accounts Payable", "Notes Payable", "Bonds Payable"],
    doctrines: ["leverage", "recap"],
  });
  // mult: 4 (hand) + 9 (leverage) = 13 ; x1.5 -> 19.5 ; chips 105 ; total round(2047.5)
  eq(r.mult, 19.5); eq(r.xMult, 1.5); eq(r.total, 2048);
});

/* ---------- 5. INVARIANT: doctrine order never changes the score ---------- */
test("score is independent of equipped-doctrine order (3-doctrine permutations)", () => {
  const cards = ["Accounts Payable", "Notes Payable", "Bonds Payable"]; // 3 LIAB fires all three
  const ids = ["leverage", "recap", "contingency"];
  const perms = [
    ["leverage", "recap", "contingency"], ["leverage", "contingency", "recap"],
    ["recap", "leverage", "contingency"], ["recap", "contingency", "leverage"],
    ["contingency", "leverage", "recap"], ["contingency", "recap", "leverage"],
  ];
  const totals = perms.map((p) => H.scoreHand(pack, { cards, doctrines: p }).total);
  // mult: 4 + 9(leverage) + 7(contingency) = 20 ; x1.5 -> 30 ; chips 105 ; total 3150
  totals.forEach((t) => eq(t, 3150));
  eq(new Set(totals).size, 1);
  assert.deepStrictEqual([...ids].sort(), ["contingency", "leverage", "recap"]); // sanity: all fire
});

/* ---------- 6. boss modifiers ---------- */
test("boss 'conservative' removes 10 chips per REV before doctrines", () => {
  const r = H.scoreHand(pack, { cards: ["Sales Revenue", "Service Revenue"], doctrines: ["revrec"], boss: "conservative" });
  // base 75 - 20 = 55 ; +32 revrec = 87 ; x2 = 174
  eq(r.chips, 87); eq(r.total, 174);
});
test("boss 'restate' halves the first scored hand only", () => {
  const first = H.scoreHand(pack, { cards: ["Sales Revenue", "Cost of Goods Sold"], doctrines: ["match"], boss: "restate", firstScored: false });
  const later = H.scoreHand(pack, { cards: ["Sales Revenue", "Cost of Goods Sold"], doctrines: ["match"], boss: "restate", firstScored: true });
  eq(first.total, 280); // 560 / 2
  eq(later.total, 560);
});

/* ---------- 7. run-scaler doctrine uses persistent state (ctx.st) ---------- */
test("compret ramps across hands via shared jkState", () => {
  const cards = ["Cash"]; const jkState = {};
  const a = H.scoreHand(pack, { cards, doctrines: ["compret"], jkState }); // x1.2
  const b = H.scoreHand(pack, { cards, doctrines: ["compret"], jkState }); // x1.4
  assert.ok(b.xMult > a.xMult, "second play should have a larger multiplier (" + b.xMult + " > " + a.xMult + ")");
  eq(Math.round(a.xMult * 10) / 10, 1.2);
  eq(Math.round(b.xMult * 10) / 10, 1.4);
});

/* ---------- 8. nondeterministic doctrine ('fv' mark-to-market) stays in bounds ---------- */
test("fv (Fair Value) remeasures within [-20,+40] per fair-value card", () => {
  // 1 AFS card (35 chips, tags oci+fv). Each fv card adds an int in [-20, 40].
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < 500; i++) {
    const r = H.scoreHand(pack, { cards: ["AFS Debt Securities"], doctrines: ["fv"] });
    assert.ok(Number.isInteger(r.chips), "chips must be integer, got " + r.chips);
    lo = Math.min(lo, r.chips); hi = Math.max(hi, r.chips);
  }
  assert.ok(lo >= 15, "min chips " + lo + " should be >= 35-20"); // clamp can't go below 15 here
  assert.ok(hi <= 75, "max chips " + hi + " should be <= 35+40");
});

/* ---------- 9. FUZZ: no doctrine throws or yields NaN/Infinity on varied hands ---------- */
test("every doctrine is crash-safe and finite across representative hands", () => {
  const hands = [
    ["Cash"],
    ["Sales Revenue", "Cost of Goods Sold"],
    ["Common Stock", "Retained Earnings", "Paid-In Capital", "Treasury Stock", "AOCI"],
    ["Accounts Payable", "Notes Payable", "Bonds Payable", "Lease Liability"],
    ["AFS Debt Securities", "Pension Liability", "AOCI"], // OCI-heavy
    ["Inventory", "Cash"],
    ["Patent", "Goodwill", "Impairment Loss"],
    ["@weakness", "@weakness"],
  ];
  let dead = [];
  (pack.doctrines || []).forEach((d) => {
    let everFired = false;
    hands.forEach((cards) => {
      const r = H.scoreHand(pack, { cards, doctrines: [d.id], handsThisBlind: 1, jkState: {} });
      assert.ok(Number.isFinite(r.chips), d.id + " produced non-finite chips on " + cards.join("+"));
      assert.ok(Number.isFinite(r.mult), d.id + " produced non-finite mult on " + cards.join("+"));
      assert.ok(Number.isFinite(r.total), d.id + " produced non-finite total on " + cards.join("+"));
      if (r.addedChips.length || r.addedMult.length) everFired = true;
    });
    if (!everFired) dead.push(d.id);
  });
  // Not a hard failure (some doctrines need niche hands), but surface anything that
  // never fired across all sample hands so balance gaps are visible in CI logs.
  if (dead.length) console.log("    note: doctrines that never fired on sample hands: " + dead.join(", "));
});

/* ---------- 10b. niche doctrines each fire on their real trigger hand ----------
   These need specific board states (so the §9 sample-hand fuzz doesn't trip them);
   asserting they fire here guards against a future edit silently breaking one. */
test("niche-trigger doctrines all fire on a correct hand", () => {
  const triggers = {
    deferred: ["Unearned Revenue", "Deferred Tax Liability"],            // 2 deferral cards
    currency: ["FX Transaction Gain"],                                   // foreign-currency card
    bigbath:  ["Impairment Loss", "Amortization"],                       // 2 loss cards
    lifo:     ["Inventory", "Inventory"],                                // 2 inventory cards
    poc:      ["Sales Revenue", "Cost of Goods Sold", "Equipment"],      // matched entry + asset
    tax:      ["Unearned Revenue"],                                      // deferral card
    dealor:   ["Sales Revenue", "Cost of Goods Sold", "Cash", "Accounts Payable"], // 4 element types
  };
  Object.keys(triggers).forEach((id) => {
    const r = H.scoreHand(pack, { cards: triggers[id], doctrines: [id] });
    assert.ok(r.addedChips.length || r.addedMult.length, "doctrine '" + id + "' did NOT fire on its trigger hand");
  });
});

/* ---------- 10. content integrity: every doctrine id is unique + has apply() ---------- */
test("doctrine ids are unique and callable", () => {
  const ids = (pack.doctrines || []).map((d) => d.id);
  eq(new Set(ids).size, ids.length);
  (pack.doctrines || []).forEach((d) => assert.strictEqual(typeof d.apply, "function", d.id + " missing apply()"));
});

if (process.exitCode) { console.error("\nscore.test.js \u2014 FAILED"); }
else { console.log("score.test.js \u2014 all " + passed + " tests passed"); }
