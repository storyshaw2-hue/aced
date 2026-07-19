/* ACED — aced-pack.js
   ============================================================================
   Turns a study pack into a GAME SKIN + light tuning. This is what makes the
   same engine feel like a different game for every pack someone brings in,
   with NOTHING subject-specific baked into the engine.

   Product stance: the engine is a fun roguelike on its own; a pack is what the
   player brings. So a pack containing ONLY questions must produce a great game
   with zero extra work. Everything below is OPTIONAL, layered over neutral,
   market-agnostic defaults (no subject flavor, no fixed vocabulary).

   Two ways a pack customizes the game — both optional:

     (a) AUTHOR-DRIVEN — the pack MAY include optional blocks:
             window.ACED_PACK = {
               questions: [ ... ],                         // the only real requirement
               name:   "Intro Spanish",                    // optional display name
               theme:  { palette: "amber" | {bg,fg,accent,dim}, font, scanlines },
               labels: { currency, hand, round, boss, run, deck, target },
               tuning: { handSize, runLength, difficulty: { easyMax, hardMin } }
             }

     (b) CONTENT-DRIVEN (automatic) — anything the author omits is DERIVED from
         the pack itself:
           - a distinct palette per pack, seeded from its name, so every deck
             looks different for free (chosen from a curated CRT set);
           - difficulty tiers from each question's shape, using per-pack
             terciles, so a one-word vocab deck and a paragraph deck each split
             sensibly RELATIVE TO THEIR OWN material;
           - run length scaled to how many questions the pack has.

   Plus a PLAYER lever: ACEDPack.setPalette(id) re-skins the run at runtime and
   the choice persists per pack (rides ACEDCore.store when present).

   The engine reads difficultyOf(q) however it likes (e.g. hold the hard ones
   for boss rounds, or weight scoring). This module never invents enemies,
   combat, HP, or subject taxonomy — it only skins and tunes.

   Vanilla ES5 IIFE, no build step, attaches to window.ACEDPack. Load after
   aced-core.js and after the pack file. DOM-touching bits are guarded, so it is
   safe to load anywhere (including tests).
   ============================================================================ */
(function () {
  "use strict";

  /* ---- curated palettes: CRT-friendly, high-contrast, all subject-neutral -- */
  var PALETTES = [
    { id: "green",   bg: "#0b0f0b", fg: "#c8f7c5", accent: "#39ff14", dim: "#1f3a1f" },
    { id: "amber",   bg: "#140d00", fg: "#ffd79a", accent: "#ffb000", dim: "#3a2600" },
    { id: "ice",     bg: "#050b12", fg: "#bfe9ff", accent: "#38bdf8", dim: "#123043" },
    { id: "magenta", bg: "#120512", fg: "#ffc8f0", accent: "#ff3ea5", dim: "#3a1030" },
    { id: "mono",    bg: "#0a0a0a", fg: "#e6e6e6", accent: "#ffffff", dim: "#2a2a2a" },
    { id: "ember",   bg: "#150404", fg: "#ffc9b0", accent: "#ff4d2e", dim: "#3a1008" },
    { id: "violet",  bg: "#0a0714", fg: "#d8ccff", accent: "#8b5cf6", dim: "#241a3f" }
  ];

  var DEFAULT_LABELS = {
    currency: "Coins", hand: "Hand", round: "Round",
    boss: "Boss", run: "Run", deck: "Deck", target: "Target"
  };

  var DEFAULT_TUNING = { handSize: 8, runLength: 8 };

  /* ------------------------------- helpers --------------------------------- */
  function hashStr(s) {
    var h = 0, i; s = String(s == null ? "" : s);
    for (i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; }
    return h;
  }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function isObj(o) { return !!o && typeof o === "object"; }
  function isArr(o) { return Object.prototype.toString.call(o) === "[object Array]"; }
  function paletteById(id) {
    for (var i = 0; i < PALETTES.length; i++) { if (PALETTES[i].id === id) return PALETTES[i]; }
    return null;
  }

  // A question's "weight": a subject-agnostic proxy for how much there is to
  // process. Longer prompt + more/longer options => heavier. Meaningful only
  // relative to the rest of THIS pack, so it works for vocab and essays alike.
  function weightOf(q) {
    if (!isObj(q)) return 0;
    if (typeof q.difficulty === "number") return q.difficulty; // author value respected
    var stem = String(q.q || q.stem || q.prompt || q.front || "");
    var opts = q.options || q.choices || q.answers || [];
    var optLen = 0, i, o;
    if (isArr(opts)) {
      for (i = 0; i < opts.length; i++) {
        o = opts[i];
        optLen += String(o == null ? "" : (isObj(o) && o.text != null ? o.text : o)).length;
      }
      optLen += opts.length * 4; // each extra option adds a little friction
    }
    return stem.length + optLen;
  }

  function questionsOf(pack) {
    var qs = isObj(pack) ? (pack.questions || pack.cards || pack.q || null) : null;
    if (isArr(qs)) return qs;
    try { if (isArr(window.ACED_QUESTIONS)) return window.ACED_QUESTIONS; } catch (e) {}
    return [];
  }

  // Difficulty thresholds from the pack's own weight distribution (terciles).
  function deriveDifficulty(qs) {
    var ws = [], i;
    for (i = 0; i < qs.length; i++) { ws.push(weightOf(qs[i])); }
    if (!ws.length) return { easyMax: 40, hardMin: 120 }; // harmless generic fallback
    ws.sort(function (a, b) { return a - b; });
    function pct(p) { return ws[clamp(Math.floor(p * (ws.length - 1)), 0, ws.length - 1)]; }
    var easyMax = pct(0.34), hardMin = pct(0.67);
    if (hardMin <= easyMax) hardMin = easyMax + 1; // keep the medium band non-empty
    return { easyMax: easyMax, hardMin: hardMin };
  }

  /* ---- storage: prefer ACEDCore.store, else localStorage, else memory ------ */
  var NS = (function () {
    try { var p = new URLSearchParams(location.search).get("pack"); return "aced:" + ((p || "cpa-far").replace(/[^a-z0-9._-]/gi, "")) + ":"; }
    catch (e) { return "aced:cpa-far:"; }
  })();
  var lsOk = false;
  try { var tk = "__acedpack__"; window.localStorage.setItem(tk, "1"); window.localStorage.removeItem(tk); lsOk = true; } catch (e) { lsOk = false; }
  var mem = {};
  function coreStore() { try { return (window.ACEDCore && window.ACEDCore.store) ? window.ACEDCore.store : null; } catch (e) { return null; } }
  function readKey(k, fb) {
    var cs = coreStore();
    if (cs) { try { var v = cs.get(k, null); if (v != null) return v; } catch (e) {} }
    if (lsOk) { try { var raw = window.localStorage.getItem(NS + k); if (raw != null) return JSON.parse(raw); } catch (e) {} }
    return mem[k] != null ? mem[k] : fb;
  }
  function writeKey(k, v) {
    var cs = coreStore();
    if (cs) { try { cs.set(k, v); return; } catch (e) {} }
    if (lsOk) { try { window.localStorage.setItem(NS + k, JSON.stringify(v)); return; } catch (e) {} }
    mem[k] = v;
  }

  /* ------------------------------- build ----------------------------------- */
  var _cfg = null;

  function resolveTheme(pack, id) {
    var base = null;
    if (isObj(pack) && isObj(pack.theme)) {
      var pt = pack.theme;
      if (isObj(pt.palette)) {
        base = { id: "custom", bg: pt.palette.bg, fg: pt.palette.fg, accent: pt.palette.accent, dim: pt.palette.dim || pt.palette.accent };
      } else if (typeof pt.palette === "string" && paletteById(pt.palette)) {
        base = paletteById(pt.palette);
      }
    }
    if (!base) base = PALETTES[hashStr(id) % PALETTES.length]; // deterministic auto-pick
    var override = readKey("packSkin", null);                 // player choice wins
    if (override && paletteById(override)) base = paletteById(override);

    var font = (isObj(pack) && isObj(pack.theme) && pack.theme.font) ? String(pack.theme.font) : null;
    var scan = !(isObj(pack) && isObj(pack.theme) && pack.theme.scanlines === false);
    return { paletteId: base.id, bg: base.bg, fg: base.fg, accent: base.accent, dim: base.dim, font: font, scanlines: scan };
  }

  function build(pack) {
    if (!isObj(pack)) { try { pack = window.ACED_PACK || null; } catch (e) { pack = null; } }
    var qs = questionsOf(pack);
    var name = (isObj(pack) && (pack.name || pack.title || pack.id)) || "Untitled Pack";
    var id = (isObj(pack) && pack.id) || name;

    // labels: defaults <- author overrides (only non-empty overrides apply)
    var labels = {}, lk, k;
    for (lk in DEFAULT_LABELS) { if (DEFAULT_LABELS.hasOwnProperty(lk)) labels[lk] = DEFAULT_LABELS[lk]; }
    if (isObj(pack) && isObj(pack.labels)) {
      for (k in pack.labels) { if (pack.labels.hasOwnProperty(k) && pack.labels[k]) labels[k] = String(pack.labels[k]); }
    }

    var theme = resolveTheme(pack, id);

    // tuning: defaults <- derived <- author overrides
    var tuning = {
      handSize: DEFAULT_TUNING.handSize,
      runLength: clamp(Math.round(qs.length / 8) || DEFAULT_TUNING.runLength, 3, 12),
      difficulty: deriveDifficulty(qs)
    };
    if (isObj(pack) && isObj(pack.tuning)) {
      var t = pack.tuning;
      if (typeof t.handSize === "number") tuning.handSize = clamp(t.handSize, 3, 12);
      if (typeof t.runLength === "number") tuning.runLength = clamp(t.runLength, 1, 30);
      if (isObj(t.difficulty)) {
        if (typeof t.difficulty.easyMax === "number") tuning.difficulty.easyMax = t.difficulty.easyMax;
        if (typeof t.difficulty.hardMin === "number") tuning.difficulty.hardMin = t.difficulty.hardMin;
      }
    }

    _cfg = {
      meta: { id: String(id), name: String(name), questionCount: qs.length },
      theme: theme,
      labels: labels,
      tuning: tuning
    };
    return _cfg;
  }

  /* --------------------------------- API ----------------------------------- */
  function config() { return _cfg || build(); }

  function palette() {
    var c = config();
    return { id: c.theme.paletteId, bg: c.theme.bg, fg: c.theme.fg, accent: c.theme.accent, dim: c.theme.dim };
  }
  function palettes() { return PALETTES.map(function (p) { return { id: p.id, bg: p.bg, fg: p.fg, accent: p.accent, dim: p.dim }; }); }

  function label(key, fb) { var c = config(); return (c.labels && c.labels[key]) || fb || key; }

  function difficultyOf(q) {
    var c = config(), w = weightOf(q), d = c.tuning.difficulty || {};
    if (w <= (d.easyMax != null ? d.easyMax : 40)) return "easy";
    if (w >= (d.hardMin != null ? d.hardMin : 120)) return "hard";
    return "medium";
  }

  // Player re-skin. Pass null to clear the override (back to author/auto).
  function setPalette(id) {
    if (id == null) { writeKey("packSkin", null); }
    else if (!paletteById(id)) { return { ok: false, reason: "unknown-palette" }; }
    else { writeKey("packSkin", id); }
    build(); // rebuild so palette()/applyTheme() reflect the change now
    return { ok: true, paletteId: config().theme.paletteId };
  }

  // Push the palette into the arcade's CRT custom properties. The game screen
  // (aced-arcade.html / study.html) reads --green/--green-dim/--cyan/--white and
  // the --bg/--panel/--border family, NOT --fg/--accent/--dim, so the 4 palette
  // colors are fanned out across those real tokens:
  //   bg     -> --bg --bg2 --panel --panel2   (all surfaces)
  //   fg     -> --white                        (body text)
  //   accent -> --green --green-dim --cyan     (brand / correct / highlights)
  //   dim    -> --border                       (frames)
  // Generic --bg/--fg/--accent/--dim are also set so any other consumer works.
  function applyTheme(root) {
    try {
      var el = root || (typeof document !== "undefined" ? document.documentElement : null);
      if (!el || !el.style) return false;
      var t = config().theme;
      el.style.setProperty("--bg", t.bg);
      el.style.setProperty("--bg2", t.bg);
      el.style.setProperty("--panel", t.bg);
      el.style.setProperty("--panel2", t.bg);
      el.style.setProperty("--white", t.fg);
      el.style.setProperty("--green", t.accent);
      el.style.setProperty("--green-dim", t.accent);
      el.style.setProperty("--cyan", t.accent);
      el.style.setProperty("--border", t.dim);
      el.style.setProperty("--fg", t.fg);
      el.style.setProperty("--accent", t.accent);
      el.style.setProperty("--dim", t.dim);
      if (t.font) el.style.setProperty("--font", t.font);
      return true;
    } catch (e) { return false; }
  }

  function reset() { _cfg = null; writeKey("packSkin", null); return true; }

  window.ACEDPack = {
    version: 1,
    PALETTES: PALETTES,
    init: build,
    config: config,
    palette: palette,
    palettes: palettes,
    setPalette: setPalette,
    label: label,
    difficultyOf: difficultyOf,
    weightOf: weightOf,
    applyTheme: applyTheme,
    reset: reset
  };
})();
