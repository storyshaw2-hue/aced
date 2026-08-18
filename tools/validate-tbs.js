#!/usr/bin/env node
/* Validate every task-based simulation bank.
   Usage:
     node tools/validate-tbs.js
     node tools/validate-tbs.js --section far
*/
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const TBS = require("../aced-tbs");

const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "packs", "originals");
const args = process.argv.slice(2);
const si = args.indexOf("--section");
const section = si >= 0 ? String(args[si + 1] || "").toLowerCase() : "";

const files = fs.readdirSync(DIR)
  .filter(f => /-tbs-.*\.js$/i.test(f))
  .filter(f => !section || f.toLowerCase().startsWith(section + "-"))
  .sort();

if (!files.length) {
  console.error("No TBS banks found" + (section ? " for section " + section : "") + ".");
  process.exit(1);
}

let simulations = 0, items = 0, errors = 0, warnings = 0;
const typeCounts = {};
const titles = new Map();

for (const file of files) {
  const sandbox = { window: { ACED_TBS: [] }, Math, Date, console };
  vm.createContext(sandbox);
  try {
    vm.runInContext(fs.readFileSync(path.join(DIR, file), "utf8"), sandbox, { filename: file });
  } catch (e) {
    console.error("ERROR", file, "could not load:", e.message);
    errors++;
    continue;
  }
  const bank = sandbox.window.ACED_TBS;
  if (!Array.isArray(bank)) {
    console.error("ERROR", file, "did not expose window.ACED_TBS as an array");
    errors++;
    continue;
  }
  bank.forEach((sim, i) => {
    simulations++;
    items += Array.isArray(sim.items) ? sim.items.length : 0;
    // Same generic title may legitimately appear in different exam sections; source + title
    // must be unique so a single section never presents indistinguishable duplicates.
    const key = (String(sim.source || "").trim() + "|" + String(sim.title || "").trim()).toLowerCase();
    if (key && titles.has(key)) {
      console.warn("WARN ", file + "[" + i + "]", "duplicate title also in", titles.get(key));
      warnings++;
    } else if (key) titles.set(key, file + "[" + i + "]");

    const es = TBS.validateSimulation(sim, file + "[" + i + "]");
    es.forEach(e => { console.error("ERROR", e); errors++; });
    (sim.items || []).forEach(it => {
      const type = it.type || "select";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
  });
}

console.log("\nTBS VALIDATION");
console.log("  banks:", files.length);
console.log("  simulations:", simulations);
console.log("  task items:", items);
console.log("  item types:", Object.keys(typeCounts).sort().map(k => k + "=" + typeCounts[k]).join(" · "));
console.log("  warnings:", warnings);
console.log("  result:", errors ? "FAIL — " + errors + " error(s)" : "PASS — clean");
process.exit(errors ? 1 : 0);
