/* Regression test for the homepage COMPILE & PLAY handoff.

   Root cause it guards: importer.html's mcq() builder required 3 distractors,
   so any paste with fewer than 4 definitions produced ZERO questions and the
   boot flow dead-ended on "Couldn't find clear questions." A user pasting a
   few "Term: definition" lines is the site's headline path, so small note sets
   MUST build playable questions.

   No framework; plain asserts. Extracts the ACEDExtract module straight out of
   importer.html so the test rides the real shipped parser (single source of
   truth), then runs it under vm. */
var assert = require("assert");
var fs = require("fs");
var vm = require("vm");

/* Pull the <script> block that defines window.ACEDExtract out of importer.html. */
function loadExtract() {
  var html = fs.readFileSync(__dirname + "/importer.html", "utf8");
  var re = /<script>([\s\S]*?root\.ACEDExtract[\s\S]*?)<\/script>/;
  var m = html.match(re);
  assert.ok(m, "found the ACEDExtract <script> block in importer.html");
  var sandbox = { window: {}, module: { exports: {} }, globalThis: {} };
  vm.runInNewContext(m[1], sandbox);
  var api = sandbox.window.ACEDExtract || sandbox.module.exports;
  assert.ok(api && typeof api.fromAny === "function", "ACEDExtract.fromAny is exported");
  return api;
}

function assertPlayable(qs, label) {
  qs.forEach(function (q, i) {
    assert.ok(Array.isArray(q.choices) && q.choices.length >= 2, label + " q" + i + " has >=2 choices");
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length, label + " q" + i + " answer index in range");
    assert.ok(q.q && String(q.q).trim().length > 0, label + " q" + i + " has a stem");
  });
}

var E = loadExtract();

/* 1. THE REGRESSION: three "Term: definition" lines must build questions. */
(function () {
  var notes = [
    "Mitochondria: the organelle that makes most of a cell's ATP",
    "Ribosome: the organelle that synthesizes proteins",
    "Nucleus: the organelle that stores the cell's DNA"
  ].join("\n");
  var res = E.fromAny(notes, { cap: 60 });
  assert.strictEqual(res.source, "text", "detected as raw notes");
  assert.ok(res.questions.length >= 1, "3 definitions build at least one question (was 0 before fix)");
  assertPlayable(res.questions, "3-def");
  console.log("PASS 1  three Term: definition lines build " + res.questions.length + " playable question(s)");
})();

/* 2. Even TWO definitions build a (2-option) question rather than dead-ending. */
(function () {
  var notes = "Accrual: revenue recognized before cash changes hands\nDeferral: cash received before the revenue is earned";
  var res = E.fromAny(notes, { cap: 60 });
  assert.ok(res.questions.length >= 1, "2 definitions still build a question");
  assertPlayable(res.questions, "2-def");
  console.log("PASS 2  two definitions build " + res.questions.length + " playable question(s)");
})();

/* 3. Larger sets remain full 4-option MCQs (no regression to the good path). */
(function () {
  var notes = [
    "Mitochondria: powerhouse of the cell",
    "Ribosome: makes proteins",
    "Nucleus: stores DNA",
    "Golgi: packages proteins for transport",
    "Lysosome: digests cellular waste"
  ].join("\n");
  var res = E.fromAny(notes, { cap: 60 });
  assert.ok(res.questions.length >= 5, "5 definitions build many questions");
  assertPlayable(res.questions, "5-def");
  var hasFour = res.questions.some(function (q) { return q.choices.length === 4; });
  assert.ok(hasFour, "with a full pool, 4-option MCQs are still produced");
  console.log("PASS 3  five definitions build " + res.questions.length + " questions incl. 4-option MCQs");
})();

console.log("\nALL TESTS PASSED");
