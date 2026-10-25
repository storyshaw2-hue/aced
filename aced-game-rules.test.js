"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const R = require("./aced-game-rules");
const sandbox = { window: {} }; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync("packs/core-jokers.js", "utf8"), sandbox);
const J = sandbox.window.ACED_CORE_JOKERS.jokers;
const deck = R.deck(["One", "Two"]);
const cards = (ranks, suits) => ranks.map((rank, i) => deck.find(c => c.rank === rank && c.el === (suits || ["S", "H", "D", "C", "S"])[i]));
const fixtures = [
  [[10, 11, 12, 13, 14], ["S", "S", "S", "S", "S"], "Straight Flush"],
  [[9, 9, 9, 9, 4], ["S", "H", "D", "C", "S"], "Four of a Kind"],
  [[9, 9, 9, 4, 4], ["S", "H", "D", "C", "S"], "Full House"],
  [[2, 5, 9, 11, 14], ["S", "S", "S", "S", "S"], "Flush"],
  [[2, 3, 4, 5, 14], null, "Straight"],
  [[9, 9, 9, 2, 4], null, "Three of a Kind"],
  [[9, 9, 4, 4, 14], null, "Two Pair"],
  [[9, 9, 4, 6, 14], null, "Pair"],
  [[2, 4, 6, 9, 14], null, "High Card"]
];
fixtures.forEach(([ranks, suits, name]) => assert.equal(R.detect(cards(ranks, suits)).name, name));
assert.equal(R.detect([]), null);
assert.equal(R.deck(["Topic"]).length, 52);
assert.equal(new Set(R.deck(["Topic"]).map(c => c.id)).size, 52);
const base = () => ({ seed: 12345, topics: ["One", "Two"], money: 20, handsLeft: 3, discards: 2, round: 2, handsPlayed: 1, insight: 3, conv: { One: 2, Two: 1 }, boosts: {}, jokerState: {}, lastCorrect: true, masteredCount: 1, redeemedCount: 1 });
const pair = cards([9, 9], ["S", "H"]);
const s = R.score(pair, ["warmup", "deepbreath"], base(), J, false);
assert.equal(s.total, (10 + 18 + 25) * (2 + 4));
const previewState = base(), before = JSON.stringify(previewState);
R.score(pair, ["flowstate", "compounding"], previewState, J, true);
assert.equal(JSON.stringify(previewState), before, "previews must not mutate run state");
const actual = base(); R.score(pair, ["compounding"], actual, J, false);
assert.ok(actual.jokerState.compounding.x > 1, "actual play advances scaler state");
const x1 = { seed: R.hash("same daily seed") }, x2 = { seed: R.hash("same daily seed") };
assert.deepEqual(R.shuffle(deck, x1), R.shuffle(deck, x2), "daily deck shuffle is deterministic");
const additiveA = { id: "times", apply: c => c.xMult(2) }, additiveB = { id: "plus", apply: c => c.addMult(3) };
const both = [additiveA, additiveB];
assert.equal(R.score(pair, ["times", "plus"], base(), both).total, R.score(pair, ["plus", "times"], base(), both).total, "multipliers apply after all additions");
J.forEach(j => {
  const result = R.score(cards([10, 11, 12, 13, 14], ["S", "S", "S", "S", "S"]), ["warmup", j.id, "deepbreath"], base(), J);
  assert.deepEqual(result.errors, [], j.id + " must have all required context");
  assert.ok(Number.isFinite(result.total) && result.total >= 0, j.id + " returns a finite score");
});
const chain = R.score(pair, ["echo", "mirror"], base(), J);
assert.deepEqual(chain.errors, [], "cyclic copying is bounded");
console.log("aced-game-rules: all hand types, deterministic shuffle, score ordering, previews, and " + J.length + " jokers passed.");
