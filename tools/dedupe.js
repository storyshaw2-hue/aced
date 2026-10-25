#!/usr/bin/env node
/* tools/dedupe.js — collapse near-duplicate questions in the canonical JSON banks.
   ----------------------------------------------------------------------------
   Clusters questions whose stems are >= --threshold token-Jaccard similar (the same
   metric the validator warns on). Within each cluster it keeps ONE representative per
   distinct answer (so genuinely different numeric variants survive), preferring the
   longest explanation, then caps the kept count per cluster at --keep K. The rest are
   removed. Pure same-answer clones (e.g. the same question with a different company
   name) collapse to a single item.

   Dry-run by default (writes nothing). Add --write to rewrite content/<pack>/*.json
   in place and emit a removal report.

   Run:
     node tools/dedupe.js                       # dry-run, K=2, threshold 0.85, pack cpa-far
     node tools/dedupe.js --keep 1              # most aggressive (clears all near-dup pairs)
     node tools/dedupe.js --keep 2 --write      # apply
*/
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const PACK = arg("--pack", "cpa-far");
const K = parseInt(arg("--keep", "2"), 10);
const TH = parseFloat(arg("--threshold", "0.85"));
const WRITE = process.argv.includes("--write");

const dir = path.resolve(ROOT, "content", PACK);
const files = fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort();
const banks = files.map(f => ({ file: f, doc: JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) }));

// flat pool with back-references to (bank, position)
const pool = [];
banks.forEach((b, bi) => (b.doc.questions || []).forEach((q, qi) => pool.push({ q, bi, qi, gi: pool.length })));

function norm(s){return String(s||"").toLowerCase().replace(/\s+/g," ").replace(/[^a-z0-9 ]/g,"").trim();}
function toks(s){return new Set(norm(s).split(" ").filter(Boolean));}
function jac(a,b){let i=0;a.forEach(t=>{if(b.has(t))i++;});return i/(a.size+b.size-i||1);}
const T = pool.map(p => toks(p.q.q));

// union-find clustering at the Jaccard threshold
const par = pool.map((_, i) => i); const find = x => par[x] === x ? x : (par[x] = find(par[x])); const uni = (a, b) => { par[find(a)] = find(b); };
for (let i = 0; i < pool.length; i++) for (let j = i + 1; j < pool.length; j++) if (jac(T[i], T[j]) >= TH) uni(i, j);
const comp = {}; pool.forEach((_, i) => { const r = find(i); (comp[r] = comp[r] || []).push(i); });
const clusters = Object.values(comp).filter(c => c.length > 1).sort((a, b) => b.length - a.length);

const explainLen = i => String(pool[i].q.explain || "").length;
const ansText = i => norm(pool[i].q.choices ? pool[i].q.choices[pool[i].q.answer] : "");

const removeSet = new Set();
const report = [];
clusters.forEach((cl, n) => {
  // best member per distinct answer (longest explanation, then stable by global index)
  const byAns = new Map();
  cl.forEach(i => { const a = ansText(i); const cur = byAns.get(a); if (cur == null || explainLen(i) > explainLen(cur) || (explainLen(i) === explainLen(cur) && i < cur)) byAns.set(a, i); });
  let reps = [...byAns.values()].sort((a, b) => explainLen(b) - explainLen(a) || a - b);
  const keep = new Set(reps.slice(0, K));
  const removed = cl.filter(i => !keep.has(i));
  removed.forEach(i => removeSet.add(i));
  report.push({
    cluster: n + 1,
    module: [...new Set(cl.map(i => pool[i].q.source))].join(","),
    size: cl.length, distinctAnswers: byAns.size, kept: [...keep].length, removed: removed.length,
    keptIds: [...keep].map(i => pool[i].q.id),
    removedIds: removed.map(i => pool[i].q.id)
  });
});

// impact summary
const before = pool.length, removedN = removeSet.size, after = before - removedN;
const fAfter = {}, fBefore = {};
pool.forEach((p, i) => { const g = String(p.q.source).split(".")[0]; fBefore[g] = (fBefore[g] || 0) + 1; if (!removeSet.has(i)) fAfter[g] = (fAfter[g] || 0) + 1; });
const perBankRemoved = {}; pool.forEach((p, i) => { if (removeSet.has(i)) perBankRemoved[banks[p.bi].file] = (perBankRemoved[banks[p.bi].file] || 0) + 1; });
// residual near-dup pairs after removal
let residual = 0;
for (let i = 0; i < pool.length; i++) if (!removeSet.has(i)) for (let j = i + 1; j < pool.length; j++) if (!removeSet.has(j) && jac(T[i], T[j]) >= TH) residual++;

console.log(`\nDEDUPE ${WRITE ? "(WRITE)" : "(dry-run)"}  pack=${PACK}  keep=${K}  threshold=${TH}`);
console.log(`clusters: ${clusters.length} | questions before: ${before} | removed: ${removedN} | after: ${after}`);
console.log(`near-dup pairs:  ${(() => { let c = 0; for (let i = 0; i < pool.length; i++) for (let j = i + 1; j < pool.length; j++) if (jac(T[i], T[j]) >= TH) c++; return c; })()} -> ${residual} after removal`);
console.log("removed per bank:", JSON.stringify(perBankRemoved));
console.log("F-group counts (before -> after):");
Object.keys(fBefore).sort().forEach(g => console.log(`  ${g}: ${fBefore[g]} -> ${fAfter[g] || 0}  (${((fAfter[g] || 0) / after * 100).toFixed(0)}%)`));

if (WRITE) {
  // rewrite each bank JSON without removed questions
  const removedByBank = {};
  pool.forEach((p, i) => { if (removeSet.has(i)) (removedByBank[p.bi] = removedByBank[p.bi] || new Set()).add(p.qi); });
  banks.forEach((b, bi) => {
    const drop = removedByBank[bi]; if (!drop) return;
    const before2 = b.doc.questions.length;
    b.doc.questions = b.doc.questions.filter((_, qi) => !drop.has(qi));
    b.doc.count = b.doc.questions.length;
    fs.writeFileSync(path.join(dir, b.file), JSON.stringify(b.doc, null, 1) + "\n");
    console.log(`  rewrote content/${PACK}/${b.file}: ${before2} -> ${b.doc.questions.length}`);
  });
  // write the audit report
  const rep = { pack: PACK, keep: K, threshold: TH, before, removed: removedN, after, perBankRemoved, clusters: report };
  const repPath = path.resolve(ROOT, "content", PACK, "_dedupe-report.json");
  fs.writeFileSync(repPath, JSON.stringify(rep, null, 1) + "\n");
  console.log("  wrote audit report: content/" + PACK + "/_dedupe-report.json");
} else {
  console.log("\n(no files changed — re-run with --write to apply)");
}
