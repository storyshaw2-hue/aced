/* server/merge.js — the sync merge, implementing docs/BACKEND_SPEC.md exactly.
   Pure function, no I/O, so it can be unit-tested (see `node server/merge.test.js`).

   Rules:
     - mastery:            take the MAX per module (progress is monotonic; never regress).
     - dailyV1.bestStreak: MAX.  dailyV1.currentStreak/lastDate/freezes: trust the side with
                           the newer `updatedAt` (the client owns "today").
     - review:             per qKey, keep the record with the newer `last` (tie -> larger `seen`).
     - everything else:    last-write-wins per top-level key, by `updatedAt`.
*/
"use strict";

function mergeMastery(a, b) {
  const out = Object.assign({}, a || {});
  const src = b || {};
  for (const k in src) if (Object.prototype.hasOwnProperty.call(src, k)) {
    const av = +out[k] || 0, bv = +src[k] || 0;
    out[k] = Math.max(av, bv);
  }
  return out;
}

function mergeReview(a, b) {
  const out = {};
  const keys = new Set(Object.keys(a || {}).concat(Object.keys(b || {})));
  keys.forEach(k => {
    const ra = (a || {})[k], rb = (b || {})[k];
    if (ra && rb) {
      // Resolve by the NEWER `last` timestamp, not the larger `seen`. Keying on
      // seen let an old, high-exposure record (e.g. a month-old box:0 failure)
      // overwrite a more recent success, silently destroying newer mastery.
      // seen === ok + miss is an invariant (aced-core bumps seen with exactly one
      // of ok/miss), so whole records stay consistent; tie -> keep more history.
      const la = +ra.last || 0, lb = +rb.last || 0;
      out[k] = (la !== lb) ? (la > lb ? ra : rb) : ((+ra.seen || 0) >= (+rb.seen || 0) ? ra : rb);
    }
    else out[k] = ra || rb;
  });
  return out;
}

function mergeDaily(a, b, aNewer) {
  a = a || {}; b = b || {};
  const newer = aNewer ? a : b;          // side that owns "today"
  const out = Object.assign({}, b, a);   // start from a union
  // current-day fields come from the newer side
  out.currentStreak = newer.currentStreak != null ? newer.currentStreak : (out.currentStreak || 0);
  out.lastDate = newer.lastDate != null ? newer.lastDate : (out.lastDate || null);
  out.freezes = newer.freezes != null ? newer.freezes : (out.freezes || 0);
  // best streak is monotonic
  out.bestStreak = Math.max(+(a.bestStreak || 0), +(b.bestStreak || 0));
  out.longestStreak = Math.max(+(a.longestStreak || 0), +(b.longestStreak || 0), out.bestStreak || 0);
  // per-date results: union (a wins on conflict — it's the same deterministic Close anyway)
  out.results = Object.assign({}, b.results || {}, a.results || {});
  return out;
}

/* Merge two snapshots of the shape produced by ACEDCore.sync.snapshot():
   { v, pack, updatedAt, data: { mastery, review, calib, dailyV1, ... } }
   `incoming` is the just-pushed client snapshot; `stored` is what the server holds.
   Returns the merged `data` object. */
function mergeState(stored, incoming) {
  const sd = (stored && stored.data) || {};
  const id = (incoming && incoming.data) || {};
  const incomingNewer = (incoming && incoming.updatedAt || 0) >= (stored && stored.updatedAt || 0);
  const out = {};
  const keys = new Set(Object.keys(sd).concat(Object.keys(id)));
  keys.forEach(k => {
    if (k === "mastery") out[k] = mergeMastery(sd[k], id[k]);
    else if (k === "review") out[k] = mergeReview(sd[k], id[k]);
    else if (k === "dailyV1") out[k] = mergeDaily(id[k], sd[k], incomingNewer); // a=incoming
    else {
      // last-write-wins by snapshot updatedAt
      if (k in id && k in sd) out[k] = incomingNewer ? id[k] : sd[k];
      else out[k] = (k in id) ? id[k] : sd[k];
    }
  });
  return out;
}

module.exports = { mergeState, mergeMastery, mergeReview, mergeDaily };
