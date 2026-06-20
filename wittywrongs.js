// ACED Witty Wrongs — punchy roasts for wrong answers, tagged by FAR trip-pattern
// Tone: Balatro-meets-Twitter. Bestie energy.
(function () {

  // Pattern matchers: regex against question stem or topic field.
  // Each pattern has an array of one-liners — picked randomly.
  const PATTERNS = [
    {
      id: 'permanent_temporary',
      label: 'Permanent vs Temporary Differences',
      matches: /(muni|municipal|tax-exempt|permanent difference|temporary difference|life insurance prem)/i,
      roasts: [
        'bestie. muni interest is FOREVER tax-free. it is not "deferred" — it is ghosted. you stood the IRS up on a date they never planned. permanent = ghosting. temporary = read-receipt with later reply.',
        'you treated a permanent difference like temporary. that\'s like adding sugar to coffee and then crying when it\'s sweet. permanent ≠ deferred. permanent = the IRS literally never sees this.',
        'if it\'s muni interest, life insurance for officers, or a fine — it\'s permanent. permanent means "we agreed to disagree forever." learn the four horsemen of permanent differences and they will never own you again.'
      ]
    },
    {
      id: 'cash_flow_gain_loss',
      label: 'Gain/Loss on Equipment Sale — CF Classification',
      matches: /(gain on sale|loss on sale|sold equipment|sale of equipment|sold a building|sale of building|carrying value)/i,
      roasts: [
        'you put the gain in operating CF. classic. but gain ≠ cash. gain is just GAAP\'s haircut on the proceeds. CASH goes to investing. GAIN gets SUBTRACTED from operating. you just counted $80k twice — that\'s enron energy.',
        'rule of thumb: cash goes to investing, gain/loss gets reversed out of operating. if you forgot to reverse the gain, congratulations, you are now overstating operating cash flow and the SEC has a folder with your name on it.',
        'the LOSS gets ADDED back to net income (it\'s non-cash). the CASH PROCEEDS go to investing. you confused the two. it\'s ok. so did every audit senior i ever worked with.'
      ]
    },
    {
      id: 'partnership_bonus_goodwill',
      label: 'Bonus vs Goodwill Method (Partnerships)',
      matches: /(partnership.*admit|goodwill.*partner|bonus.*partner|admitted.*partner|partner.*capital balance)/i,
      roasts: [
        'bonus vs goodwill, take 47. bonus = the pie gets redistributed. goodwill = the pie GETS BIGGER. if new partner pays more than their %, AND implied total capital goes UP → goodwill. if total capital = sum of contributions → bonus. you invented a pie that didn\'t exist.',
        'you ran bonus when the answer wanted goodwill (or vice versa). when in doubt: does total capital match the contributions exactly? bonus. does it imply something bigger? goodwill. the keyword "revalued" usually means goodwill is incoming.',
        'partnerships exist to humble you. the moment you think you have bonus vs goodwill figured out, becker throws "admitted for a one-third interest after revaluation of assets" and your soul leaves your body.'
      ]
    },
    {
      id: 'consolidation_noncontrolling',
      label: 'Consolidations — NCI & Acquisition Method',
      matches: /(noncontrolling|non-controlling|acquisition method|consolidat|business combination|fair value of net assets)/i,
      roasts: [
        'consolidations: the only place where 100% × parent + 100% × sub = "wait, where did the goodwill come from." answer: it came from the price you paid above book value. acquisition method, baby.',
        'NCI lives in equity. it is not a liability. it is not "other." it is equity, full stop. if you ever park NCI on the wrong side of the balance sheet, the FASB has a list and you are on it.'
      ]
    },
    {
      id: 'leases_finance_operating',
      label: 'Lease Classification (ASC 842)',
      matches: /(finance lease|operating lease|right.of.use|lease term|present value of lease)/i,
      roasts: [
        'ASC 842 says: every lease > 12 months goes on the balance sheet. ROU asset + lease liability. you don\'t get to hide leases off-BS anymore. that ship sailed in 2019 and capsized.',
        'finance vs operating: it\'s the 5 criteria. transfer of ownership, bargain purchase, lease term ≥ 75% of useful life, PV ≥ 90% of FV, specialized asset. hit ANY one → finance. miss all 5 → operating. simple, until it isn\'t.'
      ]
    },
    {
      id: 'pension_smoothing',
      label: 'Pension Expense Components',
      matches: /(service cost|interest cost|expected return|projected benefit obligation|PBO|prior service cost)/i,
      roasts: [
        'pension expense is a 5-headed monster: Service + Interest − Expected Return + Amort of Prior Service + Amort of Net (Gain)/Loss. memorize this and you can survive ASC 715. forget it and you\'re actuarial chum.',
        'expected return on plan assets is SUBTRACTED. not added. it reduces pension expense because it\'s a "positive" thing from the company\'s perspective. yes, accounting is weird about signs. blame the FASB.'
      ]
    },
    {
      id: 'eps_dilutive',
      label: 'EPS — Diluted vs Basic',
      matches: /(earnings per share|EPS|dilutive|antidilutive|treasury stock method|convertible)/i,
      roasts: [
        'EPS rule: convertibles and options go into diluted EPS ONLY IF they are dilutive (i.e., they LOWER EPS). antidilutive securities (those that would INCREASE EPS) are excluded. yes, the rule is literally "exclude anything that makes the number look better." pessimism: institutionalized.'
      ]
    },
    {
      id: 'govt_fund_accounting',
      label: 'Governmental Fund Accounting',
      matches: /(general fund|enterprise fund|fiduciary|governmental fund|modified accrual|GASB)/i,
      roasts: [
        'governmental funds use MODIFIED ACCRUAL — revenue when measurable AND available (within 60 days). proprietary funds use FULL accrual. fiduciary funds also full accrual. if you mix them up, you have just become a finding in the city\'s CAFR.'
      ]
    }
  ];

  // Generic sass pool for non-tagged wrongs
  const GENERIC_SASS = [
    'L. but a stylish L.',
    'this one is in becker\'s top 10 traps. you fell for it like a champion.',
    'don\'t worry. the AICPA designed this question to make 67% of people get it wrong. you\'re statistically average.',
    'wrong. but you said it with confidence and that counts for something.',
    'the correct answer is right there. it was always right there.',
    'one day you\'ll get this question right. today is not that day.',
    'becker\'s explanation is below if you want to actually learn. or you can just keep guessing. dealer\'s choice.',
    'wrong, but at least it was a SPICY wrong.'
  ];

  function getRoast(question) {
    if (!question) return { tagged: false, message: pickGeneric() };
    const stem = (question.stem || question.q || '') + ' ' + (question.topic || '');
    for (const p of PATTERNS) {
      if (p.matches.test(stem)) {
        return {
          tagged: true,
          patternId: p.id,
          patternLabel: p.label,
          message: p.roasts[Math.floor(Math.random() * p.roasts.length)]
        };
      }
    }
    return { tagged: false, message: pickGeneric() };
  }

  function pickGeneric() {
    return GENERIC_SASS[Math.floor(Math.random() * GENERIC_SASS.length)];
  }

  function getPatterns() { return PATTERNS.map(p => ({ id: p.id, label: p.label })); }

  window.ACEDWittyWrongs = { getRoast, getPatterns };
})();
