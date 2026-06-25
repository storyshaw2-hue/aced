/* server/leaderboard.test.js — run: node leaderboard.test.js (or npm test) */
"use strict";
const assert = require("assert");
const { leaderboardMetrics } = require("./leaderboard");
const NOW = 1700000000000, DAY = 86400000;

// 1) honest 10-day-old account: one module half-mastered, one fully
let m = leaderboardMetrics({ mastery:{ "F1.M1":25, "F2.M1":60 }, dailyV1:{ bestStreak:7 } }, NOW-10*DAY, NOW);
assert.strictEqual(m.readiness, 75);   // 25*2=50 ; 60*2=120->100 ; avg=75
assert.strictEqual(m.bestStreak, 7);

// 2) forged snapshot on a 3-day-old account: impossible streak, absurd mastery, junk mock
m = leaderboardMetrics({ mastery:{ x:999999 }, dailyV1:{ bestStreak:1e9 }, mockBest:1e9 }, NOW-3*DAY, NOW);
assert.strictEqual(m.readiness, 100);  // per-module capped
assert.strictEqual(m.bestStreak, 4);   // 3 days + 1 grace
assert.strictEqual(m.mockBest, 100);   // capped to MOCK_MAX

// 3) garbage / missing fields don't throw and floor to 0
m = leaderboardMetrics({ mastery:{ a:"nope" }, dailyV1:{ bestStreak:NaN } }, null, NOW);
assert.deepStrictEqual([m.readiness, m.bestStreak, m.mockBest], [0,0,0]);

// 4) brand-new account (created today) can still legitimately have a 1-day streak
m = leaderboardMetrics({ dailyV1:{ bestStreak:1 } }, NOW, NOW);
assert.strictEqual(m.bestStreak, 1);

console.log("leaderboard.test.js — all assertions passed");
