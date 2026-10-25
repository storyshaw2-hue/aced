/* tools/_integrate_batch07.js — fold the uploaded far-original-batch-05.json into the pack.
   - remaps each question's `source` from the other chat's fuller taxonomy to THIS pack's
     19 modules, by topic (table below);
   - regenerates the id from the new source + stem hash (consistent with the other batches);
   - shuffles choices (seeded) to balance the key and avoid a longest-answer tell;
   - DROPS any question that exact- or near-duplicates one already in the pool (so it adds
     new coverage instead of re-creating questions already authored in F1/F3 batches);
   - writes the survivors to content/cpa-far/far-original-batch-07.json.
   Run: node tools/_integrate_batch07.js
*/
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const SRC = "/mnt/user-data/uploads/far-original-batch-05.json";

// index -> corrected source (mapped by the actual topic of each question)
const REMAP = {
  0:"F1.M3", 1:"F1.M4", 2:"F1.M4", 3:"F1.M4", 4:"F2.M7", 5:"F1.M3", 6:"F2.M7", 7:"F1.M3",
  8:"F1.M3", 9:"F4.M2", 10:"F4.M5", 11:"F4.M5", 12:"F2.M2", 13:"F2.M3", 14:"F2.M4", 15:"F2.M5",
  16:"F2.M5", 17:"F2.M6", 18:"F3.M4", 19:"F3.M4", 20:"F4.M4", 21:"F1.M2", 22:"F3.M5", 23:"F2.M1",
  24:"F2.M1", 25:"F2.M1", 26:"F2.M4", 27:"F1.M3", 28:"F1.M2", 29:"F2.M5"
};
const VALID = new Set(["F1.M1","F1.M2","F1.M3","F1.M4","F2.M1","F2.M2","F2.M3","F2.M4","F2.M5","F2.M6","F2.M7","F3.M1","F3.M4","F3.M5","F4.M1","F4.M2","F4.M3","F4.M4","F4.M5"]);

function hash8(s){let h=5381;s=String(s||"");for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return("0000000"+h.toString(16)).slice(-8);}
function idFor(src,q){return "cpa-far-"+String(src).toLowerCase().replace(/[^a-z0-9]/g,"")+"-"+hash8(q);}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shuffle(arr,seed){const a=arr.slice(),r=mulberry32(seed);for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;}
function norm(s){return String(s||"").toLowerCase().replace(/\s+/g," ").replace(/[^a-z0-9 ]/g,"").trim();}
function toks(s){return new Set(norm(s).split(" ").filter(Boolean));}
function jac(a,b){let i=0;a.forEach(t=>{if(b.has(t))i++;});return i/(a.size+b.size-i||1);}

// existing pool (everything already in content/, excluding this batch if present)
const dir = path.resolve(ROOT, "content", "cpa-far");
const existing = [];
fs.readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("_") && f !== "far-original-batch-07.json")
  .forEach(f => { const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); (d.questions || []).forEach(q => existing.push({ q: q.q, source: q.source })); });
const existingTok = existing.map(e => toks(e.q));

const upl = JSON.parse(fs.readFileSync(SRC, "utf8")).questions;
const kept = [], dropped = [];
const keptTok = [];
upl.forEach((q, i) => {
  const src = REMAP[i] || q.source;
  if (!VALID.has(src)) { dropped.push({ i, why: "unmapped source " + src, q: q.q }); return; }
  const correct = q.choices[q.answer];
  const ch = shuffle(q.choices, parseInt(hash8(q.q), 16));
  const rec = { id: idFor(src, q.q), source: src, diff: q.diff || "medium", q: q.q, choices: ch, answer: ch.indexOf(correct), explain: q.explain };
  // duplicate check vs existing pool AND vs already-kept this batch
  const tk = toks(q.q);
  let dupOf = null, sim = 0;
  for (let j = 0; j < existing.length; j++) { const s = jac(tk, existingTok[j]); if (s > sim) { sim = s; if (s >= 0.85) dupOf = existing[j]; } }
  if (!dupOf) for (let j = 0; j < kept.length; j++) { if (jac(tk, keptTok[j]) >= 0.85) { dupOf = { q: kept[j].q, source: kept[j].source }; sim = 1; break; } }
  if (dupOf) { dropped.push({ i, why: "dup(" + sim.toFixed(2) + ") of [" + dupOf.source + "] " + dupOf.q.slice(0, 55), q: q.q, src }); return; }
  kept.push(rec); keptTok.push(tk);
});

const doc = { $schema: "aced-question-bank/v1", pack: "cpa-far", section: "FAR", bank: "far-original-batch-07", generated: false, count: kept.length, questions: kept };
fs.writeFileSync(path.join(dir, "far-original-batch-07.json"), JSON.stringify(doc, null, 1) + "\n");

const byMod = {}; kept.forEach(r => byMod[r.source] = (byMod[r.source] || 0) + 1);
console.log("uploaded: " + upl.length + " | kept: " + kept.length + " | dropped as dup/invalid: " + dropped.length);
console.log("survivors by module:", JSON.stringify(byMod));
console.log("\ndropped (redundant with content already in the pack):");
dropped.forEach(d => console.log("  #" + d.i + "  " + d.why));
console.log("\nwrote content/cpa-far/far-original-batch-07.json (" + kept.length + " questions)");
