/* ACED bridge: lets the full poker roguelike (study.html) play packs saved in the
   user's library. It converts library questions into engine questions, maps run
   settings (stakes, starting joker) to engine mods, and writes answers back to the
   pack's progress so the library shows real recall progress. */
(function (root) {
  "use strict";

  var STAKES = {
    casual: { stakesMult: 0.75, startMoney: 8 },
    standard: { stakesMult: 1, startMoney: 4 },
    brutal: { stakesMult: 1.35, startMoney: 4 }
  };
  var RELICS = { warmup: "warmup", flowstate: "flowstate", snowball: "snowball" };

  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  function hash(text) {
    var h = 2166136261;
    for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffled(list, random) {
    var out = list.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(random() * (i + 1)), swap = out[i]; out[i] = out[j]; out[j] = swap;
    }
    return out;
  }
  function norm(text) { return String(text == null ? "" : text).trim().toLowerCase().replace(/\s+/g, " "); }

  function answerText(q) {
    if (q.kind === "choice" && Array.isArray(q.choices)) return String(q.choices[q.answer]);
    return String(q.answer == null ? "" : q.answer);
  }

  /* Multiple-choice questions pass straight through. Open-ended cards become
     multiple choice by drawing wrong options from the other answers in the same
     pack (same topic first), so every card can be graded automatically and bet on. */
  function toEngineQuestions(pack) {
    var rows = (pack && pack.questions) || [];
    var pool = rows.map(function (q) { return { text: answerText(q), source: q.source || "General" }; });
    return rows.map(function (q) {
      var base = { id: q.id, q: q.q, source: q.source || "General" };
      if (q.kind === "choice" && Array.isArray(q.choices) && q.choices.length >= 2) {
        base.choices = q.choices.slice(); base.answer = q.answer; base.explain = q.explain || "";
        return base;
      }
      var correct = answerText(q), key = norm(correct), seen = Object.create(null);
      seen[key] = true;
      var same = [], other = [];
      pool.forEach(function (candidate) {
        var k = norm(candidate.text);
        if (!k || seen[k]) return;
        seen[k] = true;
        (candidate.source === base.source ? same : other).push(candidate.text);
      });
      var random = rng(hash(String(q.id) + "\n" + q.q));
      var wrong = shuffled(same, random).concat(shuffled(other, random)).slice(0, 3);
      if (!wrong.length) wrong = ["None of the above"];
      var position = Math.floor(random() * (wrong.length + 1));
      var choices = wrong.slice(); choices.splice(position, 0, correct);
      base.choices = choices; base.answer = position;
      base.explain = "Answer: " + correct + (q.explain ? " \u2014 " + q.explain : "");
      return base;
    });
  }

  function mods(difficulty, relic) {
    var level = typeof difficulty === "string" && own(STAKES, difficulty) ? STAKES[difficulty] : STAKES.standard;
    var result = { stakesMult: level.stakesMult, startMoney: level.startMoney };
    if (typeof relic === "string" && own(RELICS, relic)) result.relicJoker = RELICS[relic];
    return result;
  }

  /* Returns a function(question, correct) that records an answer in pack progress. */
  function recorder(library, id) {
    return function (q, correct) {
      try {
        var learning = library.learning(id);
        learning.answers = learning.answers || {};
        var previous = learning.answers[q.id] || { attempts: 0, correct: 0, strength: 0 };
        learning.attempts = (learning.attempts || 0) + 1;
        if (correct) learning.correct = (learning.correct || 0) + 1;
        learning.answers[q.id] = {
          attempts: previous.attempts + 1,
          correct: previous.correct + (correct ? 1 : 0),
          strength: correct ? Math.min(2, (previous.strength || 0) + 1) : 0,
          lastCorrect: !!correct, lastAt: Date.now(), selfRated: false
        };
        library.saveLearning(id, learning);
      } catch (e) { /* progress is a bonus; never interrupt a run */ }
    };
  }

  var api = { toEngineQuestions: toEngineQuestions, mods: mods, recorder: recorder, STAKES: STAKES, RELICS: RELICS };
  root.ACEDBridge = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
