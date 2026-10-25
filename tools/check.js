#!/usr/bin/env node
"use strict";
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const skipped = new Set([".git", "node_modules", "dist", "vendor", "private", "_personal"]);
const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (skipped.has(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(js|html|json|md|webmanifest|xml|yaml|yml)$/.test(file)) files.push(file);
  }
}
walk(root);
let failures = 0, scripts = 0, links = 0;
function fail(file, message) { failures++; console.error(path.relative(root, file) + ": " + message); }
const retired = new RegExp("\\bC" + "PA\\b|cpa-(?:far|aud|reg|bar)|\\bGA" + "AP\\b|fiscal (?:year|close)|Audit Moment|Exam Readiness", "i");
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  if (file !== __filename && !file.endsWith(".test.js") && retired.test(content)) fail(file, "retired subject-specific content remains");
  if (file.endsWith(".js")) {
    try { new vm.Script(content, { filename: file }); scripts++; }
    catch (e) { fail(file, e.message); }
  }
  if (file.endsWith(".json") || file.endsWith(".webmanifest")) {
    try { JSON.parse(content); } catch (e) { fail(file, "invalid JSON: " + e.message); }
  }
  if (file.endsWith(".html")) {
    for (const match of content.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (match[2].trim() && !/application\/ld\+json/.test(match[1])) {
        try { new vm.Script(match[2], { filename: file + " inline" }); scripts++; }
        catch (e) { fail(file, e.message); }
      }
    }
    for (const match of content.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const target = match[1].split(/[?#]/)[0];
      if (!target || /^(?:https?:|data:|mailto:|tel:|javascript:)/.test(target)) continue;
      const resolved = target.startsWith("/") ? path.join(root, target) : path.resolve(path.dirname(file), target);
      links++;
      if (!fs.existsSync(resolved)) fail(file, "missing local target " + target);
    }
  }
}
console.log("Checked " + files.length + " text files, " + scripts + " scripts and " + links + " local page references.");
if (failures) { console.error(failures + " check(s) failed."); process.exitCode = 1; }
else console.log("PASS: syntax, JSON, internal links, and subject-neutral content.");
