# ACED — acedhq.com bundle (domain migration fix + security/core/marketability)

Rebuilt directly on the current repo (the `acedhq.com` commit), so it inherits the
domain move and adds improvements on top — with `acedhq.com` used throughout.
Validated: server booted on real SQLite with `APP_URL=https://acedhq.com` — CORS
echoes acedhq.com, magic-link redirect lands on acedhq.com, `/notify` persists a
normalized/deduped subscriber, anti-cheat caps hold, and the full
auth → opt-in → sync → leaderboard → sign-out-all flow passes.

---

## ⚠️ DO THIS FIRST (revenue-blocking) — Render dashboard
The migration commit updated the site's HTML but **not the API's `APP_URL`**, which
is the CORS origin + magic-link redirect + Stripe return URL. If the Render env still
says `aced.pplx.app`, then from `acedhq.com` **sign-in, sync, checkout, and the notify
form are all CORS-blocked**.

In the Render dashboard for the `aced-api` service, set:
```
APP_URL = https://acedhq.com
```
(the `render.yaml` in this bundle is also corrected, but the live env must be changed
by hand). While there, confirm `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`PRICE_CPA_FAR`, `RESEND_API_KEY`, and an `EMAIL_FROM` on your verified acedhq.com
domain are all set. Then redeploy the API.

---

## Apply (Perplexity)

### Overwrite
| Path | Why |
|---|---|
| `render.yaml` | `APP_URL` → `https://acedhq.com` (was still the old domain). |
| `robots.txt` | Sitemap URL → acedhq.com. |
| `README.md` | Live URL → acedhq.com. |
| `sitemap.xml` | acedhq.com URLs + added `cheatsheet.html` (the $9 funnel) and `importer.html`. |
| `server/server.js` | Security headers (nosniff/DENY/no-referrer/no-store); **POST `/notify`** (validated, rate-limited, idempotent); hourly expired-token cleanup. |
| `server/db.js` | `subscribers` table + `subscribers.add` (SQLite & Postgres); `magic.gc(cutoff)`. Migrates automatically on boot. |
| `index.html` | `acedhq.com` `SoftwareApplication` + `FAQPage` JSON-LD; email capture now POSTs to `ACED_API_URL` + `/notify` (was only localStorage — every lead was being lost); FAR/AUD/REG/BAR roadmap rows clickable into their pack; "270+" count fix; early-access roadmap labels. |
| `study.html` | Account modal now has a **PUBLIC LEADERBOARD** opt-in (handle → show/hide) and **SIGN OUT EVERYWHERE**, wiring the leaderboard + session-revocation features that had no UI. |

### Add
| Path | Why |
|---|---|
| `vercel.json` | Static security headers in **Vercel's** format (this replaces the Netlify-style `_headers` — Vercel does not read `_headers`). No enforcing CSP (an untested one would break this inline-heavy app). |
| `SECURITY.md` | Responsible-disclosure policy (contact: security@acedhq.com). |
| `.well-known/security.txt` | RFC 9116 security contact (Vercel serves it at `/.well-known/security.txt`). |

### Delete
```bash
git rm .github/workflows/jscrambler-code-integrity.yml
```
It runs `npm ci` + `npm run build` against a nonexistent `dist/` on every push and always fails. Real CI is `validate.yml`.

### Redeploy
- API (Render): after setting `APP_URL`, redeploy. The `subscribers` table is created automatically.
- Static (Vercel): redeploy for the HTML/sitemap/robots/vercel.json changes.

---

## Verify after deploy
1. `https://aced-api.onrender.com/health` → `"stripe":true`, `"email":"resend"`, and the response carries `X-Content-Type-Options: nosniff`.
2. From **acedhq.com**, sign in with a real email (link must arrive and land back on acedhq.com), then do a Stripe **test-card** purchase and confirm the Mock Exam unlocks.
3. Submit the homepage "NOTIFY ME" form → the row appears in the `subscribers` table (lead-capture fix).
4. Account modal shows the leaderboard handle field; setting one puts you on the board; "SIGN OUT EVERYWHERE" invalidates other devices.

## Notes
- Internal docs (`docs/*.md`, `.github/copilot-instructions.md`) still mention the old domain in prose — harmless, can be swept later.
- CSP starter to iterate on in-browser, then add to `vercel.json`:
  `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://aced-api.onrender.com; form-action 'self' https://*.gumroad.com; frame-ancestors 'self'`
