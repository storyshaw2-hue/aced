"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const memory = new Map();
global.localStorage = {
  getItem: k => memory.has(k) ? memory.get(k) : null, setItem: (k, v) => memory.set(k, v),
  removeItem: k => memory.delete(k), key: i => [...memory.keys()][i],
  get length() { return memory.size; }
};
global.location = { href: "https://acedhq.com/importer.html" };
const L = require("./aced-library");
let passed = 0;
function test(name, fn) { fn(); passed++; console.log("ok", name); }
test("term pairs and Q/A blocks are parsed without invented answers", () => {
  const p = L.parse("Term: Definition\nQ: A question?\nA: An answer", { name: "Demo", subject: "Anything" });
  assert.equal(p.questions.length, 2); assert.equal(p.questions[0].answer, "Definition");
  assert.equal(p.questions[1].q, "A question?"); assert.equal(p.subject, "Anything");
});
test("prose and partly unstructured input do not silently lose lines", () => {
  assert.throws(() => L.parse("Here is an unstructured paragraph."), /not a question/);
  assert.throws(() => L.parse("Term: definition\nThis would be lost"), /Line 2/);
});
test("an incomplete Q/A block is rejected", () => assert.throws(() => L.parse("Q: Missing answer?"), /needs an A/));
test("CSV quoted commas, newlines and escaped quotes round-trip", () => {
  const p = L.parse('question,answer,topic,explanation\n"What, exactly?","An ""answer""",Topic,"Line one\nLine two"', { filename: "demo.csv" });
  assert.equal(p.questions[0].q, "What, exactly?");
  assert.equal(p.questions[0].answer, 'An "answer"');
  assert.equal(p.questions[0].explain, "Line one\nLine two");
});
test("TSV and headerless tables work", () => {
  assert.equal(L.parse("One\tTwo\nThree\tFour").questions.length, 2);
  assert.equal(L.parse("One,Two\nThree,Four", { filename: "demo.csv" }).questions.length, 2);
});
test("Markdown list pairs work and bare URLs are not invented questions", () => {
  assert.equal(L.parse("# Topic\n- Term: definition\n1. Word: meaning").questions.length, 2);
  assert.throws(() => L.parse("https://example.com"), /not a question/);
});
test("MCQ answers accept zero-based indices, letters and exact text", () => {
  [1, "B", "Second"].forEach(answer => assert.equal(L.normalize({ questions: [{ q: "Pick", choices: ["First", "Second"], answer }] }).questions[0].answer, 1));
});
test("legacy object options and front/back cards work", () => {
  const p = L.normalize({ questions: [{ q: "Pick", options: { A: "One", B: "Two" }, answer: "B", why: "Reason" }] });
  assert.equal(p.questions[0].explain, "Reason"); assert.equal(p.questions[0].answer, 1);
  assert.equal(L.normalize([{ front: "Front", back: "Back" }]).questions[0].kind, "recall");
});
test("all retained example JSON packs use the same import contract", () => {
  fs.readdirSync("packs").filter(name => name.endsWith(".json")).forEach(name => {
    assert.ok(L.normalize(JSON.parse(fs.readFileSync("packs/" + name, "utf8"))).questions.length > 0);
  });
});
test("invalid MCQs, duplicate IDs and empty packs are rejected", () => {
  assert.throws(() => L.normalize({ questions: [{ q: "Pick", choices: ["Same", "same"], answer: 0 }] }), /duplicate/);
  assert.throws(() => L.normalize({ questions: [{ q: "Pick", choices: ["A", "B"], answer: 9 }] }), /correct answer/);
  assert.throws(() => L.normalize({ questions: [{ id: "same", q: "One", answer: "A" }, { id: "same", q: "Two", answer: "B" }] }), /duplicated/);
  assert.throws(() => L.normalize({ questions: [] }), /no questions/);
});
test("two saved packs survive independently", () => {
  const one = L.save(L.parse("One: Answer", { name: "Pack one" }));
  const two = L.save(L.parse("Two: Answer", { name: "Pack two" }));
  assert.notEqual(one.id, two.id); assert.equal(L.list().length, 2);
  const parsed = JSON.parse(memory.get("aced:packs:v1")); assert.equal(parsed.packs.length, 2);
});
test("editing retains pack and question identities", () => {
  const p = L.list()[0], id = p.id, qid = p.questions[0].id;
  p.questions[0].q = "Reworded question"; p.name = "New name";
  const saved = L.save(p); assert.equal(saved.id, id); assert.equal(saved.questions[0].id, qid); assert.equal(L.list().length, 2);
});
test("changing an answer resets that question's recall without changing identity", () => {
  const p = L.list()[0], q = p.questions[0];
  L.saveLearning(p.id, { answers: { [q.id]: { strength: 2 } }, attempts: 2, correct: 2 });
  assert.equal(L.progress(p.id, p.questions).pct, 100);
  q.answer = "A corrected answer"; const saved = L.save(p);
  assert.equal(saved.questions[0].id, q.id); assert.equal(L.progress(p.id, saved.questions).pct, 0);
});
test("starter IDs cannot overwrite built-in content", () => {
  const saved = L.save({ id: "world-capitals", name: "My copy", questions: [{ q: "Q", answer: "A" }] });
  assert.notEqual(saved.id, "world-capitals"); assert.equal(L.starter("world-capitals").name, "World Capitals");
});
test("pack identities cannot collide with collection or draft storage", () => {
  const before = L.list().length;
  const p = L.normalize({ id: "packs", questions: [{ q: "Reserved?", answer: "No" }] });
  assert.notEqual(p.id, "packs");
  L.remove("packs"); assert.equal(L.list().length, before);
  assert.throws(() => L.saveLearning("activity", {}), /Invalid pack/);
});
test("export-import preserves MCQ and recall content", () => {
  const p = L.normalize({ name: "Unicode 日本語", questions: [{ q: "Á?", choices: ["Sí", "No"], answer: 0, explain: "Because", source: "Topic" }, { front: "Hello", back: "Hola" }] });
  const q = L.parse(L.exportText(p)); assert.deepEqual(q.questions, p.questions); assert.equal(q.name, p.name);
});
test("share links open a separate copy without sharing progress", () => {
  const p = L.list()[0], url = L.shareUrl(p), q = L.importShared(new URL(url).hash);
  assert.notEqual(q.id, p.id); assert.deepEqual(q.questions, p.questions);
  assert.equal(new URL(url).pathname, "/importer.html");
});
test("temporary previews and local files share through a stable public address", () => {
  const original = global.location.href, p = L.list()[0];
  for (const url of ["https://sites.pplx.app/sites/proxy/temporary-capability/index.html", "https://preview--test.pplx.app/index.html", "https://aced-branch.vercel.app/", "file:///private/path/index.html"]) {
    global.location.href = url;
    const shared = new URL(L.shareUrl(p));
    assert.equal(shared.origin, "https://acedhq.com"); assert.equal(shared.pathname, "/importer.html");
    assert.ok(!shared.href.includes("temporary-capability"));
  }
  global.location.href = original;
});
test("large or invalid share links fail safely", () => {
  const p = L.normalize({ name: "Large", questions: Array.from({ length: 40 }, (_, i) => ({ q: "Question " + i + "?".repeat(400), answer: "Answer" })) });
  assert.throws(() => L.shareUrl(p), /too large/);
  assert.throws(() => L.importShared("#pack=malformed"), /invalid/);
});
test("playing does not increment question-based recall progress", () => {
  const p = L.list()[0]; L.touch(p.id); assert.equal(L.progress(p.id, p.questions).pct, 0);
  memory.set("aced:" + p.id + ":learning_v1", JSON.stringify({ answers: { [p.questions[0].id]: { strength: 1 } }, attempts: 1, correct: 1 }));
  assert.equal(L.progress(p.id, p.questions).pct, 50);
});
test("removed questions no longer inflate progress", () => {
  const p = L.list()[0];
  memory.set("aced:" + p.id + ":learning_v1", JSON.stringify({ answers: { removed: { strength: 2 } } }));
  assert.equal(L.progress(p.id, p.questions).pct, 0);
});
test("both starter packs satisfy the same universal schema and correct counts", () => {
  L.starters.forEach(meta => {
    const sandbox = { window: {} }; vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(meta.file, "utf8"), sandbox);
    const pack = L.normalize(sandbox.window.ACED_PACK);
    assert.equal(pack.questions.length, meta.count); assert.ok(pack.questions.every(q => q.kind === "choice"));
  });
});
test("HTML in authored material is data, not stripped or executed by the parser", () => {
  const p = L.parse("What is an HTML tag?: <script>alert(1)</script>");
  assert.equal(p.questions[0].answer, "<script>alert(1)</script>");
});
test("deleting one saved pack leaves the others intact", () => {
  const before = L.list(), id = before[0].id;
  L.saveLearning(id, { answers: {}, attempts: 1 }); L.touch(id);
  L.remove(id);
  assert.equal(L.list().length, before.length - 1); assert.equal(L.get(id), null);
  assert.equal(memory.has("aced:" + id + ":learning_v1"), false);
  assert.equal(L.activity()[id], undefined);
});
test("storage failure is visible and uses a non-persistent in-memory fallback", () => {
  global.localStorage.setItem = () => { throw new Error("quota"); };
  const p = L.save(L.parse("Memory: only", { name: "Fallback" }));
  assert.equal(L.isPersistent(), false); assert.equal(L.get(p.id).name, "Fallback");
  L.saveLearning(p.id, { answers: { [p.questions[0].id]: { strength: 2 } } });
  assert.equal(L.progress(p.id, p.questions).pct, 100);
});
console.log("aced-library: " + passed + " tests passed.");
