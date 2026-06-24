/* ACED — aced-config.js
   ============================================================================
   The ONE place to turn on accounts + cloud sync across the whole app.

   To enable: deploy the reference backend in server/ (see BACKEND_SPEC.md), then
   uncomment the line below and point it at your API's public URL. That's it —
   every page that loads this file will show sign-in and sync phone <-> laptop.

   Leave it commented to keep ACED 100% local (localStorage only). When unset,
   ACEDAccount is a no-op and no sign-in control appears, so this is safe to ship.

   Load order on each page:  aced-config.js  ->  aced-core.js  ->  aced-account.js
   ============================================================================ */
// window.ACED_API_URL = "https://your-aced-backend.example.com";
