#!/usr/bin/env node
"use strict";
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const L = require("../aced-library");
const args = process.argv.slice(2), index = args.indexOf("--pack"), requested = index < 0 ? null : args[index + 1];
const packs = requested ? L.starters.filter(p => p.id === requested) : L.starters;
if (!packs.length) { console.error("Unknown starter pack. User packs are validated when imported."); process.exit(1); }
let failures = 0;
for (const meta of packs) {
  try {
    const sandbox = { window: {} }; vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(__dirname, "..", meta.file), "utf8"), sandbox);
    const pack = L.normalize(sandbox.window.ACED_PACK);
    if (pack.questions.length !== meta.count) throw new Error("Registry question count differs from actual content.");
    console.log("PASS " + meta.id + ": " + pack.questions.length + " valid questions across " + new Set(pack.questions.map(q => q.source)).size + " topics.");
  } catch (e) { failures++; console.error("FAIL " + meta.id + ": " + e.message); }
}
process.exitCode = failures ? 1 : 0;
