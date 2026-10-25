"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

// Run the real checker as a CLI against disposable project fixtures.
const root = fs.mkdtempSync(path.join(os.tmpdir(), "aced-html-check-"));
fs.mkdirSync(path.join(root, "tools"));
fs.copyFileSync(path.join(__dirname, "check.js"), path.join(root, "tools/check.js"));
let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("PASS " + name); }
  catch (error) { failed++; console.error("FAIL " + name + ": " + error.message); }
}
function check(html) {
  fs.writeFileSync(path.join(root, "index.html"), html, "utf8");
  const result = spawnSync(process.execPath, [path.join(root, "tools/check.js")], {
    cwd: root, encoding: "utf8", timeout: 10000
  });
  if (result.error) throw result.error;
  return result;
}

try {
  const endings = [
    ["ordinary", "</script>"],
    ["space", "</script >"],
    ["tab", "</script\t>"],
    ["newline", "</script\n>"],
    ["carriage return", "</script\r>"],
    ["form feed", "</script\f>"],
    ["slash", "</script/>"],
    ["ignored attribute", '</script data-ignored="value">'],
    ["mixed case and ignored attribute", "</ScRiPt data-ignored=value >"]
  ];
  for (const [name, end] of endings) {
    test("valid inline JavaScript is checked with a " + name + " end tag", () => {
      const result = check('<ScRiPt data-test="fixture">const ready = true;' + end);
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /2 scripts/); // The checker itself plus the inline script.
    });
    test("invalid inline JavaScript cannot hide behind a " + name + " end tag", () => {
      const result = check("<script>const broken = ;" + end);
      assert.equal(result.status, 1, "invalid JavaScript was skipped: " + result.stdout);
      assert.match(result.stderr, /index\.html:/);
    });
  }
  test("script-name lookalikes do not truncate a JavaScript string", () => {
    const result = check('<script>const text = "</scripture>";</script>');
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /2 scripts/);
  });
  test("a custom element is not mistaken for a script opening tag", () => {
    const result = check("<script-widget>const notJavaScript = ;</script>");
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /1 scripts/);
  });
  test("multiple inline scripts with different end tags are all checked", () => {
    const result = check("<script>const first = 1;</script >\n<script>const second = 2;</script x=1>");
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /3 scripts/);
  });
  test("JSON-LD remains data rather than executable JavaScript", () => {
    const result = check('<script type="application/ld+json">{"name":"Structured data"}</script >');
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /1 scripts/);
  });
} finally {
  // Only fixture files created by this test exist in this temporary directory.
  fs.rmSync(root, { recursive: true, force: true });
}
console.log("html-checker: " + passed + " passed, " + failed + " failed.");
if (failed) process.exitCode = 1;
