/* server/sync-auth-guards.js — pure request guards for /state, /sync and magic-link sign-in.
   No I/O and no dependencies, so they are unit-tested directly (node server/sync-auth-guards.test.js).

   1) Pack scoping (audit G1). Sync state is keyed by (user, pack). The old helper silently
      fell back to "world-capitals" when a request named no pack, so a pull that forgot
      ?pack= received world-capitals progress, and the client wrote it into whatever pack
      was open. Sync routes now REQUIRE an explicit pack and reject a request whose query
      and body name different packs. Sanitisation is unchanged, so existing rows keep
      their exact keys.

   2) Sign-in state (audit G3, "#token=" session fixation). The browser that asks for a
      magic link sends a random one-time `state`. The server carries it through the
      emailed link and back to the app fragment; the app accepts a session only when the
      returning state matches the one it stored. A link minted for someone else's account
      therefore cannot sign a victim in. The server never stores or logs the state. */
"use strict";

const PACK_STRIP = /[^a-z0-9._-]/gi;
// 22+ base64url chars = at least 128 bits of entropy; 128 caps abuse of the link length.
const STATE_RE = /^[A-Za-z0-9_-]{22,128}$/;

function cleanPack(v) {
  if (v == null || typeof v === "object") return "";
  return String(v).replace(PACK_STRIP, "");
}

// -> { pack } or { error }   (error is a stable machine-readable code)
function syncPackId(req) {
  const q = cleanPack(req && req.query ? req.query.pack : null);
  const body = req && req.body && typeof req.body === "object" ? req.body : null;
  const b = cleanPack(body ? body.pack : null);
  if (q && b && q !== b) return { error: "pack_mismatch" };
  const pack = q || b;
  if (!pack) return { error: "pack_required" };
  return { pack };
}

function cleanAuthState(s) {
  return typeof s === "string" && STATE_RE.test(s) ? s : null;
}

function magicLinkUrl(apiUrl, token, state) {
  return apiUrl + "/auth/verify?token=" + encodeURIComponent(token) + "&state=" + encodeURIComponent(state);
}

function sessionRedirectUrl(appUrl, session, state) {
  return appUrl + "/#token=" + encodeURIComponent(session) + "&state=" + encodeURIComponent(state);
}

module.exports = { syncPackId, cleanAuthState, magicLinkUrl, sessionRedirectUrl, STATE_RE };
