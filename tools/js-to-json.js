#!/usr/bin/env node
/* tools/js-to-json.js  —  migrate hand-edited JS banks to canonical JSON (zero deps)
   ----------------------------------------------------------------------------
   Reads the pack's questionBanks (the .js files that ship today) and writes one
   canonical JSON file per bank under content/<pack>/. Each question gets a STABLE
   id derived from its module + a hash of the stem, so the id survives re-ordering,
   review-key joins, errata, and analytics. Field names are kept identical to the
   runtime schema (source/diff/q/choices/answer/explain) so the round-trip is lossless
   and the engine never has to change.

   Run:  node tools/js-to-json.js            # pack=cpa-far
         node tools/js-to-json.js --pack cpa-far
*/
"use strict";
const fs = require("fs");
const path = require("path");
const { loadPack, loadQuestions, ROOT } = require("./lib/load-banks");

const args = process.argv.slice(2);
const packId = args.indexOf("--pack") >= 0 ? args[args.indexOf("--pack") + 1] : "cpa-far";

function hash8(s) { let h = 5381, i; s = String(s || ""); for (i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return ("0000000" + h.toString(16)).slice(-8); }
function idFor(packId, q) { return packId + "-" + String(q.source || "x").toLowerCase().replace(/[^a-z0-9]/g, "") + "-" + hash8(q.q); }

const pack = loadPack("packs/" + packId + ".js");
const banks = pack.questionBanks || [];
const { questions, perBank } = loadQuestions(banks);

const outDir = path.resolve(ROOT, "content", packId);
fs.mkdirSync(outDir, { recursive: true });

let cursor = 0, totalIds = new Set(), collisions = 0, written = 0;
perBank.forEach(({ bank, count }) => {
  const slice = questions.slice(cursor, cursor + count); cursor += count;
  const out = slice.map(q => {
    const id = idFor(packId, q);
    if (totalIds.has(id)) collisions++; totalIds.add(id);
    const rec = { id: id, source: q.source, diff: q.diff || "medium", q: q.q, choices: q.choices, answer: q.answer, explain: q.explain };
    if (q.tags) rec.tags = q.tags;
    if (q.reviewed) rec.reviewed = q.reviewed;
    if (q.verifiedBy) rec.verifiedBy = q.verifiedBy;
    if (q.ref) rec.ref = q.ref;            // optional ASC/standards citation
    return rec;
  });
  const base = path.basename(bank).replace(/\.js$/, ".json");
  const doc = { $schema: "aced-question-bank/v1", pack: packId, section: pack.section || null, bank: base.replace(/\.json$/, ""), generated: /generat|batch-0[34]/i.test(base), count: out.length, questions: out };
  const dest = path.join(outDir, base);
  fs.writeFileSync(dest, JSON.stringify(doc, null, 1) + "\n");
  written++;
  console.log("wrote " + path.relative(ROOT, dest) + "  (" + out.length + " questions)");
});
console.log("\n" + written + " files · " + questions.length + " questions · " + totalIds.size + " unique ids" + (collisions ? "  ⚠ " + collisions + " id collisions (stem hash clash — add a disambiguator)" : ""));
