/* ACED — aced-vault.js
   ============================================================================
   Persistent meta-progression CURRENCY + permanent upgrade tree.

   This is the "retention hook" layer. The player earns a spendable currency on
   EVERY run — win, loss, or voluntary file — and spends it on permanent
   upgrades that carry into future runs. It COMPLEMENTS aced-progress.js: that
   layer answers "what rank am I?" (XP / prestige); this layer answers "what
   have I permanently bought with my winnings?".

   It is deliberately NOT a Slay-the-Spire combat/HP system. There is no combat
   here and nothing study-specific — it is pure game economy, so it works for
   any pack (subject-agnostic) and does not re-couple study to damage.

   Design rules (matches aced-core.js / aced-progress.js):
     - Vanilla ES5 IIFE, no build step, attaches to window.ACEDVault.
     - Degrades gracefully: prefers ACEDCore.store, falls back to localStorage,
       falls back to in-memory. No storage, no network, no problem.
     - Load AFTER aced-core.js so it rides the shared store + sync. It still
       works standalone if aced-core.js is absent.

   ---- Wiring (one line, next to your existing progress-event calls) ----------
       ACEDVault.event("run_end", { outcome: "loss", score: 4200, ante: 3 });
   or explicitly:
       var coins = ACEDVault.awardRunEnd({ outcome: "win", score: 9001, ante: 8 });

   ---- Reading upgrades at run start (engine applies them to its own state) ---
       var b = ACEDVault.bonuses();
       hands     += b.hands;      discards += b.discards;    slots += b.slots;
       startCash += b.startCash;  rerollCost = Math.max(0, rerollCost - b.rerollDiscount);
       if (ACEDVault.isUnlocked("skin_amber")) applyPalette("amber");

   ---- Cross-device sync (optional, 1-line surgical patch to aced-core.js) -----
       In aced-core.js, add "vault" to the SYNC_KEYS array so this state
       round-trips with everything else, e.g.:
         var SYNC_KEYS = [... "progress", "objectives", "vault"];
   ============================================================================ */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------------
     CONFIG — everything tunable lives here. Rename the currency, retune the
     award curve, or edit the CATALOG without touching the logic below.
  --------------------------------------------------------------------------- */
  var CONFIG = {
    CURRENCY_ID: "coin",
    CURRENCY_LABEL: "Coins",   // UI label — neutral default; drive it from the pack via ACEDPack.label("currency", ...)

    // Run-end award curve. A finished run ALWAYS pays out (anti-tilt floor),
    // so a lost run still feeds meta-progression.
    award: {
      finish: 3,          // flat, just for finishing a run
      perScore: 1500,     // +1 coin per this many points of run score...
      scoreCap: 25,       // ...capped at this many score-coins per run
      perAnte: 1,         // +N coins per ante/close reached
      winBonus: 15,       // +this if the run was won
      firstWinOfDay: 10   // +this the first won run each calendar day
    }
  };

  /* ---------------------------------------------------------------------------
     CATALOG — the permanent upgrade tree.
       kind:"tier"   -> repeatable (buy one level at a time, up to max).
                        Accumulates into bonuses() under bonusKey.
       kind:"unlock" -> one-shot toggle (cosmetics / modes). Feeds isUnlocked().
       cost(lv)      -> price of the NEXT level given lv already owned.

     NOTE: the tier bonusKeys below (hands/discards/slots/rerollDiscount/
     startCash) are my best guess at your arcade's run-start stat names from
     README_CANONICAL. If your engine names them differently, rename bonusKey
     here (or just remap in bonuses() at your call site) — nothing else changes.
  --------------------------------------------------------------------------- */
  var CATALOG = [
    { id: "extra_hand",    kind: "tier",   max: 3, label: "Extra Hand",
      desc: "+1 hand each round, permanently.",
      bonusKey: "hands",          bonusPer: 1, cost: function (lv) { return 40 + lv * 40; } },

    { id: "extra_discard", kind: "tier",   max: 3, label: "Extra Discard",
      desc: "+1 discard each round, permanently.",
      bonusKey: "discards",       bonusPer: 1, cost: function (lv) { return 30 + lv * 30; } },

    { id: "extra_slot",    kind: "tier",   max: 2, label: "Extra Slot",
      desc: "+1 joker/consumable slot to start each run.",
      bonusKey: "slots",          bonusPer: 1, cost: function (lv) { return 60 + lv * 60; } },

    { id: "reroll_deal",   kind: "tier",   max: 3, label: "Reroll Deal",
      desc: "Shop rerolls cost $1 less (stacks).",
      bonusKey: "rerollDiscount", bonusPer: 1, cost: function (lv) { return 25 + lv * 25; } },

    { id: "seed_capital",  kind: "tier",   max: 4, label: "Seed Capital",
      desc: "Start every run with +$1 (stacks).",
      bonusKey: "startCash",      bonusPer: 1, cost: function (lv) { return 20 + lv * 20; } },

    { id: "skin_amber",    kind: "unlock", label: "CRT Skin: Amber",
      desc: "Cosmetic terminal palette. No gameplay effect.",
      cost: function () { return 50; } },

    { id: "skin_ice",      kind: "unlock", label: "CRT Skin: Ice",
      desc: "Cosmetic terminal palette. No gameplay effect.",
      cost: function () { return 50; } }
  ];

  /* ---------------------------------------------------------------------------
     STORAGE — prefer ACEDCore.store, else namespaced localStorage, else memory.
  --------------------------------------------------------------------------- */
  var KEY = "vault";
  var mem = {};

  function coreStore() {
    try { return (window.ACEDCore && window.ACEDCore.store) ? window.ACEDCore.store : null; }
    catch (e) { return null; }
  }

  var NS = (function () {
    try {
      var p = new URLSearchParams(location.search).get("pack");
      return "aced:" + ((p || "cpa-far").replace(/[^a-z0-9._-]/gi, "")) + ":";
    } catch (e) { return "aced:cpa-far:"; }
  })();

  var lsOk = false;
  try {
    var t = "__acedvault__";
    window.localStorage.setItem(t, "1");
    window.localStorage.removeItem(t);
    lsOk = true;
  } catch (e) { lsOk = false; }

  function fresh() {
    return { v: 1, bal: 0, earned: 0, spent: 0, tiers: {}, unlocks: {}, lastWinDay: null };
  }

  function normalize(s) {
    if (!s || typeof s !== "object") s = fresh();
    if (typeof s.bal !== "number" || s.bal < 0) s.bal = Math.max(0, +s.bal || 0);
    if (typeof s.earned !== "number") s.earned = 0;
    if (typeof s.spent !== "number") s.spent = 0;
    if (!s.tiers || typeof s.tiers !== "object") s.tiers = {};
    if (!s.unlocks || typeof s.unlocks !== "object") s.unlocks = {};
    if (s.lastWinDay === undefined) s.lastWinDay = null;
    s.v = 1;
    return s;
  }

  function load() {
    var raw = null;
    var cs = coreStore();
    if (cs) { try { raw = cs.get(KEY, null); } catch (e) { raw = null; } }
    if (raw == null && lsOk) {
      try { var s = window.localStorage.getItem(NS + KEY); if (s != null) raw = JSON.parse(s); } catch (e) {}
    }
    if (raw == null && mem[KEY] != null) raw = mem[KEY];
    return normalize(raw || fresh());
  }

  function save(state) {
    var cs = coreStore();
    if (cs) { try { cs.set(KEY, state); return; } catch (e) {} }
    if (lsOk) { try { window.localStorage.setItem(NS + KEY, JSON.stringify(state)); return; } catch (e) {} }
    mem[KEY] = state;
  }

  function track(evt, props) {
    try { if (window.ACEDCore && window.ACEDCore.analytics) window.ACEDCore.analytics.track(evt, props || {}); }
    catch (e) {}
  }

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function def(id) {
    for (var i = 0; i < CATALOG.length; i++) { if (CATALOG[i].id === id) return CATALOG[i]; }
    return null;
  }

  /* ---------------------------------------------------------------------------
     EARN
  --------------------------------------------------------------------------- */
  function award(amount, reason) {
    amount = Math.max(0, Math.round(amount || 0));
    var s = load();
    s.bal += amount; s.earned += amount;
    save(s);
    track("vault_award", { amount: amount, reason: reason || null, balance: s.bal });
    return s.bal;
  }

  // Returns the number of coins AWARDED for this run (the delta, not the balance).
  function awardRunEnd(p) {
    p = p || {};
    var a = CONFIG.award;
    var coins = a.finish;
    var score = Math.max(0, +p.score || 0);
    coins += Math.min(a.scoreCap, Math.floor(score / a.perScore));
    var ante = Math.max(0, +(p.ante != null ? p.ante : p.close) || 0);
    coins += ante * a.perAnte;

    var won = p.outcome === "win" || p.won === true;
    if (won) {
      coins += a.winBonus;
      var s = load();
      var tk = todayKey();
      if (s.lastWinDay !== tk) { coins += a.firstWinOfDay; s.lastWinDay = tk; save(s); }
    }

    award(coins, "run_end:" + (p.outcome || (won ? "win" : "loss")));
    track("vault_run_end", { coins: coins, outcome: p.outcome || (won ? "win" : "loss"), score: score, ante: ante });
    return coins;
  }

  // Route the events the engine already fires. Unknown events are a no-op, so
  // it is safe to call this everywhere you call ACEDProgress.event(...).
  function event(type, payload) {
    payload = payload || {};
    switch (type) {
      case "run_end":
      case "run_over":
      case "cash_out":
        return awardRunEnd(payload);
      case "boss_defeated":
      case "close_won":
        return award(payload.reward || 3, "boss");
      case "daily_win":
        return award(payload.reward || 8, "daily");
      default:
        return 0;
    }
  }

  /* ---------------------------------------------------------------------------
     SPEND
  --------------------------------------------------------------------------- */
  function levelOf(id) {
    var d = def(id); if (!d) return 0;
    var s = load();
    if (d.kind === "unlock") return s.unlocks[id] ? 1 : 0;
    return s.tiers[id] || 0;
  }

  function maxLevel(d) { return d.kind === "unlock" ? 1 : (d.max || 1); }

  function maxedOut(id) {
    var d = def(id); if (!d) return true;
    return levelOf(id) >= maxLevel(d);
  }

  function costOf(id) {
    var d = def(id); if (!d) return null;
    if (maxedOut(id)) return null;
    try { return Math.max(0, Math.round(d.cost(levelOf(id)))); } catch (e) { return null; }
  }

  function canAfford(id) {
    var c = costOf(id);
    return c != null && load().bal >= c;
  }

  function purchase(id) {
    var d = def(id);
    if (!d) return { ok: false, reason: "unknown" };
    if (maxedOut(id)) return { ok: false, reason: "maxed", level: levelOf(id) };
    var c = costOf(id);
    if (c == null) return { ok: false, reason: "maxed", level: levelOf(id) };
    var s = load();
    if (s.bal < c) return { ok: false, reason: "insufficient", need: c, balance: s.bal };

    s.bal -= c; s.spent += c;
    if (d.kind === "unlock") s.unlocks[id] = 1;
    else s.tiers[id] = (s.tiers[id] || 0) + 1;
    save(s);

    var lv = d.kind === "unlock" ? 1 : s.tiers[id];
    track("vault_purchase", { id: id, cost: c, level: lv, balance: s.bal });
    return { ok: true, id: id, level: lv, spent: c, balance: s.bal };
  }

  /* ---------------------------------------------------------------------------
     READ
  --------------------------------------------------------------------------- */
  // Aggregate gameplay deltas from all owned tier upgrades. Engine applies these
  // at run start.
  function bonuses() {
    var s = load();
    var out = { hands: 0, discards: 0, slots: 0, rerollDiscount: 0, startCash: 0 };
    for (var i = 0; i < CATALOG.length; i++) {
      var d = CATALOG[i];
      if (d.kind === "tier" && d.bonusKey) {
        var lv = s.tiers[d.id] || 0;
        out[d.bonusKey] = (out[d.bonusKey] || 0) + lv * (d.bonusPer || 0);
      }
    }
    return out;
  }

  function isUnlocked(id) { return !!load().unlocks[id]; }

  // A render-ready view of the whole tree (for a meta-shop screen).
  function catalog() {
    var s = load();
    return CATALOG.map(function (d) {
      var lv = d.kind === "unlock" ? (s.unlocks[d.id] ? 1 : 0) : (s.tiers[d.id] || 0);
      var max = maxLevel(d);
      var maxed = lv >= max;
      var next = maxed ? null : Math.max(0, Math.round(d.cost(lv)));
      return {
        id: d.id, kind: d.kind, label: d.label, desc: d.desc,
        level: lv, max: max, maxed: maxed, cost: next,
        affordable: next != null && s.bal >= next
      };
    });
  }

  function balance() { return load().bal; }
  function getState() { return load(); }
  function reset() { save(fresh()); track("vault_reset", {}); return true; }

  /* --------------------------------------------------------------------------- */
  window.ACEDVault = {
    version: 1,
    LABEL: CONFIG.CURRENCY_LABEL,
    CONFIG: CONFIG,
    CATALOG: CATALOG,
    // earn
    award: award,
    awardRunEnd: awardRunEnd,
    event: event,
    // spend
    costOf: costOf,
    canAfford: canAfford,
    purchase: purchase,
    // read
    balance: balance,
    level: levelOf,
    bonuses: bonuses,
    isUnlocked: isUnlocked,
    catalog: catalog,
    getState: getState,
    reset: reset
  };
})();
