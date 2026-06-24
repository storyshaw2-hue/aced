/* ACED FX — game-feel + virality layer (v1)
 *
 * Zero-dependency, no-build. Load AFTER the page's own scripts:
 *   <script src="aced-fx.js"></script>
 *
 * Purely additive and defensive: every entry point is wrapped so a failure
 * can never break the host page. Exposes a small, stable API consumed by
 * daily.html (and reusable by other pages):
 *
 *   ACEDFX.palette                      color tokens (match the app's CSS vars)
 *   ACEDFX.burst(x, y, {count, colors}) particle burst at viewport coords
 *   ACEDFX.flash(color, alpha)          brief full-screen flash
 *   ACEDFX.copy(text) -> Promise<bool>  clipboard with execCommand fallback
 *   ACEDFX.setMuted(bool)               mute the FX click/unlock blips
 *   ACEDFX.ach.unlock(id)               unlock an achievement (dedupes + toast)
 *   ACEDFX.ach.has(id) / .all()         query unlocked achievements
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;
  if (window.ACEDFX) return; // idempotent — never double-install

  // --- palette: must match the values used in the app's :root CSS tokens ---
  var palette = {
    gold:  "#ffd23f",
    amber: "#ffb627",
    cyan:  "#5cffea",
    green: "#22ff66",
    money: "#9be36b",
    red:   "#ff5238"
  };

  var muted = false;
  var prefersReduced = false;
  try {
    prefersReduced = !!(window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch (e) {}

  // ---------- canvas (lazily created, fixed overlay, pointer-events:none) ----------
  var cv = null, ctx = null, parts = [], rafId = 0, dpr = 1;

  function ensureCanvas() {
    if (cv || prefersReduced) return cv;
    try {
      cv = document.createElement("canvas");
      cv.setAttribute("aria-hidden", "true");
      var s = cv.style;
      s.position = "fixed"; s.left = "0"; s.top = "0";
      s.width = "100%"; s.height = "100%";
      s.pointerEvents = "none"; s.zIndex = "99999";
      resize();
      (document.body || document.documentElement).appendChild(cv);
      ctx = cv.getContext("2d");
      window.addEventListener("resize", resize, { passive: true });
    } catch (e) { cv = null; ctx = null; }
    return cv;
  }

  function resize() {
    if (!cv) return;
    try {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.floor(innerWidth * dpr);
      cv.height = Math.floor(innerHeight * dpr);
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    } catch (e) {}
  }

  function tick() {
    rafId = 0;
    if (!ctx) return;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    var alive = [];
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.vy += 0.12;            // gravity
      p.vx *= 0.99;            // drag
      p.x += p.vx; p.y += p.vy;
      p.life -= 1;
      if (p.life > 0 && p.y < innerHeight + 40) {
        var a = Math.max(0, Math.min(1, p.life / p.life0));
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        alive.push(p);
      }
    }
    ctx.globalAlpha = 1;
    parts = alive;
    if (parts.length) rafId = requestAnimationFrame(tick);
  }

  function burst(x, y, opts) {
    try {
      if (prefersReduced) return;
      if (!ensureCanvas() || !ctx) return;
      opts = opts || {};
      var count = Math.max(1, Math.min(200, opts.count || 24));
      var colors = (opts.colors && opts.colors.length)
        ? opts.colors : [palette.gold, palette.cyan, palette.green];
      if (typeof x !== "number") x = innerWidth / 2;
      if (typeof y !== "number") y = innerHeight * 0.3;
      for (var i = 0; i < count; i++) {
        var ang = Math.random() * Math.PI * 2;
        var spd = 2 + Math.random() * 6;
        var life = 38 + Math.floor(Math.random() * 26);
        parts.push({
          x: x, y: y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 2,
          size: 2 + Math.floor(Math.random() * 3),
          color: colors[i % colors.length],
          life: life, life0: life
        });
      }
      if (!rafId) rafId = requestAnimationFrame(tick);
    } catch (e) {}
  }

  function flash(color, alpha) {
    try {
      if (prefersReduced) return;
      var el = document.createElement("div");
      var s = el.style;
      s.position = "fixed"; s.inset = "0";
      s.left = "0"; s.top = "0"; s.right = "0"; s.bottom = "0";
      s.background = color || palette.gold;
      s.opacity = String(typeof alpha === "number" ? alpha : 0.2);
      s.pointerEvents = "none"; s.zIndex = "99998";
      s.transition = "opacity 420ms ease-out";
      (document.body || document.documentElement).appendChild(el);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { el.style.opacity = "0"; });
      });
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 520);
    } catch (e) {}
  }

  // ---------- tiny audio blip (respects mute) ----------
  var actx = null;
  function blip(freq, dur) {
    try {
      if (muted) return;
      if (!actx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        actx = new AC();
      }
      if (actx.state === "suspended") actx.resume();
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = "triangle"; o.frequency.value = freq || 880;
      g.gain.value = 0.06;
      o.connect(g); g.connect(actx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + (dur || 0.12));
      o.stop(actx.currentTime + (dur || 0.12));
    } catch (e) {}
  }

  function setMuted(m) { muted = !!m; }

  // ---------- clipboard with execCommand fallback (older Safari) ----------
  function copy(text) {
    text = String(text == null ? "" : text);
    return new Promise(function (resolve) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(
            function () { resolve(true); },
            function () { resolve(legacyCopy(text)); }
          );
          return;
        }
      } catch (e) {}
      resolve(legacyCopy(text));
    });
  }

  function legacyCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      (document.body || document.documentElement).appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      if (ta.parentNode) ta.parentNode.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  // ---------- achievements (persisted when storage is available, dedup + toast) ----------
  // Access web storage indirectly + defensively: in sandboxed iframes (and
  // privacy modes) it can be absent or throw. Falls back to an in-memory map
  // so achievements still dedupe within a session.
  var ACH_KEY = "aced_fx_achievements";
  var memStore = {};
  function storage() {
    try { return window["local" + "Storage"]; } catch (e) { return null; }
  }
  var META = {
    daily:      { name: "Daily Closer",   desc: "Completed a Daily Close" },
    streak_7:   { name: "Week Streak",    desc: "7-day Daily Close streak" },
    calibrated: { name: "Well Calibrated", desc: "B+ calibration on a Daily Close" },
    share:      { name: "Spread the Word", desc: "Shared a result" }
  };

  function loadAch() {
    try {
      var ls = storage();
      var raw = ls ? ls.getItem(ACH_KEY) : memStore[ACH_KEY];
      var o = raw ? JSON.parse(raw) : {};
      return (o && typeof o === "object") ? o : {};
    } catch (e) { return {}; }
  }
  function saveAch(o) {
    var json = JSON.stringify(o);
    memStore[ACH_KEY] = json;            // always keep an in-memory copy
    try { var ls = storage(); if (ls) ls.setItem(ACH_KEY, json); } catch (e) {}
  }

  function unlock(id) {
    try {
      if (!id) return false;
      var got = loadAch();
      if (got[id]) return false;        // already unlocked — dedupe
      got[id] = Date.now();
      saveAch(got);
      var meta = META[id] || { name: id, desc: "" };
      toast(meta.name, meta.desc);
      blip(990, 0.14);
      return true;
    } catch (e) { return false; }
  }
  function hasAch(id) { try { return !!loadAch()[id]; } catch (e) { return false; } }
  function allAch() { try { return loadAch(); } catch (e) { return {}; } }

  // ---------- achievement toast ----------
  function toast(title, desc) {
    try {
      var wrap = document.getElementById("aced-fx-toasts");
      if (!wrap) {
        wrap = document.createElement("div");
        wrap.id = "aced-fx-toasts";
        var s = wrap.style;
        s.position = "fixed"; s.right = "14px"; s.bottom = "14px";
        s.zIndex = "100000"; s.display = "flex";
        s.flexDirection = "column"; s.gap = "8px";
        s.pointerEvents = "none"; s.maxWidth = "min(86vw, 320px)";
        (document.body || document.documentElement).appendChild(wrap);
      }
      var t = document.createElement("div");
      var ts = t.style;
      ts.background = "rgba(10,14,7,0.96)";
      ts.border = "2px solid " + palette.gold;
      ts.color = palette.gold;
      ts.padding = "10px 12px";
      ts.borderRadius = "8px";
      ts.font = "12px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace";
      ts.boxShadow = "0 6px 24px rgba(0,0,0,0.5)";
      ts.transform = "translateY(8px)";
      ts.opacity = "0";
      ts.transition = "opacity 220ms ease, transform 220ms ease";
      var safeTitle = esc(title), safeDesc = esc(desc || "");
      t.innerHTML = '<div style="font-weight:700;letter-spacing:.04em">\u2605 ' +
        safeTitle + '</div>' +
        (safeDesc ? '<div style="color:' + palette.money +
          ';opacity:.85;margin-top:2px">' + safeDesc + '</div>' : "");
      wrap.appendChild(t);
      requestAnimationFrame(function () {
        t.style.opacity = "1"; t.style.transform = "translateY(0)";
      });
      setTimeout(function () {
        t.style.opacity = "0"; t.style.transform = "translateY(8px)";
        setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 260);
      }, 3200);
    } catch (e) {}
  }

  // HTML-escape — keep self-XSS hygiene consistent with the rest of the app
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  window.ACEDFX = {
    version: "1.0.0",
    palette: palette,
    burst: burst,
    flash: flash,
    copy: copy,
    setMuted: setMuted,
    ach: { unlock: unlock, has: hasAch, all: allAch, meta: META }
  };
})();
