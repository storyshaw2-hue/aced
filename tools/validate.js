#!/usr/bin/env node
/* tools/validate.js  —  ACED question-bank linter (zero dependencies)
   ----------------------------------------------------------------------------
   Loads the pack named by --pack (default cpa-far) and every bank it lists,
   then runs structural + quality + coverage checks and prints a report.

   Exit code: 1 if any ERROR, else 0. (WARN/INFO never fail the build.)

   Run:
     node tools/validate.js
     node tools/validate.js --pack cpa-far
     node tools/validate.js --json        # machine-readable summary on stdout
   ----------------------------------------------------------------------------
   Checks
     ERRORS (block):
       - missing/blank required field (source, diff, q, choices, answer, explain)
       - source not in pack MODULES
       - choices not an array of 4 non-empty strings
       - duplicate choices within a question
       - answer not an integer index into choices
       - exact-duplicate stem across the whole pool
     WARNINGS (quality tells graders notice):
       - explanation shorter than MIN_EXPLAIN chars
       - diff not in {easy,medium,hard}
       - near-duplicate stems (token Jaccard >= NEAR_DUP)
       - answer-key skew (any option's share deviates > KEY_SKEW from 25%)
       - "longest-choice == answer" tell over LONGEST_TELL of items
       - empty / thin modules (< THIN_MODULE questions)
     INFO:
       - per-bank counts, per-module counts, difficulty mix,
         F-group coverage vs blueprintWeights, CPA-reviewed share
*/
"use strict";
const { loadPack, loadQuestions } = require("./lib/load-banks");

const MIN_EXPLAIN = 40;      // chars
const NEAR_DUP = 0.85;       // token Jaccard threshold
const KEY_SKEW = 0.12;       // allowed deviation from 0.25 per option
const LONGEST_TELL = 0.40;   // share where correct == longest choice
const THIN_MODULE = 3;       // questions below this = thin

const args = process.argv.slice(2);
const packId = (args[(args.indexOf("--pack") + 1)] && args.indexOf("--pack") >= 0) ? args[args.indexOf("--pack") + 1] : "cpa-far";
const asJson = args.includes("--json");

const errors = [], warns = [], infos = [];
const E = (m) => errors.push(m);
const W = (m) => warns.push(m);
const I = (m) => infos.push(m);

function norm(s) { return String(s == null ? "" : s).toLowerCase().replace(/\s+/g, " ").replace(/[^a-z0-9 ]/g, "").trim(); }
// Choice equality must NOT strip sign-bearing punctuation: in accounting, "$100,000" and
// "($100,000)" are different answers (the classic sign-flip distractor). So only fold case
// and whitespace here — keep parentheses, minus signs, $, %, commas, decimals.
function normChoice(s) { return String(s == null ? "" : s).toLowerCase().replace(/\s+/g, " ").trim(); }
function tokens(s) { return new Set(norm(s).split(" ").filter(Boolean)); }
function jaccard(a, b) { let inter = 0; a.forEach(t => { if (b.has(t)) inter++; }); const uni = a.size + b.size - inter; return uni ? inter / uni : 0; }

let pack, loaded;
try {
  pack = loadPack("packs/" + packId + ".js");
  loaded = loadQuestions(pack.questionBanks || []);
} catch (e) {
  console.error("FATAL: " + e.message);
  process.exit(1);
}
const Q = loaded.questions;
const MODULES = pack.modules || {};
const WEIGHTS = pack.blueprintWeights || {};

/* ---------- structural pass ---------- */
const stemSeen = new Map(); // normalized stem -> first idx
Q.forEach((q, i) => {
  const where = "[" + (q.source || "?") + " #" + i + "]";
  if (!q.source || !MODULES[q.source]) E(where + " source '" + q.source + "' is not a known module");
  if (!q.q || !String(q.q).trim()) E(where + " empty stem (q)");
  if (!Array.isArray(q.choices) || q.choices.length !== 4) E(where + " choices must be an array of 4 (got " + (Array.isArray(q.choices) ? q.choices.length : typeof q.choices) + ")");
  else {
    if (q.choices.some(c => !String(c == null ? "" : c).trim())) E(where + " has a blank choice");
    const set = new Set(q.choices.map(c => normChoice(c)));
    if (set.size !== q.choices.length) E(where + " has duplicate choices");
  }
  if (!Number.isInteger(q.answer) || q.answer < 0 || (Array.isArray(q.choices) && q.answer >= q.choices.length)) E(where + " answer index " + q.answer + " out of range");
  if (!q.explain || !String(q.explain).trim()) E(where + " missing explanation");
  else if (String(q.explain).trim().length < MIN_EXPLAIN) W(where + " explanation is very short (" + String(q.explain).trim().length + " chars)");
  if (q.diff && !["easy", "medium", "hard"].includes(String(q.diff))) W(where + " diff '" + q.diff + "' not in easy|medium|hard");
  if (q.q) {
    const n = norm(q.q);
    if (stemSeen.has(n)) E(where + " exact-duplicate stem of #" + stemSeen.get(n));
    else stemSeen.set(n, i);
  }
});

/* ---------- near-duplicate stems (cheap O(n^2) over a few hundred) ---------- */
const toks = Q.map(q => tokens(q.q));
let nearPairs = 0;
for (let i = 0; i < Q.length; i++) {
  for (let j = i + 1; j < Q.length; j++) {
    if (norm(Q[i].q) === norm(Q[j].q)) continue; // already an exact-dup error
    const sim = jaccard(toks[i], toks[j]);
    if (sim >= NEAR_DUP) { nearPairs++; if (nearPairs <= 20) W("near-duplicate stems (" + sim.toFixed(2) + "): #" + i + " [" + Q[i].source + "] ~ #" + j + " [" + Q[j].source + "]"); }
  }
}
if (nearPairs > 20) W("...and " + (nearPairs - 20) + " more near-duplicate pairs");

/* ---------- answer-key balance ---------- */
const keyCount = [0, 0, 0, 0];
let longestIsAnswer = 0, scored = 0;
Q.forEach(q => {
  if (Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4) keyCount[q.answer]++;
  if (Array.isArray(q.choices) && q.choices.length === 4 && Number.isInteger(q.answer)) {
    scored++;
    const lens = q.choices.map(c => String(c).length);
    const max = Math.max.apply(null, lens);
    if (lens[q.answer] === max && lens.filter(l => l === max).length === 1) longestIsAnswer++;
  }
});
const keyTotal = keyCount.reduce((a, b) => a + b, 0) || 1;
const keyShare = keyCount.map(c => c / keyTotal);
keyShare.forEach((s, i) => { if (Math.abs(s - 0.25) > KEY_SKEW) W("answer-key skew: option " + "ABCD"[i] + " is " + (s * 100).toFixed(0) + "% of keys (target ~25%)"); });
if (scored && longestIsAnswer / scored > LONGEST_TELL) W("'longest choice is the answer' in " + ((longestIsAnswer / scored) * 100).toFixed(0) + "% of items — a giveaway pattern; vary distractor length");

/* ---------- module coverage ---------- */
const perMod = {};
Object.keys(MODULES).forEach(m => perMod[m] = 0);
Q.forEach(q => { if (q.source != null) perMod[q.source] = (perMod[q.source] || 0) + 1; });
const empty = Object.keys(MODULES).filter(m => (perMod[m] || 0) === 0);
const thin = Object.keys(MODULES).filter(m => (perMod[m] || 0) > 0 && (perMod[m] || 0) < THIN_MODULE);
if (empty.length) W("EMPTY modules (0 questions): " + empty.join(", "));
if (thin.length) W("THIN modules (< " + THIN_MODULE + "): " + thin.map(m => m + "=" + perMod[m]).join(", "));

/* ---------- info: counts, difficulty, blueprint, reviewed ---------- */
I("Pack: " + pack.id + " (" + pack.section + ")  ·  banks: " + (pack.questionBanks || []).length + "  ·  total questions: " + Q.length);
loaded.perBank.forEach(b => I("  bank " + b.bank.replace(/^packs\//, "") + " → " + b.count));
const diff = {};
Q.forEach(q => diff[q.diff || "?"] = (diff[q.diff || "?"] || 0) + 1);
I("Difficulty mix: " + Object.entries(diff).map(([k, v]) => k + " " + v + " (" + ((v / Q.length) * 100).toFixed(0) + "%)").join(" · "));
I("Answer-key spread: " + keyCount.map((c, i) => "ABCD"[i] + " " + ((c / keyTotal) * 100).toFixed(0) + "%").join(" · "));
// F-group coverage vs blueprint
const fGroup = {};
Q.forEach(q => { const g = String(q.source || "").split(".")[0]; if (g) fGroup[g] = (fGroup[g] || 0) + 1; });
const fKeys = Object.keys(WEIGHTS).length ? Object.keys(WEIGHTS) : Object.keys(fGroup);
I("Blueprint coverage (have% vs target%):");
fKeys.forEach(g => {
  const have = (fGroup[g] || 0) / (Q.length || 1);
  const target = WEIGHTS[g];
  const flag = (target != null && Math.abs(have - target) > 0.08) ? "  <-- off-weight" : "";
  I("  " + g + ": " + (fGroup[g] || 0) + " items, " + (have * 100).toFixed(0) + "%" + (target != null ? " vs target " + (target * 100).toFixed(0) + "%" : "") + flag);
});
const reviewed = Q.filter(q => q.reviewed).length;
I("CPA-reviewed: " + reviewed + " / " + Q.length + " (" + ((reviewed / (Q.length || 1)) * 100).toFixed(0) + "%)");
// thinnest modules, surfaced for authoring priority
const ranked = Object.keys(MODULES).map(m => ({ m, n: perMod[m] || 0 })).sort((a, b) => a.n - b.n).slice(0, 6);
I("Thinnest modules (author here next): " + ranked.map(r => r.m + "=" + r.n).join(", "));

/* ---------- report ---------- */
if (asJson) {
  console.log(JSON.stringify({ pack: pack.id, total: Q.length, errors, warns, perModule: perMod, keyShare, reviewed }, null, 2));
  process.exit(errors.length ? 1 : 0);
}
const line = "─".repeat(64);
console.log("\n" + line + "\nACED bank validation — " + pack.id + "\n" + line);
infos.forEach(m => console.log("  " + m));
console.log(line);
if (warns.length) { console.log("WARNINGS (" + warns.length + "):"); warns.forEach(m => console.log("  ⚠ " + m)); console.log(line); }
if (errors.length) { console.log("ERRORS (" + errors.length + "):"); errors.forEach(m => console.log("  ✘ " + m)); console.log(line); }
console.log(errors.length ? "RESULT: FAIL (" + errors.length + " errors, " + warns.length + " warnings)\n" : "RESULT: PASS" + (warns.length ? " with " + warns.length + " warnings" : " — clean") + "\n");
process.exit(errors.length ? 1 : 0);
