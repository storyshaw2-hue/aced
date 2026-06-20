// ACED Campaign — narrative quest-chapter system for F1 → F6
// Lore fragments, character unlocks, codex tracking
(function () {
  const STORAGE_KEY = 'aced_campaign';

  const CAMPAIGN = [
    {
      id: 'F1',
      title: 'The Framework',
      subtitle: 'Conceptual Framework & Standard-Setting',
      antagonist: 'The Auditor Without a Face',
      antagonistFlavor: 'A faceless PCAOB inspector who only speaks in FASB definitions. Never met an estimate it liked.',
      moduleTag: 'F1.',
      requiredCorrect: 50, // play 50+ F1 questions correctly to clear chapter
      unlocks: {
        codex: {
          id: 'codex_1',
          title: 'Codex Fragment I: Why FASB Whispers in Definitions',
          body: 'Before there was GAAP, there was disagreement. Before disagreement, there was a meeting. Before the meeting, there were donuts. FASB exists because someone, somewhere, called a transaction by the wrong name and the entire stock market briefly forgot what assets were. The Conceptual Framework is the dictionary the auditors keep under their pillow.'
        },
        advisor: {
          id: 'mortimer_hayek',
          name: 'Mortimer Hayek',
          tagline: 'Theorist. Annoying at parties.',
          effect: '+15% MULT on Theory-tagged questions',
          mult_bonus: 0.15,
          target: 'theory'
        }
      }
    },
    {
      id: 'F2',
      title: 'The Ledger Heresy',
      subtitle: 'Financial Statement Accounts',
      antagonist: 'The Reclassifying Phantom',
      antagonistFlavor: 'A ghost that moves your line items between Current and Non-Current while you sleep. Wears reading glasses.',
      moduleTag: 'F2.',
      requiredCorrect: 30,
      unlocks: {
        codex: {
          id: 'codex_2',
          title: 'Codex Fragment II: The Ten Rules of the Balance Sheet',
          body: 'Rule 1: Assets = Liabilities + Equity. Always. If it doesn\'t, you broke physics. Rule 2: Current is anything turning into cash within a year. Rule 3-10: ask Mortimer, he won\'t shut up about them anyway.'
        },
        advisor: {
          id: 'mei_linwood',
          name: 'Mei Linwood, CPA',
          tagline: 'Got tired of partner track. Now she helps you cheat.',
          effect: 'Once per run, re-roll one wrong answer',
          ability: 'reroll'
        }
      }
    },
    {
      id: 'F3',
      title: 'The Accounts Apocalypse',
      subtitle: 'Select Financial Statement Accounts',
      antagonist: 'The Deferred Liability',
      antagonistFlavor: 'A boss that gains +1 HP every time you mention "deferred." It is currently listening.',
      moduleTag: 'F3.',
      requiredCorrect: 60,
      unlocks: {
        codex: {
          id: 'codex_3',
          title: 'Codex Fragment III: Why Cash Flow is Truth',
          body: 'Net income lies. Cash flow does not. You can manipulate accruals, reclassify revenues, and invent intangibles — but if cash didn\'t move, cash didn\'t move. The statement of cash flows is the polygraph of the financial statements. Bring it to your audit interview.'
        },
        consumable: {
          id: 'black_coffee',
          name: 'Black Coffee +∞',
          tagline: 'Single use. Probably illegal.',
          effect: 'Adds +50 CHIPS to your next hand',
          uses: 1
        }
      }
    },
    {
      id: 'F4',
      title: 'The Transaction Cult',
      subtitle: 'Select Transactions',
      antagonist: 'The Lease Lord',
      antagonistFlavor: 'Operates a 10-phase pyramid scheme of finance leases. Each phase asks for a different right-of-use calculation. Speaks ASC 842 fluently.',
      moduleTag: 'F4.',
      requiredCorrect: 50,
      unlocks: {
        codex: {
          id: 'codex_4',
          title: 'Codex Fragment IV: Pension Mathematics Hidden in Tarot',
          body: 'The Service Cost is The Fool. The Interest Cost is The Tower. Expected Return on Plan Assets is The Wheel. Amortization of Prior Service Cost is The Hanged Man. You did not ask for this metaphor. Neither did the actuary, but here we are.'
        },
        advisor: {
          id: 'the_actuary',
          name: 'The Actuary',
          tagline: 'Once calculated a pension obligation that exceeded the heat death of the universe.',
          effect: 'Pension/Lease/EPS questions deal x3 MULT',
          mult_bonus: 2.0,
          target: 'pension_lease_eps'
        }
      }
    },
    {
      id: 'F5',
      title: 'The Standard Setters',
      subtitle: 'State & Local Governments',
      antagonist: 'The Fund Sovereign',
      antagonistFlavor: 'Rules over 11 different fund types. None of them are required to balance the same way. Holds a GASB scepter.',
      moduleTag: 'F5.',
      requiredCorrect: 35,
      unlocks: {
        codex: {
          id: 'codex_5',
          title: 'Codex Fragment V: Modified Accrual is a Language',
          body: 'In private sector accounting, revenue is recognized when earned. In governmental, revenue is recognized when measurable and available. "Available" means "within 60 days." This is not arbitrary. It is, in fact, the most arbitrary thing in accounting. Welcome to fund accounting.'
        },
        consumable: {
          id: 'past_exam_q',
          name: 'Past Exam Q',
          tagline: 'The vendor said it was OK. The vendor was lying.',
          effect: 'Preview the next boss question before answering',
          uses: 1
        }
      }
    },
    {
      id: 'F6',
      title: 'The Final Audit',
      subtitle: 'Endgame — All Sections',
      antagonist: 'The Big Four Hydra',
      antagonistFlavor: 'Four heads. Each represents a Big 4 firm. Each demands a different audit methodology. Cut one off and an associate grows back.',
      moduleTag: 'ALL',
      requiredCorrect: 100,
      unlocks: {
        codex: {
          id: 'codex_6',
          title: 'Codex Fragment VI: Story\'s Final Engagement Letter',
          body: 'Dear Reality, This letter confirms our understanding of the terms of our audit engagement. We have audited the accompanying statements of existence as of June 25, 2026. In our opinion, the figures present fairly, in all material respects, that you, Story Shaw, are CPA Eligible. Signed, The Universe, AICPA Member.'
        },
        title: {
          id: 'cpa_eligible',
          name: 'CPA Eligible ⭐',
          tagline: 'Earned by completing all six chapters'
        }
      }
    }
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function getProgress(chapterId) {
    const state = load();
    return state[chapterId] || { correct: 0, cleared: false, unlocks: [] };
  }

  function recordCorrect(source) {
    if (!source) return null;
    const state = load();
    let triggered = null;
    for (const ch of CAMPAIGN) {
      const matches = ch.moduleTag === 'ALL' || source.startsWith(ch.moduleTag);
      if (!matches) continue;
      const prog = state[ch.id] || { correct: 0, cleared: false, unlocks: [] };
      prog.correct++;
      if (!prog.cleared && prog.correct >= ch.requiredCorrect) {
        prog.cleared = true;
        prog.clearedAt = Date.now();
        triggered = ch;
      }
      state[ch.id] = prog;
    }
    save(state);
    return triggered;
  }

  function getCampaign() { return CAMPAIGN; }
  function getStatus() {
    const state = load();
    return CAMPAIGN.map(ch => ({
      ...ch,
      progress: state[ch.id] || { correct: 0, cleared: false }
    }));
  }
  function getCodex() {
    const state = load();
    const codex = [];
    for (const ch of CAMPAIGN) {
      if (state[ch.id]?.cleared && ch.unlocks.codex) {
        codex.push({ chapter: ch.id, ...ch.unlocks.codex, unlockedAt: state[ch.id].clearedAt });
      }
    }
    return codex;
  }

  window.ACEDCampaign = {
    getCampaign, getStatus, getProgress, recordCorrect, getCodex
  };
})();
