/* server/server.js — ACED reference backend (accounts · sync · Stripe entitlements)
   ============================================================================
   Implements docs/BACKEND_SPEC.md. Pairs with the client contract in aced-core.js
   (ACEDCore.backend / ACEDCore.sync) and the glue in aced-account.js.

   Storage is durable and pluggable via server/db.js:
     DATABASE_URL set   -> Postgres (Neon/Supabase/Render — free tiers exist)
     DATABASE_URL unset -> SQLite at DB_PATH (mount a persistent disk in prod!)
   Email (magic links) is pluggable via server/email.js (Resend, else console).

   Quick start:
     cd server && cp .env.example .env   # fill in values
     npm install
     npm start                            # http://localhost:8787

   Endpoints:
     POST /auth/request   {email}                 -> emails a magic link (dev: also returns it)
     GET  /auth/verify?token=...                  -> mints a session JWT, redirects to APP_URL#token=...
     GET  /state                                  -> merged state for the authed user+pack   (Bearer)
     POST /sync           <snapshot>              -> merge + persist                          (Bearer)
     GET  /entitlements                           -> { packs:[...] }                          (Bearer)
     POST /billing/checkout {pack}                -> { url } Stripe Checkout                   (Bearer)
     POST /billing/webhook                        -> Stripe -> grant entitlement (raw body)
     GET  /leaderboard?pack=cpa-far               -> public opt-in stats
   ============================================================================ */
"use strict";
require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { mergeState } = require("./merge");
const db = require("./db");
const { sendMagicLink, providerName } = require("./email");

const PORT = process.env.PORT || 8787;
const APP_URL = process.env.APP_URL || "http://localhost:5500";          // where index.html is served
const API_URL = process.env.API_URL || ("http://localhost:" + PORT);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const DEV = process.env.NODE_ENV !== "production";
const stripe = process.env.STRIPE_SECRET_KEY ? require("stripe")(process.env.STRIPE_SECRET_KEY) : null;
// pack -> Stripe Price id (one-time per-section unlock). Configure in .env.
const PRICES = { "cpa-far": process.env.PRICE_CPA_FAR, "cpa-aud": process.env.PRICE_CPA_AUD };

const uid = () => crypto.randomBytes(9).toString("hex");

/* ---------- app ---------- */
const app = express();

// Stripe webhook needs the RAW body for signature verification — mount before express.json.
app.post("/billing/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(501).end();
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET); }
  catch (e) { return res.status(400).send("bad signature: " + e.message); }
  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    const userId = s.metadata && s.metadata.user_id, packId = s.metadata && s.metadata.pack_id;
    if (userId && packId) {
      try { await db.entitlements.grant(userId, packId, Date.now()); }
      catch (e) { console.error("[webhook] grant failed:", e.message); return res.status(500).end(); }
    }
  }
  res.json({ received: true });
});

app.use(express.json({ limit: "2mb" }));
// permissive CORS for the static site (lock APP_URL down in prod)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", APP_URL);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const tok = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!tok) return res.status(401).json({ error: "no token" });
  try { req.user = jwt.verify(tok, JWT_SECRET); next(); }
  catch (e) { res.status(401).json({ error: "bad token" }); }
}
function packId(req) { return String(req.query.pack || (req.body && req.body.pack) || "cpa-far").replace(/[^a-z0-9._-]/gi, ""); }

/* ---------- accounts (magic-link) ---------- */
app.post("/auth/request", async (req, res) => {
  const email = String((req.body && req.body.email) || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: "invalid email" });
  const token = crypto.randomBytes(24).toString("hex");
  try { await db.magic.create(token, email, Date.now() + 15 * 60 * 1000); }
  catch (e) { console.error("[auth] magic create failed:", e.message); return res.status(500).json({ error: "server error" }); }
  const link = API_URL + "/auth/verify?token=" + token;
  // Deliver via the configured provider. Never block the response on delivery, and
  // NEVER leak the link in the API response outside dev (it's a bearer credential).
  sendMagicLink(email, link).catch(err => console.error("[auth] email send failed:", err.message));
  console.log("[auth] magic link issued for " + email + (DEV ? (": " + link) : ""));
  res.json({ ok: true, devLink: DEV ? link : undefined });
});

app.get("/auth/verify", async (req, res) => {
  let row;
  try { row = await db.magic.find(String(req.query.token || "")); }
  catch (e) { console.error("[auth] verify lookup failed:", e.message); return res.status(500).send("server error"); }
  if (!row || Number(row.expires) < Date.now()) return res.status(400).send("Link expired — request a new one.");
  await db.magic.remove(row.token);
  let user = await db.users.findByEmail(row.email);
  if (!user) { const id = uid(); await db.users.create(id, row.email, Date.now()); user = { id, email: row.email }; }
  const session = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "60d" });
  // hand the token back to the static app via the URL fragment (not logged by servers)
  res.redirect(APP_URL + "/#token=" + session);
});

/* ---------- sync ---------- */
app.get("/state", auth, async (req, res) => {
  const pid = packId(req);
  const row = await db.state.get(req.user.sub, pid);
  if (!row) return res.json({ v: 1, pack: pid, updatedAt: 0, data: {} });
  res.json({ v: 1, pack: pid, updatedAt: Number(row.updated_at), data: JSON.parse(row.json) });
});

app.post("/sync", auth, async (req, res) => {
  const pid = packId(req);
  const incoming = req.body || {};
  const row = await db.state.get(req.user.sub, pid);
  const stored = row ? { updatedAt: Number(row.updated_at), data: JSON.parse(row.json) } : null;
  const merged = mergeState(stored, incoming);
  const now = Date.now();
  await db.state.upsert(req.user.sub, pid, now, JSON.stringify(merged));
  // opportunistically refresh the public leaderboard row from the merged state
  try {
    const d = merged, ds = d.dailyV1 || {};
    const mast = d.mastery || {}; const vals = Object.values(mast).map(Number);
    const readiness = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    await db.leaderboard.upsert(req.user.sub, pid, null, ds.bestStreak || 0, readiness, d.mockBest || 0, now);
  } catch (e) { /* leaderboard is best-effort */ }
  res.json({ ok: true, serverUpdatedAt: now });
});

/* ---------- entitlements + billing ---------- */
app.get("/entitlements", auth, async (req, res) => {
  const packs = await db.entitlements.listPacks(req.user.sub);
  res.json({ packs });
});

app.post("/billing/checkout", auth, async (req, res) => {
  if (!stripe) return res.status(501).json({ error: "billing not configured" });
  const pid = packId(req); const price = PRICES[pid];
  if (!price) return res.status(400).json({ error: "no price for pack " + pid });
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",                                   // one-time per-section unlock
      line_items: [{ price, quantity: 1 }],
      customer_email: req.user.email,
      success_url: APP_URL + "/study.html?paid=1&pack=" + pid,
      cancel_url: APP_URL + "/?canceled=1",
      metadata: { user_id: req.user.sub, pack_id: pid }
    });
    res.json({ url: session.url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ---------- leaderboard (opt-in public stats only) ---------- */
app.get("/leaderboard", async (req, res) => {
  const pid = String(req.query.pack || "cpa-far").replace(/[^a-z0-9._-]/gi, "");
  const rows = await db.leaderboard.top(pid, 50);
  res.json(rows.map(r => ({ handle: r.handle, bestStreak: r.best_streak, readiness: r.readiness, mockBest: r.mock_best })));
});

app.get("/health", (req, res) => res.json({ ok: true, stripe: !!stripe, db: db.kind, email: providerName }));

/* ---------- boot ---------- */
db.init().then(() => {
  if (!DEV && providerName === "console") {
    console.warn("[WARN] NODE_ENV=production but no email provider is configured (RESEND_API_KEY unset).");
    console.warn("[WARN] Magic links will NOT be delivered — set RESEND_API_KEY or sign-in will silently fail.");
  }
  app.listen(PORT, () => console.log(
    "ACED API on " + API_URL +
    "  · db: " + db.kind +
    "  · email: " + providerName +
    (stripe ? "" : "  · Stripe disabled (set STRIPE_SECRET_KEY)")
  ));
}).catch(e => { console.error("FATAL: db init failed:", e.message); process.exit(1); });
