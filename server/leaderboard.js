/* server/leaderboard.js — derive the PUBLIC leaderboard row from a synced state
   snapshot, with sanity caps. The /sync body is fully client-controlled, so these
   bounds are what stop a tampered client from posting an impossible streak or
   readiness and topping the board. Pure + dependency-free so it unit-tests cleanly,
   mirroring merge.js / merge.test.js. */
"use strict";

const DAY_MS = 86400000;
const MOCK_MAX = 100;         // assumes mock score is a 0–100 percent; raise if it's a raw total
const STREAK_ABS_MAX = 3650;  // ~10y absolute ceiling, independent of account age

// coerce to a finite integer within [lo,hi]; anything non-finite collapses to lo.
function intIn(v, lo, hi) {
  const n = Math.round(Number(v));
  if (!isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

function leaderboardMetrics(merged, createdAt, now) {
  const d  = merged && typeof merged === "object" ? merged : {};
  const ds = d.dailyV1 && typeof d.dailyV1 === "object" ? d.dailyV1 : {};

  // readiness: average per-module mastery, each capped to the same 0–100 the client
  // displays (min(100, raw*2)), then clamped 0–100. Also corrects a latent bug where
  // the old code averaged RAW mastery points (which can exceed 100).
  const mast = d.mastery && typeof d.mastery === "object" ? d.mastery : {};
  const keys = Object.keys(mast);
  let sum = 0;
  for (let i = 0; i < keys.length; i++) sum += intIn(Number(mast[keys[i]]) * 2, 0, 100);
  const readiness = keys.length ? intIn(sum / keys.length, 0, 100) : 0;

  // a streak can't exceed the account's age (+1 day grace), nor the absolute ceiling.
  const byAge = (isFinite(createdAt) && createdAt > 0)
    ? Math.floor((now - createdAt) / DAY_MS) + 1
    : STREAK_ABS_MAX;
  const bestStreak = intIn(ds.bestStreak, 0, Math.min(byAge, STREAK_ABS_MAX));

  const mockBest = intIn(d.mockBest, 0, MOCK_MAX);

  return { bestStreak, readiness, mockBest };
}

module.exports = { leaderboardMetrics };
