/* ============================================================================
   ACED — aced-brand.js
   Applies window.ACED_BRAND (from aced-config.js) across the app.

   FOUC — the important part
   -------------------------
   Colors are written as CSS custom properties onto <html> SYNCHRONOUSLY, the
   moment this script runs. An inline property on the documentElement overrides
   the stylesheet's :root{} defaults, so if this file is placed in <head> right
   after aced-config.js and BEFORE the page's <style>/<link rel="stylesheet">,
   the variables already hold the client's values when the browser computes the
   first paint — no flash of the default palette.

       <head>
         ...
         <script src="aced-config.js"></script>   <!-- defines window.ACED_BRAND -->
         <script src="aced-brand.js"></script>    <!-- applies it, pre-paint     -->
         <link rel="stylesheet" href="...">       <!-- or inline <style>         -->
         ...
       </head>

   Text swaps (name/logo/tagline) run at DOMContentLoaded. Because the HTML ships
   with the default brand ("ACED") already in place, the default build shows no
   flash; only a white-label fork momentarily shows "ACED" before the swap, which
   is imperceptible and can be avoided entirely by hard-coding the client name in
   their HTML fork if they prefer.

   Mark up swappable text with data-attributes (preferred) or classes:
     <span data-brand-name>ACED</span>
     <span data-brand-logo>ACED_</span>
     <span data-brand-tagline>study anything like a roguelike</span>
     <span class="brand-name">ACED</span>
   ============================================================================ */
(function () {
  var B = window.ACED_BRAND || {};

  // 1) COLORS → CSS variables on <html> (runs now; pre-paint when loaded in <head>)
  try {
    var root = document.documentElement, c = B.colors || {};
    Object.keys(c).forEach(function (k) { if (c[k]) root.style.setProperty("--" + k, c[k]); });
    // keep a couple of derived tokens coherent if the client only set the base green
    if (c.green) root.style.setProperty("--money", c.green);
  } catch (e) {}

  // 2) <title> — swap the default product name if a custom one is set
  try {
    if (B.name && B.name !== "ACED" && /ACED/.test(document.title)) {
      document.title = document.title.replace(/ACED/g, B.name);
    }
  } catch (e) {}

  // 3) TEXT NODES — [data-brand-*] / .brand-name, at DOMContentLoaded
  function swap() {
    try {
      if (B.name) {
        document.querySelectorAll("[data-brand-name], .brand-name").forEach(function (el) { el.textContent = B.name; });
      }
      if (B.logoText) {
        document.querySelectorAll("[data-brand-logo]").forEach(function (el) { el.textContent = B.logoText; });
      }
      if (B.tagline) {
        document.querySelectorAll("[data-brand-tagline]").forEach(function (el) { el.textContent = B.tagline; });
      }
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", swap); else swap();
})();
