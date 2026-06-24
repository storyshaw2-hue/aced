/* tools/lib/load-banks.js
   Dependency-free. Evaluates the pack + question-bank JS files in a tiny `window`
   shim and returns the data, so the same files that ship to the browser can be
   linted in Node/CI without a build step or any npm install.

   Usage (from a tool):
     const { loadPack, loadQuestions } = require("./lib/load-banks");
     const pack = loadPack("packs/cpa-far.js");
     const qs   = loadQuestions(pack.questionBanks);            // [{source,diff,q,choices,answer,explain,...}]
*/
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");          // repo root (tools/lib -> repo)

// Run a bank/pack file with a fake `window` (and self/globalThis aliases) and return it.
function runInWindow(absPath) {
  const text = fs.readFileSync(absPath, "utf8");
  const win = {};
  // The files start with comments + an IIFE that writes window.ACED_*; a plain
  // Function body runs that fine. Errors are surfaced with the file name attached.
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("window", "self", "globalThis", "document", text);
    const noop = function () {};
    const docShim = { createElement: () => ({ style: {}, appendChild: noop }), head: { appendChild: noop }, body: {} };
    fn(win, win, win, docShim);
  } catch (e) {
    throw new Error("Failed to evaluate " + path.relative(ROOT, absPath) + ": " + e.message);
  }
  return win;
}

function loadPack(packRelPath) {
  const win = runInWindow(path.resolve(ROOT, packRelPath));
  if (!win.ACED_PACK) throw new Error(packRelPath + " did not define window.ACED_PACK");
  return win.ACED_PACK;
}

// Load every bank in order, accumulating window.ACED_QUESTIONS exactly like the browser does.
// Returns { questions, perBank } where perBank = [{ bank, count }].
function loadQuestions(bankRelPaths) {
  const all = [];
  const perBank = [];
  const win = {}; // shared, so .concat(window.ACED_QUESTIONS||[]) chains across files
  for (const rel of bankRelPaths) {
    const before = (win.ACED_QUESTIONS || []).length;
    const abs = path.resolve(ROOT, rel);
    const text = fs.readFileSync(abs, "utf8");
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function("window", "self", "globalThis", text);
      fn(win, win, win);
    } catch (e) {
      throw new Error("Failed to evaluate " + rel + ": " + e.message);
    }
    const after = (win.ACED_QUESTIONS || []).length;
    perBank.push({ bank: rel, count: after - before });
  }
  (win.ACED_QUESTIONS || []).forEach((q, i) => all.push(Object.assign({ _idx: i }, q)));
  return { questions: all, perBank };
}

module.exports = { loadPack, loadQuestions, runInWindow, ROOT };
