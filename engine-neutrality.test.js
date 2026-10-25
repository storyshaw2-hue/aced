"use strict";
/* ACED is a subject-neutral study-game engine. Exam or accounting wording belongs in packs
   (packs/cpa-*.js, packs/cpa-shared.js, cpa.html, learn/), never in the shared engine files below. */
const fs = require("fs");
const path = require("path");

function blank(m) { return m.replace(/[^\n]/g, " "); }
function stripJs(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/(^|[^:'"\\])\/\/ [^<`]*$/gm, "$1").replace(/(^|[^:'"\\])\/\/$/gm, "$1");
}
function strip(file, src) {
  if (!/\.html$/.test(file)) return stripJs(src);
  src = src.replace(/<!--[\s\S]*?-->/g, blank);
  // A line comment never contains markup; a "// DAILY RUN</span>" inside a template string is visible copy.
  return src.replace(/(<(script|style)\b[^>]*>)([\s\S]*?)(<\/\2>)/gi, function (m, open, tag, body, close) { return open + stripJs(body) + close; });
}

// Words that would make the product read as an accounting or exam-prep app.
const STRICT = /10-K|run filed|file the |\bCPA\b|\bFAR\b|\bAUD\b|\bGAAP\b|\bfiscal\b|\bledger\b|journal entr|\baccrual|\baccounting\b|balance sheet|exam moment|audit moment|mock exam|exam readiness|exam pass|daily close|\bclose #|\baudit(ed|or|ing)?\b/i;
// Looser rule for the big engine file, which still holds internal identifiers such as auditBattle.
const PHRASES = /10-K|run filed|end &amp; file|exam moment|audit moment|mock exam|exam readiness|exam pass|daily close|\bclose #|fiscal|\bGAAP\b|\bCPA\b|BOOKS (CLOSED|DIDN)|adjusting entr|year-end/i;

const strictFiles = [
  "aced-core.js", "aced-progress.js", "aced-fx.js", "aced-onboarding.js", "aced-library.js", "aced-library-page.js",
  "aced-bridge.js", "aced-importer.js", "aced-ui.js", "social.js", "leagues.js", "nemesis.js", "packs/core-jokers.js",
  "daily.html", "index.html", "importer.html", "league.html", "pricing.html"
];
const phraseFiles = ["study.html", "aced-config.js", "library.html"];
// Library exam-prep section and pricing monetization note are allowed to name the CPA packs.
const allowLine = /EXAM PREP|cpa\.html|study\.html\?pack=cpa-|href="cpa|PLAY (FAR|AUD|REG|BAR)|class="name">(FAR|AUD|REG|BAR)|class="ammo"|Library packs free to play|premium exam-prep|CPA today|class="hook"/;

let bad = [];
function scan(files, re, allow) {
  files.forEach(function (f) {
    const p = path.join(__dirname, f);
    if (!fs.existsSync(p)) { bad.push(f + ": missing"); return; }
    strip(f, fs.readFileSync(p, "utf8")).split("\n").forEach(function (line, i) {
      const m = line.replace(/\bcpa-[a-z]+/g, "").match(re); // pack ids and legacy storage keys are fine
      if (m && !(allow && allow.test(line))) bad.push(f + ":" + (i + 1) + " [" + m[0] + "] " + line.trim().slice(0, 100));
    });
  });
}
scan(strictFiles, STRICT, null);
scan(phraseFiles, PHRASES, allowLine);

if (bad.length) {
  console.error("engine-neutrality.test.js: exam or accounting wording found in shared engine files:\n  " + bad.join("\n  "));
  process.exit(1);
}
console.log("engine-neutrality.test.js: ok");
