"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const scripts = ["aced-ui.js", "aced-importer.js"].map(name => ({
  name, code: fs.readFileSync(path.join(__dirname, name), "utf8")
}));
let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("PASS " + name); }
  catch (error) { failed++; console.error("FAIL " + name + ": " + error.message); }
}

// Run the actual UI and importer controllers with a minimal DOM and a library
// test double. The tests inspect navigation, not a reimplementation of the URL.
function importer(options = {}) {
  const elements = new Map(), navigations = [], saves = [], replacements = [];
  const pack = {
    id: options.id || "review-pack", name: "Review pack", subject: "General",
    questions: [{
      id: "q1", q: "A question?", answer: "An answer", choices: [],
      source: "General", explain: "", kind: "recall"
    }]
  };
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      value: "", hidden: false, textContent: "", innerHTML: "",
      focus() {}, addEventListener() {}, appendChild() {},
      querySelector() { return null; }
    });
    return elements.get(id);
  }
  element("pack-form").querySelector = selector => {
    if (selector === '[name="relic"]:checked') return options.relic === undefined ? null : { value: options.relic };
    assert.equal(selector, '[name="difficulty"]:checked');
    return options.missingSelection ? null : { value: options.difficulty };
  };
  const location = { search: "", hash: "#pack=fixture" };
  Object.defineProperty(location, "href", {
    get: () => navigations.at(-1) || "https://acedhq.com/importer.html",
    set: value => navigations.push(String(value))
  });
  const sandbox = {
    URLSearchParams, location,
    history: { replaceState: (state, title, url) => replacements.push(url) },
    document: {
      readyState: "loading", addEventListener() {},
      getElementById: element, createElement: element
    },
    ACEDLibrary: {
      importShared: () => JSON.parse(JSON.stringify(pack)),
      save: value => { saves.push(value); return value; },
      isPersistent: () => options.persistent !== false,
      exportText: value => JSON.stringify(value),
      encode: value => options.payload || Buffer.from(value, "utf8").toString("base64url")
    }
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  scripts.forEach(script => vm.runInContext(script.code, sandbox, { filename: script.name }));
  return {
    elements, navigations, saves, replacements, pack,
    click: play => element(play ? "save-play" : "save-library").onclick()
  };
}
function destination(s) {
  assert.equal(s.navigations.length, 1, "save and play should navigate exactly once");
  const url = new URL(s.navigations[0], "https://acedhq.com/importer.html");
  assert.equal(url.origin, "https://acedhq.com");
  assert.equal(url.pathname, "/study.html");
  assert.equal(url.searchParams.getAll("pack").length, 1);
  assert.equal(url.searchParams.getAll("difficulty").length, 1);
  assert.deepEqual([...url.searchParams.keys()], url.searchParams.has("relic") ? ["pack", "difficulty", "relic"] : ["pack", "difficulty"]);
  assert.equal(url.searchParams.get("pack"), s.pack.id);
  return url;
}

for (const difficulty of ["casual", "standard", "brutal"]) {
  test("save and play preserves the supported " + difficulty + " difficulty", () => {
    const s = importer({ difficulty }); s.click(true);
    assert.equal(destination(s).searchParams.get("difficulty"), difficulty);
    assert.equal(s.saves.length, 1);
    assert.equal(destination(s).hash, "");
  });
}
test("unrecognized or tampered difficulty cannot inject query fields or fragments", () => {
  for (const difficulty of [
    "", "STANDARD", " standard ", "__proto__", "javascript:alert(1)",
    "casual&pack=another", "brutal#pack=untrusted",
    'standard"><img src=x onerror=alert(1)>'
  ]) {
    const s = importer({ difficulty }); s.click(true);
    const url = destination(s);
    assert.equal(url.searchParams.get("difficulty"), "standard");
    assert.equal(url.hash, "");
  }
});
for (const relic of ["warmup", "flowstate", "snowball"]) {
  test("save and play carries the " + relic + " starting joker", () => {
    const s = importer({ difficulty: "standard", relic }); s.click(true);
    const url = destination(s);
    assert.equal(url.searchParams.get("relic"), relic);
    assert.equal(url.hash, "");
  });
}
test("no starting joker leaves the relic field out of the URL", () => {
  for (const relic of [undefined, "", "none"]) {
    const s = importer({ difficulty: "standard", relic }); s.click(true);
    assert.equal(destination(s).searchParams.has("relic"), false);
  }
});
test("tampered starting joker cannot inject query fields, fragments or unknown jokers", () => {
  for (const relic of ["WARMUP", " warmup", "__proto__", "warmup&pack=another", "snowball#pack=untrusted", 'flowstate"><img src=x onerror=alert(1)>', "javascript:alert(1)"]) {
    const s = importer({ difficulty: "standard", relic }); s.click(true);
    const url = destination(s);
    assert.equal(url.searchParams.has("relic"), false);
    assert.equal(url.hash, "");
  }
});
test("a missing difficulty selection safely defaults to standard", () => {
  const s = importer({ missingSelection: true }); s.click(true);
  assert.equal(destination(s).searchParams.get("difficulty"), "standard");
});
test("pack identity stays in one encoded URL component", () => {
  const s = importer({ id: "pack?x=1&pack=another#fragment", difficulty: "standard" });
  s.click(true);
  assert.equal(destination(s).hash, "");
  assert.equal(s.replacements[0], "importer.html?edit=" + encodeURIComponent(s.pack.id));
});
test("blocked storage still carries a temporary pack with each supported difficulty", () => {
  for (const difficulty of ["casual", "standard", "brutal"]) {
    const s = importer({ persistent: false, difficulty }); s.click(true);
    const url = destination(s);
    assert.equal(url.searchParams.get("difficulty"), difficulty);
    assert.ok(url.hash.startsWith("#pack="));
    const payload = decodeURIComponent(url.hash.slice("#pack=".length));
    assert.deepEqual(JSON.parse(Buffer.from(payload, "base64url").toString("utf8")), s.pack);
  }
});
test("oversized temporary packs fail without navigating", () => {
  const s = importer({ persistent: false, difficulty: "standard", payload: "a".repeat(190001) });
  s.click(true);
  assert.equal(s.navigations.length, 0);
  assert.match(s.elements.get("import-status").textContent, /too large/);
});
test("saving to the library does not launch a game", () => {
  const s = importer({ missingSelection: true }); s.click(false);
  assert.equal(s.saves.length, 1);
  assert.equal(s.navigations.length, 0);
  assert.match(s.elements.get("import-status").textContent, /Saved to your library/);
});

console.log("aced-importer: " + passed + " passed, " + failed + " failed.");
if (failed) process.exitCode = 1;
