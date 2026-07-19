/* ACED — CPA/FAR boss names (OPTIONAL, opt-in flavor for the CPA pack only)
   ============================================================================
   nemesis.js (v8) is subject-agnostic and generates a boss name for any domain.
   This file restores the hand-authored FAR villains for the CPA pack, WITHOUT
   putting subject content back into the engine.

   Load this BEFORE nemesis.js (nemesis reads window.ACED_BOSS_NAMES on init),
   or call ACEDNemesis.setNames(window.ACED_BOSS_NAMES) after both have loaded.
   Only ship it with the CPA pack — omit it for every other pack and the boss
   names are generated automatically.
   ============================================================================ */
window.ACED_BOSS_NAMES = {
  "F1.M1": ["The Bottom Line", "drags your net income into the red"],
  "F1.M2": ["The Footnote", "buries you in disclosures"],
  "F1.M3": ["The Restatement", "rewrites your past"],
  "F1.M4": ["The Reconciler", "turns accrual into cash and back"],
  "F2.M1": ["The Five-Step Phantom", "recognizes revenue you cannot"],
  "F2.M2": ["The Bad Debt", "writes you off"],
  "F2.M3": ["The LIFO Layer", "buries your cost in old strata"],
  "F2.M4": ["The Depreciator", "wears down everything you own"],
  "F2.M5": ["The Impairment", "marks your goodwill to zero"],
  "F2.M6": ["The Equity Method", "consolidates your will"],
  "F2.M7": ["The OCI Specter", "haunts other comprehensive income"],
  "F3.M1": ["The Float", "holds your cash in transit"],
  "F3.M4": ["The Amortizer", "grinds your premium down to par"],
  "F3.M5": ["The Lessor", "tightens every term"],
  "F4.M1": ["The Treasury", "buys back your shares"],
  "F4.M2": ["The Dilutionist", "waters down your EPS"],
  "F4.M3": ["The Rollforward", "never lets the period close"],
  "F4.M4": ["The Deferred", "taxes you later, and harder"],
  "F4.M5": ["The Comptroller", "audits your every fund"]
};
