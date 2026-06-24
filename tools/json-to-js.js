#!/usr/bin/env node
/* tools/json-to-js.js  —  compile canonical JSON banks back to the runtime .js (zero deps)
   ----------------------------------------------------------------------------
   Reads content/<pack>/*.json and emits the `window.ACED_QUESTIONS=(...).concat([...])`
   files the browser loads. This is the ONLY build step, and it is dev-time only — the
   deployed site stays static with no runtime build. Run it after editing JSON, commit
   the generated .js next to the JSON.

   Run:  node tools/json-to-js.js                      # pack=cpa-far -> packs/originals/
         node tools/json-to-js.js --pack cpa-far --out packs/originals
*/
"use strict";
const fs = require("fs");
const path = require("path");
const { ROOT } = require("./lib/load-banks");

const args = process.argv.slice(2);
const packId = args.indexOf("--pack") >= 0 ? args[args.indexOf("--pack") + 1] : "cpa-far";
const outRel = args.indexOf("--out") >= 0 ? args[args.indexOf("--out") + 1] : "packs/originals";

const inDir = path.resolve(ROOT, "content", packId);
if (!fs.existsSync(inDir)) { console.error("No content dir: " + path.relative(ROOT, inDir) + " — run js-to-json first."); process.exit(1); }
const outDir = path.resolve(ROOT, outRel);
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(inDir).filter(f => f.endsWith(".json")).sort();
let total = 0;
files.forEach(f => {
  const doc = JSON.parse(fs.readFileSync(path.join(inDir, f), "utf8"));
  const qs = doc.questions || [];
  total += qs.length;
  const header =
`/* AUTO-GENERATED from content/${packId}/${f} by tools/json-to-js.js — DO NOT EDIT BY HAND.
   Edit the JSON, run \`node tools/validate.js\` then \`node tools/json-to-js.js\`, commit both.
   ${qs.length} questions · schema ${doc.$schema || "aced-question-bank/v1"} */
`;
  const body = "window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat(\n" +
    JSON.stringify(qs, null, 1) +
    "\n);\n";
  const dest = path.join(outDir, f.replace(/\.json$/, ".js"));
  fs.writeFileSync(dest, header + body);
  console.log("wrote " + path.relative(ROOT, dest) + "  (" + qs.length + " questions)");
});
console.log("\n" + files.length + " banks · " + total + " questions compiled to " + outRel + "/");
