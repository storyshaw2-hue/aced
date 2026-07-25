/* ACED — nemesis-encounter.js
   ============================================================================
   The NEMESIS BOSS FIGHT as a headless engine (no DOM, no storage). This is the
   game-feel layer for the signature moment: your weak topic becomes a named
   villain with a SHIELD that only its own topic can break, then a CORE (HP) you
   wound with any correct answer. Whiffing on its topic re-armors it; too many
   misses and it overwhelms you.

   Boundary: this is the ENCOUNTER (one bounded boss fight, transient state).
   It is NOT the source of truth for real mastery — nemesis.js owns that,
   deriving the villain and its real strength from the review store. Here the
   bars are tuned game values for feel; the arcade should still record each
   answer to the review store as usual so nemesis.js reflects true recovery.

   Vanilla ES5 IIFE, attaches to window.ACEDEncounter. Pure logic — feed it
   answer results, render the returned events however you like (the demo
   nemesis-boss.html shows one presentation).

   ---- Typical wiring --------------------------------------------------------
     // when a boss blind for the current Nemesis begins:
     var boss = ACEDEncounter.start();            // identity from ACEDNemesis.current()

     // each time the player answers a question during the fight:
     var r = ACEDEncounter.resolve({ weak: isWeakTopicCard, correct: gotItRight, commit: didCommit });
     // r.event: "safe_score" | "shield_break" | "core_hit" | "harden" | "miss"
     // r.phaseChange === true on the hit that drops the shield
     // r.outcome: "win" | "lose" | null   -> when non-null, the fight is over
     applyJuice(r);   // shake, shatter, damage numbers, sound
   ============================================================================ */
(function () {
  "use strict";

  var CONFIG = {
    shield: 3,        // charges; only correct WEAK-topic answers break them
    hp: 5,            // core health once the shield is down
    menaceMax: 5,     // wrong answers raise menace; hitting max loses the fight
    chipsSafe: 20,    // chips for a correct normal card
    chipsWeak: 40,    // chips for a correct weak-topic card
    commitMult: 2     // conviction "commit": doubles stakes both ways
  };

  var enc = null;

  function nemesis() { try { return window.ACEDNemesis || null; } catch (e) { return null; } }

  function resolveIdentity(opts) {
    opts = opts || {};
    if (opts.name && opts.domain) return { name: opts.name, epithet: opts.epithet || "", domain: opts.domain };
    var N = nemesis();
    if (!opts.name && N && N.current) {
      try { var cur = N.current(); if (cur) return { name: cur.name, epithet: cur.epithet || "", domain: cur.module }; } catch (e) {}
    }
    if (opts.domain && N && N.nameFor) {
      try { var nm = N.nameFor(opts.domain); if (nm) return { name: opts.name || nm[0], epithet: opts.epithet || nm[1], domain: opts.domain }; } catch (e) {}
    }
    return { name: opts.name || "The Unknown", epithet: opts.epithet || "keeps finding your errors", domain: opts.domain || "" };
  }

  function snapshot() {
    if (!enc) return null;
    return {
      name: enc.name, epithet: enc.epithet, domain: enc.domain,
      shield: enc.shield, shieldMax: enc.shieldMax,
      hp: enc.hp, hpMax: enc.hpMax,
      menace: enc.menace, menaceMax: enc.menaceMax,
      chips: enc.chips, phase: enc.phase, outcome: enc.outcome, active: enc.active
    };
  }

  // Begin a fight. opts may override identity + tuning; identity falls back to
  // ACEDNemesis.current() (or nameFor(domain)).
  function start(opts) {
    opts = opts || {};
    var id = resolveIdentity(opts);
    var shield = (typeof opts.shield === "number") ? opts.shield : CONFIG.shield;
    var hp = (typeof opts.hp === "number") ? opts.hp : CONFIG.hp;
    var menaceMax = (typeof opts.menaceMax === "number") ? opts.menaceMax : CONFIG.menaceMax;
    enc = {
      name: id.name, epithet: id.epithet, domain: id.domain,
      shield: shield, shieldMax: shield,
      hp: hp, hpMax: hp,
      menace: 0, menaceMax: menaceMax,
      chips: 0, phase: shield > 0 ? "shield" : "core", outcome: null, active: true
    };
    return snapshot();
  }

  // Apply one answer. { weak, correct, commit } -> a result event describing what
  // happened, including deltas, phase change, and terminal outcome.
  function resolve(input) {
    if (!enc || !enc.active) return null;
    input = input || {};
    var weak = !!input.weak, correct = !!input.correct;
    var commit = !!input.commit && weak;         // commit only meaningful on its own topic
    var m = commit ? CONFIG.commitMult : 1;

    var before = { shield: enc.shield, hp: enc.hp, menace: enc.menace, chips: enc.chips };
    var down = enc.shield <= 0;
    var event, phaseChange = false;

    if (correct) {
      enc.chips += (weak ? CONFIG.chipsWeak : CONFIG.chipsSafe) * m;
      if (!weak && !down) {
        event = "safe_score";                    // scores, bounces off the shield
      } else if (weak && !down) {
        enc.shield = Math.max(0, enc.shield - m); // break shield charge(s)
        event = "shield_break";
        if (before.shield > 0 && enc.shield === 0) { enc.phase = "core"; phaseChange = true; }
      } else {
        enc.hp = Math.max(0, enc.hp - m);         // shield down: wound the core
        event = "core_hit";
      }
    } else {
      enc.menace += m;
      event = "miss";
      if (weak && enc.shield < enc.shieldMax) {   // flinching on its topic re-armors it
        enc.shield = Math.min(enc.shieldMax, enc.shield + 1);
        event = "harden";
      }
    }

    if (enc.hp <= 0) { enc.outcome = "win"; enc.active = false; }
    else if (enc.menace >= enc.menaceMax) { enc.outcome = "lose"; enc.active = false; }

    return {
      event: event,
      weak: weak, correct: correct, commit: commit,
      phase: enc.phase, phaseChange: phaseChange,
      chipsGained: enc.chips - before.chips,
      delta: { shield: enc.shield - before.shield, hp: enc.hp - before.hp, menace: enc.menace - before.menace },
      shield: enc.shield, hp: enc.hp, menace: enc.menace, chips: enc.chips,
      outcome: enc.outcome, name: enc.name, domain: enc.domain
    };
  }

  function state() { return snapshot(); }
  function active() { return !!(enc && enc.active); }
  function reset() { enc = null; return true; }

  window.ACEDEncounter = {
    version: 1,
    CONFIG: CONFIG,
    start: start,
    resolve: resolve,
    state: state,
    active: active,
    reset: reset
  };
})();
