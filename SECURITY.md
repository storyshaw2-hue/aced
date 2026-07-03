# Security Policy

ACED takes the security of its users — and their synced study progress and
payments — seriously.

## Reporting a vulnerability
Please report suspected vulnerabilities privately to **security@acedhq.com**.
Do not open a public GitHub issue for security reports. Include steps to
reproduce, the affected endpoint or page, and any proof-of-concept. We aim to
acknowledge within 72 hours.

Please act in good faith: do not access or modify other users' data, degrade
service, or run heavy automated scans. Testing against your own account is fine.

## Scope
In scope: the web app at https://acedhq.com and the API at
https://aced-api.onrender.com (auth, sync, entitlements, billing, leaderboard).
Out of scope: third-party providers (Stripe, Resend, Vercel, Render).

## Good to know
- Payments are processed by Stripe; ACED never sees card data.
- Authentication is passwordless (one-time email magic links).
- All access is over HTTPS.
