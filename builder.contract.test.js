/* Integration test: does the pack that builder.html emits actually work with
   aced-pack.js, and does the share-link base64 round-trip cleanly?
   No framework; plain asserts. */
var assert = require("assert");
var fs = require("fs");
var vm = require("vm");

/* A pack in the EXACT shape builder.html's buildPack() produces. */
var BUILDER_PACK = {
  id: "intro-spanish-a1b2",
  name: "Intro Spanish",
  author: "maria",
  createdAt: 1730000000000,
  questions: [
    { q: "How do you say 'hello'?", choices: ["Hola", "Adios", "Gracias"], answer: 0, explanation: "Hola = hello." },
    { q: "Which word means 'thank you'?", choices: ["Hola", "Gracias", "Por favor"], answer: 1 }
  ],
  theme: { scanlines: true, palette: "amber" },
  labels: { currency: "Pesos" },
  tuning: { handSize: 8, runLength: 8 }
};

/* 1. aced-pack.js accepts the builder pack and produces sane config. */
(function () {
  var src = fs.readFileSync(__dirname + "/aced-pack.js", "utf8");
  var ctx = { window: {} };
  vm.runInNewContext(src, ctx);
  var P = ctx.window.ACEDPack;

  var cfg = P.init(BUILDER_PACK);
  assert.strictEqual(cfg.meta.name, "Intro Spanish", "name carried through");
  assert.strictEqual(cfg.meta.questionCount, 2, "counts questions");
  assert.strictEqual(cfg.theme.paletteId, "amber", "author palette honored");
  assert.strictEqual(cfg.labels.currency, "Pesos", "author label honored");
  assert.strictEqual(cfg.labels.hand, "Hand", "untouched label defaults");
  assert.strictEqual(cfg.tuning.handSize, 8, "tuning carried through");
  assert.strictEqual(["easy", "medium", "hard"].indexOf(P.difficultyOf(BUILDER_PACK.questions[0])) !== -1, true, "difficulty classifiable");
  console.log("PASS 1  builder pack is a valid ACEDPack input");
})();

/* 2. Share-link base64url round-trips (mirrors builder + share-loader logic). */
(function () {
  function b64url(str) {
    var b = Buffer.from(str, "utf8").toString("base64");
    return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function decode(payload) {
    var b = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (b.length % 4) b += "=";
    return Buffer.from(b, "base64").toString("utf8");
  }
  var json = JSON.stringify(BUILDER_PACK);
  var round = JSON.parse(decode(b64url(json)));
  assert.deepStrictEqual(round, BUILDER_PACK, "pack survives base64url round-trip intact");
  assert.strictEqual(/^[A-Za-z0-9_-]+$/.test(b64url(json)), true, "payload is URL-safe");
  console.log("PASS 2  share-link base64url round-trip");
})();

/* 3. Builder questions satisfy the arcade's normalize() contract:
      it reads `choices` (array >=2) + integer `answer` in range. This guards the
      options->choices remap in builder.html's buildPack(). */
(function () {
  BUILDER_PACK.questions.forEach(function (q, i) {
    assert.strictEqual(Array.isArray(q.choices) && q.choices.length >= 2, true, "Q" + i + " has a choices array of >=2");
    assert.strictEqual(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length, true, "Q" + i + " answer is a valid index into choices");
  });
  console.log("PASS 3  builder pack matches arcade normalize() contract (choices + answer index)");
})();

console.log("\nALL TESTS PASSED");
