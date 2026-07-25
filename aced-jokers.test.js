/* Node tests for aced-jokers.js — no framework, plain asserts. */
var assert = require("assert");
var fs = require("fs");
var vm = require("vm");
var SRC = fs.readFileSync(__dirname + "/aced-jokers.js", "utf8");
function load(){ var ctx={ window:{}, Math:Math }; vm.runInNewContext(SRC, ctx); return ctx.window.ACEDJokers; }
var J = load();

/* 1. No jokers: total = chips x mult. */
(function(){
  var r = J.score({ baseChips:20, baseMult:2, correct:true });
  assert.strictEqual(r.chips, 20, "chips passthrough");
  assert.strictEqual(r.mult, 2, "mult passthrough");
  assert.strictEqual(r.total, 40, "total = 20 x 2");
  console.log("PASS 1  base chips x mult");
})();

/* 2. Steady Hand adds flat chips; fires only on correct. */
(function(){
  var hit = J.score({ baseChips:10, baseMult:1, correct:true, jokers:["steady"] });
  assert.strictEqual(hit.chips, 25, "steady +15 chips");
  assert.strictEqual(hit.total, 25, "25 x 1");
  var miss = J.score({ baseChips:0, baseMult:1, correct:false, jokers:["steady"] });
  assert.strictEqual(miss.total, 0, "no chips on a miss");
  console.log("PASS 2  Steady Hand (+chips, correct-only)");
})();

/* 3. Streaker scales +3 mult per streak (capped at 8). */
(function(){
  var r = J.score({ baseChips:10, baseMult:1, correct:true, streak:4, jokers:["streaker"] });
  assert.strictEqual(r.mult, 1 + 12, "streak 4 -> +12 mult");
  var capped = J.score({ baseChips:10, baseMult:1, correct:true, streak:20, jokers:["streaker"] });
  assert.strictEqual(capped.mult, 1 + 24, "streak capped at 8 -> +24");
  console.log("PASS 3  Streaker scales + caps");
})();

/* 4. Conviction-gated jokers only fire on CERTAIN (high). */
(function(){
  var lo = J.score({ baseChips:10, baseMult:1, correct:true, conviction:"med", jokers:["sure","highroll"] });
  assert.strictEqual(lo.chips, 10, "Sure Thing dormant off-CERTAIN");
  assert.strictEqual(lo.mult, 1, "High Roller dormant off-CERTAIN");
  var hi = J.score({ baseChips:10, baseMult:2, correct:true, conviction:"high", jokers:["sure","highroll"] });
  assert.strictEqual(hi.chips, 45, "Sure Thing +35 on CERTAIN");
  assert.strictEqual(hi.mult, 3, "High Roller x1.5 on CERTAIN (2 -> 3)");
  console.log("PASS 4  conviction-gated jokers");
})();

/* 5. Chain Reaction xMult scales with the family chain. */
(function(){
  var none = J.score({ baseChips:10, baseMult:2, correct:true, chain:1, jokers:["chain"] });
  assert.strictEqual(none.mult, 2, "chain<2 -> no effect");
  var c3 = J.score({ baseChips:10, baseMult:2, correct:true, chain:3, jokers:["chain"] });
  assert.strictEqual(Math.round(c3.mult*100)/100, Math.round(2*(1+0.2*3)*100)/100, "chain 3 -> x1.6");
  console.log("PASS 5  Chain Reaction");
})();

/* 6. Comeback Kid fires only right after a miss. */
(function(){
  var plain = J.score({ baseChips:10, baseMult:1, correct:true, justRecovered:false, jokers:["comeback"] });
  assert.strictEqual(plain.chips, 10, "no comeback normally");
  var back = J.score({ baseChips:10, baseMult:1, correct:true, justRecovered:true, jokers:["comeback"] });
  assert.strictEqual(back.chips, 70, "+60 on recovery");
  console.log("PASS 6  Comeback Kid");
})();

/* 7. Multiple jokers combine: chips add, then mult applies, in loadout order. */
(function(){
  // Steady (+15 chips) + Streaker (+3*2 mult) + Glass Cannon (x2)
  var r = J.score({ baseChips:10, baseMult:1, correct:true, streak:2, jokers:["steady","streaker","glass"] });
  // chips: 10+15=25 ; mult: (1 + 6) then x2 = 14 ; total 350
  assert.strictEqual(r.chips, 25, "chips summed");
  assert.strictEqual(r.mult, 14, "add-mult then x-mult in order");
  assert.strictEqual(r.total, 350, "25 x 14 = 350");
  assert.strictEqual(r.fired.length, 3, "three jokers fired");
  console.log("PASS 7  jokers combine (chips then mult, ordered)");
})();

/* 8. Polymath / Scholar scale with run context. */
(function(){
  var poly = J.score({ baseChips:10, baseMult:1, correct:true, distinctFamilies:4, jokers:["polymath"] });
  assert.strictEqual(poly.mult, 1 + 20, "polymath +5 per distinct family");
  var sch = J.score({ baseChips:10, baseMult:1, correct:true, mastered:6, jokers:["scholar"] });
  assert.strictEqual(sch.chips, 40, "scholar +5 per mastered");
  console.log("PASS 8  Polymath / Scholar scale with run");
})();

/* 9. Shop: rarity-weighted, distinct, respects exclude, deterministic with seeded rng. */
(function(){
  // simple deterministic rng
  function seeded(seed){ var s=seed; return function(){ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; }; }
  var a = J.rollShop(3, { rng: seeded(42) }).map(function(j){return j.id;});
  var b = J.rollShop(3, { rng: seeded(42) }).map(function(j){return j.id;});
  assert.deepStrictEqual(a.join(","), b.join(","), "seeded shop is deterministic");
  assert.strictEqual(new Set(a).size, a.length, "shop offers are distinct");
  a.forEach(function(id){ assert.ok(J.def(id), id+" is a real joker"); });
  var ex = J.rollShop(5, { rng: seeded(7), exclude:["steady","streaker"] }).map(function(j){return j.id;});
  assert.ok(ex.indexOf("steady")===-1 && ex.indexOf("streaker")===-1, "excluded jokers never offered");
  console.log("PASS 9  shop: weighted, distinct, excludes, deterministic");
})();

console.log("\nALL TESTS PASSED");
