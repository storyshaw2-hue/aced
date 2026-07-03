/* server/leaderboard.test.js — run: node leaderboard.test.js (or npm test) */
"use strict";
const assert = require("assert");
const { leaderboardMetrics } = require("./leaderboard");
const NOW = 1700000000000, DAY = 86400000;

// 1) honest 10-day-old FAR account (20 modules): two of twenty modules touched.
//    Readiness divides by the pack's TRUE module count, so partial coverage reads
//    low — matching the client's own blueprint-wide meter.
let m = leaderboardMetrics({ mastery:{ "F1.M1":25, "F2.M1":60 }, dailyV1:{ bestStreak:7 } }, NOW-10*DAY, NOW, 20);
assert.strictEqual(m.readiness, 8);    // (25*2=50)+(60*2=120->100)=150 ; /20=7.5 -> 8
assert.strictEqual(m.bestStreak, 7);

// 2) forged snapshot on a 3-day-old account: the classic readiness exploit — send a
//    single maxed module and delete the rest. Dividing by the pack's real module
//    count (not the payload's key count) stops it inflating past its true share.
m = leaderboardMetrics({ mastery:{ "F1.M1":999999 }, dailyV1:{ bestStreak:1e9 }, mockBest:1e9 }, NOW-3*DAY, NOW, 20);
assert.strictEqual(m.readiness, 5);    // one capped-100 module / 20 modules = 5%, NOT 100%
assert.strictEqual(m.bestStreak, 4);   // 3 days + 1 grace
assert.strictEqual(m.mockBest, 100);   // capped to MOCK_MAX

// 3) garbage / missing fields don't throw and floor to 0
m = leaderboardMetrics({ mastery:{ a:"nope" }, dailyV1:{ bestStreak:NaN } }, null, NOW);
assert.deepStrictEqual([m.readiness, m.bestStreak, m.mockBest], [0,0,0]);

// 4) brand-new account (created today) can still legitimately have a 1-day streak
m = leaderboardMetrics({ dailyV1:{ bestStreak:1 } }, NOW, NOW);
assert.strictEqual(m.bestStreak, 1);

// 5) legacy safety: called without a module count (unknown pack), readiness falls
//    back to averaging over the keys present — no throw, mirrors pre-hardening math.
m = leaderboardMetrics({ mastery:{ "F1.M1":25, "F2.M1":60 } }, NOW-10*DAY, NOW);
assert.strictEqual(m.readiness, 75);

console.log("leaderboard.test.js — all assertions passed");
