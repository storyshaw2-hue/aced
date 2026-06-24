/* server/server.js — ACED reference backend (accounts · sync · Stripe entitlements)
   ============================================================================
   Implements docs/BACKEND_SPEC.md. Pairs with the existing client contract in
   aced-core.js (ACEDCore.backend / ACEDCore.sync) and the client glue in
   aced-account.js. SQLite for zero-infra local dev; swap to Postgres by replacing
   the three db helpers — the shapes are identical.

   Quick start:
     cd server && cp .env.example .env   # fill in values
     npm install
     npm start                            # http://localhost:8787

   Endpoints:
     POST /auth/request   {email}                 -> emails a magic link (dev: returns it)
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
const Database = require("better-sqlite3");
const { mergeState } = require("./merge");

const PORT = process.env.PORT || 8787;
const APP_URL = process.env.APP_URL || "http://localhost:5500";          // where index.html is served
const API_URL = process.env.API_URL || ("http://localhost:" + PORT);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const DEV = process.env.NODE_ENV !== "production";
const stripe = process.env.STRIPE_SECRET_KEY ? require("stripe")(process.env.STRIPE_SECRET_KEY) : null;
// pack -> Stripe Price id (one-time per-section unlock). Configure in .env.
const PRICES = { "cpa-far": process.env.PRICE_CPA_FAR, "cpa-aud": process.env.PRICE_CPA_AUD };

/* ---------- db ---------- */
const db = new Database(process.env.DB_PATH || "aced.db");
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS users        (id TEXT PRIMARY KEY, email TEXT UNIQUE, created_at INTEGER);
  CREATE TABLE IF NOT EXISTS magic        (token TEXT PRIMARY KEY, email TEXT, expires INTEGER);
  CREATE TABLE IF NOT EXISTS state        (user_id TEXT, pack_id TEXT, updated_at INTEGER, json TEXT, PRIMARY KEY(user_id,pack_id));
  CREATE TABLE IF NOT EXISTS entitlements (user_id TEXT, pack_id TEXT, granted_at INTEGER, PRIMARY KEY(user_id,pack_id));
  CREATE TABLE IF NOT EXISTS leaderboard  (user_id TEXT, pack_id TEXT, handle TEXT, best_streak INTEGER, readiness INTEGER, mock_best INTEGER, updated_at INTEGER, PRIMARY KEY(user_id,pack_id));
`);
const uid = () => crypto.randomBytes(9).toString("hex");

/* ---------- app ---------- */
const app = express();
// Stripe webhook needs the RAW body for signature verification — mount before express.json.
app.post("/billing/webhook", express.raw({ type: "application/json" }), (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(501).end();
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET); }
  catch (e) { return res.status(400).send("bad signature: " + e.message); }
  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    const userId = s.metadata && s.metadata.user_id, packId = s.metadata && s.metadata.pack_id;
    if (userId && packId) {
      db.prepare("INSERT OR IGNORE INTO entitlements(user_id,pack_id,granted_at) VALUES(?,?,?)").run(userId, packId, Date.now());
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
app.post("/auth/request", (req, res) => {
  const email = String((req.body && req.body.email) || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: "invalid email" });
  const token = crypto.randomBytes(24).toString("hex");
  db.prepare("INSERT INTO magic(token,email,expires) VALUES(?,?,?)").run(token, email, Date.now() + 15 * 60 * 1000);
  const link = API_URL + "/auth/verify?token=" + token;
  // PROD: email `link` via your provider (Postmark/SES/Resend). DEV: log + return it.
  console.log("[auth] magic link for " + email + ": " + link);
  res.json({ ok: true, devLink: DEV ? link : undefined });
});

app.get("/auth/verify", (req, res) => {
  const row = db.prepare("SELECT * FROM magic WHERE token=?").get(String(req.query.token || ""));
  if (!row || row.expires < Date.now()) return res.status(400).send("Link expired — request a new one.");
  db.prepare("DELETE FROM magic WHERE token=?").run(row.token);
  let user = db.prepare("SELECT * FROM users WHERE email=?").get(row.email);
  if (!user) { const id = uid(); db.prepare("INSERT INTO users(id,email,created_at) VALUES(?,?,?)").run(id, row.email, Date.now()); user = { id, email: row.email }; }
  const session = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "60d" });
  // hand the token back to the static app via the URL fragment (not logged by servers)
  res.redirect(APP_URL + "/#token=" + session);
});

/* ---------- sync ---------- */
app.get("/state", auth, (req, res) => {
  const row = db.prepare("SELECT json, updated_at FROM state WHERE user_id=? AND pack_id=?").get(req.user.sub, packId(req));
  if (!row) return res.json({ v: 1, pack: packId(req), updatedAt: 0, data: {} });
  res.json({ v: 1, pack: packId(req), updatedAt: row.updated_at, data: JSON.parse(row.json) });
});

app.post("/sync", auth, (req, res) => {
  const pid = packId(req);
  const incoming = req.body || {};
  const row = db.prepare("SELECT json, updated_at FROM state WHERE user_id=? AND pack_id=?").get(req.user.sub, pid);
  const stored = row ? { updatedAt: row.updated_at, data: JSON.parse(row.json) } : null;
  const merged = mergeState(stored, incoming);
  const now = Date.now();
  db.prepare("INSERT INTO state(user_id,pack_id,updated_at,json) VALUES(?,?,?,?) ON CONFLICT(user_id,pack_id) DO UPDATE SET updated_at=excluded.updated_at, json=excluded.json")
    .run(req.user.sub, pid, now, JSON.stringify(merged));
  // opportunistically refresh the public leaderboard row from the merged state
  try {
    const d = merged, ds = d.dailyV1 || {};
    const mast = d.mastery || {}; const vals = Object.values(mast).map(Number);
    const readiness = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    db.prepare("INSERT INTO leaderboard(user_id,pack_id,handle,best_streak,readiness,mock_best,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(user_id,pack_id) DO UPDATE SET best_streak=excluded.best_streak, readiness=excluded.readiness, updated_at=excluded.updated_at")
      .run(req.user.sub, pid, null, ds.bestStreak || 0, readiness, d.mockBest || 0, now);
  } catch (e) {}
  res.json({ ok: true, serverUpdatedAt: now });
});

/* ---------- entitlements + billing ---------- */
app.get("/entitlements", auth, (req, res) => {
  const rows = db.prepare("SELECT pack_id FROM entitlements WHERE user_id=?").all(req.user.sub);
  res.json({ packs: rows.map(r => r.pack_id) });
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
app.get("/leaderboard", (req, res) => {
  const pid = String(req.query.pack || "cpa-far").replace(/[^a-z0-9._-]/gi, "");
  const rows = db.prepare("SELECT handle, best_streak, readiness, mock_best FROM leaderboard WHERE pack_id=? AND handle IS NOT NULL ORDER BY best_streak DESC, readiness DESC LIMIT 50").all(pid);
  res.json(rows.map(r => ({ handle: r.handle, bestStreak: r.best_streak, readiness: r.readiness, mockBest: r.mock_best })));
});

app.get("/health", (req, res) => res.json({ ok: true, stripe: !!stripe }));
app.listen(PORT, () => console.log("ACED API on " + API_URL + (stripe ? "" : "  (Stripe disabled — set STRIPE_SECRET_KEY)")));
