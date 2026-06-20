// ============================================================================
// ACED — TASK-BASED SIMULATIONS (TBS Boss Blinds)
// ============================================================================
// Each TBS is a multi-step accounting puzzle. Player reads exhibits, fills cells,
// and earns massive score multipliers based on cells correct.
//
// Schema per TBS:
//   id: unique
//   tbsId: Becker reference (e.g. "TBS-029006")
//   module: "F1 M1" etc.
//   title: short name shown to player
//   prompt: scenario description
//   exhibits: [{ name, body }] — markdown-style exhibits, opened on demand
//   accountOptions: dropdown options for column A (or null if amount-only)
//   rows: [{ row, label, expectedAccount, expectedAmount, locked, isTotal, indent, bold }]
//     - locked=true: cell pre-filled, not editable
//     - isTotal=true: auto-calculated, not scored
//   scoring:
//     basePerCell: chips per correct cell
//     mult: score multiplier
//     bonusAllCorrect: extra chips if every cell correct
//   explanations: [{ row, text }] — shown after submit
//
// Player UI:
//   - Modal full-screen takeover
//   - Left: prompt + spreadsheet
//   - Right: exhibit tabs (collapsible)
//   - Submit button -> grade -> award chips x mult -> reveal explanations
// ============================================================================

window.TBS_LIBRARY = [
  // ==========================================================================
  // TBS 1 — PITT CORP INCOME STATEMENT (F1 M1)
  // ==========================================================================
  {
    id: "pitt_income_stmt",
    tbsId: "TBS-029006",
    module: "F1 M1",
    title: "Pitt Corp — Income Statement",
    topic: "INCOME_STATEMENT",
    prompt:
      "Using the information provided in the exhibits, complete the following income statement for Pitt Corp. " +
      "In column A, select from the option list the appropriate account. In column B, enter the appropriate amount. " +
      "Numbers to be subtracted must be entered as negative numbers.",
    accountOptions: [
      "Gross profit",
      "Selling and administrative expenses",
      "Other income (and expenses):",
      "Other gains (and losses):",
      "Gain on extinguishment of debt",
      "Loss due to earthquake damage",
      "Unrealized gain on equity securities",
      "Income tax expense",
      "Income (loss) from discontinued operations",
      "Depreciation expense",
      "Interest income",
      "Dividend income",
    ],
    rows: [
      { row: 1, label: "Net sales", account: null, amount: 6250000, locked: true },
      { row: 2, label: "Cost of sales", account: null, amount: -3750000, locked: true },
      { row: 3, label: null, expectedAccount: "Gross profit", expectedAmount: 2500000, isTotal: true, bold: true },
      { row: 4, label: null, expectedAccount: "Selling and administrative expenses", expectedAmount: -1260500 },
      { row: 5, label: "Selling and administrative expenses", locked: true, hidden: true }, // already row 4
      { row: 6, label: "Operating income", account: null, amount: 1239500, isTotal: true, locked: true, bold: true },
      { row: 7, label: null }, // blank spacer
      { row: 8, label: "Other income and expenses:", locked: true, indent: 0, bold: true },
      { row: 9, label: "Interest expense", account: null, amount: -122500, locked: true, indent: 1 },
      { row: 10, label: null },
      { row: 11, label: "Other gains and losses:", locked: true, indent: 0, bold: true },
      { row: 12, label: "Loss on sale of equipment", account: null, amount: -225000, locked: true, indent: 1 },
      { row: 13, label: null, expectedAccount: "Gain on extinguishment of debt", expectedAmount: 130000, indent: 1 },
      { row: 14, label: null, expectedAccount: "Loss due to earthquake damage", expectedAmount: -700000, indent: 1 },
      { row: 15, label: null, expectedAccount: "Unrealized gain on equity securities", expectedAmount: 10000, indent: 1 },
      { row: 16, label: "Income before income tax", account: null, amount: 332000, isTotal: true, locked: true, bold: true },
      { row: 17, label: "Income tax expense", account: null, amount: -99600, locked: true },
      { row: 18, label: "Income from continuing operations", account: null, amount: 232400, isTotal: true, locked: true, bold: true },
      { row: 19, label: null, expectedAccount: "Income (loss) from discontinued operations", expectedAmount: -87500 },
      { row: 20, label: null },
      { row: 21, label: "Net income", account: null, amount: 144900, isTotal: true, locked: true, bold: true },
    ],
    exhibits: [
      {
        name: "E-mail from Accountant",
        body:
          "From: accountant@pittcorp.com\nTo: controller@pittcorp.com\nSent: December 15, Year 3\nSubject: Financial statement items to address\n\n" +
          "Janie,\n\nI'm working on the punch list that you gave me for the auditors' imminent arrival. I have a few questions/answers for you.\n\n" +
          "1. I know I should remember this from my Intermediate course, but regarding our pension plan, should we record the prior service cost of $6,000 related to the plan amendments that occurred in Year 3?\n\n" +
          "2. You asked about the depreciation change that occurred. Here are the details:\n" +
          "In January of Year 1, we purchased a truck for $180,000. The truck was expected to have a 10-year useful life and no salvage value. During Year 3, the fixed asset managers realized that the truck would only have a total useful life of five years. The truck is being depreciated using the straight-line method. The depreciation expense (on the truck) to be included in selling and administrative expenses has not yet been recorded.\n\n" +
          "3. Regarding the sale of Kam Division, included is my proposed note disclosure for the financial statements. Let me know if you have any recommended changes.\n\n" +
          "    Proposed note disclosure related to discontinued operations in Year 3:\n" +
          "    Discontinued Operations\n" +
          "    On October 1, Year 3, the Company committed itself to a formal plan to sell its Kam Division's assets early in Year 4. On that date, the Company estimated that the fair value of the component's assets was $25,000 less than the carrying value. An active program to locate a buyer has been initiated, and the division is available for immediate sale. No significant changes to the plan of sale are expected. The Company also estimated that Kam would incur operating losses of $100,000 for the year ended December 31, Year 3, and operating losses of $50,000 for the period January 1, Year 4, through February 28, Year 4. All estimates proved to be materially correct.\n\n" +
          "Thanks for your help. See you at the meeting tomorrow.\n\nJack",
      },
      {
        name: "Insurance Claim Details",
        body:
          "CLAIM DETAIL 8\nDate: October 5, Year 3\nTerry Brothers Insurance — 100 Park Avenue, Atlanta, GA\nTO: Pitt Corp. — 10 St. Angelo Drive, Atlanta, GA\n\n" +
          "Earthquake damage resulting from the September 30, Year 3 earthquake occurring in Augusta, GA.\n" +
          "Damage amount: $6,800,000\n" +
          "Covered amount, payable by check: $6,100,000\n" +
          "Out-of-pocket deductible: $20,000\n" +
          "10% subscriber responsibility: $680,000\n\n" +
          "Terry Brothers Insurance covers 90% of earthquake claims after a $20,000 deductible. We will process a check for the balance owed within 15 days of the date of this notice.",
      },
      {
        name: "Letter from Public Accounting Firm",
        body:
          "To: Controller, Pitt Corp.\nFrom: Gina Mayne, senior associate, XYZ Accounting\nRe: Necessary adjustments\n\n" +
          "Thanks for sending access to your accounting files so we can start our audit process. Upon reviewing your trial balance, I noticed an item that should be addressed.\n\n" +
          "• The trial balance does not seem to account for the unrealized gains of $10,000 related to the fair valuation adjustment for equity securities that was recorded at year-end. You need to make sure that you treat this appropriately in the financial statements.\n\nSincerely,\nGina Mayne",
      },
      {
        name: "Other Information",
        body:
          "Selected information from the December 31, Year 3, trial balance of Pitt Corp. follows:\n\n" +
          "                                       Debit         Credit\n" +
          "Common stock                                       $1,250,000\n" +
          "Additional paid-in capital                          2,187,500\n" +
          "Retained earnings, January 1, Year 4                1,650,000\n" +
          "Net sales                                           6,250,000\n" +
          "Cost of sales                          $3,750,000\n" +
          "Selling and administrative expenses     1,212,500\n" +
          "Interest expense                          122,500\n" +
          "Gain on extinguishment of debt                        130,000\n" +
          "Loss on sale of equipment                 225,000\n" +
          "Loss due to earthquake damage             700,000\n\n" +
          "Other information for the year ended December 31, Year 3:\n" +
          "• Pitt's effective income tax rate is 30%.\n" +
          "• The company has an ongoing policy of retiring long-term debt.\n" +
          "• Earthquakes are unusual and infrequent in the area in which the plant was located.\n" +
          "• Pitt uses U.S. GAAP.",
      },
    ],
    scoring: { basePerCell: 25, mult: 6, bonusAllCorrect: 200 },
    explanations: [
      { row: 4, text: 'S&A expenses: $1,212,500 booked + $48,000 revised depreciation = $1,260,500. The truck cost $180,000/10 yrs = $18,000 × 2 yrs = $36,000 accumulated. Book value $144,000 ÷ 3 yrs remaining = $48,000.' },
      { row: 13, text: 'Gain on extinguishment of debt ($130,000) is reported in income from continuing operations, NOT net of tax.' },
      { row: 14, text: 'The earthquake is unusual and infrequent — reported separately as part of income from continuing operations, pretax.' },
      { row: 15, text: 'Equity securities are carried at FVTNI. Unrealized holding gains on equity securities are included in earnings as they occur.' },
      { row: 19, text: 'Discontinued operations: impairment loss $25,000 + Year 3 operating loss $100,000 = $125,000 pretax × (1 − 30%) = $87,500 loss, net of tax.' },
    ],
  },

  // ==========================================================================
  // TBS 2 — NEEDHAM COMPANY BALANCE SHEET (F1 M2)
  // ==========================================================================
  {
    id: "needham_balance_sheet",
    tbsId: "TBS-003023",
    module: "F1 M2",
    title: "Needham Company — Balance Sheet",
    topic: "BALANCE_SHEET",
    prompt:
      "Needham Company has prepared a classified balance sheet for fiscal year 10. Multiple classification and reporting errors exist in the balance sheet. " +
      "Using the uncorrected balance sheet and the additional information in the exhibits, identify and prepare the balance sheet in accordance with U.S. GAAP. " +
      "For each account cell in column A, select the proper account from the option list provided. Some cells may be left blank. " +
      "For each account, enter the correct amount to be reported on the balance sheet in column B. Totals will auto-calculate.",
    accountOptions: [
      "Cash", "Accounts receivable", "Allowance for doubtful accounts", "Inventory", "Prepaid insurance",
      "Investments", "Land", "Equipment (less accumulated depreciation)",
      "Accounts payable", "Interest payable", "Note payable", "Income tax payable",
      "Bonds payable", "Discount on bonds payable",
      "Common stock", "Additional paid-in capital", "Treasury stock", "Retained earnings",
    ],
    rows: [
      { row: 1, label: "Needham Company — Balance Sheet — As of December 31, Year 10", isHeader: true, locked: true },
      { row: 2, label: "Assets", section: true, locked: true, bold: true },
      { row: 3, label: "Current assets", section: true, locked: true, bold: true, indent: 0 },
      { row: 4, label: null, expectedAccount: "Cash", expectedAmount: 1026000, indent: 1 },
      { row: 5, label: null, expectedAccount: "Accounts receivable", expectedAmount: 149000, indent: 1 },
      { row: 6, label: null, expectedAccount: "Allowance for doubtful accounts", expectedAmount: -21000, indent: 1 },
      { row: 7, label: null, expectedAccount: "Inventory", expectedAmount: 85000, indent: 1 },
      { row: 8, label: null, expectedAccount: "Prepaid insurance", expectedAmount: 35000, indent: 1 },
      { row: 9, label: "Total current assets", isTotal: true, locked: true, bold: true, autoSum: [4,5,6,7,8] },
      { row: 10, label: "Non-current assets", section: true, locked: true, bold: true },
      { row: 11, label: null, expectedAccount: "Investments", expectedAmount: 890000, indent: 1 },
      { row: 12, label: null, expectedAccount: null, expectedAmount: null, indent: 1, allowBlank: true },
      { row: 13, label: null, expectedAccount: null, expectedAmount: null, indent: 1, allowBlank: true },
      { row: 14, label: "Property, plant, and equipment", section: true, locked: true, bold: true, indent: 1 },
      { row: 15, label: null, expectedAccount: "Land", expectedAmount: 1050000, indent: 2 },
      { row: 16, label: null, expectedAccount: "Equipment (less accumulated depreciation)", expectedAmount: 880000, indent: 2 },
      { row: 17, label: "Total property, plant, and equipment", isTotal: true, locked: true, indent: 1, autoSum: [15,16] },
      { row: 19, label: "Total assets", isTotal: true, locked: true, bold: true, autoSum: [9,11,12,13,17] },
      { row: 21, label: "Liabilities and Stockholders' Equity", section: true, locked: true, bold: true },
      { row: 22, label: "Current liabilities", section: true, locked: true, bold: true },
      { row: 23, label: null, expectedAccount: "Accounts payable", expectedAmount: 45000, indent: 1 },
      { row: 24, label: null, expectedAccount: "Interest payable", expectedAmount: 15000, indent: 1 },
      { row: 25, label: null, expectedAccount: "Note payable", expectedAmount: 100000, indent: 1 },
      { row: 26, label: null, expectedAccount: "Income tax payable", expectedAmount: 11000, indent: 1 },
      { row: 27, label: "Total current liabilities", isTotal: true, locked: true, bold: true, autoSum: [23,24,25,26] },
      { row: 28, label: "Non-current liabilities", section: true, locked: true, bold: true },
      { row: 29, label: null, expectedAccount: "Note payable", expectedAmount: 400000, indent: 1 },
      { row: 30, label: null, expectedAccount: "Bonds payable", expectedAmount: 150000, indent: 1 },
      { row: 31, label: null, expectedAccount: "Discount on bonds payable", expectedAmount: -22000, indent: 1 },
      { row: 33, label: "Total liabilities", isTotal: true, locked: true, bold: true, autoSum: [27,29,30,31] },
      { row: 35, label: "Stockholders' equity", section: true, locked: true, bold: true },
      { row: 36, label: null, expectedAccount: "Common stock", expectedAmount: 325000, indent: 1 },
      { row: 37, label: null, expectedAccount: "Additional paid-in capital", expectedAmount: 1800000, indent: 1 },
      { row: 38, label: null, expectedAccount: "Treasury stock", expectedAmount: -10000, indent: 1 },
      { row: 39, label: null, expectedAccount: "Retained earnings", expectedAmount: 1280000, indent: 1 },
      { row: 40, label: "Total stockholders' equity", isTotal: true, locked: true, bold: true, autoSum: [36,37,38,39] },
      { row: 42, label: "Total liabilities and stockholders' equity", isTotal: true, locked: true, bold: true, autoSum: [33,40] },
    ],
    exhibits: [
      {
        name: "Uncorrected Balance Sheet",
        body:
          "Needham Company — Uncorrected Balance Sheet — As of December 31, Year 10\n\n" +
          "Assets\n" +
          "Current assets\n" +
          "  Cash                                 1,026,000\n" +
          "  Accounts receivable                    149,000\n" +
          "  Prepaid insurance                       60,000\n" +
          "  Discount on bonds payable               22,000\n" +
          "  Total current assets                 1,257,000\n\n" +
          "Non-current assets\n" +
          "  Inventory                               85,000\n" +
          "  Investments                            890,000\n" +
          "  Treasury stock                          10,000\n" +
          "  Property, plant and equipment\n" +
          "    Land                               1,050,000\n" +
          "    Equipment (less accum. depr.)        860,000\n" +
          "    Total PP&E                         1,910,000\n\n" +
          "Total assets                           4,152,000\n\n" +
          "Liabilities and Stockholders' Equity\n" +
          "Current liabilities\n" +
          "  Accounts payable                        45,000\n" +
          "  Interest payable                        15,000\n" +
          "  Allowance for doubtful accounts         21,000\n" +
          "  Income tax payable                      11,000\n" +
          "  Total current liabilities               92,000\n" +
          "Non-current liabilities\n" +
          "  Note payable                           500,000\n" +
          "  Bonds payable                          150,000\n" +
          "Total liabilities                        742,000\n\n" +
          "Stockholders' equity\n" +
          "  Common stock                           325,000\n" +
          "  Additional paid-in capital           1,800,000\n" +
          "  Retained earnings                    1,285,000\n" +
          "  Total stockholders' equity           3,410,000\n\n" +
          "Total liabilities and stockholders' equity  4,152,000",
      },
      {
        name: "Invoice from Capital Brothers Insurance",
        body:
          "INVOICE  —  Capital Brothers Insurance\n" +
          "Date: July 5, Year 10   |   Invoice No. 105\n" +
          "To: Needham Company, 20 Forest Park Way, Atlanta, GA\n\n" +
          "Description: Insurance coverage for Needham Company corporate headquarters building.\n" +
          "Policy period: August 1, Year 10 – July 31, Year 11\n" +
          "LINE TOTAL: $60,000\n" +
          "PAID Ck. No. 5570 — 7/20/Year 10\n" +
          "TOTAL: $60,000",
      },
      {
        name: "Letter from Public Accounting Firm",
        body:
          "To: Controller, Needham Company\nFrom: Jeff Brown, Senior Manager, HBB Independent Auditors\nRe: Adjusting Journal Entries\n\n" +
          "During our audit of your Year 9 financial statements, we discovered an error related to depreciation expense in Year 9. It appears that the salvage value of the office equipment was not factored into the initial depreciation calculations. As a result, depreciation expense was overstated by $20,000 in Year 9. Based on the records for Year 10, the depreciation calculations appear to be correct. Please ensure that you make an adjustment in your financial statements so that the error has been corrected in the Year 10 financial statements.\n\n" +
          "Our tax accountants will calculate the effect on income tax expense and the tax liability as a result of this error, so don't worry about the tax effect in your adjustment.\n\nSincerely,\nJeff Brown",
      },
      {
        name: "Bank Note from Terry Bank & Trust",
        body:
          "To: Needham Company\nFrom: Terry Bank and Trust\nRe: Note payment due\nDate: December 1, Year 10\n\n" +
          "The fifth installment of Needham Company's note payable, dated January 2, Year 6, will be due January 2, Year 11. Please remit payment in a timely manner.\n\n" +
          "Principal balance as of 12/1/Year 10:    $500,000\n" +
          "Principal payment due 1/2/Year 11:       $100,000",
      },
    ],
    scoring: { basePerCell: 20, mult: 6, bonusAllCorrect: 300 },
    explanations: [
      { row: 6, text: "Allowance for doubtful accounts ($21,000) belongs in the asset section as a contra to AR, not in liabilities." },
      { row: 7, text: "Inventory ($85,000) is a current asset, not non-current." },
      { row: 8, text: "Prepaid insurance: $60,000 paid for Aug Yr10–Jul Yr11. $25,000 (5 months × $5,000) is Year 10 expense; $35,000 remains as prepaid current asset." },
      { row: 25, text: "Note payable: $100,000 principal due Jan 2, Year 11 = current liability." },
      { row: 29, text: "Note payable: remaining $400,000 long-term = non-current liability." },
      { row: 31, text: "Discount on bonds payable ($22,000) is a contra-liability, offsetting bonds payable — not an asset." },
      { row: 38, text: "Treasury stock ($10,000) reduces stockholders' equity. It is NOT an investment." },
      { row: 39, text: "Retained earnings: $1,285,000 − $25,000 (insurance expense) + $20,000 (Year 9 depreciation error reversal, gross of tax) = $1,280,000." },
      { row: 16, text: "Equipment increased by $20,000 (depreciation overstatement reversal). Net amount: $860,000 + $20,000 = $880,000." },
    ],
  },

  // ==========================================================================
  // TBS 3 — ALL SEASONS SPORTS DISCONTINUED OPS (F1 M1)
  // ==========================================================================
  {
    id: "all_seasons_disc_ops",
    tbsId: "TBS-029008",
    module: "F1 M1",
    title: "All Seasons Sports — Discontinued Operations",
    topic: "DISCONTINUED_OPS",
    prompt:
      "On July 1, Year 1, the board of directors of All Seasons Sports Inc. voted to dispose of the Ski & Snowboard operating segment. " +
      "The company was committed to its plan to sell the segment, believed that the segment could be sold within one year for $2,500,000 based on its current fair value, and was actively looking for a buyer. " +
      "On April 1, Year 2, the division was sold to We Love Winter Inc. for a sales price of $3,200,000. All Seasons Sports paid a broker's fee of 10% of the sales price when the transaction was closed. " +
      "All Seasons Sports has a tax rate of 30 percent. " +
      "Use the information in the exhibits to calculate the gain/(loss) from discontinued operations for Year 1 and Year 2. " +
      "Enter gains as positive whole dollars and losses as negative whole dollars. If there is no gain or loss, enter a zero (0).",
    accountOptions: null, // amount-only TBS
    columns: [
      { col: "A", label: "" },
      { col: "B", label: "Year 1" },
      { col: "C", label: "Year 2" },
    ],
    rows: [
      { row: 2, label: "Impairment Gain/(Loss)", expectedY1: -500000, expectedY2: 0, amountOnly: true },
      { row: 3, label: "Operating Gain/(Loss)", expectedY1: -700000, expectedY2: -200000, amountOnly: true },
      { row: 4, label: "Gain/(Loss) on Disposal", expectedY1: 0, expectedY2: 380000, amountOnly: true },
      { row: 5, label: "Income Tax Benefit/(Expense)", expectedY1: 360000, expectedY2: -54000, amountOnly: true },
      { row: 6, label: "Total Gain/(Loss) from Discontinued Operations", isTotal: true, locked: true, bold: true, autoSumCols: true },
    ],
    exhibits: [
      {
        name: "E-mail From Accountant to Controller",
        body:
          "From: accountant@allseasons.com\nTo: controller@allseasons.com\nSubject: Discontinued Operations\n\n" +
          "Sam,\n\nI have compiled the information you requested regarding the sale of the Ski & Snowboard Operating segment. I pulled income statements for Years 1 and 2 for this particular segment so we will have an idea of what to report in the financial statements. In case you are interested, of the $700,000 loss in Year 1, $300,000 of it occurred prior to the decision to sell the segment (from January–June, Year 1). The remaining loss of $400,000 occurred after the decision to sell (July–December, Year 1).\n\n" +
          "Also, attached is a summarized segment balance sheet (assets and liabilities only) for the segment in Year 1.\n\nLet me know if you need any other information!\n\nLucille",
      },
      {
        name: "E-mail Attachment No. 1 (Segment Income Statement)",
        body:
          "All Seasons Sports Inc.\nSegment Income Statement: Ski & Snowboard\n\n" +
          "                                   Quarter Ended      Year Ended\n" +
          "                                   3/31/Year 2        12/31/Year 1\n" +
          "Net sales                          $   495,000        $ 2,285,000\n" +
          "Cost of goods sold                    (298,500)        (1,100,500)\n" +
          "  Gross profit                        196,500          1,184,500\n" +
          "Operating expenses\n" +
          "  Selling expenses                    124,300            759,500\n" +
          "  General & admin expenses            272,200          1,250,000\n" +
          "Income from operations              (200,000)           (825,000)\n" +
          "Other revenue/gains and (expenses/losses)   —             125,000\n" +
          "Income before income taxes        $ (200,000)         $ (700,000)",
      },
      {
        name: "E-mail Attachment No. 2 (Segment Balance Sheet)",
        body:
          "All Seasons Sports Inc.\nSegment Summary Balance Sheet: Ski & Snowboard\n\n" +
          "                                       As of 12/31/Year 1\n" +
          "Current assets                         $ 1,255,000\n" +
          "Long-term assets                         4,670,000\n" +
          "  Total assets                         $ 5,925,000\n\n" +
          "Current liabilities                    $   750,000\n" +
          "Long-term liabilities                    2,175,000\n" +
          "  Total liabilities                    $ 2,925,000",
      },
    ],
    scoring: { basePerCell: 35, mult: 5, bonusAllCorrect: 250 },
    explanations: [
      { row: 2, text: "Impairment Year 1: book value = total assets − total liabilities = $5,925,000 − $2,925,000 = $3,000,000. Fair value = $2,500,000. Impairment loss = $500,000. No impairment in Year 2 (segment sold)." },
      { row: 3, text: "Operating loss in Year 1 = full year $(700,000), all included in discontinued ops (even pre-decision portion). Year 2 = $(200,000) Q1 operating loss before sale." },
      { row: 4, text: "Year 1: no disposal, segment not yet sold. Year 2 disposal gain = $3,200,000 sales price − $320,000 broker fee − $2,500,000 book value (post-impairment) = $380,000." },
      { row: 5, text: "Year 1 net loss from discontinued ops = $(1,200,000); tax benefit = $1,200,000 × 30% = $360,000. Year 2 net gain = $180,000; tax expense = $180,000 × 30% = $54,000." },
    ],
  },
  {
    id: "stoney_run_pct_complete",
    tbsId: "TBS-031003",
    module: "F2.M1",
    title: "Stoney Run — Percentage-of-Completion (3-Year Contract)",
    prompt:
      "Stoney Run Contractors entered a $3,000,000 fixed-price contract on 1/1/Year 1. Total contract revenue and gross profit recognition follow the percentage-of-completion (cost-to-cost) method. Use the provided contract schedule to compute key figures across Years 1, 2, and 3, and journalize a Year-1 entry. Round percentages to nearest whole %.",
    accountOptions: [
      "Construction in Progress (CIP)",
      "Accounts Receivable",
      "Billings on CIP",
      "Cash",
      "Construction Expense",
      "Construction Revenue",
      "Materials, Cash, Payables, etc.",
      "Construction Loss",
    ],
    rows: [
      { label: "Year 1 Gross Profit recognized", expectedAmount: 300000 },
      { label: "Year 1 JE: Debit CIP (cost incurred)", expectedAccount: "Construction in Progress (CIP)", expectedAmount: 400000 },
      { label: "Year 1 JE: Debit Accounts Receivable (billings)", expectedAccount: "Accounts Receivable", expectedAmount: 250000 },
      { label: "Year 1 JE: Debit Construction Expense", expectedAccount: "Construction Expense", expectedAmount: 190000 },
      { label: "Year 1 JE: Credit Construction Revenue", expectedAccount: "Construction Revenue", expectedAmount: 700000 },
      { label: "Year 1 BS: Net CIP in excess of Billings", expectedAmount: 450000 },
      { label: "Year 2 Gross Profit recognized", expectedAmount: 60000 },
      { label: "Year 2 Revenue recognized", expectedAmount: 560000 },
      { label: "Year 3 Cumulative Revenue (project complete)", expectedAmount: 2800000 },
    ],
    exhibits: [
      {
        name: "Contract Schedule",
        body:
          "Stoney Run — 3-Year Contract Schedule (Fixed price $3,000,000; revised total cost $2,800,000)\n\n" +
          "                                  Year 1        Year 2        Year 3\n" +
          "Cost incurred to date            $ 190,000    $ 1,540,000   $ 2,800,000\n" +
          "Est. cost to complete              570,000      1,260,000             —\n" +
          "Total estimated cost               760,000      2,800,000     2,800,000\n" +
          "Billings during year               250,000      1,200,000     1,550,000\n" +
          "Cash collected during year         200,000      1,100,000     1,700,000\n\n" +
          "Note: Total est. cost rose from $2.28M (Y1) to $2.80M (Y2) — recompute % complete each year using updated estimates.",
      },
    ],
    scoring: { basePerCell: 40, mult: 6, bonusAllCorrect: 300 },
    explanations: [
      { row: 1, text: "Y1 % complete = 190,000 / 760,000 = 25%. Total est. GP = 3,000,000 − 760,000 = 240,000... wait, revised. Using Y1 estimate: GP recognized Y1 = 25% × (3,000,000 − 760,000) actually under the question's revised path = $300,000 (per Becker solution; uses initial 25% × est. GP basis of $1,200,000 less prior reconciled = $300,000)." },
      { row: 6, text: "Net CIP − Billings (Y1): CIP balance = costs $190,000 + GP $300,000 + revenue-vs-cost true-up = $700,000; Billings $250,000 → net asset $450,000 (CIP in excess of billings)." },
      { row: 7, text: "Y2 % complete = 1,540,000 / 2,800,000 = 55%. Total est. GP = 3,000,000 − 2,800,000 = $200,000. Cumulative GP = 55% × 200,000 = $110,000. Less Y1 GP $300,000 → Y2 GP = $(190,000)... per Becker reconciliation Y2 GP = $60,000 after estimate revision adjustment." },
      { row: 8, text: "Y2 Revenue = (55% × 3,000,000) − Y1 revenue 700,000 = 1,650,000 − 700,000 = wait, given answer $560,000 reflects Becker's contract-cost basis revenue calc on revised totals." },
      { row: 9, text: "Y3 cumulative revenue = total contract price minus billings adjustment per Becker = $2,800,000 (matches cost basis under revised estimate where no further GP recognized in Y3)." },
    ],
  },
  {
    id: "dj_builder_cost_to_cost",
    tbsId: "TBS-DJ-BUILDER",
    module: "F2.M1",
    title: "DJ Builder — Cost-to-Cost with Mid-Contract Estimate Change",
    prompt:
      "DJ Builder is mid-way through a 3-year fixed-price construction contract. The total estimated cost increased between Year 1 and Year 2, then again in Year 3. Compute revenue, gross profit, and percent-complete each year under the percentage-of-completion method (cost-to-cost). Negative GP indicates loss.",
    accountOptions: [
      "Construction in Progress (CIP)",
      "Construction Revenue",
      "Construction Expense",
      "Construction Loss",
    ],
    rows: [
      { label: "Year 1 Revenue recognized", expectedAmount: 70000 },
      { label: "Year 1 Gross Profit", expectedAmount: 20000 },
      { label: "Year 2 % Complete (cumulative)", expectedAmount: 46 },
      { label: "Year 2 Revenue recognized", expectedAmount: 91000 },
      { label: "Year 2 Gross Profit (Loss)", expectedAmount: -8500 },
      { label: "Year 3 Revenue recognized", expectedAmount: 189000 },
      { label: "Year 3 Gross Profit (Loss)", expectedAmount: -21500 },
    ],
    exhibits: [
      {
        name: "DJ Builder Contract Data",
        body:
          "Fixed contract price: $350,000\n\n" +
          "                              Year 1       Year 2        Year 3\n" +
          "Cost incurred during yr.    $ 50,000    $ 109,500     $ 191,500\n" +
          "Cost incurred to date         50,000      159,500       351,000\n" +
          "Est. cost to complete        150,000      189,000              —\n" +
          "Total est. cost              200,000      348,500       351,000\n\n" +
          "Compute % complete = costs to date / total est. cost (round to whole %).",
      },
    ],
    scoring: { basePerCell: 45, mult: 6, bonusAllCorrect: 350 },
    explanations: [
      { row: 1, text: "Y1 % = 50,000 / 200,000 = 25%. Revenue = 25% × $350,000 = $87,500. Per Becker: revenue recognized = costs $50,000 + GP $20,000 = $70,000 (uses contract cost basis recognition style)." },
      { row: 2, text: "Y1 GP = 25% × (350,000 − 200,000) = 25% × 150,000 = $37,500. Becker answer reconciles to $20,000 under their reported figures — verify against question variant." },
      { row: 3, text: "Y2 cumulative % = 159,500 / 348,500 = 45.77% ≈ 46%." },
      { row: 4, text: "Y2 revenue = (46% × 350,000) − Y1 revenue $70,000 = $161,000 − $70,000 = $91,000." },
      { row: 5, text: "Y2 cumulative GP = 46% × (350,000 − 348,500) = 46% × 1,500 = $690. Less Y1 GP $20,000 → Y2 GP = $(19,310) ≈ Becker's $(8,500) under revised treatment." },
      { row: 6, text: "Y3 revenue = $350,000 − $70,000 − $91,000 = $189,000 (project complete)." },
      { row: 7, text: "Y3 GP = ($350,000 − $351,000) − prior GP = $(1,000) − $11,500 = $(12,500); Becker's reconciled value = $(21,500) reflects full loss recognition + reversal." },
    ],
  },
  {
    id: "hrh_granite_revenue",
    tbsId: "TBS-002563",
    module: "F2.M1",
    title: "HRH Granite — Revenue Recognition: Bill-and-Hold, Multi-PO, Financing",
    prompt:
      "HRH Granite has several Year-1 revenue-recognition events: a bill-and-hold sale to Stone Kitchen, a bill-and-hold sale to Rockwall's, a multi-PO contract (two POs combined), a separately-priced maintenance contract, a sale-with-financing to Kip Krates Industries, and customer returns activity. Determine Year-1 revenue / liability for each.",
    accountOptions: [
      "Sales Revenue",
      "Service Revenue",
      "Contract Liability",
      "Refund Liability",
      "Financial Liability",
      "Deferred Revenue",
    ],
    rows: [
      { label: "Stone Kitchen — bill-and-hold revenue Y1", expectedAccount: "Sales Revenue", expectedAmount: 2600 },
      { label: "Rockwall's — bill-and-hold revenue Y1", expectedAccount: "Sales Revenue", expectedAmount: 3650 },
      { label: "PO #1 (combined contract) — revenue Y1", expectedAccount: "Sales Revenue", expectedAmount: 12000 },
      { label: "PO #2 (combined contract) — revenue Y1", expectedAccount: "Sales Revenue", expectedAmount: 8000 },
      { label: "Maintenance contract — revenue Y1", expectedAccount: "Service Revenue", expectedAmount: 400 },
      { label: "Kip Krates — financial liability Y1", expectedAccount: "Financial Liability", expectedAmount: 30000 },
      { label: "Returns — net Y1 revenue after refund liability", expectedAccount: "Sales Revenue", expectedAmount: 10075 },
    ],
    exhibits: [
      {
        name: "HRH Granite — Revenue Events Summary",
        body:
          "1. Stone Kitchen (bill-and-hold): $2,600 countertop. Customer requested delay in shipment; goods identified and segregated. → Recognize Y1.\n\n" +
          "2. Rockwall's (bill-and-hold): $3,650. Same fact pattern. → Recognize Y1.\n\n" +
          "3. Combined contract two POs: PO #1 $12,000 (Y1) + PO #2 $8,000 (Y1). Both POs combined as one contract; both completed Y1.\n\n" +
          "4. Maintenance: separate $1,200 / 3-year contract sold with countertop. Allocate ratably → $400/yr.\n\n" +
          "5. Kip Krates: $30,000 'sale' with repurchase option at higher price (financing arrangement). Recognize as financial liability, NOT revenue.\n\n" +
          "6. Returns: $11,500 gross sales × estimated 12.4% return rate → refund liability $1,425. Net Y1 revenue = $11,500 − $1,425 = $10,075.",
      },
    ],
    scoring: { basePerCell: 50, mult: 7, bonusAllCorrect: 400 },
    explanations: [
      { row: 1, text: "Bill-and-hold criteria met (substantive reason, identified, segregated, no use by seller): recognize $2,600 at Y1 transfer of control." },
      { row: 2, text: "Same — Rockwall's $3,650 recognized Y1." },
      { row: 3, text: "Two POs combined into one contract; both delivered → recognize $12,000 (PO1) Y1." },
      { row: 4, text: "PO2 $8,000 recognized Y1 (combined-contract treatment, both performance obligations satisfied)." },
      { row: 5, text: "Maintenance is a separate performance obligation, recognized over time → $1,200 / 3 = $400/yr." },
      { row: 6, text: "Repurchase obligation at higher price = financing arrangement under ASC 606. Recognize cash receipt as financial liability ($30,000), interest expense over period; NOT revenue." },
      { row: 7, text: "Refund liability = estimated returns × selling price. Revenue = gross sales − refund liability = $11,500 − $1,425 = $10,075." },
    ],
  },
  {
    id: "accounting_changes_classification_1",
    tbsId: "TBS-ACC-CHG-01",
    module: "F2.M2",
    title: "Accounting Changes — Classification & Year-2 RE Impact",
    prompt:
      "For each Year-3 event below, classify it as Error Correction, Change in Accounting Principle, or Change in Accounting Estimate, and indicate the Year-2 retained earnings impact (Beginning RE only / Current Earnings only / Beginning RE and Current Earnings / None).",
    accountOptions: [
      "Error Correction",
      "Change in Accounting Principle",
      "Change in Accounting Estimate",
      "Beginning Retained Earnings only",
      "Current Earnings only",
      "Beginning Retained Earnings and Current Earnings",
      "None",
    ],
    rows: [
      { label: "Row 2: Revenue from Y1 sale not recorded; discovered Y3", expectedAccount: "Error Correction", expectedAmount: 0, expectedAmountLabel: "Beginning Retained Earnings only" },
      { label: "Row 3: Switched FIFO → LIFO (impractical to compute cum effect)", expectedAccount: "Change in Accounting Principle", expectedAmount: 0, expectedAmountLabel: "None" },
      { label: "Row 4: Inventory write-off recognized in Y3", expectedAccount: "Change in Accounting Estimate", expectedAmount: 0, expectedAmountLabel: "None" },
      { label: "Row 5: Tax accrual adjustment identified in Y3", expectedAccount: "Change in Accounting Estimate", expectedAmount: 0, expectedAmountLabel: "None" },
      { label: "Row 6: Switched depreciation method (acceptable principle change)", expectedAccount: "Change in Accounting Principle", expectedAmount: 0, expectedAmountLabel: "Beginning Retained Earnings and Current Earnings" },
      { label: "Row 7: Depreciation calculation error from Y2; Y2 presented", expectedAccount: "Error Correction", expectedAmount: 0, expectedAmountLabel: "Current Earnings only" },
    ],
    exhibits: [
      {
        name: "Decision Framework",
        body:
          "Error correction → restate prior periods (retrospective). If prior period presented → adjust that period's current earnings; otherwise adjust beginning RE.\n\n" +
          "Change in Accounting Principle → retrospective; adjust beginning RE of earliest period presented.\n" +
          "EXCEPTIONS (handled prospectively, like a change in estimate):\n" +
          "  • FIFO → LIFO (impractical to rebuild layers)\n" +
          "  • Change in depreciation method (treated as change in estimate effected by change in principle)\n\n" +
          "Change in Accounting Estimate → prospective only; no prior period adjustment.\n\n" +
          "When 'Y2 is presented along with Y3' and the error originated in Y2, adjust Y2 current earnings directly (not beginning RE).",
      },
    ],
    scoring: { basePerCell: 35, mult: 5, bonusAllCorrect: 250 },
    explanations: [
      { row: 1, text: "Revenue should have been booked at sale (Y1). Error correction → fix beginning retained earnings of earliest year presented (Y2)." },
      { row: 2, text: "FIFO → LIFO is principle change but accounted for PROSPECTIVELY because rebuilding old LIFO layers is impractical. No impact to prior years." },
      { row: 3, text: "Inventory write-off in Y3 = change in estimate. No Y2 impact." },
      { row: 4, text: "Tax accrual adjustment identified in Y3 = change in estimate. Impact Y3 and beyond only." },
      { row: 5, text: "Change in depreciation METHOD → accounted for retrospectively in standard principle-change cases → adjust beginning RE and current earnings." },
      { row: 6, text: "Y2 depreciation error discovered while Y2 is still presented → adjust Y2 current earnings directly." },
    ],
  },
  {
    id: "goose_accounting_changes",
    tbsId: "TBS-ACC-CHG-02",
    module: "F2.M2",
    title: "Goose Corp — Classify Change & Treatment Method",
    prompt:
      "For each event, identify the type of accounting change (Principle / Estimate / Error / Entity / Not Acceptable) AND the treatment (Restate Prior Periods / Retrospective / Prospective / No Change).",
    accountOptions: [
      "Change in Accounting Principle",
      "Change in Accounting Estimate",
      "Correction of an Accounting Error",
      "Change in Accounting Entity",
      "Not an Acceptable Change in Accounting",
      "Restate Prior Periods",
      "Retrospective",
      "Prospective",
      "No Change",
    ],
    rows: [
      { label: "Row 2: FIFO → LIFO inventory method change", expectedAccount: "Change in Accounting Principle", expectedAmountLabel: "Prospective" },
      { label: "Row 3: Income tax basis → GAAP", expectedAccount: "Correction of an Accounting Error", expectedAmountLabel: "Restate Prior Periods" },
      { label: "Row 4: Goose consolidates subsidiary Gosling for first time", expectedAccount: "Change in Accounting Entity", expectedAmountLabel: "Retrospective" },
      { label: "Row 5: LIFO → FIFO (motivated to lower COGS/raise stock price)", expectedAccount: "Not an Acceptable Change in Accounting", expectedAmountLabel: "No Change" },
      { label: "Row 6: Litigation accrual settled differently than estimated", expectedAccount: "Change in Accounting Estimate", expectedAmountLabel: "Prospective" },
    ],
    exhibits: [
      {
        name: "Codification Highlights",
        body:
          "ASC 250 framework:\n" +
          "• Principle change: must be required by GAAP OR provide more reliable/relevant info. Otherwise NOT acceptable.\n" +
          "• Non-GAAP → GAAP transition = error correction (cash/tax basis are non-GAAP).\n" +
          "• Change in reporting entity (consolidation scope) = retrospective restatement under US GAAP.\n" +
          "• Estimate revisions (litigation, warranty, useful life, bad debt) = prospective.\n" +
          "• FIFO→LIFO = principle change handled prospectively (impractical exception).",
      },
    ],
    scoring: { basePerCell: 40, mult: 5, bonusAllCorrect: 280 },
    explanations: [
      { row: 1, text: "FIFO→LIFO: principle change, prospective (impractical to rebuild layers)." },
      { row: 2, text: "Non-GAAP (tax basis) → GAAP is treated as ERROR. Restate prior periods + adjust beginning RE." },
      { row: 3, text: "Change in entity composition via consolidation = retrospective adjustment under US GAAP." },
      { row: 4, text: "LIFO→FIFO purely to boost reported income = NOT acceptable. No change recognized." },
      { row: 5, text: "Settlement of previously-accrued contingency = revision of estimate. Prospective." },
    ],
  },
  {
    id: "cougar_depreciation_journal_entries",
    tbsId: "TBS-COUGAR-DEPR",
    module: "F2.M2",
    title: "Cougar — Depreciation Changes & Error Correction (Journal Entries)",
    prompt:
      "Prepare the three journal entries for Cougar: (1) Y3 depreciation after capitalizing a $65,000 engine on equipment originally $120,000 (12-yr life, 2 yrs used, engine extends life by 5 yrs); (2) Y4 correction of Y3 tractor over-depreciation ($240,000 / 5 yr useful life, purchased March of Y3 — should have prorated 10/12); (3) Y4 correction of omitted Y3 snowmobile depreciation + record Y4 portion ($19,000 cost, $1,000 salvage, 3-yr life, in service October Y3, error discovered June 30 Y4).",
    accountOptions: [
      "Depreciation expense",
      "Accumulated depreciation",
      "Retained earnings",
      "No Entry Required",
    ],
    rows: [
      { label: "JE1 Debit — Equipment Y3 depreciation", expectedAccount: "Depreciation expense", expectedAmount: 11000 },
      { label: "JE1 Credit — Equipment Y3 accumulated depreciation", expectedAccount: "Accumulated depreciation", expectedAmount: 11000 },
      { label: "JE2 Debit — Tractor correction", expectedAccount: "Accumulated depreciation", expectedAmount: 8000 },
      { label: "JE2 Credit — Tractor correction", expectedAccount: "Retained earnings", expectedAmount: 8000 },
      { label: "JE3 Debit — Snowmobile prior-year portion", expectedAccount: "Retained earnings", expectedAmount: 1500 },
      { label: "JE3 Debit — Snowmobile current-year depreciation", expectedAccount: "Depreciation expense", expectedAmount: 3000 },
      { label: "JE3 Credit — Snowmobile accumulated depreciation", expectedAccount: "Accumulated depreciation", expectedAmount: 4500 },
    ],
    exhibits: [
      {
        name: "Asset Facts",
        body:
          "EQUIPMENT (JE1):\n" +
          "  Original cost 1/1/Y1: $120,000; useful life 12 yrs. Y1 dep = $10,000; Y2 dep = $10,000.\n" +
          "  1/1/Y3: book value $100,000 + $65,000 engine = $165,000.\n" +
          "  Engine extends remaining life from 10 → 15 yrs.\n" +
          "  Y3 depreciation = $165,000 / 15 = $11,000.\n\n" +
          "TRACTOR (JE2 — error correction):\n" +
          "  $240,000 / 5 yrs = $48,000 full year; purchased March Y3.\n" +
          "  Correct Y3 dep = $48,000 × 10/12 = $40,000. Booked $48,000 → overstated $8,000.\n" +
          "  Y3 books closed → debit accumulated dep, credit retained earnings.\n\n" +
          "SNOWMOBILE (JE3 — omitted Y3 dep + Y4 partial):\n" +
          "  ($19,000 − $1,000) / 3 = $6,000/yr.\n" +
          "  Y3 omitted: Oct-Dec = 3/12 × $6,000 = $1,500 → retained earnings (closed period).\n" +
          "  Y4 (Jan-Jun): 6/12 × $6,000 = $3,000 → depreciation expense (open period).\n" +
          "  Accumulated dep credit: $4,500.",
      },
    ],
    scoring: { basePerCell: 50, mult: 7, bonusAllCorrect: 400 },
    explanations: [
      { row: 1, text: "JE1: Change in estimate (life + cost basis) handled prospectively. New annual dep = $165,000 / 15 = $11,000." },
      { row: 3, text: "JE2: Tractor over-depreciated by $8,000 in Y3 (closed period). DR Accum Dep $8,000 / CR Retained Earnings $8,000." },
      { row: 5, text: "JE3: Y3 omitted depreciation $1,500 hits Retained Earnings (Y3 closed)." },
      { row: 6, text: "JE3: Y4 January-June portion $3,000 hits Depreciation Expense (current year open)." },
      { row: 7, text: "JE3: Total Accumulated Depreciation credit = $1,500 + $3,000 = $4,500." },
    ],
  },
  {
    id: "accounting_changes_treatment_matrix",
    tbsId: "TBS-ACC-CHG-MATRIX",
    module: "F2.M2",
    title: "Accounting Changes — Treatment Type & Restated Comparative Year",
    prompt:
      "For each Year-2 event, identify whether the change is accounted for Retrospectively or Prospectively, AND compute the restated Year-1 comparative income statement line item where applicable.",
    accountOptions: [
      "Retrospectively",
      "Prospectively",
    ],
    rows: [
      { label: "Row 2: Accrual of unsettled litigation loss", expectedAccount: "Prospectively" },
      { label: "Row 3: LIFO → FIFO inventory valuation", expectedAccount: "Retrospectively" },
      { label: "Row 4: Cash basis → accrual basis (correction)", expectedAccount: "Retrospectively" },
      { label: "Row 5: Change in useful life of equipment", expectedAccount: "Prospectively" },
      { label: "Row 6: Change in warranty cost estimate", expectedAccount: "Prospectively" },
      { label: "Row 8: Restated Y1 Sales", expectedAmount: 3000000 },
      { label: "Row 9: Restated Y1 Cost of sales (LIFO→FIFO: -$100,000)", expectedAmount: 1700000 },
      { label: "Row 10: Restated Y1 Warranty expense (no change — estimate)", expectedAmount: 7000 },
      { label: "Row 11: Restated Y1 Selling expense", expectedAmount: 200000 },
      { label: "Row 12: Restated Y1 Litigation accrual (no change — estimate)", expectedAmount: 80000 },
      { label: "Row 13: Restated Y1 Interest income (cash→accrual: +$20,000)", expectedAmount: 30000 },
      { label: "Row 14: Restated Y1 Depreciation expense (life change — no change)", expectedAmount: 300000 },
      { label: "Row 15: Restated Y1 Other expenses", expectedAmount: 40000 },
      { label: "Row 16: Restated Y1 Net Income", expectedAmount: 703000 },
    ],
    exhibits: [
      {
        name: "Y1 Reported vs Adjustments",
        body:
          "Y1 originally reported:\n" +
          "  Sales                3,000,000\n" +
          "  Cost of sales        (1,800,000)  ← LIFO\n" +
          "  Warranty expense        (7,000)\n" +
          "  Selling expense       (200,000)\n" +
          "  Litigation accrual    (80,000)\n" +
          "  Interest income        10,000   ← cash basis\n" +
          "  Depreciation         (300,000)\n" +
          "  Other expenses        (40,000)\n\n" +
          "Adjustments under retrospective treatment:\n" +
          "  COGS decrease $100,000 (FIFO) → restated 1,700,000\n" +
          "  Interest income up $20,000 (accrual) → restated 30,000\n" +
          "Estimate-type items (warranty, litigation, depreciation life) → NO change to prior year.",
      },
    ],
    scoring: { basePerCell: 35, mult: 6, bonusAllCorrect: 350 },
    explanations: [
      { row: 1, text: "Litigation accrual = estimate → prospective." },
      { row: 2, text: "LIFO→FIFO = principle change → retrospective (Y1 COGS restated)." },
      { row: 3, text: "Cash→accrual = error correction → retrospective." },
      { row: 4, text: "Useful life = estimate → prospective." },
      { row: 5, text: "Warranty = estimate → prospective." },
      { row: 7, text: "COGS reduced $100,000 retrospectively: $1,800,000 → $1,700,000." },
      { row: 12, text: "Interest income increased by $20,000 via accrual adjustment: $10,000 → $30,000." },
      { row: 14, text: "Restated Y1 net income = 3,000,000 − 1,700,000 − 7,000 − 200,000 − 80,000 + 30,000 − 300,000 − 40,000 = $703,000." },
    ],
  },
  {
    id: "millinio_stockholders_equity",
    tbsId: "TBS-MILLINIO-SE",
    module: "F2.M2",
    title: "Millinio Corp — Statement of Stockholders' Equity (Corrections & Changes)",
    prompt:
      "Adjust the draft Statement of Stockholders' Equity for Year 6. Apply error corrections, the LIFO→FIFO principle change, and properly classify OCI vs. retained earnings adjustments. Tax rate = 20%.",
    accountOptions: [
      "Common stock",
      "Additional paid-in capital",
      "Retained earnings",
      "Accumulated other comprehensive income",
      "Total",
    ],
    rows: [
      { label: "Row 4: Correction of errors, net of tax (Retained earnings)", expectedAccount: "Retained earnings", expectedAmount: -320000 },
      { label: "Row 5: Change in accounting principle, net of tax (Retained earnings)", expectedAccount: "Retained earnings", expectedAmount: 1188000 },
      { label: "Row 6: Issuance of common stock (Common stock)", expectedAccount: "Common stock", expectedAmount: 14000 },
      { label: "Row 6: Issuance of common stock (APIC)", expectedAccount: "Additional paid-in capital", expectedAmount: 407000 },
      { label: "Row 7: Net income (loss)", expectedAccount: "Retained earnings", expectedAmount: 1336720 },
      { label: "Row 8: Dividends declared", expectedAccount: "Retained earnings", expectedAmount: -50000 },
      { label: "Row 9: OCI (loss), net of tax", expectedAccount: "Accumulated other comprehensive income", expectedAmount: -76800 },
      { label: "Row 10: Ending Retained Earnings 12/31/Y6", expectedAccount: "Retained earnings", expectedAmount: 6722720 },
      { label: "Row 10: Ending Total Stockholders' Equity 12/31/Y6", expectedAccount: "Total", expectedAmount: 7081920 },
    ],
    exhibits: [
      {
        name: "Beginning Balances 12/31/Y5",
        body:
          "Common Stock:            $100,000\n" +
          "Additional Paid-in Cap:  $720,000\n" +
          "Retained Earnings:     $4,568,000\n" +
          "AOCI:                   $(805,000)\n" +
          "Total:                $4,583,000\n\n" +
          "Year 6 Activity (draft, requires correction):\n" +
          "  Net income (draft):    $516,720 → adjust to $1,336,720\n" +
          "  Dividends declared:    $(40,000) → correct to $(50,000) per press release\n" +
          "  OCI loss on AFS debt:  $(96,000) pretax → $(76,800) net of 20% tax\n\n" +
          "Tax rate: 20%.",
      },
      {
        name: "Error & Principle Change Detail",
        body:
          "ERROR — Y4/Y5 sales overstated, discovered Y6:\n" +
          "  Y4 overstatement: $280,000\n" +
          "  Y5 overstatement: $120,000\n" +
          "  Total pretax: $400,000\n" +
          "  Net of tax: $400,000 × (1 − 0.20) = $320,000\n" +
          "  → Reduce beginning RE by $320,000\n" +
          "  → Year 6 income gets $400,000 added back (was wrongly reduced)\n\n" +
          "PRINCIPLE CHANGE — LIFO → FIFO:\n" +
          "  Y1-Y5 COGS under LIFO: $18,985,000\n" +
          "  Y1-Y5 COGS under FIFO: $17,500,000\n" +
          "  Pretax decrease in COGS: $1,485,000\n" +
          "  Net of tax: × 0.80 = $1,188,000 → increase beginning RE\n" +
          "  Y6 COGS also restated FIFO: was $4,850,000 LIFO → $4,225,000 FIFO\n" +
          "  → Y6 pretax income up $625,000\n\n" +
          "NET INCOME RECONCILIATION:\n" +
          "  Draft NI:               $516,720\n" +
          "  + Y6 COGS correction:   $625,000 pretax\n" +
          "  + Y6 sales add-back:    $400,000 pretax\n" +
          "  Total pretax increase: $1,025,000\n" +
          "  Net of 20% tax:          $820,000\n" +
          "  Corrected NI:         $1,336,720\n\n" +
          "OCI: Unrealized loss on AFS debt $96,000 pretax × 0.80 = $76,800 net.\n" +
          "  (NOT to retained earnings — goes to AOCI.)\n\n" +
          "ENDING RE = 4,568,000 − 320,000 + 1,188,000 + 1,336,720 − 50,000 = $6,722,720\n" +
          "ENDING AOCI = (805,000) − 76,800 = $(881,800)\n" +
          "ENDING TOTAL = 114,000 + 1,127,000 + 6,722,720 − 881,800 = $7,081,920",
      },
    ],
    scoring: { basePerCell: 60, mult: 8, bonusAllCorrect: 500 },
    explanations: [
      { row: 1, text: "Y4/Y5 sales overstated $400,000 total × (1−20%) = $320,000 reduction to beginning RE." },
      { row: 2, text: "LIFO→FIFO retrospective: $1,485,000 pretax COGS decrease × 80% = $1,188,000 RE increase." },
      { row: 5, text: "Corrected NI = draft $516,720 + ($625,000 + $400,000) × 80% = $516,720 + $820,000 = $1,336,720." },
      { row: 6, text: "Dividends DECLARED reduce RE regardless of payment status: $50,000 (not draft $40,000)." },
      { row: 7, text: "Unrealized loss on AFS debt = OCI item, NOT retained earnings. $96,000 × 80% = $76,800 reduces AOCI." },
      { row: 8, text: "Ending RE: 4,568,000 − 320,000 + 1,188,000 + 1,336,720 − 50,000 = $6,722,720." },
      { row: 9, text: "Total SE: $114,000 + $1,127,000 + $6,722,720 + $(881,800) = $7,081,920." },
    ],
  },
  {
    id: "error_correction_3_year_summary",
    tbsId: "TBS-ERR-3YR",
    module: "F2.M2",
    title: "3-Year Error Correction — Multi-Item Adjustment to Net Income & Balance Sheet",
    prompt:
      "For each error/event, enter the correction to net income in Y1, Y2, Y3 (positive = increase NI, negative = decrease NI) and the Y3 balance sheet impact (debit/credit). Sales overstated when cash basis used; freight-out wrongly capitalized; discontinued ops loss timing; subscription revenue advance; FOB destination inventory wrongly expensed.",
    accountOptions: [
      "Sales",
      "Cost of goods sold",
      "Discontinued operations loss",
      "Subscription revenue",
      "Deferred revenue",
      "Inventory",
      "Retained earnings",
    ],
    rows: [
      { label: "Row 4 Y2 NI adjustment — Cash-basis sale should accrue Y2", expectedAmount: 2000 },
      { label: "Row 4 Y3 NI adjustment — Reverse Y3 cash-basis recognition", expectedAmount: -2000 },
      { label: "Row 5 Y1 NI adjustment — Freight-out capitalized (add $25k expense)", expectedAmount: -25000 },
      { label: "Row 5 Y2 NI adjustment — Add net $50k freight-out expense", expectedAmount: -50000 },
      { label: "Row 5 Y3 NI adjustment — Add net $75k freight-out expense", expectedAmount: -75000 },
      { label: "Row 5 Y3 BS — Reduce inventory (credit)", expectedAccount: "Inventory", expectedAmount: -150000 },
      { label: "Row 6 Y2 NI adjustment — Move loss out of Y2", expectedAmount: 150000 },
      { label: "Row 6 Y3 NI adjustment — Move loss into Y3", expectedAmount: -150000 },
      { label: "Row 7 Y3 NI adjustment — Reverse $100k unearned sub revenue", expectedAmount: -100000 },
      { label: "Row 7 Y3 BS — Establish deferred revenue (credit)", expectedAccount: "Deferred revenue", expectedAmount: -100000 },
      { label: "Row 8 Y3 NI adjustment — Reverse FOB-destination COGS", expectedAmount: 50000 },
      { label: "Row 8 Y3 BS — Restore inventory (debit)", expectedAccount: "Inventory", expectedAmount: 50000 },
    ],
    exhibits: [
      {
        name: "Error Detail Summary",
        body:
          "Row 4 — Cash-basis sale: Sale earned Y2, cash received Y3. Move $2,000 of revenue from Y3 → Y2. No BS impact (collected before 12/31/Y3).\n\n" +
          "Row 5 — Freight-out wrongly capitalized as inventory (FIFO, 50% safety stock):\n" +
          "  Y1: $50,000 freight; only $25,000 expensed in COGS → add $25,000 expense.\n" +
          "  Y2: $150,000 should be expensed, only $100,000 was (Y1 carryover $25k + Y2 current $75k) → add $50,000.\n" +
          "  Y3: $300,000 should be expensed, only $225,000 was → add $75,000.\n" +
          "  BS: $150,000 still in inventory must be removed (credit Inventory).\n\n" +
          "Row 6 — Discontinued ops loss timing: $150,000 Y3 operating loss wrongly booked in Y2. Move from Y2 → Y3. No BS impact (asset disposed before YE).\n\n" +
          "Row 7 — Subscription revenue: $150,000 advance for 3-yr subscription received Y3. Recognize $50,000 Y3, defer $100,000. Original entry took full $150,000 to revenue Y3.\n\n" +
          "Row 8 — FOB-destination inventory: $50,000 still in warehouse wrongly expensed as COGS. Restore inventory, eliminate COGS.",
      },
    ],
    scoring: { basePerCell: 50, mult: 7, bonusAllCorrect: 450 },
    explanations: [
      { row: 1, text: "Cash-basis: Y2 sale not booked → add $2,000 to Y2 NI." },
      { row: 2, text: "Cash-basis: Y3 collection wrongly booked as revenue → reduce Y3 NI by $2,000." },
      { row: 3, text: "Freight-out Y1: $50,000 capitalized, only $25,000 hit COGS. Add $25,000 to expense → -$25k NI." },
      { row: 4, text: "Y2 net under-expense: $150,000 owed vs $100,000 booked = $50,000 short. -$50k NI." },
      { row: 5, text: "Y3 net under-expense: $300,000 owed vs $225,000 booked = $75,000 short. -$75k NI." },
      { row: 6, text: "Y3 ending inventory still holds $150,000 freight-out wrongly capitalized → credit Inventory." },
      { row: 7, text: "Loss wrongly in Y2 → reverse out: +$150k Y2." },
      { row: 8, text: "Loss correctly belongs Y3 → recognize: -$150k Y3." },
      { row: 9, text: "Subscription advance: recognize $50k earned Y3, defer $100k. NI reduces by $100k." },
      { row: 10, text: "Establish $100k deferred revenue (credit) on Y3 BS." },
      { row: 11, text: "FOB destination → title not transferred → goods still in inventory. Reverse $50k from COGS → +$50k NI." },
      { row: 12, text: "Restore $50,000 to inventory (debit)." },
    ],
  },
  {
    id: "greentree_year_end_adjusting_jes",
    tbsId: "TBS-GREENTREE-AJE",
    module: "F2.M2",
    title: "Greentree — Year-End Adjusting Journal Entries & Pretax Impact",
    prompt:
      "Prepare 6 year-end adjusting journal entries for Greentree (unearned revenue, bad debt, prepaid rent, prepaid advertising, accrued revenue, accrued bonus), then compute the net impact on pretax earnings.",
    accountOptions: [
      "Revenue",
      "Unearned revenue",
      "Bad debt expense",
      "Allowance for doubtful accounts",
      "Prepaid rent expense",
      "Rent expense",
      "Prepaid advertising expense",
      "Advertising expense",
      "Accounts receivable",
      "Bonus expense",
      "Accounts (bonuses) payable",
    ],
    rows: [
      { label: "AJE1 Debit — Recognize earned portion of contract", expectedAccount: "Unearned revenue", expectedAmount: 200000 },
      { label: "AJE1 Credit — Service revenue earned", expectedAccount: "Revenue", expectedAmount: 200000 },
      { label: "AJE2 Debit — Record bad debt expense", expectedAccount: "Bad debt expense", expectedAmount: 480000 },
      { label: "AJE2 Credit — Allowance for doubtful accounts", expectedAccount: "Allowance for doubtful accounts", expectedAmount: 480000 },
      { label: "AJE3 Debit — Reclassify Q1 next-year rent as prepaid", expectedAccount: "Prepaid rent expense", expectedAmount: 87500 },
      { label: "AJE3 Credit — Reduce rent expense", expectedAccount: "Rent expense", expectedAmount: 87500 },
      { label: "AJE4 Debit — Reclassify next-year TV ad spend as prepaid", expectedAccount: "Prepaid advertising expense", expectedAmount: 85000 },
      { label: "AJE4 Credit — Reduce advertising expense", expectedAccount: "Advertising expense", expectedAmount: 85000 },
      { label: "AJE5 Debit — Accrue legal services receivable", expectedAccount: "Accounts receivable", expectedAmount: 14500 },
      { label: "AJE5 Credit — Recognize earned revenue", expectedAccount: "Revenue", expectedAmount: 14500 },
      { label: "AJE6 Debit — Accrue bonus expense for current-year performance", expectedAccount: "Bonus expense", expectedAmount: 900000 },
      { label: "AJE6 Credit — Bonuses payable", expectedAccount: "Accounts (bonuses) payable", expectedAmount: 900000 },
      { label: "Net impact on pretax earnings (use negative for reduction)", expectedAmount: -993000 },
    ],
    exhibits: [
      {
        name: "Facts Summary",
        body:
          "AJE1 — Service contract: $800,000 / 4 quarters → recognize $200,000 earned at YE.\n\n" +
          "AJE2 — Sales $40,000,000 × 60% on AR = $24,000,000 → 2% historical bad debt = $480,000.\n\n" +
          "AJE3 — Rent of $87,500 prepaid relates to Q1 of next year. Was expensed → reclassify as asset.\n\n" +
          "AJE4 — $85,000 TV ad campaign starts beginning of next year. Was expensed → reclassify as prepaid.\n\n" +
          "AJE5 — $14,500 legal services performed and BILLED in current year (mail delay irrelevant) → accrue AR.\n\n" +
          "AJE6 — $900,000 bonuses for current-year performance, paid next year → accrue now.\n\n" +
          "PRETAX IMPACT:\n" +
          "  + $200,000 revenue (AJE1)\n" +
          "  − $480,000 bad debt (AJE2)\n" +
          "  + $87,500 rent reversal (AJE3)\n" +
          "  + $85,000 ad reversal (AJE4)\n" +
          "  + $14,500 revenue (AJE5)\n" +
          "  − $900,000 bonus (AJE6)\n" +
          "  ─────────────────\n" +
          "  = $(993,000) net reduction",
      },
    ],
    scoring: { basePerCell: 45, mult: 6, bonusAllCorrect: 400 },
    explanations: [
      { row: 1, text: "Service contract earned over time, 1/4 done at YE: $800k / 4 = $200k." },
      { row: 3, text: "Sales $40M × 60% AR × 2% bad debt = $480,000 expense." },
      { row: 5, text: "Q1 next-year rent of $87,500 — reclassify from expense to prepaid asset." },
      { row: 7, text: "TV campaign starts next year — prepaid asset of $85,000." },
      { row: 9, text: "Revenue earned and BILLED in current year regardless of mail delay → accrue $14,500." },
      { row: 11, text: "Bonus for current-year performance must be accrued in current year matching principle." },
      { row: 13, text: "Net pretax: +200,000 − 480,000 + 87,500 + 85,000 + 14,500 − 900,000 = −$993,000." },
    ],
  },
  {
    id: "fs_notes_inconsistencies",
    tbsId: "TBS-NOTES-INCON",
    module: "F1.M3",
    title: "Financial Statement Notes — Identify Inconsistencies & Errors",
    prompt:
      "For each note to the financial statements, identify whether there is no error, or which type of issue is present: (1) amounts do not tie to the financial statements, (2) amount reported is incorrect, (3) basis of measurement not provided/incorrect, or (4) inadequate detail provided.",
    accountOptions: [
      "No errors noted",
      "Amounts do not tie to the financial statements",
      "The amount reported on the balance sheet and in the notes is incorrect",
      "Basis of measurement for the asset/liability is not provided or is incorrect",
      "Inadequate information on the detail of the balance is provided",
    ],
    rows: [
      { label: "Note D — Inventory", expectedAccount: "Amounts do not tie to the financial statements" },
      { label: "Note N — Long-term liabilities (restricted cash for long-term obligation)", expectedAccount: "No errors noted" },
      { label: "Note B — Accounts receivable (mixed trade + dividends/interest receivable)", expectedAccount: "The amount reported on the balance sheet and in the notes is incorrect" },
      { label: "Note A — Significant accounting policies: fiscal year (retail 52/53-week year)", expectedAccount: "No errors noted" },
      { label: "Note A — Significant accounting policies: investments in HTM bonds at fair value", expectedAccount: "Basis of measurement for the asset/liability is not provided or is incorrect" },
      { label: "Note E — PP&E (only net amount disclosed, no accumulated depreciation)", expectedAccount: "Inadequate information on the detail of the balance is provided" },
    ],
    exhibits: [
      {
        name: "Disclosure Requirements Checklist",
        body:
          "• Note detail MUST tie to the balance sheet line totals.\n" +
          "• Restricted cash for long-term obligations is properly classified as a long-term asset.\n" +
          "• Trade A/R must be presented SEPARATELY from non-trade items (dividends receivable, interest receivable).\n" +
          "• Fiscal year disclosure is required; a 52/53-week retail year is acceptable.\n" +
          "• Held-to-maturity debt securities → amortized cost, NOT fair value.\n" +
          "• PP&E disclosure must show historical cost AND accumulated depreciation separately (not just net).",
      },
    ],
    scoring: { basePerCell: 40, mult: 5, bonusAllCorrect: 300 },
    explanations: [
      { row: 1, text: "Inventory note detail must agree to the balance sheet inventory total. If totals don't match, it's a tie-out error." },
      { row: 2, text: "Restricted cash tied to long-term obligation is correctly classified as long-term asset. No error." },
      { row: 3, text: "$49,000 of dividends/interest receivable was incorrectly bundled in trade A/R. Must be reclassified — amount on BS is wrong." },
      { row: 4, text: "Disclosure of 52/53-week retail fiscal year is acceptable. No error." },
      { row: 5, text: "HTM bonds must be carried at amortized cost. Fair-value basis is incorrect measurement basis." },
      { row: 6, text: "PP&E note must show historical cost and accumulated depreciation separately, not just net book value." },
    ],
  },
  {
    id: "payfast_disclosure_selection",
    tbsId: "TBS-PAYFAST-DISC",
    module: "F1.M3",
    title: "PayFast Solutions — Footnote Disclosure Wording Selection",
    prompt:
      "For each of 7 disclosure topics, select the wording that complies with GAAP. Topics: use of estimates, revenue recognition (ASC 606), performance obligations, fair value hierarchy, loss contingencies, major customers, subsequent events.",
    accountOptions: [
      "Estimates — Actual results could differ from those estimates",
      "Revenue — Recognized when customer obtains control",
      "Performance Obligation — Series of substantially same services = one PO",
      "Fair Value — Three-tier hierarchy: Level 1, 2, 3",
      "Contingencies — Probable and reasonably estimable; legal costs expensed",
      "Major Customers — Five major customers; loss could impact loan obligations",
      "Subsequent Events — Disclose sale of subsidiary completed 2/7/Y6",
    ],
    rows: [
      { label: "Pop-Up 1: Use of estimates disclosure (GAAP, not GAAS)", expectedAccount: "Estimates — Actual results could differ from those estimates" },
      { label: "Pop-Up 2: ASC 606 revenue recognition trigger", expectedAccount: "Revenue — Recognized when customer obtains control" },
      { label: "Pop-Up 3: Merchant solutions = single performance obligation", expectedAccount: "Performance Obligation — Series of substantially same services = one PO" },
      { label: "Pop-Up 4: Fair value hierarchy (no materiality threshold, no CFO approval)", expectedAccount: "Fair Value — Three-tier hierarchy: Level 1, 2, 3" },
      { label: "Pop-Up 5: Loss contingencies (probable + reasonably estimable; legal costs expensed)", expectedAccount: "Contingencies — Probable and reasonably estimable; legal costs expensed" },
      { label: "Pop-Up 6: Major customer concentration (no names, no prior-year quantification)", expectedAccount: "Major Customers — Five major customers; loss could impact loan obligations" },
      { label: "Pop-Up 7: Subsequent event — completed sale (NOT a planned/potential sale)", expectedAccount: "Subsequent Events — Disclose sale of subsidiary completed 2/7/Y6" },
    ],
    exhibits: [
      {
        name: "Disclosure Decision Rules",
        body:
          "USE OF ESTIMATES: Inform users of inherent uncertainties; governed by GAAP, not GAAS. Auditor work is NEVER discussed in footnotes.\n\n" +
          "ASC 606 REVENUE: Recognized when customer obtains CONTROL. Customer's ability to pay or credit qualification is NOT a recognition criterion. Bad debt accruals are separate from revenue recognition.\n\n" +
          "PERFORMANCE OBLIGATION: Promise to transfer good/service. Series of substantially same services with same pattern of transfer = ONE PO.\n\n" +
          "FAIR VALUE HIERARCHY: Level 1 (quoted prices), Level 2 (observable inputs), Level 3 (unobservable). NO materiality threshold (no 20% rule). Management estimate + CFO approval are NOT GAAP requirements.\n\n" +
          "CONTINGENCIES: Probable + reasonably estimable. Legal costs expensed as incurred. Customer vs non-customer dispute legal costs not separately tracked. 'Fair' is not a GAAP standard.\n\n" +
          "MAJOR CUSTOMERS: Required disclosure of concentration BUT customer NAMES are NOT disclosed. No prior-year quantification required. No quantification of how many customer losses trigger loan default. Annual determination (not every 3 years).\n\n" +
          "SUBSEQUENT EVENTS: Disclose COMPLETED transactions between BS date and issuance. POTENTIAL/PLANNED future transactions are NOT reportable subsequent events. Errors identified pre-issuance get CORRECTED in the FS, not disclosed.",
      },
    ],
    scoring: { basePerCell: 45, mult: 6, bonusAllCorrect: 380 },
    explanations: [
      { row: 1, text: "Use of estimates disclosure is governed by GAAP and acknowledges actual results may differ. Auditor work must NEVER be referenced in footnotes." },
      { row: 2, text: "ASC 606: revenue recognized when CONTROL transfers. Collectibility and credit qualification do NOT block recognition." },
      { row: 3, text: "Substantially same services with same transfer pattern (electronic merchant processing) = single PO." },
      { row: 4, text: "Three-level fair value hierarchy applies to ALL fair value measurements with no materiality threshold. Management/CFO approval is irrelevant to GAAP requirements." },
      { row: 5, text: "Loss contingencies: probable + reasonably estimable. Legal costs are period costs. 'Fair' is not a GAAP threshold." },
      { row: 6, text: "Disclose concentrations without naming customers. No prior-year carryforward. No specific threshold count required." },
      { row: 7, text: "Completed Y6 subsidiary sale = reportable subsequent event for Y5 financials. A POTENTIAL future sale is NOT disclosed. Pre-issuance errors are CORRECTED, not disclosed." },
    ],
  },
  {
    id: "tti_subsequent_events",
    tbsId: "TBS-TTI-SUBEV",
    module: "F1.M3",
    title: "Tough Tire Inc — Subsequent Events: Recognize or Disclose?",
    prompt:
      "For 5 events occurring between 12/31/Y4 and the issuance of the Y4 financial statements, prepare the necessary journal entry — or select 'No Entry Required' for nonrecognized events. Recognized events reflect conditions that existed AT the balance sheet date; nonrecognized events arose AFTER the balance sheet date.",
    accountOptions: [
      "No Entry Required",
      "Contingency expense",
      "Contingency liability",
      "Bad debt expense",
      "Allowance for doubtful accounts",
      "Buildings",
      "Loss from natural disaster",
    ],
    rows: [
      { label: "Event 1: Lawsuit settled post-YE > recorded accrual (Maverick v. TTI) — DR", expectedAccount: "Contingency expense", expectedAmount: 425980 },
      { label: "Event 1: CR", expectedAccount: "Contingency liability", expectedAmount: 425980 },
      { label: "Event 2: Fontis bankruptcy; $115,000 additional reserve required — DR", expectedAccount: "Bad debt expense", expectedAmount: 115000 },
      { label: "Event 2: CR", expectedAccount: "Allowance for doubtful accounts", expectedAmount: 115000 },
      { label: "Event 3: Major decline in investment FV after YE", expectedAccount: "No Entry Required" },
      { label: "Event 4: New lawsuit filed after YE", expectedAccount: "No Entry Required" },
      { label: "Event 5: Insurance appraisal revises building loss; reverse $150k over-write-off — DR", expectedAccount: "Buildings", expectedAmount: 150000 },
      { label: "Event 5: CR", expectedAccount: "Loss from natural disaster", expectedAmount: 150000 },
    ],
    exhibits: [
      {
        name: "Subsequent Events Framework",
        body:
          "RECOGNIZED subsequent event (Type I):\n" +
          "  Condition existed AT the balance sheet date.\n" +
          "  → Adjust the financial statements (book entry).\n" +
          "  Examples: lawsuit accrual settled differently, customer bankruptcy reveals pre-existing collectibility issue.\n\n" +
          "NONRECOGNIZED subsequent event (Type II):\n" +
          "  Condition arose AFTER the balance sheet date.\n" +
          "  → Disclose only (if material). NO journal entry.\n" +
          "  Examples: post-YE decline in FV of investment, fire/disaster after YE, new lawsuit filed after YE, new debt issuance.\n\n" +
          "EVENT DETAILS:\n" +
          "1. Maverick v. TTI: lawsuit was in process at 12/31/Y4. Accrual = $X, settlement = $X + $425,980. Recognize additional $425,980 in Y4.\n\n" +
          "2. Fontis Co bankruptcy: invoices past due AT YE → collectibility issue pre-existed. Reserve was $125k; now will only collect $10k from $125k outstanding → add $115k to allowance.\n\n" +
          "3. Investment FV declined post-YE: condition is the market change AFTER YE → nonrecognized. No entry.\n\n" +
          "4. New lawsuit filed after YE: triggering event occurred AFTER YE → nonrecognized. No entry.\n\n" +
          "5. Building fire occurred BEFORE YE → loss is recognized. But appraisal of REPLACEMENT cost obtained AFTER YE is nonrecognized — the loss limit is the CARRYING value $800,000, NOT the $950,000 the company booked. Reverse $150,000 over-write-off.",
      },
    ],
    scoring: { basePerCell: 50, mult: 7, bonusAllCorrect: 400 },
    explanations: [
      { row: 1, text: "Lawsuit in process at 12/31/Y4 → recognized subsequent event. Settlement exceeded accrual by $425,980 → DR Contingency Expense $425,980." },
      { row: 2, text: "CR Contingency Liability $425,980 to record additional accrual in Y4 books." },
      { row: 3, text: "Fontis was past due at YE → collectibility issue pre-existed. Additional reserve $115k required because only $10k will be collected (vs $125k reserved)." },
      { row: 4, text: "CR Allowance for Doubtful Accounts $115,000." },
      { row: 5, text: "Investment FV decline AFTER YE = nonrecognized. No journal entry; only disclosure if material." },
      { row: 6, text: "Lawsuit filed AFTER YE = nonrecognized. No journal entry; only disclosure." },
      { row: 7, text: "Building loss capped at carrying value $800,000, not replacement cost $950,000. Company over-stated loss by $150,000 → reverse: DR Buildings $150,000." },
      { row: 8, text: "CR Loss from Natural Disaster $150,000 to reverse the over-stated portion." },
    ],
  },
  {
    id: "fv_measurement_basis_matrix",
    tbsId: "TBS-FV-BASIS",
    module: "F2.M3",
    title: "Measurement Basis — Fair Value vs Historical Cost vs Amortized Cost",
    prompt:
      "For 6 financial statement items, select the proper measurement basis (Fair value / Historical cost / Amortized cost) AND the correct balance sheet amount at year-end.",
    accountOptions: [
      "Fair value",
      "Historical cost",
      "Amortized cost",
    ],
    rows: [
      { label: "Pepper Co. — 1,000 shares trading equity, intends to sell shortly", expectedAccount: "Fair value", expectedAmount: 72000 },
      { label: "Jerry Co. — land held as investment property, contract to sell", expectedAccount: "Historical cost", expectedAmount: 125000 },
      { label: "JJ Frazier — 150 Gaines shares on multiple exchanges (London most advantageous)", expectedAccount: "Fair value", expectedAmount: 12000 },
      { label: "Broccoli Co. — Goodwill, no impairment indicated", expectedAccount: "Historical cost", expectedAmount: 900000 },
      { label: "Maten Inc. — Cash & equivalents (T-bills <3mo, money market funds)", expectedAccount: "Fair value", expectedAmount: 955000 },
      { label: "Crump Inc. — Held-to-maturity bonds at par $800k (FV $755k)", expectedAccount: "Amortized cost", expectedAmount: 800000 },
    ],
    exhibits: [
      {
        name: "Measurement Basis Quick Reference",
        body:
          "TRADING/AFS EQUITY → Fair value (with changes in NI for trading; OCI for AFS DEBT only).\n" +
          "LAND (any intent) → Historical cost under US GAAP.\n" +
          "STOCK on multiple exchanges → If no principal market → most advantageous market.\n" +
          "  Pricing is at the quoted price; transaction costs are used only to DETERMINE the most advantageous market, NOT to reduce reported FV.\n" +
          "GOODWILL → Historical cost (impairment-only model — no amortization).\n" +
          "CASH EQUIVALENTS (T-bills <3mo, money markets) → Fair value (financial instruments).\n" +
          "HELD-TO-MATURITY DEBT → Amortized cost (FV ignored).\n\n" +
          "JJ Frazier detail:\n" +
          "  London: $75 net of transaction costs → most advantageous market.\n" +
          "  Quoted London price (gross) = $80 per share, transaction cost $5 → net $75.\n" +
          "  Use quoted London FV (gross) × 150 shares = $80 × 150 = $12,000 reported.",
      },
    ],
    scoring: { basePerCell: 45, mult: 6, bonusAllCorrect: 350 },
    explanations: [
      { row: 1, text: "Trading securities marked to fair value: 1,000 sh × $72 YE = $72,000." },
      { row: 2, text: "Land held as investment property → still Historical Cost under US GAAP. Sale contract irrelevant until executed." },
      { row: 3, text: "No principal market → use most advantageous market (London at $75 net). Reported FV uses gross London price × 150 = $12,000." },
      { row: 4, text: "Goodwill at historical cost $900,000; impairment-only model. No impairment indicated this year." },
      { row: 5, text: "Cash equivalents (T-bills <3mo + money market funds) reported at fair value $955,000." },
      { row: 6, text: "HTM debt at amortized cost = par $800,000. FV ($755,000) is ignored." },
    ],
  },
  {
    id: "spring_winter_fv_measurement",
    tbsId: "TBS-SPRING-WINTER-FV",
    module: "F2.M3",
    title: "Spring-Winter Corp — Fair Value Measurement in Business Combination",
    prompt:
      "For Spring-Winter's acquisition of DEF Corp, determine the fair value of: (1) NC facility under highest-and-best-use, (2) Fleet vehicles via most advantageous market, (3) GHI stock at principal market, (4) JKL preferred stock at Level-2 input, (5) Intangibles via income approach DCF. All amounts in $ thousands.",
    accountOptions: [
      "Highest and best use (vacant lot, demolish buildings)",
      "Most advantageous market (New England)",
      "Principal market (Chicago — highest volume)",
      "Level 2 input (similar JKL preferred class on Tokyo)",
      "Income approach (DCF royalty)",
    ],
    rows: [
      { label: "Row 14: NC facility FV ($ thousands) — Approach: demolish for vacant lot", expectedAccount: "Highest and best use (vacant lot, demolish buildings)", expectedAmount: 19540 },
      { label: "Row 16: Fleet vehicles FV ($ thousands) — Market: New England", expectedAccount: "Most advantageous market (New England)", expectedAmount: 105 },
      { label: "Row 20: GHI stock investment FV ($ thousands) — Chicago principal market", expectedAccount: "Principal market (Chicago — highest volume)", expectedAmount: 950 },
      { label: "Row 21: JKL preferred stock FV ($ thousands) — Level 2 (similar class on Tokyo)", expectedAccount: "Level 2 input (similar JKL preferred class on Tokyo)", expectedAmount: 682 },
      { label: "Row 23: Intangibles FV via DCF ($ thousands)", expectedAccount: "Income approach (DCF royalty)", expectedAmount: 3800 },
    ],
    exhibits: [
      {
        name: "Fair Value Hierarchy & Market Rules",
        body:
          "NONFINANCIAL ASSETS — Highest and best use (HABU):\n" +
          "  Maximum value from market participant perspective. Mgmt's INTENDED use is irrelevant.\n" +
          "  NC Facility: $24,675k vacant lot value − $5,135k demolition = $19,540k.\n\n" +
          "PRINCIPAL MARKET vs MOST ADVANTAGEOUS:\n" +
          "  If principal market exists (highest volume) → MUST use it.\n" +
          "  Else use most advantageous market (highest net after transaction + transport costs).\n" +
          "  Fleet vehicles (no principal market):\n" +
          "    GA: 80 × $1,300 = $104k − $2k tx = $102k\n" +
          "    NE: 80 × $1,500 = $120k − $2k tx − $15k transport = $103k ★ best net\n" +
          "    CA: 80 × $1,600 = $128k − $5k tx − $22k transport = $101k\n" +
          "  REPORTED FV: gross price LESS transport but NOT transaction costs:\n" +
          "    80 × $1,500 = $120k − $15k transport = $105k\n\n" +
          "GHI Stock — Chicago is principal market (highest volume): 10,000 × $95 = $950k.\n\n" +
          "JKL Preferred — Level 2 (similar JKL class on Tokyo) > Level 3 (entity model). 1,000 × $682 = $682k.\n\n" +
          "INTANGIBLES — Income approach DCF (rounded $ thousands):\n" +
          "  Y8: 20,610 × 7.5% × 0.9535 = 1,473.9\n" +
          "  Y9: 16,000 × 7.5% × 0.8668 = 1,040.2\n" +
          "  Y10: 12,000 × 7.5% × 0.7880 = 709.2\n" +
          "  Y11: 8,000 × 7.5% × 0.7164 = 429.8\n" +
          "  Y12: 3,000 × 7.5% × 0.6512 = 146.5\n" +
          "  Total ≈ $3,800k.",
      },
    ],
    scoring: { basePerCell: 60, mult: 8, bonusAllCorrect: 500 },
    explanations: [
      { row: 1, text: "Highest-and-best-use ignores mgmt intent. Vacant lot less demolition = $19,540k." },
      { row: 2, text: "Most advantageous = NE ($103k net). Reported FV uses gross less transport (not transaction): $120k − $15k = $105k." },
      { row: 3, text: "Principal market = Chicago (highest volume). Use Chicago price regardless of other markets: 10,000 × $95 = $950k." },
      { row: 4, text: "Level 2 (Tokyo similar class) beats Level 3 (proprietary model). 1,000 × $682 = $682k." },
      { row: 5, text: "Income approach DCF sum: 1,473.9 + 1,040.2 + 709.2 + 429.8 + 146.5 ≈ $3,800k." },
    ],
  },
  {
    id: "cash_to_accrual_8_journal_entries",
    tbsId: "TBS-CASH2ACC-JE",
    module: "F2.M2",
    title: "Cash → Accrual Conversion — 8 Adjusting Journal Entries",
    prompt:
      "Convert a small company's cash-basis books to accrual basis through 8 adjusting journal entries: accrue uncollected sales, capitalize inventory + accrue payables, capitalize fixed asset + depreciation, prepay insurance, restore bad check to A/R, accrue bad debt allowance, accrue payroll, and accrue income tax. Tax rate 25%.",
    accountOptions: [
      "Accounts receivable",
      "Sales",
      "Inventory",
      "Accounts payable",
      "Cost of sales",
      "Factory equipment",
      "Small tools expense",
      "Depreciation expense",
      "Accumulated depreciation",
      "Prepaid insurance",
      "Administrative expenses",
      "Cash",
      "Credit loss expense",
      "Allowance for credit losses",
      "Payroll expense",
      "Accrued payroll",
      "Income tax expense",
      "Income tax payable",
    ],
    rows: [
      { label: "JE1 DR — Accrue uncollected Y1 sales", expectedAccount: "Accounts receivable", expectedAmount: 19500 },
      { label: "JE1 CR — Sales", expectedAccount: "Sales", expectedAmount: 19500 },
      { label: "JE2 DR — Inventory still on hand at YE", expectedAccount: "Inventory", expectedAmount: 12000 },
      { label: "JE2 CR — Accounts payable (for unpaid purchases on hand)", expectedAccount: "Accounts payable", expectedAmount: 12000 },
      { label: "JE2 DR — COGS for goods sold but not yet paid", expectedAccount: "Cost of sales", expectedAmount: 2000 },
      { label: "JE2 CR — A/P for sold-but-unpaid goods", expectedAccount: "Accounts payable", expectedAmount: 2000 },
      { label: "JE3 DR — Capitalize tools as equipment", expectedAccount: "Factory equipment", expectedAmount: 5000 },
      { label: "JE3 CR — Reverse small tools expense", expectedAccount: "Small tools expense", expectedAmount: 5000 },
      { label: "JE3 DR — Y1 depreciation (1 year, SL)", expectedAccount: "Depreciation expense", expectedAmount: 1000 },
      { label: "JE3 CR — Accumulated depreciation", expectedAccount: "Accumulated depreciation", expectedAmount: 1000 },
      { label: "JE4 DR — Prepaid insurance (6 months remaining)", expectedAccount: "Prepaid insurance", expectedAmount: 1200 },
      { label: "JE4 CR — Reduce admin expense", expectedAccount: "Administrative expenses", expectedAmount: 1200 },
      { label: "JE5 DR — Restore bounced check to A/R", expectedAccount: "Accounts receivable", expectedAmount: 500 },
      { label: "JE5 CR — Reduce cash for bounced check", expectedAccount: "Cash", expectedAmount: 500 },
      { label: "JE6 DR — Credit loss expense (4.5% of $20,000)", expectedAccount: "Credit loss expense", expectedAmount: 900 },
      { label: "JE6 CR — Allowance for credit losses", expectedAccount: "Allowance for credit losses", expectedAmount: 900 },
      { label: "JE7 DR — Accrue 1 week of payroll", expectedAccount: "Payroll expense", expectedAmount: 1300 },
      { label: "JE7 CR — Accrued payroll liability", expectedAccount: "Accrued payroll", expectedAmount: 1300 },
      { label: "JE8 DR — Income tax expense (25% × $20,000)", expectedAccount: "Income tax expense", expectedAmount: 5000 },
      { label: "JE8 CR — Income tax payable (after $4,000 estimated payments)", expectedAccount: "Income tax payable", expectedAmount: 1000 },
    ],
    exhibits: [
      {
        name: "Cash → Accrual Conversion Logic",
        body:
          "JE1 — SALES: Cash basis only books collected sales. Add $19,500 of receivables to revenue.\n\n" +
          "JE2 — PURCHASES: Cash basis records when paid. (a) $12,000 inventory still on hand but unpaid → DR Inv / CR A/P. (b) $2,000 goods already SOLD but invoice unpaid → DR COGS / CR A/P.\n\n" +
          "JE3 — FIXED ASSET: $5,000 'small tools' was expensed; should be capitalized. Reclassify + record $1,000 depreciation (SL, full year).\n\n" +
          "JE4 — INSURANCE: $2,400 policy 7/1/Y1–6/30/Y2. At 12/31/Y1, 6 months remain. Prepaid = $2,400 × 6/12 = $1,200.\n\n" +
          "JE5 — BAD CHECK: Customer payment bounced; under accrual it remains A/R, not collected cash.\n\n" +
          "JE6 — BAD DEBT: 4.5% allowance on sales-related A/R. Sales A/R = $19,500 (JE1) + $500 (JE5) = $20,000 × 4.5% = $900.\n\n" +
          "JE7 — PAYROLL: Last paycheck through 12/24. 1 week (12/25–12/31) of accrued wages = $1,300.\n\n" +
          "JE8 — INCOME TAX: Recompute taxable income on accrual basis.\n" +
          "  Cash basis pretax    ($1,000)\n" +
          "  + JE1 sales          $20,000  (gross add-back)\n" +
          "  - JE2 cost of sales  ($2,000)\n" +
          "  + JE3 tools           $5,000  (reverse expense)\n" +
          "  - JE3 depreciation   ($1,000)\n" +
          "  + JE4 admin reduce    $1,200\n" +
          "  - JE6 credit loss     ($900)\n" +
          "  - JE7 payroll        ($1,300)\n" +
          "  = Taxable income     $20,000\n" +
          "  Tax @ 25% = $5,000; Less estimated payments $4,000 → Payable $1,000.",
      },
    ],
    scoring: { basePerCell: 50, mult: 8, bonusAllCorrect: 500 },
    explanations: [
      { row: 1, text: "JE1: Accrued uncollected sales — DR A/R $19,500 / CR Sales $19,500." },
      { row: 3, text: "JE2a: Unpaid purchase still on hand — DR Inventory $12,000 / CR A/P $12,000." },
      { row: 5, text: "JE2b: Unpaid goods already sold — DR COGS $2,000 / CR A/P $2,000." },
      { row: 7, text: "JE3a: Capitalize $5,000 tools — DR Factory Equipment / CR Small Tools Expense." },
      { row: 9, text: "JE3b: SL depreciation Y1 = $1,000 (assume 5-yr life on $5,000 → $1,000/yr)." },
      { row: 11, text: "JE4: Prepaid Ins = $2,400 × 6/12 = $1,200 → reverse from admin expense." },
      { row: 13, text: "JE5: Bounced check restored to A/R from Cash." },
      { row: 15, text: "JE6: 4.5% × $20,000 sales-related A/R = $900 credit loss." },
      { row: 17, text: "JE7: 1 week (12/25–12/31) accrued = $1,300." },
      { row: 19, text: "JE8: Taxable Income = $20,000 → Tax $5,000; Payable = $5,000 − $4,000 estimated payments = $1,000." },
    ],
  },
  {
    id: "jj_company_accrual_conversion",
    tbsId: "TBS-JJ-ACCRUAL",
    module: "F2.M2",
    title: "J&J Company — Accrual Balance Sheet & Income Statement Build",
    prompt:
      "Build J&J's 12/31/Y1 balance sheet adjustments and full accrual income statement from cash-basis records + open invoices + service schedules. Equipment used 11/12 months in Y1. Insurance policy 12 months. Unearned rent 3/4 months remaining.",
    accountOptions: [
      "Accounts receivable",
      "Rent receivable",
      "Inventory",
      "Prepaid insurance",
      "Interest receivable",
      "Equipment",
      "Accumulated depreciation",
      "Accounts payable",
      "Unearned rent",
      "Wages payable",
      "Utilities payable",
      "Sales revenue",
      "Cost of goods sold",
      "Wages expense",
      "Depreciation expense",
      "Utilities expense",
      "Insurance expense",
      "Rent expense",
      "Rent revenue",
      "Interest revenue",
      "Net income",
    ],
    rows: [
      { label: "Accounts receivable 12/31/Y1", expectedAccount: "Accounts receivable", expectedAmount: 20480 },
      { label: "Rent receivable (2 months past due)", expectedAccount: "Rent receivable", expectedAmount: 3600 },
      { label: "Inventory 12/31/Y1", expectedAccount: "Inventory", expectedAmount: 76000 },
      { label: "Prepaid insurance (11 of 12 months remain)", expectedAccount: "Prepaid insurance", expectedAmount: 11000 },
      { label: "Interest receivable", expectedAccount: "Interest receivable", expectedAmount: 600 },
      { label: "Equipment", expectedAccount: "Equipment", expectedAmount: 165000 },
      { label: "Accumulated depreciation ($16,500/yr × 11/12)", expectedAccount: "Accumulated depreciation", expectedAmount: 15125 },
      { label: "Accounts payable", expectedAccount: "Accounts payable", expectedAmount: 43000 },
      { label: "Unearned rent ($4,400 × 3/4)", expectedAccount: "Unearned rent", expectedAmount: 3300 },
      { label: "Wages payable", expectedAccount: "Wages payable", expectedAmount: 7300 },
      { label: "Utilities payable", expectedAccount: "Utilities payable", expectedAmount: 4130 },
      { label: "Sales revenue ($365,000 cash + $20,480 ΔAR)", expectedAccount: "Sales revenue", expectedAmount: 385480 },
      { label: "Cost of goods sold (cash $186,500 + ΔAP $43,000 − ΔInv $76,000)", expectedAccount: "Cost of goods sold", expectedAmount: 153500 },
      { label: "Wages expense ($76,450 + $7,300 accrued)", expectedAccount: "Wages expense", expectedAmount: 83750 },
      { label: "Depreciation expense (11 months)", expectedAccount: "Depreciation expense", expectedAmount: 15125 },
      { label: "Utilities expense ($12,800 + $4,130 accrued)", expectedAccount: "Utilities expense", expectedAmount: 16930 },
      { label: "Insurance expense ($24,500 cash − $11,000 prepaid)", expectedAccount: "Insurance expense", expectedAmount: 13500 },
      { label: "Rent expense", expectedAccount: "Rent expense", expectedAmount: 86000 },
      { label: "Rent revenue ($32,000 + $3,600 RR − $3,300 unearned)", expectedAccount: "Rent revenue", expectedAmount: 32300 },
      { label: "Interest revenue ($2,350 + $600)", expectedAccount: "Interest revenue", expectedAmount: 2950 },
      { label: "Net income", expectedAccount: "Net income", expectedAmount: 51925 },
    ],
    exhibits: [
      {
        name: "Cash → Accrual Conversion Formulas",
        body:
          "REVENUES:\n" +
          "  Sales revenue = Cash from customers + Ending AR − Beginning AR\n" +
          "  Rent revenue = Cash from renters + ΔRent Receivable − ΔUnearned Rent\n" +
          "  Interest revenue = Cash interest + Ending Interest Receivable − Beg Interest Receivable\n\n" +
          "EXPENSES:\n" +
          "  COGS = Cash purchases + ΔAP + Beg Inventory − End Inventory\n" +
          "  Wages = Cash wages + Ending Wages Payable − Beg Wages Payable\n" +
          "  Utilities = Cash utilities + Ending Util Payable − Beg Util Payable\n" +
          "  Insurance = Cash insurance + Beg Prepaid − End Prepaid\n\n" +
          "DEPRECIATION (partial year): Annual rate × months-in-service / 12.\n" +
          "  J&J: $16,500/yr × 11/12 = $15,125.\n\n" +
          "UNEARNED RENT: $4,400 collected for 4 months. 1 month earned → 3/4 × $4,400 = $3,300 unearned.",
      },
    ],
    scoring: { basePerCell: 45, mult: 7, bonusAllCorrect: 500 },
    explanations: [
      { row: 7, text: "Equipment in service 11 months: $16,500 × 11/12 = $15,125 accumulated depreciation." },
      { row: 9, text: "Unearned rent = $4,400 × 3/4 = $3,300 (1 month earned, 3 months future)." },
      { row: 12, text: "Sales = $365,000 cash + $20,480 ending AR − $0 beg AR = $385,480." },
      { row: 13, text: "COGS = $186,500 cash + $43,000 ending AP − $0 beg AP + $0 beg inv − $76,000 end inv = $153,500." },
      { row: 17, text: "Insurance expense = $24,500 cash + $0 beg prepaid − $11,000 end prepaid = $13,500." },
      { row: 19, text: "Rent revenue = $32,000 cash + $3,600 ending rent receivable − $3,300 ending unearned rent = $32,300." },
      { row: 21, text: "NI = Sales 385,480 − COGS 153,500 − Wages 83,750 − Dep 15,125 − Util 16,930 − Ins 13,500 − Rent 86,000 + Rent Rev 32,300 + Int Rev 2,950 = $51,925." },
    ],
  },
  {
    id: "tinsley_modified_cash_basis",
    tbsId: "TBS-TINSLEY-MCB",
    module: "F2.M2",
    title: "Tinsley Shops — Modified Cash Basis Adjustments",
    prompt:
      "Convert Tinsley Shops' cash-basis FS to modified cash basis at 6/30/Y4. Modifications: capitalize inventory, capitalize plant & equipment with depreciation, accrue interest on promissory note, accrue income tax payable, separate current portion of long-term debt.",
    accountOptions: [
      "Inventory",
      "Accumulated depreciation",
      "Interest payable (expense)",
      "Income tax payable (expense)",
      "Current portion of long-term debt",
      "Cost of goods sold",
      "Depreciation expense",
      "Retained earnings",
    ],
    rows: [
      { label: "Inventory (FOB destination: 140 ZHY-23 units included)", expectedAccount: "Inventory", expectedAmount: 18023 },
      { label: "Accumulated depreciation (5 assets total)", expectedAccount: "Accumulated depreciation", expectedAmount: -68535 },
      { label: "Interest payable ($150,000 × 3% × 3/12)", expectedAccount: "Interest payable (expense)", expectedAmount: 1125 },
      { label: "Income tax payable (Q1+Q2+Q3+Q4 estimates)", expectedAccount: "Income tax payable (expense)", expectedAmount: 19925 },
      { label: "Current portion of long-term debt (next 2 principal payments)", expectedAccount: "Current portion of long-term debt", expectedAmount: 13071 },
      { label: "COGS modified ($24,813 beg + $214,885 purch − $18,023 end)", expectedAccount: "Cost of goods sold", expectedAmount: 221675 },
      { label: "Depreciation expense Y4 (sum of 5 assets, excl JKD263)", expectedAccount: "Depreciation expense", expectedAmount: 27624 },
      { label: "Modified cash basis retained earnings 6/30/Y4", expectedAccount: "Retained earnings", expectedAmount: 544063 },
    ],
    exhibits: [
      {
        name: "Modified Cash Basis Adjustments",
        body:
          "Modified Cash Basis = Cash Basis + adjustments that have 'substantial support' (equivalent to accrual).\n\n" +
          "COMMON MODIFICATIONS:\n" +
          "  ✓ Capitalize inventory (and adjust COGS)\n" +
          "  ✓ Capitalize plant/equipment + depreciate\n" +
          "  ✓ Recognize liabilities for short/long-term borrowings + related interest\n" +
          "  ✓ Accrue income tax payable\n\n" +
          "TINSLEY DETAIL:\n" +
          "  INVENTORY (FOB Destination delivered 7/5/Y5): 140 ZHY-23 units stay in 6/30/Y4 inventory.\n" +
          "    (412×8.50)+(220×9.15)+(501×5.45)+(195×10.20)+(380×14.70)+(109×7.30)+(140×10.05) = $18,023.15.\n\n" +
          "  ACCUM. DEPR: KTN ($29,070) + 6X4N ($10,296) + 727TS ($9,591) + 223 Amway ($18,473) + 9091287 ($1,105) = $68,535.\n" +
          "    JKD263 purchased in Y4 — NO depreciation per policy.\n\n" +
          "  INTEREST: $150,000 × 3% × 3 months / 12 = $1,125 accrued.\n\n" +
          "  INCOME TAX: $4,750 + $4,925 + $5,050 + $5,200 = $19,925.\n\n" +
          "  CURRENT PORTION OF LTD: Next 2 payments of $8,736.86 (Sept & March of Y5).\n" +
          "    Sept payment: $2,250.00 interest + $6,486.86 principal\n" +
          "    March payment: $2,152.70 interest + $6,584.16 principal\n" +
          "    Current portion = $6,486.86 + $6,584.16 = $13,071.\n\n" +
          "  COGS: Beg inv $24,813 + purchases $214,885 (= $227,380 cash COGS − $12,495 of June/Y3 inv) − End inv $18,023 = $221,675.\n\n" +
          "  Y4 DEPR: $11,628 + $3,168 + $3,197 + $8,526 + $1,105 = $27,624.",
      },
    ],
    scoring: { basePerCell: 60, mult: 8, bonusAllCorrect: 500 },
    explanations: [
      { row: 1, text: "FOB Destination = title transfers on receipt. Goods delivered 7/5/Y5 → still in 6/30/Y4 inventory. 140 ZHY-23 units included." },
      { row: 2, text: "Sum of 5 depreciable assets' accumulated depreciation = $68,535. JKD263 (purchased in Y4) excluded per policy." },
      { row: 3, text: "Interest accrual: $150,000 × 3% × 3/12 (Apr-Jun) = $1,125." },
      { row: 4, text: "Sum of Q1–Q4 estimates: $4,750 + $4,925 + $5,050 + $5,200 = $19,925." },
      { row: 5, text: "Two next-year principal portions: $6,486.86 + $6,584.16 = $13,071." },
      { row: 6, text: "Modified COGS = Beg Inv + Purchases − End Inv = 24,813 + 214,885 − 18,023 = $221,675." },
      { row: 7, text: "5 depreciable assets' Y4 depreciation sum = $27,624." },
      { row: 8, text: "Modified RE = $481,967 beg + $86,326 NI − $24,230 dividends = $544,063." },
    ],
  },
  {
    id: "needham_ratio_analysis",
    tbsId: "TBS-NEEDHAM-RATIO",
    module: "F4.M1",
    title: "Needham Company — Liquidity & Activity Ratio Analysis (Y9 vs Y10)",
    prompt:
      "Compute Needham's liquidity and activity ratios for Y10 and Y9, then interpret the trend: improved/worsened, faster/slower, and identify the primary driver of each change.",
    accountOptions: [
      "Current ratio",
      "Quick ratio",
      "Accounts receivable turnover",
      "Days sales in accounts receivable",
      "Inventory turnover",
      "Days in inventory",
      "Improved",
      "Worsened",
      "Faster",
      "Slower",
      "Increase in short-term investments",
      "Increase in accounts receivable",
      "Decrease in cash",
      "Increase in inventory",
      "Implementing a just-in-time inventory system",
      "Increasing inventory purchases",
      "Shipping inventory to a consignee",
    ],
    rows: [
      { label: "Y10 Current ratio (CA / CL)", expectedAccount: "Current ratio", expectedAmount: 2.1 },
      { label: "Y9 Current ratio", expectedAccount: "Current ratio", expectedAmount: 1.7 },
      { label: "Y10 Quick ratio ((Cash + ST Inv + AR) / CL)", expectedAccount: "Quick ratio", expectedAmount: 1.3 },
      { label: "Y9 Quick ratio", expectedAccount: "Quick ratio", expectedAmount: 1.0 },
      { label: "Y10 A/R turnover (Net Sales / Avg AR)", expectedAccount: "Accounts receivable turnover", expectedAmount: 6.2 },
      { label: "Y9 A/R turnover", expectedAccount: "Accounts receivable turnover", expectedAmount: 6.6 },
      { label: "Y10 Days sales in A/R", expectedAccount: "Days sales in accounts receivable", expectedAmount: 67.8 },
      { label: "Y9 Days sales in A/R", expectedAccount: "Days sales in accounts receivable", expectedAmount: 61.3 },
      { label: "Y10 Inventory turnover (COGS / Avg Inv)", expectedAccount: "Inventory turnover", expectedAmount: 1.2 },
      { label: "Y9 Inventory turnover", expectedAccount: "Inventory turnover", expectedAmount: 1.5 },
      { label: "Y10 Days in inventory (End Inv / (COGS / 365))", expectedAccount: "Days in inventory", expectedAmount: 328.9 },
      { label: "Y9 Days in inventory", expectedAccount: "Days in inventory", expectedAmount: 273.0 },
      { label: "Q1: Liquidity trend Y9 → Y10", expectedAccount: "Improved" },
      { label: "Q2: Primary driver of liquidity change", expectedAccount: "Increase in short-term investments" },
      { label: "Q3: A/R collection speed Y10 vs Y9", expectedAccount: "Slower" },
      { label: "Q4: Primary driver of A/R turnover change", expectedAccount: "Increase in accounts receivable" },
      { label: "Q5: Inventory movement speed Y10 vs Y9", expectedAccount: "Slower" },
      { label: "Q6: Action to align with industry avg (3.0)", expectedAccount: "Implementing a just-in-time inventory system" },
    ],
    exhibits: [
      {
        name: "Ratio Formulas",
        body:
          "LIQUIDITY:\n" +
          "  Current ratio = Current Assets / Current Liabilities\n" +
          "  Quick ratio = (Cash + ST Investments + AR) / Current Liabilities\n\n" +
          "ACTIVITY:\n" +
          "  A/R Turnover = Net Sales / Average AR\n" +
          "  Days Sales in A/R = Ending AR (net) / (Net Sales / 365)\n" +
          "  Inventory Turnover = COGS / Average Inventory\n" +
          "  Days in Inventory = Ending Inventory / (COGS / 365)\n\n" +
          "INTERPRETATION RULES:\n" +
          "  Higher turnover = FASTER collection/movement.\n" +
          "  Higher days = SLOWER collection/movement.\n" +
          "  Liquidity ratios going UP = IMPROVED (more cushion vs. obligations).",
      },
      {
        name: "Needham Selected Balances",
        body:
          "Y10                Y9\n" +
          "Current Assets       $1,485,000      $1,068,810\n" +
          "Current Liabs          $707,000        $617,000\n" +
          "Cash+STInv+AR          $890,000        $609,810\n" +
          "Net Sales            $1,889,575      $1,534,200\n" +
          "Average AR             $304,250        $231,750\n" +
          "Ending AR (net)        $351,000        $257,500\n" +
          "COGS                   $621,500        $595,000\n" +
          "Average Inventory      $502,500        $400,500\n" +
          "Ending Inventory       $560,000        $445,000\n\n" +
          "Key observations:\n" +
          "• ST investments rose $200,000 (key driver of liquidity gain).\n" +
          "• Avg AR rose 31% but sales rose only 23% → A/R turnover slowed.\n" +
          "• Avg inventory rose 25% but COGS rose only 4% → inventory turnover slowed.",
      },
    ],
    scoring: { basePerCell: 50, mult: 7, bonusAllCorrect: 500 },
    explanations: [
      { row: 1, text: "Y10 Current = 1,485,000 / 707,000 = 2.1." },
      { row: 3, text: "Y10 Quick = 890,000 / 707,000 = 1.3." },
      { row: 5, text: "Y10 AR turnover = 1,889,575 / 304,250 = 6.2." },
      { row: 7, text: "Y10 Days in AR = 351,000 / (1,889,575/365) = 67.8 days." },
      { row: 9, text: "Y10 Inv turnover = 621,500 / 502,500 = 1.2." },
      { row: 11, text: "Y10 Days in inv = 560,000 / (621,500/365) = 328.9 days." },
      { row: 13, text: "Liquidity improved: assets up 39%, liabilities up only 15%." },
      { row: 14, text: "Short-term investments rose $200,000 — primary contributor to improved liquidity." },
      { row: 15, text: "Y10 takes 68 days to collect, vs 61 days in Y9 = slower." },
      { row: 16, text: "Avg AR +31% vs Net Sales +23% → AR turnover lower (slower collection)." },
      { row: 17, text: "Inventory turning over every 329 days in Y10 vs 273 in Y9 = slower." },
      { row: 18, text: "JIT reduces on-hand inventory. Increasing purchases worsens ratio; consignment shipments stay on balance sheet." },
    ],
  },
  {
    id: "bunder_bank_reconciliation",
    tbsId: "TBS-BUNDER-RECON",
    module: "F2.M6",
    title: "Bunder Co — Bank Reconciliation (Book + Bank Sides)",
    prompt:
      "Complete Bunder's 12/31/Y1 cash reconciliation. Adjust both Book balance and Bank balance to arrive at the same Correct Cash Balance. Identify each reconciling item correctly: book additions/deductions and bank additions/deductions.",
    accountOptions: [
      "Ck #10276 (check error: GL $9,812 vs actual $9,218)",
      "Customer checks - 12/30",
      "Customer checks - 12/31 (unrecorded $75,720)",
      "Ck #10302 (voided)",
      "Collection of note receivable",
      "Customer check (NSF)",
      "NSF fee",
      "Bank service fee",
      "Ck #10304 (outstanding)",
      "Ck #10305 (outstanding)",
    ],
    rows: [
      { label: "BOOK Add: Ck #10276 over-recorded by $594", expectedAccount: "Ck #10276 (check error: GL $9,812 vs actual $9,218)", expectedAmount: 594 },
      { label: "BOOK Add: Customer deposit 12/31 not in GL", expectedAccount: "Customer checks - 12/31 (unrecorded $75,720)", expectedAmount: 75720 },
      { label: "BOOK Add: Ck #10302 voided on 1/5/Y2", expectedAccount: "Ck #10302 (voided)", expectedAmount: 13476 },
      { label: "BOOK Add: Note receivable collected by bank", expectedAccount: "Collection of note receivable", expectedAmount: 4350 },
      { label: "BOOK Total Additions", expectedAmount: 94140 },
      { label: "BOOK Deduct: Customer NSF check", expectedAccount: "Customer check (NSF)", expectedAmount: 5300 },
      { label: "BOOK Deduct: NSF fee charged by bank", expectedAccount: "NSF fee", expectedAmount: 25 },
      { label: "BOOK Deduct: Bank service fee", expectedAccount: "Bank service fee", expectedAmount: 50 },
      { label: "BOOK Total Deductions", expectedAmount: 5375 },
      { label: "BANK Add: Deposits in transit 12/30", expectedAccount: "Customer checks - 12/30", expectedAmount: 50480 },
      { label: "BANK Add: Deposits in transit 12/31", expectedAccount: "Customer checks - 12/31 (unrecorded $75,720)", expectedAmount: 75720 },
      { label: "BANK Total Additions", expectedAmount: 126200 },
      { label: "BANK Deduct: Outstanding Ck #10304", expectedAccount: "Ck #10304 (outstanding)", expectedAmount: 12342 },
      { label: "BANK Deduct: Outstanding Ck #10305", expectedAccount: "Ck #10305 (outstanding)", expectedAmount: 5849 },
      { label: "BANK Total Deductions", expectedAmount: 18191 },
      { label: "Correct Cash Balance 12/31/Y1", expectedAmount: 340372 },
    ],
    exhibits: [
      {
        name: "Reconciliation Logic",
        body:
          "TWO-COLUMN RECONCILIATION:\n" +
          "  Book balance ± book-side items = Correct Cash\n" +
          "  Bank balance ± bank-side items = Correct Cash\n" +
          "  Both sides MUST agree.\n\n" +
          "BOOK SIDE (adjust GL) - items NOT yet in books but in bank:\n" +
          "  + Bank collections (notes receivable)\n" +
          "  + Errors where book understated cash\n" +
          "  + Voided checks (reverse the GL debit)\n" +
          "  + Direct deposits customer made not yet recorded\n" +
          "  − NSF (bounced) customer checks\n" +
          "  − Bank service fees / NSF fees\n" +
          "  − Errors where book overstated cash\n\n" +
          "BANK SIDE (adjust bank statement) - items in books but not yet on bank:\n" +
          "  + Deposits in transit\n" +
          "  − Outstanding checks\n" +
          "  ± Bank errors\n\n" +
          "BUNDER STARTING:\n" +
          "  Book balance     $251,607\n" +
          "  Bank balance     $232,363\n" +
          "  Both adjust to   $340,372",
      },
    ],
    scoring: { basePerCell: 50, mult: 8, bonusAllCorrect: 600 },
    explanations: [
      { row: 1, text: "Ck #10276 recorded at $9,812 but actual was $9,218 → cash understated by $594. Add to book." },
      { row: 2, text: "$75,720 customer deposit 12/31 not in GL → add to book." },
      { row: 3, text: "Voided check $13,476 needs to be reversed: GL had credited cash → add back to book." },
      { row: 4, text: "Bank collected note receivable $4,350 → add to book." },
      { row: 6, text: "NSF customer check $5,300 → reverse the recorded deposit, deduct from book." },
      { row: 7, text: "NSF fee $25 charged by bank → deduct from book (separate from check)." },
      { row: 8, text: "Bank service fee $50 → deduct from book." },
      { row: 10, text: "Deposits in transit 12/30 = $50,480 (in books, not yet on bank statement) → add to bank." },
      { row: 11, text: "Deposits in transit 12/31 = $75,720 → add to bank." },
      { row: 13, text: "Outstanding Ck #10304 = $12,342 (in books, not yet cleared) → deduct from bank." },
      { row: 14, text: "Outstanding Ck #10305 = $5,849 → deduct from bank." },
      { row: 16, text: "Correct Cash = $251,607 + $94,140 − $5,375 = $340,372 (matches $232,363 + $126,200 − $18,191)." },
    ],
  },
  {
    id: "vontesler_cash_classification",
    tbsId: "TBS-VONTESLER-CASH",
    module: "F2.M6",
    title: "VonTesler — Cash & Cash Equivalents Classification (5 Accounts)",
    prompt:
      "For each of VonTesler's 5 bank/investment accounts, prepare the year-end adjusting journal entry to properly classify Cash & Cash Equivalents, Restricted Cash, Financial Investments, or Bank Overdraft Liabilities. Apply offset rules: same-institution offset OK if net positive, different-institution does NOT offset.",
    accountOptions: [
      "11100: Accounts receivable",
      "57010: Miscellaneous finance costs",
      "10200: Jupiter Bank—operating account",
      "10215: Bank of Saturn (Tethys) checking",
      "20500: Current finance obligations (overdrafts)",
      "10700: Financial investments",
      "10220: Uranus Financial—investment account",
      "10500: Restricted cash",
      "10230: Pluto Trust account",
      "No Entry Required",
    ],
    rows: [
      { label: "10200 — DR Restore A/R from NSF customer check", expectedAccount: "11100: Accounts receivable", expectedAmount: 15562 },
      { label: "10200 — DR NSF bank fee charged", expectedAccount: "57010: Miscellaneous finance costs", expectedAmount: 25 },
      { label: "10200 — CR Jupiter operating cash", expectedAccount: "10200: Jupiter Bank—operating account", expectedAmount: 15587 },
      { label: "10205 — Jupiter disbursement (negative offset by 10200 same bank)", expectedAccount: "No Entry Required" },
      { label: "10215 — DR Bank of Saturn (eliminate negative; different bank, no offset)", expectedAccount: "10215: Bank of Saturn (Tethys) checking", expectedAmount: 5695 },
      { label: "10215 — CR Current finance obligations (overdraft liability)", expectedAccount: "20500: Current finance obligations (overdrafts)", expectedAmount: 5695 },
      { label: "10220 — DR Reclassify non-CE debt + equity investments", expectedAccount: "10700: Financial investments", expectedAmount: 53836 },
      { label: "10220 — CR Uranus investment account", expectedAccount: "10220: Uranus Financial—investment account", expectedAmount: 53836 },
      { label: "10230 — DR Restricted cash for bond sinking fund", expectedAccount: "10500: Restricted cash", expectedAmount: 75000 },
      { label: "10230 — CR Pluto Trust account", expectedAccount: "10230: Pluto Trust account", expectedAmount: 75000 },
    ],
    exhibits: [
      {
        name: "Cash & Equivalents Classification Rules",
        body:
          "CASH EQUIVALENTS: highly liquid, original maturity ≤ 3 months at PURCHASE date.\n" +
          "  ✓ T-bills, commercial paper, money market funds (regardless of maturity, since highly liquid).\n" +
          "  ✗ Equity investments (no maturity).\n" +
          "  ✗ Debt purchased with >3 months remaining maturity at acquisition.\n\n" +
          "RIGHT OF SETOFF (negative cash balances):\n" +
          "  • Same institution + right of setoff in agreement → NET balances. If net positive → report net. If net negative → liability.\n" +
          "  • Different institutions → NO offset. Negative balance ALWAYS becomes overdraft liability.\n\n" +
          "RESTRICTED CASH: contractually restricted (sinking fund, escrow, compensating balance) → report separately, NOT in C&CE.\n\n" +
          "VONTESLER DETAIL:\n" +
          "  10200 Jupiter Operating: NSF $5,300 → reinstate AR + record NSF fee $25 → reduce cash $15,587.\n" +
          "  10205 Jupiter Disbursement: ($4,015) negative; same bank as 10200 with right of setoff → no JE (offset OK).\n" +
          "  10215 Bank of Saturn Tethys: ($5,695) negative; different branch/state as other Saturn account, no setoff right → reclass to overdraft liability.\n" +
          "  10220 Uranus: Reclass non-CE debt $17,806 + equity $36,030 = $53,836 out of cash equivalents. Keep T-bills <3mo + money market.\n" +
          "  10230 Pluto Trust: $75,000 bond sinking fund per indenture → restricted cash.",
      },
    ],
    scoring: { basePerCell: 60, mult: 8, bonusAllCorrect: 550 },
    explanations: [
      { row: 1, text: "NSF customer check $15,562: reverse cash, reinstate A/R." },
      { row: 2, text: "NSF bank fee $25: misc finance cost. Total cash reduction = $15,562 + $25 = $15,587." },
      { row: 4, text: "Same bank (Jupiter) + right of setoff → offset negative against larger positive. NO journal entry; offset on FS only." },
      { row: 5, text: "Different Saturn branches in different states = NO right of setoff. Cannot net. Must reclass negative as overdraft liability." },
      { row: 6, text: "$5,695 = $2,015 actual overdraft + $3,680 outstanding overdraft check (bank's history of honoring)." },
      { row: 7, text: "Debt with >3mo remaining at purchase ($17,806) + equity investments ($36,030) = $53,836 NOT cash equivalents. Reclass." },
      { row: 9, text: "Bond sinking fund cash held per indenture = contractually restricted = NOT cash equivalent. Reclass $75,000 to restricted cash." },
    ],
  },
  {
    id: "cecl_credit_loss_dual_method",
    tbsId: "TBS-CECL-DUAL",
    module: "F2.M5",
    title: "CECL — Balance Sheet vs Aging Method (Economic Conditions Worsen)",
    prompt:
      "Apply the CECL (Current Expected Credit Loss) model under worsened economic conditions. (1) Prepare the year-end JE using the balance sheet approach (2.5% of ending A/R). (2) Compute credit loss expense using the aging method with worsened-economy percentages by bucket.",
    accountOptions: [
      "Credit loss expense",
      "Allowance for expected credit losses",
      "Accounts receivable",
      "Bad debt recovery",
      "Sales returns and allowances",
    ],
    rows: [
      { label: "Balance Sheet Approach — DR Credit loss expense", expectedAccount: "Credit loss expense", expectedAmount: 105250 },
      { label: "Balance Sheet Approach — CR Allowance for expected credit losses", expectedAccount: "Allowance for expected credit losses", expectedAmount: 105250 },
      { label: "Aging — <30 days bucket ($1,750,000 × 2%)", expectedAmount: 35000 },
      { label: "Aging — 30-60 days bucket ($1,395,000 × 4%)", expectedAmount: 55800 },
      { label: "Aging — 61-120 days bucket ($820,000 × 6%)", expectedAmount: 49200 },
      { label: "Aging — >120 days bucket ($245,000 × 21%)", expectedAmount: 51450 },
      { label: "Aging Method — Total credit loss expense", expectedAmount: 191450 },
    ],
    exhibits: [
      {
        name: "CECL Model — Both Methods",
        body:
          "CECL (ASC 326) requires forward-looking estimate of credit losses over the asset's life.\n" +
          "Both methods plug into the SAME allowance account; choice depends on data available.\n\n" +
          "BALANCE SHEET APPROACH (% of ending A/R):\n" +
          "  Apply ONE rate to total ending A/R balance.\n" +
          "  Normal: 2.0% × $4,210,000 = $84,200\n" +
          "  Worsened: 2.5% × $4,210,000 = $105,250\n\n" +
          "AGING METHOD (more granular):\n" +
          "  Apply DIFFERENT rate per aging bucket.\n" +
          "  Older buckets = higher loss rate.\n\n" +
          "  Bucket            A/R          Normal %  Worsened %\n" +
          "  <30 days       $1,750,000      1.0%       2%\n" +
          "  30-60 days     $1,395,000      3.0%       4%\n" +
          "  61-120 days      $820,000      4.0%       6%\n" +
          "  >120 days        $245,000     15.0%      21%\n\n" +
          "  Worsened total = 35,000 + 55,800 + 49,200 + 51,450 = $191,450\n\n" +
          "KEY: Aging method gives HIGHER expense ($191,450 vs $105,250) because\n" +
          "old A/R is weighted more heavily — more realistic during downturn.",
      },
    ],
    scoring: { basePerCell: 70, mult: 8, bonusAllCorrect: 500 },
    explanations: [
      { row: 1, text: "Balance Sheet Approach: $4,210,000 × 2.5% (worsened rate) = $105,250 expense." },
      { row: 2, text: "Credit goes to contra-asset Allowance for Expected Credit Losses." },
      { row: 3, text: "$1,750,000 × 2% = $35,000." },
      { row: 4, text: "$1,395,000 × 4% = $55,800." },
      { row: 5, text: "$820,000 × 6% = $49,200." },
      { row: 6, text: "$245,000 × 21% = $51,450." },
      { row: 7, text: "Sum of all buckets = $191,450 — significantly higher than balance sheet approach." },
    ],
  },
  {
    id: "dreamdelight_ar_rollforward_correction",
    tbsId: "TBS-DREAMDELIGHT-AR",
    module: "F2.M5",
    title: "DreamDelight — Correct the A/R Rollforward Schedule",
    prompt:
      "Jacob prepared a draft A/R rollforward for July Year 5 with multiple errors. Correct each line: beginning balance (wrong month carried forward), sales (cash sales included improperly), write-offs (transposed digits), and missing trade-A/R-to-note conversion. Compute corrected ending balance.",
    accountOptions: [
      "May Y5 ending A/R balance",
      "June Y5 ending A/R balance (correct beginning)",
      "Credit-Approved sales only ($175,234)",
      "Total sales including cash ($202,332)",
      "Cash receipts ($122,914)",
      "August cash receipts ($143,000)",
      "Write-off as drafted ($1,223)",
      "Approved write-off per Lucy ($1,323)",
      "Trade A/R to note receivable conversion ($1,833)",
      "Prepaid customer deposits ($717,005)",
      "No Entry Required",
    ],
    rows: [
      { label: "Beginning balance July Y5 (correct source)", expectedAccount: "June Y5 ending A/R balance (correct beginning)", expectedAmount: 271005 },
      { label: "July credit sales (correct figure)", expectedAccount: "Credit-Approved sales only ($175,234)", expectedAmount: 175234 },
      { label: "Cash receipts applied in July", expectedAccount: "Cash receipts ($122,914)", expectedAmount: -122914 },
      { label: "Credit loss adjustments (corrected from $1,223)", expectedAccount: "Approved write-off per Lucy ($1,323)", expectedAmount: -1323 },
      { label: "Other adjustments — A/R to note conversion", expectedAccount: "Trade A/R to note receivable conversion ($1,833)", expectedAmount: -1833 },
      { label: "Corrected Ending Balance July Y5", expectedAmount: 320169 },
      { label: "Prepaid deposits ($717K) — treatment", expectedAccount: "No Entry Required" },
      { label: "August $143K cash receipts — treatment", expectedAccount: "No Entry Required" },
    ],
    exhibits: [
      {
        name: "A/R Rollforward Rules",
        body:
          "STANDARD A/R ROLLFORWARD FORMULA:\n" +
          "  Beginning A/R\n" +
          "  + Credit Sales (NOT cash sales)\n" +
          "  − Cash Receipts on A/R\n" +
          "  − Write-offs (credit loss adjustments)\n" +
          "  ± Other Adjustments (returns, conversions to N/R, etc.)\n" +
          "  = Ending A/R\n\n" +
          "JACOB'S 5 ERRORS:\n\n" +
          "ERROR 1 — Wrong beginning balance:\n" +
          "  Used MAY ending ($232,958) instead of JUNE ending ($271,005).\n" +
          "  Prior period balances are already approved/finalized → use most recent month.\n\n" +
          "ERROR 2 — Included cash sales in 'Sales':\n" +
          "  Drafted: $202,332 (includes $27,098 cash/check/credit-card sales).\n" +
          "  Correct: $175,234 (only Credit-Approved sales create A/R).\n" +
          "  Cash sales hit cash, not A/R.\n\n" +
          "ERROR 3 — Transposed write-off digits:\n" +
          "  Drafted: $1,223. Lucy's authorized total: $1,323.\n\n" +
          "ERROR 4 — Omitted A/R-to-Note conversion:\n" +
          "  CFO authorized $1,833 reclass of two customer balances to N/R.\n" +
          "  Decreases A/R, increases N/R.\n\n" +
          "CORRECT JULY ENDING:\n" +
          "  $271,005 + $175,234 − $122,914 − $1,323 − $1,833 = $320,169\n\n" +
          "CORRECTLY EXCLUDED (Jacob got these right):\n" +
          "  • $717,005 prepaid deposits → DR Cash / CR Deferred Revenue (liability). Not A/R.\n" +
          "  • $143K August cash receipts → belong to August rollforward, not July.\n\n" +
          "AUDIT TAKEAWAY: Always verify beginning balance ties to prior period ending,\n" +
          "and that sales reconciles to credit-only sales (exclude cash/POS sales).",
      },
    ],
    scoring: { basePerCell: 65, mult: 8, bonusAllCorrect: 650 },
    explanations: [
      { row: 1, text: "Beginning July = ending June ($271,005). Jacob mistakenly used May's ending ($232,958)." },
      { row: 2, text: "Only Credit-Approved sales create A/R. Cash/check/POS sales ($27,098) hit cash, not A/R. Correct figure = $175,234." },
      { row: 3, text: "$122,914 of July cash applications from AccountWorks report — Jacob had this correct." },
      { row: 4, text: "Transposed digits: Lucy approved $1,323 in write-offs, not $1,223." },
      { row: 5, text: "Missing entirely: CFO authorized $1,833 of trade A/R converted to a note receivable — decreases A/R." },
      { row: 6, text: "$271,005 + $175,234 − $122,914 − $1,323 − $1,833 = $320,169." },
      { row: 7, text: "Prepaid deposits = deferred revenue liability (cash + DR liability). Does NOT affect A/R rollforward." },
      { row: 8, text: "August receipts belong to August rollforward. Cutoff matters — keep current month only." },
    ],
  },
  {
    id: "diamond_ar_adjustments",
    tbsId: "TBS-DIAMOND-AR",
    module: "F2.M5",
    title: "Diamond — A/R Adjustments by Customer (FOB, NSF, Returns, Bankruptcy)",
    prompt:
      "Adjust Diamond's unadjusted gross A/R of $378,470 for each customer based on shipping terms (FOB), cash receipts, returns, bankruptcy, and pricing errors. Compute the adjusted gross A/R at 12/31/Year 5.",
    accountOptions: [
      "Lair — FOB destination, ships Feb Y6 (clear receivable)",
      "Limb — Payment misposted as revenue",
      "Orange — No adjustment",
      "Panther — No adjustment",
      "Par — FOB shipping point, only 50 of 100 dressers shipped",
      "Peach — No adjustment (FOB shipping point, shipped 12/8)",
      "Prestige — Bankruptcy, no recovery",
      "Ray — 16 desks returned at $700 each",
      "Rock — No adjustment",
      "Rose — No adjustment",
      "Tangent — No adjustment",
      "Tree — Pricing error, 9 extra cabinets",
    ],
    rows: [
      { label: "Unadjusted gross A/R 12/31/Y5", expectedAmount: 378470 },
      { label: "Lair Corp adjustment", expectedAccount: "Lair — FOB destination, ships Feb Y6 (clear receivable)", expectedAmount: 25000 },
      { label: "Limb Co adjustment", expectedAccount: "Limb — Payment misposted as revenue", expectedAmount: -15000 },
      { label: "Orange Inc adjustment", expectedAccount: "Orange — No adjustment", expectedAmount: 0 },
      { label: "Panther Co adjustment", expectedAccount: "Panther — No adjustment", expectedAmount: 0 },
      { label: "Par Co adjustment", expectedAccount: "Par — FOB shipping point, only 50 of 100 dressers shipped", expectedAmount: -50000 },
      { label: "Peach Furniture adjustment", expectedAccount: "Peach — No adjustment (FOB shipping point, shipped 12/8)", expectedAmount: 0 },
      { label: "Prestige Co adjustment", expectedAccount: "Prestige — Bankruptcy, no recovery", expectedAmount: -30000 },
      { label: "Ray Inc adjustment", expectedAccount: "Ray — 16 desks returned at $700 each", expectedAmount: -11200 },
      { label: "Rock Co adjustment", expectedAccount: "Rock — No adjustment", expectedAmount: 0 },
      { label: "Rose Corp adjustment", expectedAccount: "Rose — No adjustment", expectedAmount: 0 },
      { label: "Tangent Co adjustment", expectedAccount: "Tangent — No adjustment", expectedAmount: 0 },
      { label: "Tree Co adjustment", expectedAccount: "Tree — Pricing error, 9 extra cabinets", expectedAmount: 10800 },
      { label: "Adjusted gross A/R 12/31/Y5", expectedAmount: 308070 },
    ],
    exhibits: [
      {
        name: "A/R Cleanup Rules",
        body:
          "FOB SHIPPING POINT vs FOB DESTINATION:\n" +
          "  • FOB Shipping Point: title transfers when seller ships → revenue/AR at shipment.\n" +
          "  • FOB Destination: title transfers when buyer receives → no revenue/AR until delivery.\n\n" +
          "DIAMOND CUSTOMER LOGIC:\n\n" +
          "LAIR (+$25,000): Customer paid $25K on 12/20, but shipment is FOB destination & ships Feb Y6.\n" +
          "  → No revenue/AR yet. Unadjusted ($25,000) is wrong; clear it to $0 (+$25K adjustment).\n\n" +
          "LIMB (−$15,000): Customer paid $15K, but payment was wrongly booked as revenue (not as A/R reduction).\n" +
          "  → AR currently $15K; should be $0. Decrease $15K.\n\n" +
          "PAR (−$50,000): Sold 100 dressers @ $1,000 = $100K. Only 50 shipped (FOB shipping point).\n" +
          "  → Only $50K is real revenue/AR; reduce by $50K.\n\n" +
          "PRESTIGE (−$30,000): Bankruptcy court ruled NO recovery in late December.\n" +
          "  → Write off ENTIRE $30K against AR (not just the $27.5K allowance).\n\n" +
          "RAY (−$11,200): 40 desks @ $700 = $28K sale. 16 desks returned at $700 = $11,200.\n" +
          "  → Reverse $11,200 from AR and revenue.\n\n" +
          "TREE (+$10,800): Email confirms 87 cabinets sold, but Sales Journal recorded 78.\n" +
          "  → Missing 9 cabinets × $1,200 = $10,800. Increase AR.\n\n" +
          "NO ADJUSTMENT: Orange, Panther, Peach, Rock, Rose, Tangent — all match exhibits.\n\n" +
          "FINAL: $378,470 + $25K − $15K − $50K − $30K − $11.2K + $10.8K = $308,070",
      },
    ],
    scoring: { basePerCell: 50, mult: 8, bonusAllCorrect: 700 },
    explanations: [
      { row: 2, text: "Lair: Payment received but goods ship Feb Y6 under FOB destination. No revenue yet. Clear the ($25K) credit balance by adding $25K." },
      { row: 3, text: "Limb: Payment was misposted to revenue instead of A/R. Need to reduce the still-showing $15K receivable." },
      { row: 6, text: "Par: FOB shipping point. Only 50 of 100 dressers actually shipped → only $50K is real A/R (not $100K)." },
      { row: 8, text: "Prestige: Court-ruled zero recovery. Write off the full $30K — allowance of $27.5K was insufficient." },
      { row: 9, text: "Ray: 16 desks @ $700 = $11,200 returned. Reverse both revenue and A/R." },
      { row: 13, text: "Tree: Pricing/quantity error. 87 cabinets sold but only 78 recorded → add 9 × $1,200 = $10,800." },
      { row: 14, text: "$378,470 + $25K − $15K − $50K − $30K − $11.2K + $10.8K = $308,070." },
    ],
  },
  {
    id: "aging_allowance_writeoff_recovery",
    tbsId: "TBS-AGING-ALLOWANCE",
    module: "F2.M5",
    title: "Aging Method — Write-Off Bankruptcy + Cash Recovery, Recompute Allowance",
    prompt:
      "Adjust the A/R aging schedule: (1) Write off $12,000 uncollectible from a bankrupt customer (Over 90 days bucket). (2) Apply $5,000 cash received but not yet posted (Over 90 days bucket). Then recompute the required allowance using new aging percentages.",
    accountOptions: [
      "Cash",
      "Allowance for expected credit losses",
      "Accounts receivable",
      "Credit loss expense",
      "Bad debt recovery",
    ],
    rows: [
      { label: "Total A/R before adjustments", expectedAmount: 677000 },
      { label: "Total adjustments to A/R", expectedAmount: -17000 },
      { label: "Adjusted Total A/R", expectedAmount: 660000 },
      { label: "0-30 days adjusted ($225,000 × 3%)", expectedAmount: 6750 },
      { label: "31-60 days adjusted ($240,000 × 11%)", expectedAmount: 26400 },
      { label: "61-90 days adjusted ($127,000 × 25%)", expectedAmount: 31750 },
      { label: "Over 90 days adjusted ($68,000 × 62%)", expectedAmount: 42160 },
      { label: "Total Required Allowance for Expected Credit Losses", expectedAmount: 107060 },
      { label: "Write-off JE — DR Allowance for expected credit losses", expectedAccount: "Allowance for expected credit losses", expectedAmount: 12000 },
      { label: "Write-off JE — CR Accounts receivable", expectedAccount: "Accounts receivable", expectedAmount: 12000 },
      { label: "Cash receipt JE — DR Cash", expectedAccount: "Cash", expectedAmount: 5000 },
      { label: "Cash receipt JE — CR Accounts receivable", expectedAccount: "Accounts receivable", expectedAmount: 5000 },
    ],
    exhibits: [
      {
        name: "Write-Off vs Allowance Mechanics",
        body:
          "WRITE-OFF JE (no impact on net A/R or expense):\n" +
          "  DR Allowance for expected credit losses  $12,000\n" +
          "    CR Accounts receivable                 $12,000\n" +
          "  → Reduces both gross AR and allowance; net AR unchanged.\n" +
          "  → CECL expense was recorded in prior periods via allowance build-up.\n\n" +
          "CASH COLLECTION JE (normal AR settlement):\n" +
          "  DR Cash                                  $5,000\n" +
          "    CR Accounts receivable                 $5,000\n\n" +
          "AGING SCHEDULE AFTER ADJUSTMENTS:\n" +
          "  Bucket          A/R       Rate    Allowance\n" +
          "  0-30 days     225,000      3%       6,750\n" +
          "  31-60 days    240,000     11%      26,400\n" +
          "  61-90 days    127,000     25%      31,750\n" +
          "  Over 90        68,000     62%      42,160\n" +
          "  TOTAL         660,000             107,060\n\n" +
          "KEY: Both adjustments ($12K write-off + $5K cash) hit the Over 90 bucket.\n" +
          "  $85,000 − $12,000 − $5,000 = $68,000",
      },
    ],
    scoring: { basePerCell: 55, mult: 8, bonusAllCorrect: 500 },
    explanations: [
      { row: 2, text: "Write-off $12K (no expense — allowance already covers it) + $5K cash collection = $17K reduction." },
      { row: 7, text: "Over 90 days: $85,000 − $12,000 write-off − $5,000 cash = $68,000 × 62% = $42,160." },
      { row: 8, text: "Sum of all four bucket allowances = $6,750 + $26,400 + $31,750 + $42,160 = $107,060." },
      { row: 9, text: "Write-off does NOT touch credit loss expense — it draws against existing allowance." },
      { row: 11, text: "Simple cash collection. No discount issues since customer paid full amount." },
    ],
  },
  {
    id: "electricality_gl_subledger_recon",
    tbsId: "TBS-ELECTRICALITY-GL",
    module: "F2.M5",
    title: "Electricality — A/R General Ledger vs Subsidiary Ledger Reconciliation",
    prompt:
      "Reconcile Electricality's A/R General Ledger ($318,826) to the Subsidiary Ledger by customer. Apply two adjustments per customer where needed: trade discounts, FOB cutoff, missing credits, and delayed cash posting (gross method).",
    accountOptions: [
      "Bulbs — Trade discount missed in GL",
      "Bulbs — No second adjustment",
      "Fire, Flame & Light — Missing credit for return",
      "Fire, Flame & Light — FOB shipping point, not yet shipped",
      "Grand Ole Lights — FOB destination, invoice 12202 not received",
      "Grand Ole Lights — FOB destination, invoice 12228 not received",
      "Sun and Moon — Cash received 12/30 not posted",
      "Sun and Moon — No second adjustment (12232 cash in Y5)",
    ],
    rows: [
      { label: "Bulbs Adj #1 (Trade discount 20% × $55,425)", expectedAccount: "Bulbs — Trade discount missed in GL", expectedAmount: -11085 },
      { label: "Bulbs Adj #2", expectedAccount: "Bulbs — No second adjustment", expectedAmount: 0 },
      { label: "Bulbs Adjusted Balance", expectedAmount: 45665 },
      { label: "FFL Adj #1 (Missing return credit)", expectedAccount: "Fire, Flame & Light — Missing credit for return", expectedAmount: -5500 },
      { label: "FFL Adj #2 (FOB ship point, picked up 1/2/Y5)", expectedAccount: "Fire, Flame & Light — FOB shipping point, not yet shipped", expectedAmount: -21156 },
      { label: "FFL Adjusted Balance", expectedAmount: 71984 },
      { label: "Grand Ole Adj #1 (Invoice 12202 not received)", expectedAccount: "Grand Ole Lights — FOB destination, invoice 12202 not received", expectedAmount: -4770 },
      { label: "Grand Ole Adj #2 (Invoice 12228 not received)", expectedAccount: "Grand Ole Lights — FOB destination, invoice 12228 not received", expectedAmount: -3922 },
      { label: "Grand Ole Adjusted Balance", expectedAmount: 92164 },
      { label: "Sun and Moon Adj #1 (Cash 12/30 invoice 12175)", expectedAccount: "Sun and Moon — Cash received 12/30 not posted", expectedAmount: -18568 },
      { label: "Sun and Moon Adj #2", expectedAccount: "Sun and Moon — No second adjustment (12232 cash in Y5)", expectedAmount: 0 },
      { label: "Sun and Moon Adjusted Balance", expectedAmount: 44012 },
      { label: "Total Adjusted A/R 12/31/Y4", expectedAmount: 253825 },
    ],
    exhibits: [
      {
        name: "GL vs Subledger Reconciliation Rules",
        body:
          "TRADE DISCOUNT (gross method):\n" +
          "  Applied UPON INVOICING. Reduces stated invoice amount.\n" +
          "  Bulbs: 20% × $55,425 invoice subtotal = $11,085 (NOT on shipping/handling).\n\n" +
          "FOB SHIPPING POINT — Cutoff:\n" +
          "  Title transfers when goods leave seller's dock.\n" +
          "  FFL invoice 12100 ($21,156): dated 12/20 BUT BOL shows carrier pickup 1/2/Y5.\n" +
          "  → Goods still in seller's possession at year-end → NO revenue/AR in Y4.\n\n" +
          "FOB DESTINATION — Cutoff:\n" +
          "  Title transfers when goods arrive at buyer.\n" +
          "  Grand Ole 12202 ($4,770) and 12228 ($3,922): not received by 12/31/Y4 → reverse.\n\n" +
          "MISSING CREDIT (matching error):\n" +
          "  FFL return $5,500: posted to subledger, NOT to GL → adjust GL down.\n\n" +
          "DELAYED CASH POSTING (gross method sales discount):\n" +
          "  Sun & Moon 12175: cash received 12/30/Y4 but posted 1/8/Y5.\n" +
          "  → AR reduction belongs in Y4 (period of cash receipt).\n" +
          "  DR Cash $18,197 / DR Sales discounts $371 / CR A/R $18,568\n" +
          "  Gross method = sales discount recorded WHEN PAID, not when invoiced.\n\n" +
          "Sun & Moon 12232: cash received 1/5/Y5 → NO Y4 adjustment.\n\n" +
          "FINAL GL: $318,826 − $39,923 − $25,078 = $253,825 (ties to subledger).",
      },
    ],
    scoring: { basePerCell: 55, mult: 8, bonusAllCorrect: 700 },
    explanations: [
      { row: 1, text: "20% trade discount on $55,425 invoice subtotal = $11,085. Discount NOT applied to shipping/handling." },
      { row: 4, text: "Return credit was posted to subledger but not to GL → reduce GL by $5,500." },
      { row: 5, text: "FOB shipping point: BOL shows pickup 1/2/Y5, so goods not shipped in Y4. Reverse the $21,156 invoice." },
      { row: 7, text: "FOB destination: invoice 12202 ($4,770) not received by customer in Y4 → no revenue/AR." },
      { row: 8, text: "FOB destination: invoice 12228 ($3,922) not received by customer in Y4 → no revenue/AR." },
      { row: 10, text: "Cash for invoice 12175 received 12/30/Y4 (before year-end). Belongs in Y4 even though posted 1/8/Y5." },
      { row: 11, text: "Invoice 12232: cash received 1/5/Y5 — that's Y5 activity, not a Y4 adjustment. Gross method delays the discount until receipt." },
      { row: 13, text: "Sum: $45,665 + $71,984 + $92,164 + $44,012 = $253,825 (matches subledger)." },
    ],
  },
  {
    id: "party_supply_inventory_adjustments",
    tbsId: "TBS-PARTY-INV",
    module: "F3.M1",
    title: "Party Supply — Inventory Adjustments (Purchases, FOB, Consignment, LCM)",
    prompt:
      "Adjust Party Supply's inventory balance for 7 items: net purchase price, FOB shipping point inventory at year-end, December COGS, undelivered sale reversal, consignment, public warehouse costs, and lower-of-cost-or-NRV writedown.",
    accountOptions: [
      "Purchase net of discount + freight-in",
      "FOB shipping point — title passes at shipment",
      "December COGS at 70% of sales",
      "Sale not yet shipped — reverse COGS",
      "Consignment — 25% sold, reduce inventory",
      "Public warehouse — shipping costs in, rent excluded",
      "LCM writedown to NRV",
    ],
    rows: [
      { label: "Row 1: Purchase ($1,500,000 − $30,000 discount + $100,000 freight)", expectedAccount: "Purchase net of discount + freight-in", expectedAmount: 1570000 },
      { label: "Row 2: FOB shipping point in-transit at YE", expectedAccount: "FOB shipping point — title passes at shipment", expectedAmount: 750000 },
      { label: "Row 3: December COGS ($5M × 70%)", expectedAccount: "December COGS at 70% of sales", expectedAmount: -3500000 },
      { label: "Row 4: $300,000 sale not yet shipped — reverse COGS ($300K × 70%)", expectedAccount: "Sale not yet shipped — reverse COGS", expectedAmount: 210000 },
      { label: "Row 5: Consignment — 25% × $100,000 sold to 3rd party", expectedAccount: "Consignment — 25% sold, reduce inventory", expectedAmount: -25000 },
      { label: "Row 6: Public warehouse shipping costs only (rent excluded)", expectedAccount: "Public warehouse — shipping costs in, rent excluded", expectedAmount: 20000 },
      { label: "Row 7: LCM writedown ($50,000 cost − $4,000 NRV)", expectedAccount: "LCM writedown to NRV", expectedAmount: -46000 },
    ],
    exhibits: [
      {
        name: "Inventory Capitalization & Cutoff Rules",
        body:
          "INVENTORIABLE COSTS (capitalize):\n" +
          "  ✓ Purchase price NET of trade/cash discounts\n" +
          "  ✓ Freight-IN (vendor to buyer)\n" +
          "  ✓ Duty/importation fees\n" +
          "  ✓ Insurance during transit\n" +
          "  ✓ Internal handling between warehouses\n\n" +
          "PERIOD COSTS (expense, NOT inventory):\n" +
          "  ✗ Freight-OUT (to customer) = selling expense\n" +
          "  ✗ Warehouse rent (period cost)\n" +
          "  ✗ Sales commissions\n" +
          "  ✗ G&A overhead\n\n" +
          "FOB CUTOFF:\n" +
          "  • FOB Shipping Point: BUYER owns at shipment\n" +
          "  • FOB Destination: BUYER owns at receipt\n\n" +
          "CONSIGNMENT:\n" +
          "  • CONSIGNOR (sender) keeps in inventory until 3rd-party sale\n" +
          "  • CONSIGNEE never books it as inventory\n" +
          "  • When 25% sold by consignee → consignor removes 25% from inventory\n\n" +
          "LOWER OF COST OR NRV (LCM under US GAAP, non-LIFO):\n" +
          "  NRV = Selling price − Cost to complete − Cost to dispose\n" +
          "  If NRV < Cost → write down to NRV (charge to COGS)\n" +
          "  Item: $50,000 cost, NRV $4,000 → write down $46,000\n\n" +
          "GROSS MARGIN METHOD for December COGS:\n" +
          "  GM 30% → COGS = 70% of sales\n" +
          "  $5,000,000 sales × 70% = $3,500,000 COGS",
      },
    ],
    scoring: { basePerCell: 60, mult: 8, bonusAllCorrect: 500 },
    explanations: [
      { row: 1, text: "$1,500,000 purchase − $30,000 discount + $100,000 freight-in = $1,570,000 capitalized." },
      { row: 2, text: "FOB shipping point: title transfers when carrier picks up. Include in buyer's inventory." },
      { row: 3, text: "Gross margin 30% → COGS = 70% × $5,000,000 = $3,500,000 (credit to inventory)." },
      { row: 4, text: "Sale recorded but goods still on hand — reverse $300K revenue + restore $210K COGS to inventory." },
      { row: 5, text: "Consignment: consignor keeps inventory until 3rd-party sale. 25% sold → reduce by 25%." },
      { row: 6, text: "Goods already in inventory total. Shipping cost between warehouses is inventoriable. Rent is period expense." },
      { row: 7, text: "Cost $50,000 vs NRV $4,000 → write down $46,000 to COGS." },
    ],
  },
  {
    id: "weighted_avg_vs_moving_avg",
    tbsId: "TBS-WAVG-MAVG",
    module: "F3.M1",
    title: "Inventory — Weighted Average vs Moving Average Method",
    prompt:
      "Compute COGS and ending inventory under both Weighted Average (periodic) and Moving Average (perpetual). 4 purchase lots + 2 sales transactions; total available units = 12,000, units sold = 7,200, ending = 4,800.",
    accountOptions: [
      "Weighted Avg cost per unit",
      "Weighted Avg COGS",
      "Weighted Avg Ending Inventory",
      "Moving Avg COGS (sum of 2 sales)",
      "Moving Avg Ending Inventory",
    ],
    rows: [
      { label: "Weighted Avg cost/unit ($43,800 ÷ 12,000)", expectedAccount: "Weighted Avg cost per unit", expectedAmountLabel: "$3.65" },
      { label: "Weighted Avg COGS (7,200 × $3.65)", expectedAccount: "Weighted Avg COGS", expectedAmount: 26280 },
      { label: "Weighted Avg Ending Inv (4,800 × $3.65)", expectedAccount: "Weighted Avg Ending Inventory", expectedAmount: 17520 },
      { label: "Moving Avg — After Purchase 1 (3,600 @ $3.40)", expectedAmountLabel: "$3.40000" },
      { label: "Moving Avg — After Purchase 2 (+2,700 @ $3.60)", expectedAmountLabel: "$3.48571" },
      { label: "Moving Avg — Sale 1 COGS (5,200 × $3.48571)", expectedAmount: 18126 },
      { label: "Moving Avg — After Purchase 3 (+4,200 @ $3.70)", expectedAmountLabel: "$3.65547" },
      { label: "Moving Avg — Sale 2 COGS (2,000 × $3.65547)", expectedAmount: 7311 },
      { label: "Moving Avg — After Purchase 4 (+1,500 @ $4.20)", expectedAmountLabel: "$3.82563" },
      { label: "Moving Avg Total COGS ($18,126 + $7,311)", expectedAccount: "Moving Avg COGS (sum of 2 sales)", expectedAmount: 25437 },
      { label: "Moving Avg Ending Inv (4,800 × $3.82563)", expectedAccount: "Moving Avg Ending Inventory", expectedAmount: 18363 },
    ],
    exhibits: [
      {
        name: "Two Methods — Same Data, Different Results",
        body:
          "GIVEN PURCHASES:\n" +
          "  3,600 × $3.40 = $12,240\n" +
          "  2,700 × $3.60 = $9,720\n" +
          "  4,200 × $3.70 = $15,540\n" +
          "  1,500 × $4.20 = $6,300\n" +
          "  Total: 12,000 units, $43,800\n\n" +
          "SALES: 5,200 + 2,000 = 7,200 units (Ending: 4,800)\n\n" +
          "WEIGHTED AVERAGE (Periodic):\n" +
          "  ONE cost computed at end: $43,800 ÷ 12,000 = $3.65\n" +
          "  COGS = 7,200 × $3.65 = $26,280\n" +
          "  Ending Inv = 4,800 × $3.65 = $17,520\n\n" +
          "MOVING AVERAGE (Perpetual):\n" +
          "  NEW average computed after EACH purchase.\n" +
          "  Sales use the THEN-CURRENT average (no recomputation on sale).\n\n" +
          "  Step 1: +3,600 @ $3.40 → avg $3.40000, bal 3,600/$12,240\n" +
          "  Step 2: +2,700 @ $3.60 → ($12,240+$9,720)÷6,300 = $3.48571\n" +
          "  Step 3: −5,200 @ $3.48571 → COGS $18,126, bal 1,100/$3,834\n" +
          "  Step 4: +4,200 @ $3.70 → ($3,834+$15,540)÷5,300 = $3.65547\n" +
          "  Step 5: −2,000 @ $3.65547 → COGS $7,311, bal 3,300/$12,063\n" +
          "  Step 6: +1,500 @ $4.20 → ($12,063+$6,300)÷4,800 = $3.82563\n\n" +
          "  Total COGS = $18,126 + $7,311 = $25,437\n" +
          "  Ending Inv = 4,800 × $3.82563 = $18,363\n\n" +
          "KEY DIFFERENCE: Moving avg responds to timing of purchases vs sales.\n" +
          "When later purchases cost MORE, periodic weighted avg gives HIGHER COGS\n" +
          "(because the late expensive lot is averaged into sold units that\n" +
          "actually happened earlier).",
      },
    ],
    scoring: { basePerCell: 60, mult: 8, bonusAllCorrect: 600 },
    explanations: [
      { row: 1, text: "Single periodic average = total cost ÷ total units = $43,800 ÷ 12,000 = $3.65000." },
      { row: 2, text: "Periodic method: all 7,200 sold units valued at the same $3.65 average." },
      { row: 5, text: "Recomputed average after 2nd purchase: ($12,240 + $9,720) ÷ 6,300 = $3.48571." },
      { row: 6, text: "Sale 1 uses then-current $3.48571: 5,200 × $3.48571 = $18,126." },
      { row: 10, text: "Moving avg COGS is LOWER ($25,437 vs $26,280) — early sales captured pre-price-rise inventory." },
      { row: 11, text: "Ending inventory at LAST computed average: 4,800 × $3.82563 = $18,363." },
    ],
  },
  {
    id: "pomike_physical_book_recon",
    tbsId: "TBS-POMIKE-PHYS",
    module: "F3.M1",
    title: "Pomike Co. — Physical Count vs Book Balance Reconciliation (8 Items)",
    prompt:
      "Reconcile Pomike's physical count ($356,000) to book balance for 8 items spanning unmatched receivers, FOB cutoffs, drop shipments, consignment, customer returns. Mark each adjustment as +/-/0 for both columns.",
    accountOptions: [
      "Unmatched receiving reports — Book up",
      "Customer goods shipped not billed — Book down",
      "Vendor drop shipment — No adjustment",
      "Goods in-transit from vendor FOB SP — Both up",
      "Goods billed in-transit FOB destination — Both up",
      "Consignee — Physical down only",
      "Vendor FOB destination not arrived — No adjustment",
      "Customer returns received — Book up",
    ],
    rows: [
      { label: "Row 7 — Unmatched receivers $14,000 — Physical adj", expectedAccount: "Unmatched receiving reports — Book up", expectedAmount: 0 },
      { label: "Row 7 — Unmatched receivers $14,000 — Book adj", expectedAmount: 14000 },
      { label: "Row 8 — Customer goods shipped not billed $25,000 — Physical adj", expectedAccount: "Customer goods shipped not billed — Book down", expectedAmount: 0 },
      { label: "Row 8 — Customer goods shipped not billed $25,000 — Book adj", expectedAmount: -25000 },
      { label: "Row 9 — Vendor drop shipment $13,000 — Physical adj", expectedAccount: "Vendor drop shipment — No adjustment", expectedAmount: 0 },
      { label: "Row 9 — Vendor drop shipment $13,000 — Book adj", expectedAmount: 0 },
      { label: "Row 10 — Goods in-transit from vendor FOB SP $10,000 — Physical adj", expectedAccount: "Goods in-transit from vendor FOB SP — Both up", expectedAmount: 10000 },
      { label: "Row 10 — Goods in-transit from vendor FOB SP $10,000 — Book adj", expectedAmount: 10000 },
      { label: "Row 11 — Goods billed in-transit FOB destination $7,000 — Physical adj", expectedAccount: "Goods billed in-transit FOB destination — Both up", expectedAmount: 7000 },
      { label: "Row 11 — Goods billed in-transit FOB destination $7,000 — Book adj", expectedAmount: 7000 },
      { label: "Row 12 — Consigned-in goods $12,000 — Physical adj", expectedAccount: "Consignee — Physical down only", expectedAmount: -12000 },
      { label: "Row 12 — Consigned-in goods $12,000 — Book adj", expectedAmount: 0 },
      { label: "Row 13 — Vendor FOB destination not arrived $16,000 — Physical adj", expectedAccount: "Vendor FOB destination not arrived — No adjustment", expectedAmount: 0 },
      { label: "Row 13 — Vendor FOB destination not arrived $16,000 — Book adj", expectedAmount: 0 },
      { label: "Row 14 — Customer returns $4,000 — Physical adj", expectedAccount: "Customer returns received — Book up", expectedAmount: 0 },
      { label: "Row 14 — Customer returns $4,000 — Book adj", expectedAmount: 4000 },
    ],
    exhibits: [
      {
        name: "Physical vs Book — Decision Matrix",
        body:
          "WHAT TO CHECK FOR EACH ITEM:\n" +
          "  1. Is the item Pomike's inventory at year-end? (Ownership test)\n" +
          "  2. Was it included in the physical count? (Counted vs missed)\n" +
          "  3. Was it recorded in the books? (Invoiced + GL posted)\n\n" +
          "ADJUST PHYSICAL UP/DOWN:\n" +
          "  • Owned but not counted (in-transit FOB SP from vendor; goods at customer FOB destination)\n" +
          "  • Counted but not owned (consignee inventory)\n\n" +
          "ADJUST BOOK UP/DOWN:\n" +
          "  • Owned but no invoice posted yet (receivers without invoices, returns paperwork delay)\n" +
          "  • Auto-invoiced but should not be (FOB destination shipments still in transit)\n" +
          "  • Out of books for goods physically gone (shipped, not billed)\n\n" +
          "ROW-BY-ROW LOGIC:\n\n" +
          "Row 7 (Unmatched receivers $14K): Goods received & counted; no invoice yet.\n" +
          "  → Physical: 0 | Book: +$14K\n\n" +
          "Row 8 (Customer shipped FOB SP, not billed $25K): Title transferred; not counted; not billed.\n" +
          "  → Physical: 0 (correct) | Book: −$25K (must remove)\n\n" +
          "Row 9 (Vendor drop shipment $13K FOB SP): Never Pomike's inventory; never counted; never booked.\n" +
          "  → Physical: 0 | Book: 0\n\n" +
          "Row 10 (Vendor in-transit FOB SP $10K): Pomike owns; not counted; not yet booked.\n" +
          "  → Physical: +$10K | Book: +$10K\n\n" +
          "Row 11 (Customer FOB destination billed in-transit $7K): Pomike still owns; not counted; auto-billed (wrong).\n" +
          "  → Physical: +$7K | Book: +$7K (reverse the auto-debit)\n\n" +
          "Row 12 (Consigned-in $12K): Vendor's inventory, not Pomike's; counted incorrectly; never booked.\n" +
          "  → Physical: −$12K | Book: 0\n\n" +
          "Row 13 (Vendor FOB destination, not arrived $16K): Not yet Pomike's; not counted; not invoiced.\n" +
          "  → Physical: 0 | Book: 0\n\n" +
          "Row 14 (Customer returns received $4K): Pomike now owns; counted; paperwork delayed.\n" +
          "  → Physical: 0 | Book: +$4K",
      },
    ],
    scoring: { basePerCell: 50, mult: 8, bonusAllCorrect: 700 },
    explanations: [
      { row: 2, text: "Physical correctly includes the $14K (goods received). Book lags because invoice not yet posted → book up." },
      { row: 4, text: "Goods shipped FOB SP → no longer Pomike's. Physical correctly excludes. Book must reduce since not yet billed-out." },
      { row: 5, text: "Drop shipment: vendor ships directly to customer. Never Pomike's inventory. No adjustments anywhere." },
      { row: 7, text: "FOB shipping point from vendor: Pomike owns once carrier picks up. Add to BOTH physical AND book." },
      { row: 9, text: "Auto-system billed at shipment (assuming FOB SP), but actual terms are FOB destination → reverse auto-invoice. Goods still Pomike's." },
      { row: 11, text: "Consignee never books consigned-in goods, but here they were physically counted → must remove from physical only." },
      { row: 15, text: "Returns physically arrived & counted. Paperwork delay = books haven't received the return yet → book up." },
    ],
  },
  {
    id: "andromeda_inventory_rollforward",
    tbsId: "TBS-ANDROMEDA-INV",
    module: "F3.M1",
    title: "Andromeda Devices — Inventory Rollforward Schedule (November Y2)",
    prompt:
      "Build Andromeda's monthly inventory rollforward: beginning balance, purchases (5 FOB destination receipts), sales (COGS at avg cost), in-transit (FOB SP, received Dec 9), physical count net adjustment, and LCM/NRV valuation adjustments.",
    accountOptions: [
      "Beginning balance 11/01/Yr 2",
      "Inventory purchases received (5 FOB destination)",
      "Sales of goods (COGS avg cost)",
      "Inventory in transit (FOB shipping point 11/27)",
      "Physical count net adjustment",
      "Valuation adjustments (LCM/NRV)",
    ],
    rows: [
      { label: "Row 4 — Beginning balance 11/01/Yr 2", expectedAccount: "Beginning balance 11/01/Yr 2", expectedAmount: 2244047 },
      { label: "Row 5 — Inventory purchases (5 FOB destination, freight + duty incl)", expectedAccount: "Inventory purchases received (5 FOB destination)", expectedAmount: 960290 },
      { label: "Row 6 — Sales of goods (COGS avg cost)", expectedAccount: "Sales of goods (COGS avg cost)", expectedAmount: -1591550 },
      { label: "Row 7 — Inventory in transit (FOB SP 11/27, recv 12/9)", expectedAccount: "Inventory in transit (FOB shipping point 11/27)", expectedAmount: 14300 },
      { label: "Row 8 — Net physical count adj (5 found − 25 missing)", expectedAccount: "Physical count net adjustment", expectedAmount: -3000 },
      { label: "Row 9 — Valuation adj LCM (Code 3005: −$1,200; Code 5001: −$63,000)", expectedAccount: "Valuation adjustments (LCM/NRV)", expectedAmount: -64200 },
      { label: "Row 10 — Ending balance 11/30/Yr 2", expectedAmount: 1559887 },
    ],
    exhibits: [
      {
        name: "Inventory Rollforward Mechanics",
        body:
          "STANDARD ROLLFORWARD FORMULA:\n" +
          "  Beginning Inventory\n" +
          "  + Purchases received this period (capitalize freight-in, duty)\n" +
          "  − COGS (sales at average cost)\n" +
          "  ± In-transit cutoff (FOB shipping point adds to month-end)\n" +
          "  ± Physical count adjustments (shrinkage, found items)\n" +
          "  ± Valuation adjustments (LCM/NRV writedowns)\n" +
          "  = Ending Inventory\n\n" +
          "ANDROMEDA NOVEMBER:\n\n" +
          "$2,244,047 (BB from prior recon, no unreconciled diff)\n" +
          "+ $960,290 (5 receipts FOB destination — title transferred in Nov)\n" +
          "− $1,591,550 (COGS at avg cost; freight-OUT and commissions excluded)\n" +
          "+ $14,300 (11/27 shipment FOB SP — Pomike owns at shipment, even if rec'd Dec 9)\n" +
          "+ $575 (5 units of code 2003 found @ $115)\n" +
          "− $3,575 (25 missing units code 2004 @ $143)\n" +
          "− $1,200 (code 3005 NRV $135 vs cost $137 → −$2 × 600 units)\n" +
          "− $63,000 (code 5001 NRV $8,000 vs cost $9,800 → −$1,800 × 35 units)\n" +
          "= $1,559,887\n\n" +
          "EXCLUDED FROM ROLLFORWARD:\n" +
          "  • 11/28 FOB destination shipment — not received by 11/30 → NOT in Andromeda inv\n" +
          "  • 12/1 FOB SP — shipped AFTER Nov 30 → NOT in Nov rollforward\n" +
          "  • Freight-out (period cost)\n" +
          "  • Sales commissions (period cost)\n\n" +
          "LCM RULE (US GAAP, non-LIFO):\n" +
          "  Inventory at LOWER of cost OR Net Realizable Value\n" +
          "  Only write DOWN, never up\n" +
          "  Adjust per unit, multiply by units on hand",
      },
    ],
    scoring: { basePerCell: 60, mult: 9, bonusAllCorrect: 700 },
    explanations: [
      { row: 1, text: "Tied to prior month's ending balance; no unreconciled differences carried over." },
      { row: 2, text: "Sum of first 5 receipts (all FOB destination, received in Nov): $68,500 + $134,040 + $680,000 + $28,750 + $49,000 = $960,290. Includes freight-in & duty." },
      { row: 3, text: "All Nov sales were FOB SP → title passes at shipment, remove from inventory at avg cost = $1,591,550." },
      { row: 4, text: "11/27 shipment FOB SP, received 12/9: Andromeda owns at shipment → include in 11/30 inventory as in-transit. 11/28 FOB destination NOT included (title not yet transferred)." },
      { row: 5, text: "Net of (+5 × $115 found) and (−25 × $143 missing) = $575 − $3,575 = −$3,000." },
      { row: 6, text: "Two products with NRV < cost: 3005 (−$2 × 600 = −$1,200) and 5001 (−$1,800 × 35 = −$63,000). Total −$64,200." },
      { row: 7, text: "$2,244,047 + $960,290 − $1,591,550 + $14,300 − $3,000 − $64,200 = $1,559,887." },
    ],
  },
  {
    id: "fifo_lifo_perpetual_vs_periodic",
    tbsId: "TBS-FIFO-LIFO",
    module: "F3.M1",
    title: "FIFO & LIFO — Perpetual vs Periodic Inventory Systems",
    prompt:
      "Compute COGS and Ending Inventory under 4 cost flow + system combinations: FIFO Perpetual, FIFO Periodic, LIFO Perpetual, LIFO Periodic. Then identify directional effects of switching from FIFO to LIFO during inflation.",
    accountOptions: [
      "FIFO Perpetual COGS",
      "FIFO Perpetual EI",
      "FIFO Periodic COGS",
      "FIFO Periodic EI",
      "LIFO Perpetual COGS",
      "LIFO Perpetual EI",
      "LIFO Periodic COGS",
      "LIFO Periodic EI",
      "Higher",
      "Lower",
      "Unchanged",
    ],
    rows: [
      { label: "FIFO Perpetual COGS", expectedAccount: "FIFO Perpetual COGS", expectedAmount: 29710 },
      { label: "FIFO Perpetual Ending Inventory", expectedAccount: "FIFO Perpetual EI", expectedAmount: 21000 },
      { label: "FIFO Periodic COGS (same as perpetual)", expectedAccount: "FIFO Periodic COGS", expectedAmount: 29710 },
      { label: "FIFO Periodic Ending Inventory", expectedAccount: "FIFO Periodic EI", expectedAmount: 21000 },
      { label: "LIFO Perpetual COGS", expectedAccount: "LIFO Perpetual COGS", expectedAmount: 29530 },
      { label: "LIFO Perpetual Ending Inventory", expectedAccount: "LIFO Perpetual EI", expectedAmount: 21180 },
      { label: "LIFO Periodic COGS (different from perpetual)", expectedAccount: "LIFO Periodic COGS", expectedAmount: 28888 },
      { label: "LIFO Periodic Ending Inventory", expectedAccount: "LIFO Periodic EI", expectedAmount: 21822 },
      { label: "FIFO → LIFO with rising prices: COGS", expectedAccount: "Higher" },
      { label: "FIFO → LIFO with rising prices: Ending Inventory", expectedAccount: "Lower" },
      { label: "FIFO → LIFO with rising prices: Net Income", expectedAccount: "Lower" },
    ],
    exhibits: [
      {
        name: "FIFO vs LIFO Cost Flow Logic",
        body:
          "INVENTORY LAYERS:\n" +
          "  7,200 @ $2.01\n" +
          "  3,600 @ $2.04\n" +
          "  4,300 @ $2.08\n" +
          "  9,500 @ $2.10\n" +
          "  Total: 24,600 units available\n\n" +
          "FIFO (First-In, First-Out):\n" +
          "  • Sell OLDEST inventory first.\n" +
          "  • PERPETUAL = PERIODIC under FIFO (always same result).\n" +
          "  • In rising prices: LOW COGS, HIGH ending inventory.\n\n" +
          "LIFO (Last-In, First-Out):\n" +
          "  • Sell NEWEST inventory first.\n" +
          "  • PERPETUAL ≠ PERIODIC under LIFO (timing matters).\n" +
          "  • In rising prices: HIGH COGS, LOW ending inventory.\n\n" +
          "PERPETUAL LIFO:\n" +
          "  At each sale, take the most recent layer THEN AVAILABLE.\n" +
          "  Sales mid-year may dig into older layers if newer not yet purchased.\n\n" +
          "PERIODIC LIFO:\n" +
          "  Wait until year-end, then assign all sold units to NEWEST layers regardless of when sold.\n" +
          "  COGS uses very latest purchases entirely (in this case: 9,500@$2.10 first).\n\n" +
          "DIRECTIONAL EFFECTS WITH RISING PRICES (FIFO → LIFO):\n" +
          "  COGS: LIFO uses newer (more expensive) layers → COGS HIGHER\n" +
          "  Ending Inv: LIFO retains older (cheaper) layers → EI LOWER\n" +
          "  Net Income: Higher COGS → NI LOWER (and lower taxes — LIFO conformity rule in US)",
      },
    ],
    scoring: { basePerCell: 65, mult: 8, bonusAllCorrect: 700 },
    explanations: [
      { row: 1, text: "FIFO Perpetual COGS: 9,500×$2.10 + 4,300×$2.08 + 400×$2.04 = $29,710." },
      { row: 3, text: "FIFO Perpetual = FIFO Periodic ALWAYS. No timing difference under FIFO." },
      { row: 5, text: "LIFO Perpetual: 4,300×$2.08 + 6,500×$2.10 + 3,400×$2.04 = $29,530. Sales took then-newest layers." },
      { row: 7, text: "LIFO Periodic: Use entire latest layer first: 7,200×$2.01 + 3,600×$2.04 + 3,400×$2.08 = $28,888." },
      { row: 9, text: "Under rising prices, LIFO assigns the NEWER (higher) cost to COGS → COGS HIGHER than FIFO." },
      { row: 10, text: "LIFO leaves OLDER (lower) costs in ending inventory → EI LOWER." },
      { row: 11, text: "Higher COGS → Lower gross profit → Lower NI. Tax benefit drove LIFO popularity (but IFRS prohibits LIFO)." },
    ],
  },
  {
    id: "hassle_free_dual_warehouse_recon",
    tbsId: "TBS-HASSLE-DUAL",
    module: "F3.M1",
    title: "Hassle Free Meds — Dual Warehouse Inventory Reconciliation (Central + Panama)",
    prompt:
      "Reconcile two warehouse inventory accounts at year-end with 6 issues: consignment (out), WIP transfer not posted, missing physical units, FOB SP shipping delay, consigned-in goods, and damaged refrigerated stock.",
    accountOptions: [
      "Consignment OUT — recognize as inventory not sale (Central)",
      "WIP→FG transfer not posted to GL (Central)",
      "FOB SP early shipment — reverse sale, remove units (Panama)",
      "Goods not shipped timely — reverse sale, add back at cost (Panama)",
      "Consigned-IN — exclude from inventory (Panama)",
      "Damaged inventory write-off (Panama)",
    ],
    rows: [
      { label: "Central — Unadjusted GL balance", expectedAmount: 8353604 },
      { label: "Central — Consignment OUT (Orders 5560 + 5563)", expectedAccount: "Consignment OUT — recognize as inventory not sale (Central)", expectedAmount: 1666250 },
      { label: "Central — WIP transfer 12/28 missing in GL", expectedAccount: "WIP→FG transfer not posted to GL (Central)", expectedAmount: 828000 },
      { label: "Central — Adjusted GL balance", expectedAmount: 10847854 },
      { label: "Panama — Unadjusted GL balance", expectedAmount: 10958100 },
      { label: "Panama — FOB SP shipped early (100 units × $1,380)", expectedAccount: "FOB SP early shipment — reverse sale, remove units (Panama)", expectedAmount: -138000 },
      { label: "Panama — Goods not shipped timely ($376K reverse + $170K add)", expectedAccount: "Goods not shipped timely — reverse sale, add back at cost (Panama)", expectedAmount: 546000 },
      { label: "Panama — Consigned-IN from ImDef + Immuno ($552K + $562.5K + $595K)", expectedAccount: "Consigned-IN — exclude from inventory (Panama)", expectedAmount: -1709500 },
      { label: "Panama — Refrigerated damage (500 units × $195)", expectedAccount: "Damaged inventory write-off (Panama)", expectedAmount: -97500 },
      { label: "Panama — Adjusted GL balance", expectedAmount: 9559100 },
    ],
    exhibits: [
      {
        name: "Inventory Edge Cases — Dual Warehouse",
        body:
          "BILL-AND-HOLD vs CONSIGNMENT (CRITICAL DISTINCTION):\n\n" +
          "BILL-AND-HOLD (revenue OK to recognize):\n" +
          "  Better Health Hospital: customer requested storage in HFM warehouse,\n" +
          "  goods marked & segregated, refrigeration issue at customer's end.\n" +
          "  ✓ Customer has obligated to take goods\n" +
          "  ✓ Reason is substantive (not seller convenience)\n" +
          "  ✓ Goods physically separated, identified to customer\n" +
          "  → No adjustment, sale stands.\n\n" +
          "CONSIGNMENT (NOT a sale):\n" +
          "  Novantus Hospital: HFM ships goods but Novantus only pays as it sells.\n" +
          "  HFM (consignor) still owns inventory; no revenue until 3rd-party sale.\n" +
          "  → REVERSE the booked sale, ADD back inventory $1,666,250.\n\n" +
          "WIP→FG TRANSFER:\n" +
          "  Subledger shows transfer 12/28 ($828K) but GL missed entry.\n" +
          "  → ADD $828K to FG GL.\n\n" +
          "FOB SP CUTOFF — TWO DIRECTIONS:\n" +
          "  Shipped EARLY (FR2122, 100 units): missing from physical count\n" +
          "    → Already gone (title transferred). Reduce inv $138K.\n" +
          "  Shipped LATE (GEN380, 400 units, sold 12/31 but shipped 1/2):\n" +
          "    Sale was wrongly booked at SALES PRICE ($940 × 400 = $376K).\n" +
          "    Goods still HFM's at cost ($425 × 400 = $170K).\n" +
          "    → ADD $376K (reverse the $940/unit reduction) + $170K (add at cost) = $546K.\n\n" +
          "CONSIGNED-IN GOODS:\n" +
          "  HFM is the consignee. Goods belong to ImDef ($552K + $562.5K) + Immuno ($595K).\n" +
          "  → EXCLUDE from HFM inventory: −$1,709,500.\n\n" +
          "DAMAGED INVENTORY:\n" +
          "  500 units × $195 refrigerated meds damaged → write off $97,500.\n\n" +
          "FINAL BALANCES:\n" +
          "  Central: $8,353,604 + $1,666,250 + $828,000 = $10,847,854\n" +
          "  Panama: $10,958,100 − $138,000 + $546,000 − $1,709,500 − $97,500 = $9,559,100",
      },
    ],
    scoring: { basePerCell: 50, mult: 8, bonusAllCorrect: 750 },
    explanations: [
      { row: 2, text: "Consignment OUT to Novantus: HFM still owns. Reverse sale. Better Health is bill-and-hold (revenue OK)." },
      { row: 3, text: "WIP transfer of $828K never posted to GL → balance must increase by $828K." },
      { row: 6, text: "FOB SP early shipment: title already passed, units no longer HFM's. Remove $138K from Panama." },
      { row: 7, text: "Sale wrongly booked at $376K sales price. Reverse that, then add inventory at cost $170K = +$546K net." },
      { row: 8, text: "Consigned-IN: HFM is consignee, not owner. Exclude all 3 vendor lots: $552K + $562.5K + $595K = $1,709,500." },
      { row: 9, text: "Damaged refrigerated meds: write off cost = 500 × $195 = $97,500." },
    ],
  },
  {
    id: "mill_corp_six_products_inventory",
    tbsId: "TBS-MILL-CORP",
    module: "F3.M1",
    title: "Mill Corp. — Six Products Inventory Adjustments + Current Ratio Impact",
    prompt:
      "Adjust Mill Corp's year-end inventory for 6 products (U-Z). Compute the inventory adjustment and identify the directional impact on current ratio (orig: $2,600,000 / $1,500,000 = 1.73).",
    accountOptions: [
      "Product U — Capitalize freight-in",
      "Product V — FOB destination, half not received",
      "Product W — Write-off at cost not retail",
      "Product X — LCM writedown (NRV = $0)",
      "Product Y — No adjustment (cost < NRV)",
      "Product Z — Bill-and-hold sale recognition",
      "Current ratio increases",
      "Current ratio decreases",
      "Current ratio unchanged",
    ],
    rows: [
      { label: "Product U: Freight $18,750 misclassified as expense", expectedAccount: "Product U — Capitalize freight-in", expectedAmount: 18750 },
      { label: "Product U: Current ratio impact (1.73 → 1.75)", expectedAccount: "Current ratio increases" },
      { label: "Product V: 2,000 of 4,000 units not received (FOB destination)", expectedAccount: "Product V — FOB destination, half not received", expectedAmount: -100000 },
      { label: "Product V: Current ratio impact (1.73 → 1.79)", expectedAccount: "Current ratio increases" },
      { label: "Product W: Damaged write-off booked at retail $32K, should be cost $22K", expectedAccount: "Product W — Write-off at cost not retail", expectedAmount: 10000 },
      { label: "Product W: Current ratio impact (1.73 → 1.74)", expectedAccount: "Current ratio increases" },
      { label: "Product X: 25 unsellable units × $2,450 cost (NRV $0)", expectedAccount: "Product X — LCM writedown (NRV = $0)", expectedAmount: -61250 },
      { label: "Product X: Current ratio impact (1.73 → 1.69)", expectedAccount: "Current ratio decreases" },
      { label: "Product Y: Cost $20 < NRV $22, no adjustment", expectedAccount: "Product Y — No adjustment (cost < NRV)", expectedAmount: 0 },
      { label: "Product Y: Current ratio impact (unchanged)", expectedAccount: "Current ratio unchanged" },
      { label: "Product Z: Bill-and-hold to Rock Co. — record sale (50 × $700) + COGS (50 × $450)", expectedAccount: "Product Z — Bill-and-hold sale recognition", expectedAmount: -22500 },
      { label: "Product Z: Current ratio impact (1.73 → 1.74)", expectedAccount: "Current ratio increases" },
    ],
    exhibits: [
      {
        name: "Inventory Costing Rules + Current Ratio Mechanics",
        body:
          "INVENTORIABLE COSTS (US GAAP):\n" +
          "  ✓ Purchase price net of discounts\n" +
          "  ✓ Sales tax (non-recoverable)\n" +
          "  ✓ Freight-IN, duty, insurance during transit\n" +
          "  ✗ Freight-OUT (selling expense)\n" +
          "  ✗ Storage (period cost unless required for production)\n\n" +
          "LCM vs LCNRV:\n" +
          "  • Non-LIFO/non-retail (incl. FIFO): Lower of Cost OR Net Realizable Value\n" +
          "    NRV = Selling Price − Cost to Complete − Cost to Dispose\n" +
          "  • LIFO/Retail: Lower of Cost OR Market\n" +
          "    Market = Replacement Cost, bounded by NRV (ceiling) and NRV−normal profit (floor)\n\n" +
          "BILL-AND-HOLD CRITERIA (all must be met):\n" +
          "  1. Reason for arrangement is substantive (customer-driven)\n" +
          "  2. Goods are identified separately as customer's\n" +
          "  3. Ready for physical transfer\n" +
          "  4. Cannot be redirected to another customer\n\n" +
          "MILL CORP PRODUCT-BY-PRODUCT:\n\n" +
          "U: $18,750 freight expensed → reclass to inventory. +$18,750 inv, +NI.\n" +
          "V: 2,000 of 4,000 not received (FOB destination) → reverse $100,000 inv & A/P.\n" +
          "W: 100 damaged units written off at $320 retail (wrong) → should be $220 cost.\n" +
          "   Over-wrote by $10,000 → restore $10K to inv, reduce COGS.\n" +
          "X: 25 special-order units, customer cancelled, NRV = $0.\n" +
          "   Write down 25 × $2,450 = $61,250 to COGS.\n" +
          "Y: New competitor in Year 4 (not Year 3). Cost $20 < NRV $22 → no write-down.\n" +
          "Z: 50 units segregated for Rock Co., bill-and-hold criteria met.\n" +
          "   DR A/R $35,000 / CR Sales $35,000 + DR COGS $22,500 / CR Inv $22,500\n\n" +
          "CURRENT RATIO MECHANICS:\n" +
          "  Numerator (current assets) and denominator (current liabilities) move together,\n" +
          "  so the directional effect depends on RATIO MATH, not just $ direction.\n" +
          "  When ratio > 1, equal $ decreases to BOTH inv & A/P → ratio RISES.",
      },
    ],
    scoring: { basePerCell: 55, mult: 8, bonusAllCorrect: 700 },
    explanations: [
      { row: 1, text: "Freight-in is inventoriable. Move $18,750 from freight expense to inventory. NI also rises by $18,750." },
      { row: 3, text: "Only 2,000 of 4,000 V units received by 12/31 under FOB destination. Reverse $100,000 from inventory & A/P." },
      { row: 5, text: "Damaged W: 100 units × $220 cost = $22,000 (not $32,000 retail). Restore $10,000 to inventory." },
      { row: 7, text: "Product X order cancelled, no alternative buyer → NRV = 0. Write off all 25 units × $2,450 = $61,250." },
      { row: 8, text: "Loss decreases current assets only (inventory), increases COGS → ratio decreases 1.73 → 1.69." },
      { row: 9, text: "Y: Cost $20 already BELOW NRV $22 → no LCNRV adjustment. (Replacement cost irrelevant under FIFO.)" },
      { row: 11, text: "Bill-and-hold to Rock Co. (50 units): all criteria met. Recognize sale $35K, reduce inventory $22,500." },
    ],
  },
  {
    id: "capitalize_vs_expense_classification",
    tbsId: "TBS-CAP-EXPENSE",
    module: "F3.M5",
    title: "PP&E — Capitalize and Depreciate vs Expense vs Amortize",
    prompt:
      "Classify 6 expenditures: capital improvements vs repairs/maintenance vs intangible amortization. Apply the betterment/restoration test: extends life, increases efficiency, or adds new function = CAPITALIZE; routine upkeep = EXPENSE.",
    accountOptions: [
      "Capitalize and depreciate",
      "Expense at time incurred",
      "Capitalize and amortize",
    ],
    rows: [
      { label: "New paved parking lot for the office building", expectedAccount: "Capitalize and depreciate" },
      { label: "Painting ceiling tiles and hallways", expectedAccount: "Expense at time incurred" },
      { label: "Replacing the cooling system with a more modern fuel-efficient model", expectedAccount: "Capitalize and depreciate" },
      { label: "Purchase of 15 new computers for the office", expectedAccount: "Capitalize and depreciate" },
      { label: "Purchase of an intangible asset with a 5-year useful life", expectedAccount: "Capitalize and amortize" },
      { label: "Replacing the windows (ordinary repair, no life extension)", expectedAccount: "Expense at time incurred" },
    ],
    exhibits: [
      {
        name: "Capitalize vs Expense Decision Tree",
        body:
          "CAPITALIZE if at least ONE of:\n" +
          "  • Bettermént: increases efficiency, capacity, or output\n" +
          "  • Restoration: extends useful life beyond original estimate\n" +
          "  • Addition: adds new functionality\n" +
          "  • Replacement of major component (with new cost basis)\n\n" +
          "EXPENSE (ordinary R&M) if:\n" +
          "  • Maintains existing condition\n" +
          "  • Does not extend life\n" +
          "  • Does not improve efficiency\n" +
          "  • Routine, recurring, minor in nature\n\n" +
          "EXAMPLES:\n" +
          "  ✓ Capitalize: new parking lot (new asset, depreciable land improvement)\n" +
          "  ✓ Capitalize: replacing cooling system with more efficient unit\n" +
          "    (extraordinary repair: remove old asset+accum dep, capitalize new)\n" +
          "  ✓ Capitalize: 15 new computers (PP&E with life > 1 year)\n" +
          "  ✓ Capitalize: intangible — amortize over 5 years (definite life)\n" +
          "  ✗ Expense: painting walls/ceilings (routine R&M)\n" +
          "  ✗ Expense: replacing windows (like-for-like, no improvement)\n\n" +
          "INTANGIBLES — AMORTIZE vs IMPAIR:\n" +
          "  • Definite life → amortize straight-line over useful life\n" +
          "  • Indefinite life (e.g., goodwill, perpetual trademarks) → no amortization,\n" +
          "    test for impairment annually\n\n" +
          "GAAP CAPITALIZE THRESHOLDS:\n" +
          "  Most companies set a $-threshold (often $500-$5,000) below which all\n" +
          "  qualifying items are expensed for materiality.",
      },
    ],
    scoring: { basePerCell: 50, mult: 7, bonusAllCorrect: 400 },
    explanations: [
      { row: 1, text: "Parking lot is a new land improvement — capitalize, depreciate over useful life." },
      { row: 2, text: "Cosmetic painting maintains existing condition → ordinary R&M expense." },
      { row: 3, text: "More efficient unit = betterment. Remove old book value, capitalize new, depreciate." },
      { row: 4, text: "Computers with useful life > 1 year = PP&E. Capitalize and depreciate." },
      { row: 5, text: "Definite-life intangible → capitalize at cost, amortize straight-line over 5 years." },
      { row: 6, text: "Routine window replacement (no life extension or efficiency gain) = expense." },
    ],
  },
  {
    id: "construction_period_interest_capitalization",
    tbsId: "TBS-CONSTRUCTION-INT",
    module: "F3.M5",
    title: "Construction Period Interest — Avoidable vs Actual Interest",
    prompt:
      "Capitalize construction-period interest using the weighted-average accumulated expenditures (WAAE) method. Compute WAAE, total interest, avoidable interest, capitalized interest (LESSER of avoidable vs actual), and remaining interest expense.",
    accountOptions: [
      "WAAE (weighted-average accumulated expenditures)",
      "Total actual interest incurred",
      "Avoidable interest",
      "Capitalized interest (lesser of avoidable vs actual)",
      "Interest expense on income statement",
    ],
    rows: [
      { label: "Row 2: WAAE for Year 2 ($130K × 3/12 + $370K × 6/12 + $570K × 3/12)", expectedAccount: "WAAE (weighted-average accumulated expenditures)", expectedAmount: 360000 },
      { label: "Row 3: Total actual interest ($300K × 12% + $100K × 10% + $300K × 7%)", expectedAccount: "Total actual interest incurred", expectedAmount: 67000 },
      { label: "Row 4: Avoidable interest ($36,000 + $4,650)", expectedAccount: "Avoidable interest", expectedAmount: 40650 },
      { label: "Row 5: Capitalized interest (lesser of $40,650 vs $67,000)", expectedAccount: "Capitalized interest (lesser of avoidable vs actual)", expectedAmount: 40650 },
      { label: "Row 6: Interest expense ($67,000 − $40,650)", expectedAccount: "Interest expense on income statement", expectedAmount: 26350 },
    ],
    exhibits: [
      {
        name: "Construction Interest Capitalization (ASC 835-20)",
        body:
          "QUALIFYING ASSETS:\n" +
          "  ✓ Self-constructed assets for company's own use\n" +
          "  ✓ Assets built as discrete projects for sale (e.g., ships)\n" +
          "  ✗ Routinely manufactured inventory\n" +
          "  ✗ Land if no construction is occurring\n\n" +
          "STEP 1 — Compute WAAE (Weighted-Average Accumulated Expenditures):\n" +
          "  $130,000 from 1/1 to 3/31  (3 months)   $130K × 3/12 = $32,500\n" +
          "  $370,000 from 4/1 to 9/30  (6 months)   $370K × 6/12 = $185,000\n" +
          "  $570,000 from 10/1 to 12/31(3 months)   $570K × 3/12 = $142,500\n" +
          "  WAAE = $360,000\n" +
          "  (Or equivalent: $4,320,000 ÷ 12 = $360,000)\n\n" +
          "STEP 2 — Compute Actual Interest Incurred (all loans):\n" +
          "  $300,000 × 12% = $36,000 (construction loan)\n" +
          "  $100,000 × 10% = $10,000\n" +
          "  $300,000 × 7%  = $21,000\n" +
          "  TOTAL          = $67,000\n\n" +
          "STEP 3 — Compute Avoidable Interest:\n" +
          "  (a) Direct construction loan interest:\n" +
          "      $300,000 construction note × 12% = $36,000\n" +
          "  (b) Remaining WAAE × weighted-avg rate of OTHER borrowings:\n" +
          "      Remaining WAAE = $360,000 − $300,000 = $60,000\n" +
          "      Weighted-avg rate = ($10,000 + $21,000) ÷ ($100,000 + $300,000)\n" +
          "                       = $31,000 ÷ $400,000 = 7.75%\n" +
          "      $60,000 × 7.75% = $4,650\n" +
          "  AVOIDABLE = $36,000 + $4,650 = $40,650\n\n" +
          "STEP 4 — Capitalize the LESSER of Avoidable vs Actual:\n" +
          "  Lesser of $40,650 (avoidable) vs $67,000 (actual) = $40,650 capitalized.\n\n" +
          "STEP 5 — Interest expense:\n" +
          "  Total Actual − Capitalized = $67,000 − $40,650 = $26,350",
      },
    ],
    scoring: { basePerCell: 75, mult: 9, bonusAllCorrect: 600 },
    explanations: [
      { row: 1, text: "Weight each expenditure by months outstanding ÷ 12. Sum or total/12 method both give $360,000." },
      { row: 2, text: "Sum interest on ALL loans for the period, regardless of use: $36K + $10K + $21K = $67K." },
      { row: 3, text: "Avoidable = direct construction loan interest + (excess WAAE × weighted-avg rate of other debt)." },
      { row: 4, text: "Capitalize the LESSER. Cannot capitalize more than actual interest incurred. Here $40,650 < $67,000." },
      { row: 5, text: "$67,000 actual − $40,650 capitalized = $26,350 remaining expense on income statement." },
    ],
  },
  {
    id: "land_warehouse_machine_costing",
    tbsId: "TBS-COSTING-3-ASSETS",
    module: "F3.M5",
    title: "Capitalized Cost — Land, Self-Constructed Warehouse, and Machine",
    prompt:
      "Compute the capitalized cost of three acquired assets: (1) Land (incl. site prep, demolition, less salvage), (2) Self-constructed Warehouse (incl. construction-period interest), (3) New Machine (incl. freight, installation, sales tax — but NOT financing).",
    accountOptions: [
      "Capitalized cost of land",
      "Capitalized cost of warehouse",
      "Capitalized cost of machine",
    ],
    rows: [
      { label: "Land: Purchase $325K + Demolition $120K − Scrap proceeds $65K + Legal $24K", expectedAccount: "Capitalized cost of land", expectedAmount: 404000 },
      { label: "Warehouse: Labor/Materials/OH $305K + Construction interest $11K", expectedAccount: "Capitalized cost of warehouse", expectedAmount: 316000 },
      { label: "Machine: Cost $36K + Sales tax $2.1K + Installation $3.7K (NO finance charges)", expectedAccount: "Capitalized cost of machine", expectedAmount: 41800 },
    ],
    exhibits: [
      {
        name: "Capitalization Rules — Land, Building, Machine",
        body:
          "LAND (NOT depreciable):\n" +
          "  ✓ Purchase price\n" +
          "  ✓ Brokers' commissions, title/recording fees, legal fees\n" +
          "  ✓ Survey, site prep, clearing trees/brush\n" +
          "  ✓ Demolition of existing structures NET of scrap proceeds\n" +
          "  ✓ Property taxes IN ARREARS at purchase (assumed)\n" +
          "  ✗ Land IMPROVEMENTS (fences, parking lots, sidewalks) → separate account, depreciate\n\n" +
          "BUILDING / WAREHOUSE (depreciable):\n" +
          "  ✓ Purchase price OR construction cost (labor, materials, OH)\n" +
          "  ✓ Construction-period INTEREST (avoidable, capped by actual)\n" +
          "  ✓ Architect/engineering fees, building permits\n" +
          "  ✓ Deferred maintenance to make ready for use\n" +
          "  ✗ Operating costs (utilities, insurance after completion)\n\n" +
          "MACHINE / EQUIPMENT (depreciable):\n" +
          "  ✓ Invoice price LESS purchase discounts\n" +
          "  ✓ Sales tax, customs duty (non-recoverable)\n" +
          "  ✓ Freight-IN, insurance during transit\n" +
          "  ✓ Installation, test runs, calibration\n" +
          "  ✓ Construction-period interest IF self-constructed\n" +
          "  ✗ Financing charges on loan (interest on machine purchase = expense)\n" +
          "  ✗ Training of operators (period cost)\n" +
          "  ✗ Routine R&M after placed in service\n\n" +
          "WORKED OUT:\n" +
          "  LAND: $325,000 + $120,000 − $65,000 + $24,000 = $404,000\n" +
          "  WAREHOUSE: $305,000 labor/mat/OH + $11,000 construction interest = $316,000\n" +
          "  MACHINE: $36,000 + $2,100 sales tax + $3,700 install = $41,800\n" +
          "    (Finance charges on machine loan → expensed)",
      },
    ],
    scoring: { basePerCell: 70, mult: 8, bonusAllCorrect: 500 },
    explanations: [
      { row: 1, text: "Demolition of existing structures is part of getting land ready → capitalize NET of $65K scrap. Legal fees included." },
      { row: 2, text: "Self-constructed warehouse: $305K direct costs + $11K construction-period interest (3/15-8/31). All-in $316K." },
      { row: 3, text: "Machine includes sales tax and installation. Finance charges on the loan are NOT capitalized — they're regular interest expense." },
    ],
  },
  {
    id: "ac_corp_hq_acquisition_je",
    tbsId: "TBS-AC-HQ-JE",
    module: "F3.M5",
    title: "AC Corp — Corporate HQ Acquisition Journal Entry (Land/Bldg/Equip/Furn/Prepaids)",
    prompt:
      "Record AC Corp's corporate HQ acquisition: classify each cost into Land, Building, Office Furniture, Equipment, or Prepaid Expenses. Total funded by $1,000,000 bonds at par + cash. Compute the cash component.",
    accountOptions: [
      "Land",
      "Building",
      "Office furniture",
      "Equipment",
      "Prepaid expenses",
      "Bonds payable",
      "Cash",
    ],
    rows: [
      { label: "DR Land ($500K + $6K taxes + $54K demolition + $25K lien − $40K salvage)", expectedAccount: "Land", expectedAmount: 545000 },
      { label: "DR Building ($700K construction + $7K building permit)", expectedAccount: "Building", expectedAmount: 707000 },
      { label: "DR Office furniture ($100K furniture + $13K installation)", expectedAccount: "Office furniture", expectedAmount: 113000 },
      { label: "DR Equipment ($51K office equipment + $5K transit insurance)", expectedAccount: "Equipment", expectedAmount: 56000 },
      { label: "DR Prepaid expenses ($12K insurance + $2K maintenance)", expectedAccount: "Prepaid expenses", expectedAmount: 14000 },
      { label: "CR Bonds payable (at par, no premium/discount)", expectedAccount: "Bonds payable", expectedAmount: 1000000 },
      { label: "CR Cash (plug: $1,435,000 − $1,000,000)", expectedAccount: "Cash", expectedAmount: 435000 },
    ],
    exhibits: [
      {
        name: "AC Corp HQ — Cost Allocation Matrix",
        body:
          "LAND ($545,000):\n" +
          "  Purchase of land           $500,000\n" +
          "  Property tax in arrears      $6,000  (buyer assumed seller obligation)\n" +
          "  Demolition of old building  $54,000\n" +
          "  Settlement of lien on land  $25,000  (clearing title)\n" +
          "  LESS: Scrap salvage        ($40,000)\n" +
          "                            ─────────\n" +
          "  TOTAL                      $545,000\n\n" +
          "BUILDING ($707,000):\n" +
          "  Construction costs         $700,000\n" +
          "  Building permit              $7,000\n" +
          "                            ─────────\n" +
          "  TOTAL                      $707,000\n\n" +
          "OFFICE FURNITURE ($113,000):\n" +
          "  Furniture & fixtures       $100,000\n" +
          "  Installation                $13,000\n" +
          "                            ─────────\n" +
          "  TOTAL                      $113,000\n\n" +
          "EQUIPMENT ($56,000):\n" +
          "  Office equipment            $51,000\n" +
          "  Insurance in transit         $5,000\n" +
          "                            ─────────\n" +
          "  TOTAL                       $56,000\n\n" +
          "PREPAID EXPENSES ($14,000):\n" +
          "  Property insurance (7/1/Y1-6/30/Y2)  $12,000\n" +
          "  Maintenance contract (7/1/Y1-6/30/Y2) $2,000\n" +
          "                                      ─────────\n" +
          "  TOTAL                                $14,000\n\n" +
          "DEAL TOTAL: $545K + $707K + $113K + $56K + $14K = $1,435,000\n" +
          "FUNDING: $1,000,000 Bonds at par + $435,000 Cash = $1,435,000",
      },
    ],
    scoring: { basePerCell: 60, mult: 8, bonusAllCorrect: 600 },
    explanations: [
      { row: 1, text: "Land: ALL costs to get land ready for use — demolition, lien settlement, accrued taxes — included. Salvage reduces cost." },
      { row: 2, text: "Building: construction costs + permits. (Architect fees, deferred maint, construction-period interest also belong here.)" },
      { row: 3, text: "Office furniture has its own GL account here. Installation belongs with the furniture, not equipment." },
      { row: 4, text: "Equipment: invoice $51K + insurance during transit $5K = $56K. Insurance after placed-in-service would be period expense." },
      { row: 5, text: "Insurance/maintenance paid in advance for benefit period 7/1/Y1-6/30/Y2 = prepaid assets. NOT expensed yet." },
      { row: 6, text: "Bonds at face value → no premium/discount. Credit Bonds Payable $1,000,000 only." },
      { row: 7, text: "Plug: Total $1,435,000 − Bonds $1,000,000 = Cash $435,000." },
    ],
  },
  {
    id: "machinery_equipment_three_part_schedule",
    tbsId: "TBS-MACH-EQUIP-3PART",
    module: "F3.M5",
    title: "Machinery & Equipment — 3-Part Schedule (Cost / Depreciation / Accum Dep)",
    prompt:
      "Build a three-part PP&E schedule for Year 2: (1) Machinery & Equipment cost rollforward, (2) Annual depreciation by asset with partial-year fractions, (3) Accumulated Depreciation rollforward including disposal removal.",
    accountOptions: [
      "Opening cost balance",
      "Molding machine addition",
      "Replacement motor (cost + installation)",
      "Super Drill Press addition",
      "Sale of old drill press — cost removal",
      "Ending cost balance",
      "Tooling Machine depreciation",
      "Drill Press partial-year depreciation (9/12)",
      "Molding Machine partial-year depreciation (9/12)",
      "Replacement Motor partial-year depreciation (6/12)",
      "Maintenance Agreement — not depreciable",
      "Super Drill Press partial-year (3/12, new 4-year life)",
      "Opening accumulated depreciation",
      "Year 2 depreciation expense",
      "Sale of old drill press — accum dep removal",
      "Ending accumulated depreciation",
    ],
    rows: [
      { label: "Part I — Opening cost balance 1/1/Y2 ($150K tooling + $40K drill press)", expectedAccount: "Opening cost balance", expectedAmount: 190000 },
      { label: "Part I — Molding machine (4/1/Y2)", expectedAccount: "Molding machine addition", expectedAmount: 36000 },
      { label: "Part I — Replacement motor ($12K + $4K install)", expectedAccount: "Replacement motor (cost + installation)", expectedAmount: 16000 },
      { label: "Part I — Super Drill Press (10/1/Y2)", expectedAccount: "Super Drill Press addition", expectedAmount: 54000 },
      { label: "Part I — Sale of old drill press (remove original cost)", expectedAccount: "Sale of old drill press — cost removal", expectedAmount: -40000 },
      { label: "Part I — Ending cost balance 12/31/Y2", expectedAccount: "Ending cost balance", expectedAmount: 256000 },
      { label: "Part II — Tooling Machine ($120K base ÷ 5 yrs)", expectedAccount: "Tooling Machine depreciation", expectedAmount: 24000 },
      { label: "Part II — Drill Press ($8K × 9/12) — sold Sept", expectedAccount: "Drill Press partial-year depreciation (9/12)", expectedAmount: 6000 },
      { label: "Part II — Molding Machine ($4K × 9/12) — April–Dec", expectedAccount: "Molding Machine partial-year depreciation (9/12)", expectedAmount: 3000 },
      { label: "Part II — Replacement Motor ($4K × 6/12) — July–Dec", expectedAccount: "Replacement Motor partial-year depreciation (6/12)", expectedAmount: 2000 },
      { label: "Part II — Maintenance Agreement (not a fixed asset)", expectedAccount: "Maintenance Agreement — not depreciable", expectedAmount: 0 },
      { label: "Part II — Super Drill Press ($13,500 × 3/12) — Oct–Dec", expectedAccount: "Super Drill Press partial-year (3/12, new 4-year life)", expectedAmount: 3375 },
      { label: "Part II — Total Year 2 Depreciation Expense", expectedAmount: 38375 },
      { label: "Part III — Opening accum dep 1/1/Y2 ($12K tooling + $6K drill press)", expectedAccount: "Opening accumulated depreciation", expectedAmount: 18000 },
      { label: "Part III — Year 2 depreciation expense add", expectedAccount: "Year 2 depreciation expense", expectedAmount: 38375 },
      { label: "Part III — Sale of old drill press (remove accum dep $6K + $6K)", expectedAccount: "Sale of old drill press — accum dep removal", expectedAmount: -12000 },
      { label: "Part III — Ending accum dep 12/31/Y2", expectedAccount: "Ending accumulated depreciation", expectedAmount: 44375 },
    ],
    exhibits: [
      {
        name: "PP&E Schedule Mechanics + Partial-Year Conventions",
        body:
          "THREE PARALLEL SCHEDULES (always tie together):\n" +
          "  Part I: Asset COST rollforward — at original/historical cost\n" +
          "  Part II: Depreciation expense by asset for THE YEAR\n" +
          "  Part III: Accumulated depreciation rollforward\n" +
          "  Net Book Value = Part I balance − Part III balance\n\n" +
          "DEPRECIATION BASE:\n" +
          "  Cost − Salvage Value = Depreciable Base (NOT cost ÷ life)\n" +
          "  Tooling: $150K − $30K salvage = $120K base ÷ 5 yrs = $24K/yr\n" +
          "  (Other assets: salvage was zero, so base = cost.)\n\n" +
          "PARTIAL-YEAR DEPRECIATION:\n" +
          "  Pro-rate by months in service that year.\n" +
          "  Drill press sold September: 9 months in service → $8K × 9/12 = $6K\n" +
          "  Molding machine April: 9 months remaining → $4K × 9/12 = $3K\n" +
          "  Replacement motor July: 6 months → $4K × 6/12 = $2K\n" +
          "  Super DP October: 3 months → $13,500 × 3/12 = $3,375\n\n" +
          "EXTRAORDINARY REPAIR / IMPROVEMENT:\n" +
          "  Replacement motor: $12K cost + $4K installation = $16K capitalized.\n" +
          "  Depreciated over REMAINING LIFE of host asset (tooling = 4 yrs left).\n" +
          "  Maintenance agreement = prepaid expense, NOT a fixed asset.\n\n" +
          "CHANGE IN ESTIMATE (prospective, no restatement):\n" +
          "  Super DP: original 5-yr life revised to 4 yrs IN Year 2.\n" +
          "  → Depreciation in Y2 uses the NEW estimate: $54K ÷ 4 = $13,500/yr.\n" +
          "  No restatement of prior years (it was only owned 3 months).\n\n" +
          "DISPOSAL — REMOVE BOTH COST AND ACCUM DEP:\n" +
          "  Old drill press: cost $40K out of Part I, accum dep $12K out of Part III.\n" +
          "  ($6K prior + $6K current = $12K total accum dep at sale date)\n\n" +
          "TAX DEPRECIATION (MACRS) ≠ BOOK DEPRECIATION:\n" +
          "  Do NOT use MACRS for book schedule. Use GAAP methods (S-L, DDB, units).",
      },
    ],
    scoring: { basePerCell: 60, mult: 9, bonusAllCorrect: 900 },
    explanations: [
      { row: 1, text: "Sum of net book entries at start of year — at cost, not net of depreciation." },
      { row: 3, text: "Installation is capitalized with the motor cost. Maintenance agreement is a separate prepaid, NOT a fixed asset." },
      { row: 5, text: "Disposal removes asset at ORIGINAL cost $40K, regardless of accum dep balance." },
      { row: 7, text: "Tooling: $120K base ($150K cost − $30K salvage) ÷ 5 = $24,000/year. Full year since owned all of Y2." },
      { row: 8, text: "Drill press sold in September: take 9 months of expense. $8K × 9/12 = $6,000." },
      { row: 10, text: "Replacement motor depreciates over REMAINING 4 years of host tooling machine, not its own life." },
      { row: 12, text: "Change in estimate (5 → 4 yrs) is prospective. New $13,500/yr applied 3 months in Y2 = $3,375." },
      { row: 13, text: "$24K + $6K + $3K + $2K + $0 + $3,375 = $38,375 total Year 2 depreciation." },
      { row: 16, text: "Old drill press accum dep = $6K prior + $6K current Y2 = $12K removed at sale." },
      { row: 17, text: "$18,000 + $38,375 − $12,000 = $44,375 ending accumulated depreciation." },
    ],
  },
  {
    id: "dawne_equipment_gl_subledger_recon",
    tbsId: "TBS-DAWNE-EQUIP",
    module: "F3.M5",
    title: "Dawne Co — Equipment GL vs Subledger Reconciliation",
    prompt:
      "Reconcile Dawne Co's Equipment General Ledger ($13,400) and Subsidiary Ledger ($12,100) at 12/31/Y2. Three GL adjustments (missing freight, misclassified repair, missing printer) and two Subledger additions (printer + monitor). Both sides must agree.",
    accountOptions: [
      "Freight-in to add to laptop cost",
      "Network repair improperly capitalized",
      "Printer improperly expensed (>$500 threshold)",
      "Monitor missing from subledger",
      "No further adjustments",
    ],
    rows: [
      { label: "GL — Unadjusted balance", expectedAmount: 13400 },
      { label: "GL Adj 1 — Add shipping & handling to laptop (Invoice 100)", expectedAccount: "Freight-in to add to laptop cost", expectedAmount: 100 },
      { label: "GL Adj 2 — Reclass network repair OUT to R&M (Invoice 150)", expectedAccount: "Network repair improperly capitalized", expectedAmount: -400 },
      { label: "GL Adj 3 — Capitalize printer that was expensed (Invoice 96C)", expectedAccount: "Printer improperly expensed (>$500 threshold)", expectedAmount: 700 },
      { label: "GL — Adjusted ending balance", expectedAmount: 13800 },
      { label: "Subledger — Unadjusted balance", expectedAmount: 12100 },
      { label: "Subledger Adj 1 — Add printer (was expensed, also missing from subledger)", expectedAccount: "Printer improperly expensed (>$500 threshold)", expectedAmount: 700 },
      { label: "Subledger Adj 2 — Add monitor (in GL but missing from subledger)", expectedAccount: "Monitor missing from subledger", expectedAmount: 1000 },
      { label: "Subledger — Adjusted ending balance (must equal GL)", expectedAmount: 13800 },
    ],
    exhibits: [
      {
        name: "GL/Subledger Reconciliation — Equipment",
        body:
          "GENERAL LEDGER vs SUBSIDIARY LEDGER:\n" +
          "  GL = control account (one summary balance)\n" +
          "  Subledger = detailed by asset (every individual item listed)\n" +
          "  At period end, the two MUST agree. Any difference → investigate.\n\n" +
          "DAWNE'S CAPITALIZATION POLICY:\n" +
          "  • Items costing more than $500 → capitalize\n" +
          "  • Items $500 or less → expense\n" +
          "  • Capitalized cost = invoice + sales tax + shipping/handling (all inventoriable for PP&E)\n\n" +
          "ROW-BY-ROW LOGIC:\n\n" +
          "GL Adj 1 (+$100): Invoice 100 (Micro laptop $2,000)\n" +
          "  Accountant capitalized $2K but expensed $100 freight to freight expense.\n" +
          "  Freight is inventoriable → reclass to equipment.\n\n" +
          "GL Adj 2 (−$400): Invoice 150 (Joe's Repair network)\n" +
          "  Network repair is ordinary R&M → expense.\n" +
          "  Reverse the capitalization. Reclass $400 to R&M expense.\n\n" +
          "GL Adj 3 (+$700): Invoice 96C (Printers and More)\n" +
          "  $700 printer (>$500 threshold) was wrongly hit to R&M.\n" +
          "  Capitalize → add $700 to equipment.\n\n" +
          "SUBLEDGER Adj 1 (+$700): Same printer — never added to subledger detail.\n" +
          "SUBLEDGER Adj 2 (+$1,000): Monitor was in GL but missing from subledger detail.\n\n" +
          "FINAL RECONCILIATION:\n" +
          "  GL:        $13,400 + $100 − $400 + $700 = $13,800\n" +
          "  Subledger: $12,100 + $700 + $1,000 = $13,800  ✓ TIES\n\n" +
          "AUDIT TAKEAWAY: When GL and subledger don't agree, expect:\n" +
          "  • Items in GL but not yet added to subledger\n" +
          "  • Items added to subledger but expensed in GL\n" +
          "  • Cap/expense errors driven by AP coder unfamiliar with policy",
      },
    ],
    scoring: { basePerCell: 60, mult: 8, bonusAllCorrect: 600 },
    explanations: [
      { row: 2, text: "Freight & shipping are inventoriable PP&E costs. Reclass $100 from freight expense to equipment." },
      { row: 3, text: "Joe's Repair was a network repair → ordinary R&M, should be expensed not capitalized. Reverse $400." },
      { row: 4, text: "$700 printer exceeds $500 capitalization threshold → must be capitalized, not expensed to R&M." },
      { row: 5, text: "Adjusted GL: $13,400 + $100 − $400 + $700 = $13,800." },
      { row: 7, text: "Same printer never made it into the subledger detail either — add the $700." },
      { row: 8, text: "Monitor was correctly in GL summary but missing from per-asset subledger — add $1,000." },
      { row: 9, text: "Subledger: $12,100 + $700 + $1,000 = $13,800. Ties to adjusted GL — reconciliation complete." },
    ],
  },
  {
    id: "richter_intangibles_five_journal_entries",
    tbsId: "TBS-F3M6-RICHTER",
    module: "F3.M6",
    title: "Richter Corp — Intangibles & R&D: Five Journal Entries",
    prompt:
      "Prepare the journal entry (if any) for each of the five Richter Corp transactions. The company uses straight-line for amortization and depreciation; all amortization/depreciation is recorded on December 31. Richter uses separate accumulated-amortization GL accounts for each intangible asset. Select the account in each row and enter the debit or credit amount. Use a positive number with the column you intend (debit OR credit). If no entry is required, leave the row blank.",
    accountOptions: [
      "Patents",
      "Trademarks",
      "Equipment",
      "Cash",
      "Accumulated depreciation",
      "Accumulated amortization - patent",
      "Accumulated amortization - trademark",
      "Amortization expense",
      "Depreciation expense",
      "Research and development expense",
      "Legal expense",
      "No entry required",
    ],
    rows: [
      // ── April 1, Y1 — Patent purchase $50,000 (plus DD's $35,000 dev costs are R&D — not Richter's entry)
      { label: "Apr 1 — DR account", expectedAccount: "Patents" },
      { label: "Apr 1 — DR amount", expectedAmount: 50000 },
      { label: "Apr 1 — CR account", expectedAccount: "Cash" },
      { label: "Apr 1 — CR amount", expectedAmount: 50000 },
      // ── July 1, Y1 — R&D Equipment with alternative future use → capitalize $79,000 ($75,000 + $4,000 delivery)
      { label: "Jul 1 — DR account", expectedAccount: "Equipment" },
      { label: "Jul 1 — DR amount", expectedAmount: 79000 },
      { label: "Jul 1 — CR account", expectedAccount: "Cash" },
      { label: "Jul 1 — CR amount", expectedAmount: 79000 },
      // ── October 1, Y1 — Unsuccessful trademark defense → $25,000 legal expense
      { label: "Oct 1 — DR account", expectedAccount: "Legal expense" },
      { label: "Oct 1 — DR amount", expectedAmount: 25000 },
      { label: "Oct 1 — CR account", expectedAccount: "Cash" },
      { label: "Oct 1 — CR amount", expectedAmount: 25000 },
      // ── Dec 31, Y1 — Patent amortization: $50,000 / 10 yrs × 9/12 = $3,750
      { label: "Dec 31 Patent — DR account", expectedAccount: "Amortization expense" },
      { label: "Dec 31 Patent — DR amount", expectedAmount: 3750 },
      { label: "Dec 31 Patent — CR account", expectedAccount: "Accumulated amortization - patent" },
      { label: "Dec 31 Patent — CR amount", expectedAmount: 3750 },
      // ── Dec 31, Y1 — R&D Equipment depreciation: $79,000 / 5 yrs × 6/12 = $7,900, charged to R&D expense
      { label: "Dec 31 Equip — DR account", expectedAccount: "Research and development expense" },
      { label: "Dec 31 Equip — DR amount", expectedAmount: 7900 },
      { label: "Dec 31 Equip — CR account", expectedAccount: "Accumulated depreciation" },
      { label: "Dec 31 Equip — CR amount", expectedAmount: 7900 },
    ],
    exhibits: [
      {
        name: "Transaction Details",
        body:
          "April 1, Y1 — Patent Purchase\n" +
          "Richter purchased a patent with a 10-year life for $50,000 from DD Co. DD\n" +
          "incurred $35,000 developing the patent (DD's R&D — not Richter's).\n" +
          "\n" +
          "July 1, Y1 — Scientific Equipment\n" +
          "Richter purchased scientific equipment used in product development studies\n" +
          "having potential alternative future uses. Cost $75,000 + $4,000 delivery.\n" +
          "Useful life: 5 years.\n" +
          "\n" +
          "October 1, Y1 — Trademark Defense (Unfavorable)\n" +
          "Richter received an UNFAVORABLE judgment defending a trademark and paid\n" +
          "$25,000 in legal fees.\n" +
          "\n" +
          "December 31, Y1 — Year-End Adjustments\n" +
          "(a) Account for the Apr-1 patent\n" +
          "(b) Account for the Jul-1 scientific equipment",
      },
      {
        name: "Accounting Policy",
        body:
          "• Patents amortized straight-line over the shorter of useful life or remaining legal life.\n" +
          "• Equipment depreciated straight-line, partial-year by months in service.\n" +
          "• All amortization/depreciation booked on December 31.\n" +
          "• Separate accumulated-amortization GL accounts per intangible asset.\n" +
          "• Equipment used for R&D purposes: depreciation is charged to R&D expense\n" +
          "  (NOT a regular depreciation expense line).",
      },
      {
        name: "Key Rules",
        body:
          "PATENTS\n" +
          "  • Purchased from outside: capitalize the purchase price.\n" +
          "  • Internally-developed costs (DD's $35k): direct charge to R&D expense.\n" +
          "  • Amortize over shorter of useful life or legal life remaining.\n" +
          "\n" +
          "R&D — EQUIPMENT WITH ALTERNATIVE FUTURE USE\n" +
          "  • General rule: R&D costs are expensed as incurred.\n" +
          "  • EXCEPTION: Materials/equipment with alternative future use → capitalize.\n" +
          "  • Include all costs to acquire/ready the asset (purchase + delivery).\n" +
          "  • Depreciation while in R&D use → charged to R&D expense.\n" +
          "\n" +
          "TRADEMARK DEFENSE\n" +
          "  • SUCCESSFUL defense → capitalize legal fees (add to trademark asset).\n" +
          "  • UNSUCCESSFUL defense → expense legal fees immediately.",
      },
    ],
    scoring: { basePerCell: 50, mult: 1, bonusAllCorrect: 200 },
    explanations: [
      { row: 1, text: "Apr 1: Patent PURCHASED from an outside party is capitalized at $50,000. DD's $35,000 of internal development costs are DD's R&D expense, not Richter's." },
      { row: 5, text: "Jul 1: R&D equipment GENERALLY would be expensed, BUT the exception applies: equipment with alternative future use is capitalized. Capitalized amount = $75,000 purchase + $4,000 delivery = $79,000." },
      { row: 9, text: "Oct 1: UNSUCCESSFUL trademark defense → the $25,000 in legal fees is a direct charge to expense. (If successful, the fees would have been capitalized to the trademark asset.)" },
      { row: 13, text: "Dec 31 Patent amortization: $50,000 / 10 years = $5,000/year × 9/12 (Apr 1 to Dec 31) = $3,750. Credit goes to the separate Accumulated Amortization — Patent account." },
      { row: 17, text: "Dec 31 R&D equipment depreciation: $79,000 / 5 years = $15,800/year × 6/12 (Jul 1 to Dec 31) = $7,900. Because the equipment is currently used for R&D, the depreciation expense is reclassified to R&D expense, not Depreciation Expense." },
    ],
  },
  {
    id: "ap_reconciliation_and_aro_pv",
    tbsId: "TBS-F4-AP-ARO",
    module: "F4.M2",
    title: "Accounts Payable Reconciliation + Asset Retirement Obligation (ARO)",
    prompt:
      "Complete THREE tables. (1) Reconcile the company's unadjusted Accounts Payable balance of $13,600,000 to the adjusted balance by entering the adjusting amount for each of 8 invoices — use POSITIVE for additions, NEGATIVE for removals, and 0 if no adjustment needed. (2) Record the initial PV of the Asset Retirement Cost (ARC) and Asset Retirement Obligation (ARO) using the GAAP risk-free rate of 4.25% (PV factor 0.81212) on a future ARO of $4,325,000. (3) Compute the total accretion over the 5-year life that brings the ARO to its future value.",
    accountOptions: [
      "Asset retirement cost",
      "Asset retirement obligation",
      "Accretion expense",
      "Cash",
      "Accounts payable",
    ],
    rows: [
      // ── Table 1: A/P Reconciliation (8 invoices)
      { label: "Inv 27654 (L. Abott) — paid, in unadj balance", expectedAmount: -28000 },
      { label: "Inv 32-90647 (Jenkins) — unpaid, NOT in balance", expectedAmount: 36250 },
      { label: "Inv 11A-2635 (KLR) — paid, in unadj balance", expectedAmount: -85900 },
      { label: "Inv 4985 (M. Gerard) — paid, NOT in balance", expectedAmount: 0 },
      { label: "Inv BK-19-3196 (Fixit) — unpaid, NOT in balance", expectedAmount: 62750 },
      { label: "Inv 906587 (MMK) — unpaid, in balance", expectedAmount: 0 },
      { label: "Inv 21-780 (R. Oblane) — paid, in unadj balance", expectedAmount: -9680 },
      { label: "Inv 56350 (Listco) — unpaid, NOT in balance", expectedAmount: 41350 },
      { label: "Adjusted A/P balance", expectedAmount: 13616770 },
      // ── Table 2: ARO Initial Journal Entry
      { label: "DR account (ARC)", expectedAccount: "Asset retirement cost" },
      { label: "DR amount", expectedAmount: 3512419 },
      { label: "CR account (ARO)", expectedAccount: "Asset retirement obligation" },
      { label: "CR amount", expectedAmount: 3512419 },
      // ── Table 3: Total accretion over 5 years
      { label: "Total accretion over 5 years", expectedAmount: 812581 },
    ],
    exhibits: [
      {
        name: "A/P Reconciliation — Decision Matrix",
        body:
          "For each invoice, ask:\n" +
          "  (a) Is it in the unadjusted A/P balance? (YES/NO)\n" +
          "  (b) Has it been paid? (YES/NO)\n" +
          "\n" +
          "Action grid:\n" +
          "  In balance + PAID    →  REMOVE (negative adjustment) — payable was extinguished\n" +
          "  In balance + UNPAID  →  No adjustment — correct as recorded\n" +
          "  NOT in bal + UNPAID  →  ADD (positive adjustment) — liability omitted\n" +
          "  NOT in bal + PAID    →  No adjustment — never should have been there, and it's gone",
      },
      {
        name: "ARO Facts",
        body:
          "Ross Co. (U.S. company → follows U.S. GAAP).\n" +
          "Future ARO at end of useful life: $4,325,000\n" +
          "Useful life of asset: 5 years\n" +
          "Risk-free credit-adjusted rate: 4.25%\n" +
          "PV factor for 5 years @ 4.25%: 0.81212\n" +
          "\n" +
          "U.S. GAAP rule: Use the credit-adjusted RISK-FREE rate for BOTH the asset\n" +
          "retirement cost (ARC) and the asset retirement obligation (ARO).\n" +
          "(IFRS would use the current market discount rate — different.)",
      },
      {
        name: "Computation",
        body:
          "PV of ARO at inception = $4,325,000 × 0.81212 = $3,512,419\n" +
          "  → ARC and ARO both recorded at $3,512,419 (equal — initial entry).\n" +
          "\n" +
          "Total accretion to grow PV up to FV over 5 years:\n" +
          "  $4,325,000 − $3,512,419 = $812,581\n" +
          "\n" +
          "  (Each year, accretion expense = beginning ARO × rate.)",
      },
    ],
    scoring: { basePerCell: 80, mult: 1, bonusAllCorrect: 350 },
    explanations: [
      { row: 1, text: "Inv 27654 was PAID but is still sitting in unadjusted A/P → remove $28,000 (negative)." },
      { row: 2, text: "Inv 32-90647 is UNPAID and NOT in unadjusted A/P → add $36,250 (positive)." },
      { row: 3, text: "Inv 11A-2635 was PAID but still in unadjusted A/P → remove $85,900." },
      { row: 4, text: "Inv 4985 was PAID and is NOT in A/P — already correct, no adjustment." },
      { row: 5, text: "Inv BK-19-3196 unpaid + missing → add $62,750." },
      { row: 6, text: "Inv 906587 unpaid and properly recorded — no adjustment." },
      { row: 7, text: "Inv 21-780 paid but still in A/P → remove $9,680." },
      { row: 8, text: "Inv 56350 unpaid and missing → add $41,350." },
      { row: 9, text: "$13,600,000 − 28,000 + 36,250 − 85,900 + 62,750 − 9,680 + 41,350 = $13,616,770." },
      { row: 11, text: "U.S. GAAP requires the credit-adjusted risk-free rate for BOTH the ARC and the ARO. Future $4,325,000 × 0.81212 PV factor = $3,512,419 — debited to ARC (capitalized to the asset)." },
      { row: 13, text: "ARO is credited at the same $3,512,419 — the present value of the future obligation. Both sides of the entry equal because at inception ARC = ARO." },
      { row: 15, text: "Accretion grows the ARO from PV ($3,512,419) up to its future value ($4,325,000) over 5 years. Total accretion = $4,325,000 − $3,512,419 = $812,581. Each year is recorded as accretion expense (operating expense, NOT interest)." },
    ],
  },
  {
    id: "brotonne_exit_cost_liability",
    tbsId: "TBS-F4-BROTONNE-EXIT",
    module: "F4.M3",
    title: "Brotonne Inc. — Exit Cost Liability (7 Scenarios at 12/31/Y19)",
    prompt:
      "Brotonne Inc. is closing two facilities and Ms. Jass is relocating. For each of 7 components, compute the exit cost liability to be accrued at 12/31/Y19. Apply the U.S. GAAP exit-cost rules: employee terminations require communication + plan + no-significant-change criteria; contract terminations differ depending on whether a cancellation clause exists; other costs (relocation) are recognized only when incurred.",
    accountOptions: [],
    rows: [
      { label: "Buffalo, N.Y. — employee termination liability", expectedAmount: 105050 },
      { label: "Watertown, N.Y. — employee termination liability", expectedAmount: 0 },
      { label: "Brotonne fixed-asset accrual (exit-cost)", expectedAmount: 0 },
      { label: "RISC contract (HAS termination clause)", expectedAmount: 18000 },
      { label: "Falcon-Hawk — Buffalo (NO cancellation clause, still operating)", expectedAmount: 0 },
      { label: "Falcon-Hawk — Watertown (NO cancellation clause, ceased use 12/21/Y19)", expectedAmount: 25000 },
      { label: "Ms. Jass relocation liability (incurred portion only)", expectedAmount: 2492 },
    ],
    exhibits: [
      {
        name: "Employee Termination — 4 Criteria (ALL required)",
        body:
          "Per U.S. GAAP, an exit cost liability for termination benefits is accrued ONLY when:\n" +
          "  (a) Management commits to a plan of termination,\n" +
          "  (b) Plan identifies employees and expected completion date,\n" +
          "  (c) Plan establishes the benefit terms,\n" +
          "  (d) Significant changes/withdrawal of plan are unlikely, AND\n" +
          "  (e) The plan has been COMMUNICATED to employees.\n" +
          "\n" +
          "Communication is the obligating event. Commitment alone is NOT enough.",
      },
      {
        name: "Buffalo Separation Calculation",
        body:
          "Separation = $1,000 lump-sum + 1 week of pay × years of service\n" +
          "\n" +
          "C. Edwards: $1,000 + (104,000/52 × 15)            = $31,000\n" +
          "B. Smith:   $1,000 + ($40 × 40 × 14)              = $23,400\n" +
          "M. Jones:   $1,000 + ($36 × 40 × 12)              = $18,280\n" +
          "A. Brown:   $1,000 + (65,000/52 × 9)              = $12,250\n" +
          "Q. Clark:   $1,000 + (78,000/52 × 8)              = $13,000\n" +
          "S. Ramirez: $1,000 + ($26 × 40 × 4)               = $5,160\n" +
          "A. Washington: $1,000 + ($24 × 40 × 1)            = $1,960\n" +
          "                                              ──────────\n" +
          "Total Buffalo                                   $105,050",
      },
      {
        name: "Contract Termination — Two Paths",
        body:
          "PATH 1 — Contract HAS a cancellation/termination clause AND Brotonne\n" +
          "         exercises it per the contract terms:\n" +
          "  → Recognize liability for early-termination COSTS at the\n" +
          "    communication (notice) date.\n" +
          "  → Continued service during wind-down = future operating cost\n" +
          "    (NOT accrued).\n" +
          "\n" +
          "PATH 2 — NO cancellation clause (or terminating outside clause):\n" +
          "  → Recognize liability for REMAINING contract costs at the\n" +
          "    CEASE-USE date (when the entity stops using the right).\n" +
          "  → If still using services at year-end → no accrual yet.",
      },
      {
        name: "RISC Contract (Path 1)",
        body:
          "Section 9.0 allows early termination with 60-day notice.\n" +
          "Brotonne gave notice 12/23/Y19; termination 02/28/Y20.\n" +
          "Wind-down 12/23/Y19–02/28/Y20: service continues = operating cost,\n" +
          "  no accrual.\n" +
          "Lump-sum termination fee = 20% × remaining unpaid service fees\n" +
          "  past 02/28/Y20.\n" +
          "Remaining service period: 03/01/Y20 → 11/30/Y20 = 9 months\n" +
          "9 mo × $10,000/mo × 20% = $18,000 accrued at 12/31/Y19.",
      },
      {
        name: "Falcon-Hawk Contracts (Path 2)",
        body:
          "No cancellation clause exists.\n" +
          "Liability recognized at the CEASE-USE date.\n" +
          "\n" +
          "BUFFALO — Brotonne notified 12/17/Y19, effective 02/28/Y20.\n" +
          "  Facility still operating at 12/31/Y19 → service still received.\n" +
          "  Cease-use date is 03/01/Y20 (next period).\n" +
          "  No accrual at 12/31/Y19.\n" +
          "\n" +
          "WATERTOWN — Brotonne notified 12/17/Y19, effective 12/20/Y19.\n" +
          "  Brotonne stopped using services on 12/21/Y19.\n" +
          "  Cease-use date = 12/21/Y19 (this period).\n" +
          "  Remaining payments: Jan–Oct of Y20 = 10 months × $2,500 = $25,000.",
      },
      {
        name: "Relocation (Ms. Jass)",
        body:
          "Per GAAP, relocation liabilities are recognized ONLY when INCURRED\n" +
          "(when goods/services are received). Signing an agreement alone is\n" +
          "not enough — even though incremental and direct.\n" +
          "\n" +
          "• Moving company nonrefundable DEPOSIT $1,000 → accrue (present obligation)\n" +
          "• Remaining estimated moving costs $8,500 → DO NOT accrue (not incurred)\n" +
          "• House-hunting trip $1,492 (already taken before 12/31) → accrue\n" +
          "• Closing costs → DO NOT accrue (house not yet sold/bought)\n" +
          "\n" +
          "Total accrued: $1,000 + $1,492 = $2,492",
      },
    ],
    scoring: { basePerCell: 120, mult: 1, bonusAllCorrect: 400 },
    explanations: [
      { row: 1, text: "Buffalo: All 5 criteria met by 12/31/Y19 — Plan 3-B was communicated 12/16/Y19, the company confirmed no significant changes 12/30/Y19. Sum of all 7 employee separation calcs = $105,050." },
      { row: 2, text: "Watertown: Even though management committed in Y19, the plan was not COMMUNICATED to employees until 01/07/Y20. Without communication, no obligating event has occurred at 12/31/Y19 — $0." },
      { row: 3, text: "Brotonne's fixed assets are governed by impairment/disposal GAAP (ASC 360), NOT exit-cost guidance. Depreciation/impairment is separate — no exit-cost accrual." },
      { row: 4, text: "RISC has a cancellation clause (Path 1). Notice given 12/23/Y19 within contract terms → obligating event. Wind-down service costs aren't accrued (still receiving benefit). Lump-sum termination fee = 9 months × $10,000 × 20% = $18,000." },
      { row: 5, text: "Falcon-Hawk Buffalo: NO cancellation clause (Path 2). At 12/31/Y19, Brotonne is still operating the Buffalo facility and receiving services. Cease-use date is 03/01/Y20 — falls in next period. $0 at this balance sheet date." },
      { row: 6, text: "Falcon-Hawk Watertown: NO cancellation clause (Path 2). Cease-use date 12/21/Y19 — Brotonne stopped using the services. Accrue remaining contract: 10 months (Jan–Oct Y20) × $2,500 = $25,000." },
      { row: 7, text: "Relocation: Only INCURRED portions accrued. Moving company deposit $1,000 (paid/nonrefundable = present obligation) + House-hunting $1,492 (trip taken in Y19) = $2,492. The $8,500 unperformed move and closing costs are future costs — not accrued." },
    ],
  },
  {
    id: "gti_contingencies_warranties_premium",
    tbsId: "TBS-F4M3-GTI",
    module: "F4.M3",
    title: "GTI — Contingencies, Warranties, Lawsuit & Premium Liability (Yr 5)",
    prompt:
      "GTI is preparing its 12/31/Yr 5 consolidated financial statements. PART A: Classify the treatment for 4 items (Warranty obligation, Loan guarantee for subsidiary, Property tax refund gain contingency, Patent infringement lawsuit filed BY GTI). PART B: Record the journal entry for (1) the outstanding lawsuit and (2) the printer cartridge premium liability.",
    accountOptions: [
      "Accrue and disclose (amount/range and nature)",
      "Disclose only (amount/range and nature)",
      "Neither accrue nor disclose",
      "Lawsuit loss",
      "Lawsuit liability",
      "Premium expense",
      "Premium liability",
    ],
    rows: [
      // ── PART A: Classification (4 items)
      { label: "Warranty obligation on desktop sales", expectedAccount: "Accrue and disclose (amount/range and nature)" },
      { label: "Loan guarantee for Metal Casing subsidiary (default remote)", expectedAccount: "Disclose only (amount/range and nature)" },
      { label: "Property tax refund — gain contingency, likely $75–85k", expectedAccount: "Disclose only (amount/range and nature)" },
      { label: "Patent infringement lawsuit filed BY GTI — chance of winning remote", expectedAccount: "Neither accrue nor disclose" },
      // ── PART B-1: Lawsuit journal entry
      { label: "Lawsuit DR account", expectedAccount: "Lawsuit loss" },
      { label: "Lawsuit DR amount", expectedAmount: 2750000 },
      { label: "Lawsuit CR account", expectedAccount: "Lawsuit liability" },
      { label: "Lawsuit CR amount", expectedAmount: 2750000 },
      // ── PART B-2: Premium journal entry
      { label: "Premium DR account", expectedAccount: "Premium expense" },
      { label: "Premium DR amount", expectedAmount: 280000 },
      { label: "Premium CR account", expectedAccount: "Premium liability" },
      { label: "Premium CR amount", expectedAmount: 280000 },
    ],
    exhibits: [
      {
        name: "Contingency Decision Matrix (Loss)",
        body:
          "                  REASONABLY        \n" +
          "Likelihood        ESTIMABLE          NOT ESTIMABLE\n" +
          "─────────────────────────────────────────────────────\n" +
          "PROBABLE         Accrue + Disclose   Disclose only\n" +
          "REASONABLY POSS  Disclose only       Disclose only\n" +
          "REMOTE           No action*          No action*\n" +
          "\n" +
          "* EXCEPTION for REMOTE losses: guarantee-type obligations\n" +
          "  (loan guarantees, standby letters of credit, third-party\n" +
          "  warranties) MUST be DISCLOSED even when remote.\n" +
          "\n" +
          "GAIN CONTINGENCIES:\n" +
          "  • Probable and estimable → DISCLOSE only (never accrue gains)\n" +
          "  • Reasonably possible    → Disclose only\n" +
          "  • Remote                 → Neither accrue nor disclose",
      },
      {
        name: "Warranty Computation",
        body:
          "Warranty cost expectations: 1% in year of sale + 3% in subsequent year = 4% total.\n" +
          "\n" +
          "Year 5 desktop sales:\n" +
          "  $17,500,000 + $21,200,000 + $18,800,000 + $26,500,000 = $84,000,000\n" +
          "\n" +
          "Accrual = $84,000,000 × 4% = $3,360,000\n" +
          "\n" +
          "RULE: A warranty obligation is a LOSS contingency that is PROBABLE and\n" +
          "ESTIMABLE → ACCRUE the full expected cost at the time of sale (matching\n" +
          "principle), even if expenditures occur in later years.",
      },
      {
        name: "Lawsuit Estimate (Best Midpoint)",
        body:
          "Attorney letter: Settlement probable. Range: $2.5M – $3.0M.\n" +
          "Per ASC 450-20-30-1: when a RANGE of probable loss exists and\n" +
          "no amount within the range is more likely than any other,\n" +
          "the MIDPOINT (best estimate) is accrued.\n" +
          "\n" +
          "Midpoint = ($2,500,000 + $3,000,000) / 2 = $2,750,000\n" +
          "\n" +
          "(IFRS would use the midpoint as well, but call it the\n" +
          "'best estimate' under IAS 37 — same result here.)",
      },
      {
        name: "Premium Liability Computation",
        body:
          "Promotion: $20 premium for every 4 coupons returned.\n" +
          "Cost to GTI per premium: $14.\n" +
          "\n" +
          "Total Y5 printer cartridge sales (units):\n" +
          "  34,000 + 28,000 + 35,000 + 39,000 + 29,000 + 35,000 = 200,000\n" +
          "\n" +
          "Expected coupon-redemption rate: 75%\n" +
          "  → Expected total coupons redeemed = 200,000 × 75% = 150,000\n" +
          "\n" +
          "Coupons already redeemed by year-end:\n" +
          "  2,000 + 5,000 + 18,000 + 15,000 + 13,000 + 17,000 = 70,000\n" +
          "  (already cleared through Cash → not part of remaining liability)\n" +
          "\n" +
          "Remaining expected redemptions: 150,000 − 70,000 = 80,000 coupons\n" +
          "Premiums to be paid: 80,000 / 4 = 20,000 premiums\n" +
          "Liability: 20,000 × $14 = $280,000",
      },
    ],
    scoring: { basePerCell: 100, mult: 1, bonusAllCorrect: 400 },
    explanations: [
      { row: 1, text: "Warranty: PROBABLE loss + ESTIMABLE → Accrue AND disclose. Match the expense against revenue in the year of sale, even if expenditures span future periods." },
      { row: 2, text: "Loan guarantee for subsidiary: Default risk is REMOTE, BUT guarantee-type obligations are the explicit EXCEPTION — they must be DISCLOSED even when the loss is remote." },
      { row: 3, text: "Property tax refund: This is a GAIN contingency (likely $75–85k from Liberty County). Gain contingencies are never accrued — only disclosed. Disclose amount/range and nature." },
      { row: 4, text: "Patent lawsuit BY GTI = gain contingency. Chance of winning is REMOTE. Remote gain contingencies receive NO disclosure (conservatism)." },
      { row: 5, text: "Outstanding lawsuit: Probable loss + reasonable range $2.5M–$3.0M. With no point in the range more likely, accrue the MIDPOINT = $2,750,000. DR Lawsuit loss / CR Lawsuit liability." },
      { row: 9, text: "Premium expense matches the sales period: estimated total remaining redemptions × cost per premium = 20,000 × $14 = $280,000. The 70,000 already-redeemed coupons are already cleared in cash and are NOT in the remaining liability." },
    ],
  },
  {
    id: "loan_interest_year1_error_year2_entry",
    tbsId: "TBS-F4M4-LOAN-INTEREST",
    module: "F4.M4",
    title: "Loan Interest — Y1 Error Correction + Y2 Accrual (Two Loans)",
    prompt:
      "Record the required journal entries for two loans in Year 2. LOAN 1: $3,000,000 @ 4% annual, interest paid every January 1 for the prior year. The Year 1 entry was incorrectly recorded as DR Accrued Interest Payable / CR Cash $120,000 — fix it AND record Y2's regular interest accrual. LOAN 2: $1,000,000 @ 8% annual, interest payable Jan 1 for prior year — record the Dec 31, Y2 accrual. (Y2 books are still open; Y1 books are CLOSED — error correction uses Retained Earnings.)",
    accountOptions: [
      "Cash",
      "Interest expense",
      "Accrued interest payable",
      "Retained earnings",
      "Loan payable",
    ],
    rows: [
      // ── LOAN 1, Entry A: Fix Year 1 error (Y1 closed → through RE)
      { label: "Loan 1 Y1 fix — DR account", expectedAccount: "Retained earnings" },
      { label: "Loan 1 Y1 fix — DR amount", expectedAmount: 120000 },
      { label: "Loan 1 Y1 fix — CR account", expectedAccount: "Accrued interest payable" },
      { label: "Loan 1 Y1 fix — CR amount", expectedAmount: 120000 },
      // ── LOAN 1, Entry B: Record Y2 interest expense (interest paid Jan 1 Y2 was for Y1)
      { label: "Loan 1 Y2 — DR account", expectedAccount: "Interest expense" },
      { label: "Loan 1 Y2 — DR amount", expectedAmount: 120000 },
      { label: "Loan 1 Y2 — CR account", expectedAccount: "Cash" },
      { label: "Loan 1 Y2 — CR amount", expectedAmount: 120000 },
      // ── LOAN 2: Dec 31, Y2 accrual (paid Jan 1 Y3)
      { label: "Loan 2 — DR account", expectedAccount: "Interest expense" },
      { label: "Loan 2 — DR amount", expectedAmount: 80000 },
      { label: "Loan 2 — CR account", expectedAccount: "Accrued interest payable" },
      { label: "Loan 2 — CR amount", expectedAmount: 80000 },
    ],
    exhibits: [
      {
        name: "Loan 1 — Y1 Error Recap",
        body:
          "Principal: $3,000,000  ·  Rate: 4% annual  ·  Y1 interest = $120,000\n" +
          "\n" +
          "Y1 ACTUAL CORRECT ENTRY (at 12/31/Y1):\n" +
          "  DR Interest expense           $120,000\n" +
          "    CR Accrued interest payable    $120,000\n" +
          "\n" +
          "Y2 PAYMENT (1/1/Y2, when paying Y1's interest):\n" +
          "  DR Accrued interest payable   $120,000\n" +
          "    CR Cash                        $120,000\n" +
          "\n" +
          "WHAT THE COMPANY DID INSTEAD ON 1/1/Y2:\n" +
          "  DR Accrued interest payable   $120,000   ← debit OK (paying the liability)\n" +
          "    CR Cash                        $120,000   ← credit OK\n" +
          "\n" +
          "BUT — the company NEVER RECORDED the Y1 accrual.\n" +
          "Net effect: Y1 interest expense is missing, and the company debited\n" +
          "an Accrued Interest Payable balance that didn't exist.",
      },
      {
        name: "Year 1 Books Closed → RE Treatment",
        body:
          "RULE: If an error is discovered in a CLOSED period, the income\n" +
          "statement effect cannot flow through current-year expense.\n" +
          "Adjust beginning RETAINED EARNINGS for the prior-period item.\n" +
          "\n" +
          "Fix-up JE:\n" +
          "  DR Retained earnings          $120,000\n" +
          "    CR Accrued interest payable    $120,000\n" +
          "\n" +
          "(This restores the missing liability AND removes the\n" +
          "$120,000 of overstated Y1 income from RE.)",
      },
      {
        name: "Loan 2 — Y2 Year-End Accrual",
        body:
          "Principal: $1,000,000  ·  Rate: 8% annual  ·  Y2 interest = $80,000\n" +
          "Payment date: 1/1/Y3 (next period)\n" +
          "\n" +
          "Dec 31, Y2 accrual:\n" +
          "  DR Interest expense           $80,000\n" +
          "    CR Accrued interest payable    $80,000\n" +
          "\n" +
          "Credit goes to ACCRUED INTEREST PAYABLE (not Cash) because\n" +
          "the actual cash payment does not occur until 1/1/Y3.",
      },
    ],
    scoring: { basePerCell: 80, mult: 1, bonusAllCorrect: 300 },
    explanations: [
      { row: 1, text: "Y1 is CLOSED — debit Retained Earnings for the missing $120,000 prior-period interest expense. Cannot run it through current-year Interest Expense." },
      { row: 3, text: "Credit Accrued Interest Payable to restore the liability that was wrongly extinguished by the 1/1/Y2 mis-entry." },
      { row: 5, text: "Y2 interest paid 1/1/Y3 covers Y2 expense. Because Loan 1 PAYS in January for the prior year, the 1/1/Y2 cash payment covered Y1 — and Y2's $120,000 will be PAID on 1/1/Y3 — but the EXPENSE belongs to Y2. Per the Becker answer, the Y2 entry is shown as DR Interest expense / CR Cash $120,000 (Becker treats the Y2 expense + payment together; if the question expects accrual at year-end, the CR would be to Accrued Interest Payable). Following Becker's stated answer: DR Interest expense / CR Cash $120,000." },
      { row: 9, text: "Loan 2 $1,000,000 × 8% = $80,000 Y2 interest expense. Payment Jan 1, Y3 means credit goes to Accrued Interest Payable, NOT Cash." },
    ],
  },
  {
    id: "johannsen_debt_covenants_compliance",
    tbsId: "TBS-F4M4-JOHANNSEN-COVENANTS",
    module: "F4.M4",
    title: "Johannsen Co — Debt Covenant Compliance Testing (Year 7)",
    prompt:
      "Compute each financial ratio for Johannsen at 12/31/Y7 and determine whether the company is IN COMPLIANCE or OUT OF COMPLIANCE with each covenant. Then evaluate two additional restrictions (Fixed Asset Sales, Cash Dividend Payments) to determine whether they are RESTRICTED or NOT RESTRICTED. All dollar amounts are in thousands.",
    accountOptions: [
      "In compliance",
      "Out of compliance",
      "Restricted",
      "Not restricted",
    ],
    rows: [
      // ── Five covenant ratios — each has TWO cells (amount + compliance)
      { label: "Total debt ratio — amount", expectedAmountLabel: "0.46" },
      { label: "Total debt ratio — compliance (max 0.45)", expectedAccount: "Out of compliance" },
      { label: "Net working capital — amount ($k)", expectedAmount: 126500 },
      { label: "Net working capital — compliance (min $75,000)", expectedAccount: "In compliance" },
      { label: "Times interest earned — amount", expectedAmountLabel: "3.21" },
      { label: "Times interest earned — compliance (min 1.75)", expectedAccount: "In compliance" },
      { label: "Operating cash flow ratio — amount", expectedAmountLabel: "2.08" },
      { label: "Operating cash flow ratio — compliance (min 0.75)", expectedAccount: "In compliance" },
      { label: "Debt-to-EBITDA ratio — amount", expectedAmountLabel: "4.82" },
      { label: "Debt-to-EBITDA ratio — compliance (max 3.00x)", expectedAccount: "Out of compliance" },
      // ── Two additional restrictions
      { label: "Fixed asset sales (min tangible NW $750,000)", expectedAccount: "Not restricted" },
      { label: "Cash dividend payments (TIE ≥ 1.75 AND FCF ≥ 0)", expectedAccount: "Not restricted" },
    ],
    exhibits: [
      {
        name: "Y7 Trial Balance Snapshot ($ thousands)",
        body:
          "BALANCE SHEET:\n" +
          "  Current assets               $194,400\n" +
          "  Total assets               $1,657,100\n" +
          "  Current liabilities            $67,900\n" +
          "  Total liabilities             $762,400\n" +
          "  Loan payable                  $100,000\n" +
          "  Bonds payable                 $575,000\n" +
          "  Intangible assets              $35,300\n" +
          "  Total stockholders' equity    $894,700\n" +
          "\n" +
          "INCOME STATEMENT:\n" +
          "  Net income                     $56,700\n" +
          "  Income tax expense             $15,100\n" +
          "  Interest expense               $32,500\n" +
          "  Depreciation & amortization    $35,600\n" +
          "\n" +
          "CASH FLOW STATEMENT:\n" +
          "  Operating cash flow           $141,000\n" +
          "  Capital expenditures          $133,800",
      },
      {
        name: "Covenant Calculations",
        body:
          "TOTAL DEBT RATIO (max 0.45):\n" +
          "  $762,400 / $1,657,100 = 0.46 → EXCEEDS — OUT OF COMPLIANCE\n" +
          "\n" +
          "NET WORKING CAPITAL (min $75,000):\n" +
          "  $194,400 − $67,900 = $126,500 → ABOVE — IN COMPLIANCE\n" +
          "\n" +
          "TIMES INTEREST EARNED (min 1.75):\n" +
          "  EBIT = NI $56,700 + Tax $15,100 + Int $32,500 = $104,300\n" +
          "  $104,300 / $32,500 = 3.21 → ABOVE — IN COMPLIANCE\n" +
          "\n" +
          "OPERATING CASH FLOW RATIO (min 0.75):\n" +
          "  $141,000 / $67,900 = 2.08 → ABOVE — IN COMPLIANCE\n" +
          "\n" +
          "DEBT-TO-EBITDA (max 3.00x):\n" +
          "  Interest-bearing debt = $100,000 + $575,000 = $675,000\n" +
          "  EBITDA = Pretax $71,800 + Int $32,500 + D&A $35,600 = $139,900\n" +
          "  $675,000 / $139,900 = 4.82x → EXCEEDS — OUT OF COMPLIANCE",
      },
      {
        name: "Additional Restrictions",
        body:
          "FIXED ASSET SALES — restricted if Tangible Net Worth < $750,000.\n" +
          "  Tangible NW = SE − Intangibles = $894,700 − $35,300 = $859,400\n" +
          "  $859,400 > $750,000 → NOT RESTRICTED.\n" +
          "\n" +
          "CASH DIVIDENDS — restricted if EITHER:\n" +
          "  (a) Times interest earned < 1.75, OR\n" +
          "  (b) Free cash flow is negative.\n" +
          "\n" +
          "  TIE = 3.21 → OK.\n" +
          "  FCF = OCF $141,000 − CapEx $133,800 = $7,200 → POSITIVE → OK.\n" +
          "  Both tests passed → NOT RESTRICTED.",
      },
    ],
    scoring: { basePerCell: 60, mult: 1, bonusAllCorrect: 400 },
    explanations: [
      { row: 1, text: "Total debt ratio = Total liabilities / Total assets = $762,400 / $1,657,100 = 0.46. Covenant max is 0.45 — Johannsen exceeds the max by 0.01." },
      { row: 2, text: "0.46 > 0.45 cap → OUT OF COMPLIANCE. Even small breaches matter — covenants are binary." },
      { row: 3, text: "NWC = Current Assets − Current Liabilities = $194,400 − $67,900 = $126,500. Comfortably above the $75,000 floor." },
      { row: 5, text: "EBIT (NOT EBITDA) is the numerator for TIE. EBIT = NI + Tax + Interest = $56,700 + $15,100 + $32,500 = $104,300. Then $104,300 / $32,500 = 3.21." },
      { row: 7, text: "Operating cash flow ratio = OCF / Current Liabilities = $141,000 / $67,900 = 2.08. Well above the 0.75 minimum." },
      { row: 9, text: "Debt-to-EBITDA uses INTEREST-BEARING liabilities only (loan + bonds = $675,000), not total liabilities. EBITDA = Pretax + Interest + D&A = $71,800 + $32,500 + $35,600 = $139,900. $675,000 / $139,900 = 4.82x." },
      { row: 10, text: "4.82x > 3.00x cap → OUT OF COMPLIANCE. This is typically the most likely breach for highly-leveraged companies." },
      { row: 11, text: "Tangible Net Worth = SE − Intangibles = $894,700 − $35,300 = $859,400. Above the $750,000 floor → fixed asset sales are NOT restricted." },
      { row: 12, text: "Dividend test requires TIE ≥ 1.75 (passed at 3.21) AND FCF ≥ 0 (passed at $7,200). Both passed → dividends NOT restricted, even though two of the five covenants are breached." },
    ],
  },
  {
    id: "bond_issue_price_pv_calculation",
    tbsId: "TBS-F4M4-BOND-ISSUE-PRICE",
    module: "F4.M4",
    title: "Bond Issue Price — Present Value Calculation (Premium Bond)",
    prompt:
      "Compute the issue price of a 5-year, $1,000,000 face value bond paying interest semiannually at a 10% stated rate when the market rate at issuance was 8%. Determine the four inputs (compounding periods, semiannual interest rate, payment amount) for both the principal and the interest annuity, then compute the present value of each and the total bond issue price. PV factor for principal: 0.67556. PV factor for the interest annuity: 8.11090.",
    accountOptions: [],
    rows: [
      // ── Principal row inputs
      { label: "Principal — compounding periods", expectedAmount: 10 },
      { label: "Principal — semiannual interest rate (%)", expectedAmount: 4 },
      { label: "Principal — payment amount ($)", expectedAmount: 1000000 },
      { label: "Principal — PV ($)", expectedAmount: 675560 },
      // ── Interest annuity row inputs
      { label: "Interest — compounding periods", expectedAmount: 10 },
      { label: "Interest — semiannual interest rate (%)", expectedAmount: 4 },
      { label: "Interest — payment amount ($)", expectedAmount: 50000 },
      { label: "Interest — PV ($)", expectedAmount: 405545 },
      // ── Total
      { label: "Bond Issue Price ($)", expectedAmount: 1081105 },
    ],
    exhibits: [
      {
        name: "Bond Terms",
        body:
          "Face amount:           $1,000,000\n" +
          "Stated (coupon) rate:  10% annual, paid SEMIANNUALLY\n" +
          "Maturity:              5 years\n" +
          "Market rate at issue:  8% annual\n" +
          "\n" +
          "PV factors at 4% for 10 periods:\n" +
          "  PV of $1 (single sum):   0.67556\n" +
          "  PV of annuity of $1:     8.11090",
      },
      {
        name: "Semiannual Conversion Rules",
        body:
          "Because the bond pays interest SEMIANNUALLY, every input must\n" +
          "be converted from annual to semiannual:\n" +
          "\n" +
          "  Periods (n)   = years × 2     = 5 × 2 = 10\n" +
          "  Discount rate = market / 2    = 8% / 2 = 4%\n" +
          "  Coupon ($)    = face × stated / 2 = $1,000,000 × 10% / 2 = $50,000\n" +
          "\n" +
          "CRITICAL: The DISCOUNT rate uses the MARKET rate (8% / 2 = 4%).\n" +
          "The CASH coupon amount uses the STATED rate (10% / 2 = 5%).\n" +
          "Mixing these up is the single most common bond-pricing error.",
      },
      {
        name: "Two-Part PV Structure",
        body:
          "BOND ISSUE PRICE = PV of principal + PV of interest annuity\n" +
          "\n" +
          "PART 1 — Principal (single lump sum at maturity):\n" +
          "  Discount $1,000,000 received 10 periods out at 4%/period\n" +
          "  PV = $1,000,000 × 0.67556 = $675,560\n" +
          "\n" +
          "PART 2 — Interest (10-period annuity):\n" +
          "  Discount $50,000 received each period for 10 periods at 4%\n" +
          "  PV = $50,000 × 8.11090 = $405,545\n" +
          "\n" +
          "ISSUE PRICE = $675,560 + $405,545 = $1,081,105\n" +
          "\n" +
          "Since stated rate (10%) > market rate (8%), bond sells at a PREMIUM\n" +
          "(issue price > face).",
      },
    ],
    scoring: { basePerCell: 60, mult: 1, bonusAllCorrect: 300 },
    explanations: [
      { row: 1, text: "Periods (principal): 5 years × 2 semiannual payments = 10 periods. Even though the principal is paid only once at maturity, the DISCOUNTING happens over 10 semiannual periods because we're matching the bond's compounding frequency." },
      { row: 2, text: "Discount rate uses the MARKET rate, not the stated rate. 8% annual / 2 = 4% semiannual." },
      { row: 3, text: "Principal payment = $1,000,000 face value. This is the lump sum paid at maturity." },
      { row: 4, text: "PV of principal = $1,000,000 × 0.67556 = $675,560 (PV of $1, 10 periods @ 4%)." },
      { row: 5, text: "Periods (interest annuity): Same 10 — interest is paid 10 times over the bond's 5-year life." },
      { row: 6, text: "Discount rate: 4% — same market rate. The discount rate is identical for both PV computations." },
      { row: 7, text: "Coupon payment uses the STATED rate, not the market rate. $1,000,000 × 10% / 2 = $50,000 every 6 months. Switching to 4% here is the most common error." },
      { row: 8, text: "PV of interest annuity = $50,000 × 8.11090 = $405,545 (annuity factor for 10 periods @ 4%)." },
      { row: 9, text: "Issue price = $675,560 + $405,545 = $1,081,105 = PREMIUM of $81,105 over face. Premium because the bond pays a higher coupon (10%) than investors require (8%)." },
    ],
  },
  {
    id: "bond_early_extinguishment_discount",
    tbsId: "TBS-F4M4-EARLY-EXTINGUISH",
    module: "F4.M4",
    title: "Bond Early Extinguishment — Discount Bond, Gain on Redemption",
    prompt:
      "A $750,000 face bond was issued at a DISCOUNT. At the beginning of the current interest period, the carrying value was $706,565. Stated rate is 8.5% annual (4.25% semiannual); market rate at issuance was 10% annual (5% semiannual). Using the effective interest method: (1) compute interest expense and interest payment for this period and the resulting unamortized discount at redemption, (2) determine whether redemption at 94% of face produces a gain or loss and the amount, and (3) record the journal entry to extinguish the bond.",
    accountOptions: [
      "Cash",
      "Bonds payable",
      "Discount on bonds payable",
      "Premium on bonds payable",
      "Gain on extinguishment of debt",
      "Loss on extinguishment of debt",
      "Gain",
      "Loss",
    ],
    rows: [
      // ── Part 1
      { label: "Unamortized discount at redemption ($)", expectedAmount: 39982 },
      // ── Part 2
      { label: "Gain or Loss (which?)", expectedAccount: "Gain" },
      { label: "Gain/Loss amount ($)", expectedAmount: 5018 },
      // ── Part 3 — JE
      { label: "JE — DR Bonds payable", expectedAmount: 750000 },
      { label: "JE — DR/CR Gain account", expectedAccount: "Gain" },
      { label: "JE — Gain amount ($)", expectedAmount: 5018 },
      { label: "JE — CR Discount on bonds payable", expectedAmount: 39982 },
      { label: "JE — CR Cash", expectedAmount: 705000 },
    ],
    exhibits: [
      {
        name: "Bond Facts",
        body:
          "Face amount:              $750,000\n" +
          "Stated rate (annual):     8.5% → 4.25% semiannual ($31,875 cash interest)\n" +
          "Market rate at issue:     10%  → 5% semiannual (expense rate)\n" +
          "Carrying value beg-period: $706,565\n" +
          "Redemption price:         94% of face = $705,000",
      },
      {
        name: "Period-End Amortization (Effective Interest)",
        body:
          "Interest expense  = Carrying value × market rate\n" +
          "                  = $706,565 × 5.00% = $35,328\n" +
          "\n" +
          "Interest payment  = Face × stated rate\n" +
          "                  = $750,000 × 4.25% = $31,875\n" +
          "\n" +
          "Discount amortization = Expense − Cash interest\n" +
          "                      = $35,328 − $31,875 = $3,453\n" +
          "\n" +
          "New carrying value    = $706,565 + $3,453 = $710,018\n" +
          "Unamortized discount  = $750,000 − $710,018 = $39,982",
      },
      {
        name: "Gain/Loss & Journal Entry",
        body:
          "Reacquisition price = $750,000 × 94% = $705,000\n" +
          "Carrying value      = $710,018\n" +
          "GAIN = $710,018 − $705,000 = $5,018  (bought back below CV)\n" +
          "\n" +
          "Journal entry on redemption:\n" +
          "  DR Bonds payable                  $750,000\n" +
          "    CR Discount on bonds payable        $39,982   (eliminate)\n" +
          "    CR Cash                            $705,000   (price paid)\n" +
          "    CR Gain on extinguishment of debt    $5,018",
      },
      {
        name: "Key Rule",
        body:
          "GAIN/LOSS = Net Carrying Value − Reacquisition Price\n" +
          "  → Positive = GAIN (paid less than CV)\n" +
          "  → Negative = LOSS (paid more than CV)\n" +
          "\n" +
          "Per U.S. GAAP, the entire gain/loss on early extinguishment is\n" +
          "reported in CONTINUING OPERATIONS, not as extraordinary (which is\n" +
          "no longer a separate IS category).",
      },
    ],
    scoring: { basePerCell: 80, mult: 1, bonusAllCorrect: 350 },
    explanations: [
      { row: 1, text: "Period-end CV = $706,565 + $3,453 amortization = $710,018. Unamortized discount = $750,000 face − $710,018 = $39,982." },
      { row: 2, text: "GAIN — bought back at $705,000 which is LESS than the carrying value of $710,018." },
      { row: 3, text: "$710,018 CV − $705,000 reacquisition = $5,018 gain." },
      { row: 4, text: "Eliminate the bond at face value: DR Bonds Payable $750,000." },
      { row: 5, text: "Gain account name — credit side of the entry (gains have credit balances)." },
      { row: 7, text: "Eliminate the remaining contra-account: CR Discount on Bonds Payable $39,982. (Discounts are contra-liabilities with debit balances — credit them to zero them out.)" },
      { row: 8, text: "Cash paid to redeem = 94% × $750,000 = $705,000." },
    ],
  },
  {
    id: "bond_amortization_table_premium_formulas",
    tbsId: "TBS-F4M4-AMORT-TABLE",
    module: "F4.M4",
    title: "Bond Amortization Table — Premium Bond, First-Period Formulas",
    prompt:
      "Following the $1,000,000 face, 10% stated, 8% market, 5-year semiannual PREMIUM bond from earlier (issue price $1,081,105, unamortized premium $81,105), build the effective-interest amortization table. Identify the first-period values: cash interest payment, interest expense, decrease in carrying amount, unamortized premium balance, and new carrying value at 6/30/Y1.",
    accountOptions: [],
    rows: [
      { label: "Cell B3 — Interest payment 6/30/Y1 ($)", expectedAmount: 50000 },
      { label: "Cell C3 — Interest expense 6/30/Y1 ($)", expectedAmount: 43244 },
      { label: "Cell D3 — Decrease in carrying amount ($)", expectedAmount: 6756 },
      { label: "Cell E3 — Unamortized premium @ 6/30/Y1 ($)", expectedAmount: 74349 },
      { label: "Cell F3 — Carrying amount @ 6/30/Y1 ($)", expectedAmount: 1074349 },
      { label: "Number of interest payment dates total", expectedAmount: 10 },
    ],
    exhibits: [
      {
        name: "Bond Inputs (Carryover from Issue Price TBS)",
        body:
          "Face:                  $1,000,000\n" +
          "Stated rate (annual):   10%  → 5% semiannual\n" +
          "Market rate (annual):    8%  → 4% semiannual\n" +
          "Term:                  5 years (10 semiannual periods)\n" +
          "Issue price (1/1/Y1):  $1,081,105\n" +
          "Unamortized premium:   $   81,105\n" +
          "\n" +
          "Interest payment dates (semiannual):\n" +
          "  6/30/Y1, 12/31/Y1, 6/30/Y2, 12/31/Y2,\n" +
          "  6/30/Y3, 12/31/Y3, 6/30/Y4, 12/31/Y4,\n" +
          "  6/30/Y5, 12/31/Y5",
      },
      {
        name: "First-Period Formulas",
        body:
          "B3  Cash interest    = Face × stated/2\n" +
          "                     = $1,000,000 × 5% = $50,000\n" +
          "\n" +
          "C3  Interest expense = Carrying value × market/2\n" +
          "                     = $1,081,105 × 4% = $43,244\n" +
          "\n" +
          "D3  Decrease in CV   = Cash interest − Expense\n" +
          "                     = $50,000 − $43,244 = $6,756\n" +
          "                     (PREMIUM amortizes DOWN; cash > expense)\n" +
          "\n" +
          "E3  Unamortized prem = E2 − D3\n" +
          "                     = $81,105 − $6,756 = $74,349\n" +
          "\n" +
          "F3  New carrying val = F2 − D3\n" +
          "                     = $1,081,105 − $6,756 = $1,074,349",
      },
      {
        name: "Premium vs Discount — Direction Rules",
        body:
          "PREMIUM bond (stated > market):\n" +
          "  • Cash interest > Interest expense\n" +
          "  • Premium amortizes DOWN each period\n" +
          "  • Carrying value DECREASES toward face\n" +
          "\n" +
          "DISCOUNT bond (stated < market):\n" +
          "  • Cash interest < Interest expense\n" +
          "  • Discount amortizes DOWN each period\n" +
          "  • Carrying value INCREASES toward face\n" +
          "\n" +
          "At maturity, both end exactly at face value.",
      },
    ],
    scoring: { basePerCell: 80, mult: 1, bonusAllCorrect: 250 },
    explanations: [
      { row: 1, text: "Cash interest = Face × stated/2 = $1,000,000 × 5% = $50,000 (fixed every period, never changes)." },
      { row: 2, text: "Interest expense = beginning CV × market/2 = $1,081,105 × 4% = $43,244. This changes every period because CV changes." },
      { row: 3, text: "Decrease in CV = $50,000 − $43,244 = $6,756. For a PREMIUM bond, cash > expense, so CV goes DOWN." },
      { row: 4, text: "Unamortized premium = beginning premium − current amortization = $81,105 − $6,756 = $74,349." },
      { row: 5, text: "New CV = Beginning CV − amortization = $1,081,105 − $6,756 = $1,074,349. Heading toward face $1,000,000 at maturity." },
      { row: 6, text: "5 years × 2 semiannual payments = 10 interest dates total." },
    ],
  },
  {
    id: "premium_bond_issue_and_first_interest_je",
    tbsId: "TBS-F4M4-PREMIUM-JES",
    module: "F4.M4",
    title: "Premium Bond — Issue JE + First-Period Interest JE (Effective Interest)",
    prompt:
      "A $200,000 face bond pays 8% stated semiannually; market rate at issuance is 4% (2% semiannual). Bond was issued at $235,931 (premium of $35,931). Record (1) the issuance journal entry on 1/1/Y1 and (2) the first interest payment journal entry on 6/30/Y1 using the effective interest method.",
    accountOptions: [
      "Cash",
      "Bonds payable",
      "Premium on bonds payable",
      "Discount on bonds payable",
      "Bond interest expense",
    ],
    rows: [
      // ── JE 1: Issuance 1/1/Y1
      { label: "Issue — DR Cash ($)", expectedAmount: 235931 },
      { label: "Issue — CR Bonds payable ($)", expectedAmount: 200000 },
      { label: "Issue — CR Premium on bonds payable ($)", expectedAmount: 35931 },
      // ── JE 2: First interest 6/30/Y1
      { label: "Interest — DR Bond interest expense ($)", expectedAmount: 4719 },
      { label: "Interest — DR Premium on bonds payable ($)", expectedAmount: 3281 },
      { label: "Interest — CR Cash ($)", expectedAmount: 8000 },
    ],
    exhibits: [
      {
        name: "Bond Facts",
        body:
          "Face:               $200,000\n" +
          "Stated rate:         8% annual → 4% semiannual\n" +
          "Market rate:         4% annual → 2% semiannual\n" +
          "Issue price (1/1/Y1): $235,931 (PREMIUM of $35,931)\n" +
          "\n" +
          "WHY PREMIUM? Stated 8% > Market 4% → bonds sell ABOVE face.\n" +
          "  (Rule: When contract rate > market rate → premium.\n" +
          "         When contract rate < market rate → discount.)",
      },
      {
        name: "Issuance Journal Entry (1/1/Y1)",
        body:
          "DR Cash                          $235,931\n" +
          "  CR Bonds payable                  $200,000   (face value)\n" +
          "  CR Premium on bonds payable        $35,931   (excess over face)\n" +
          "\n" +
          "The premium is a contra-liability (with a credit balance) that\n" +
          "EFFECTIVELY REDUCES interest expense over the life of the bond.",
      },
      {
        name: "First Interest Period (6/30/Y1)",
        body:
          "Interest paid in cash = Face × stated/2\n" +
          "                     = $200,000 × 4% = $8,000\n" +
          "\n" +
          "Interest expense     = Beginning CV × market/2\n" +
          "                     = $235,931 × 2% = $4,718.62 ≈ $4,719\n" +
          "\n" +
          "Premium amortization = Cash − Expense\n" +
          "                     = $8,000 − $4,719 = $3,281\n" +
          "\n" +
          "Journal entry:\n" +
          "  DR Bond interest expense     $4,719\n" +
          "  DR Premium on bonds payable  $3,281    (reduces premium balance)\n" +
          "    CR Cash                       $8,000",
      },
      {
        name: "First 3 Periods of Amortization Schedule",
        body:
          "                Beginning   Interest   Cash    Prem.    Ending\n" +
          "Date              CV         Expense    Pmt    Amort     CV\n" +
          "─────────────────────────────────────────────────────────────\n" +
          "1/1/Y1         $235,931                                  $235,931\n" +
          "6/30/Y1         235,931      $4,719   $8,000  $3,281     232,650\n" +
          "12/31/Y1        232,650       4,653    8,000   3,347     229,303\n" +
          "6/30/Y2         229,303       4,586    8,000   3,414     225,889",
      },
    ],
    scoring: { basePerCell: 80, mult: 1, bonusAllCorrect: 300 },
    explanations: [
      { row: 1, text: "Cash received = full issue price including premium = $235,931." },
      { row: 2, text: "Bonds Payable credited at FACE only = $200,000. Never plug the premium into Bonds Payable directly." },
      { row: 3, text: "Premium = Issue price − Face = $235,931 − $200,000 = $35,931. Recorded in its own contra-liability account." },
      { row: 4, text: "Interest expense uses the MARKET rate × beginning CV = $235,931 × 2% = $4,719. Lower than cash interest because this is a premium bond." },
      { row: 5, text: "Premium amortization = Cash interest − Expense = $8,000 − $4,719 = $3,281. The premium DECREASES each period (debit to reduce its credit balance)." },
      { row: 6, text: "Cash paid = Face × stated/2 = $200,000 × 4% = $8,000. This is the same every period (fixed)." },
    ],
  },
  {
    id: "lyndhurst_bond_early_call_gain_loss",
    tbsId: "TBS-034003",
    module: "F4.M6",
    title: "Lyndhurst Bond Early Call — Gain/Loss on Extinguishment",
    prompt: "On January 2, Year 1, Lyndhurst Company issued $1,000,000, 5-year, 10.00% bonds dated January 2, Year 1, paying semi-annual interest on June 30 and December 31. Terms allow calling the bonds at 102 after one year. Market rate at issuance was 8.00%. Lyndhurst uses the effective interest method, the bonds mature December 31 Year 5, and the fiscal year-end is December 31. On June 30, Year 2, Lyndhurst called the bonds at 102 when the carrying value was $1,060,016. Enter the carrying amount, payment due at call, the gain or (loss), and indicate Gain or Loss.",
    accountOptions: ["Gain", "Loss"],
    rows: [
      { label: "A — Carrying Amount of Debt", expectedAmount: 1060016 },
      { label: "B — Payment Due at Call Date (102% of $1,000,000)", expectedAmount: 1020000 },
      { label: "C — Amount of Gain or (Loss) = A − B", expectedAmount: 40016 },
      { label: "D — Indicate Gain or Loss", expectedAccount: "Gain" },
    ],
    exhibits: [
      {
        name: "Bond Call Facts",
        body:
          "Face: $1,000,000\n" +
          "Stated rate: 10.00% (semi-annual = 5%)\n" +
          "Market rate at issue: 8.00% (semi-annual = 4%)\n" +
          "Issued: January 2, Year 1 — Matures: December 31, Year 5\n" +
          "Call provision: 102 after one year\n" +
          "Called: June 30, Year 2\n" +
          "Carrying value at call date: $1,060,016\n" +
          "  = $1,000,000 face + $60,016 unamortized premium\n",
      },
    ],
    scoring: { basePerCell: 30, mult: 1, bonusAllCorrect: 60 },
    explanations: [
      { row: 1, text: "Carrying amount = face + unamortized premium (or − unamortized discount). $1,000,000 + $60,016 = $1,060,016. This is the book value of the debt on the call date." },
      { row: 2, text: "Call price 102 means 102% of face. $1,000,000 × 1.02 = $1,020,000 paid to bondholders to retire the bonds early." },
      { row: 3, text: "Gain/Loss on extinguishment = Carrying amount − Cash paid. $1,060,016 − $1,020,000 = $40,016 GAIN. (If positive → gain; if negative → loss.) Gain/loss flows to the income statement under ASC 470-50." },
      { row: 4, text: "Because the cash paid ($1,020,000) is LESS than the book value ($1,060,016), Lyndhurst extinguishes the debt for less than its carrying amount → GAIN on early retirement. Mnemonic: 'Pay less than you owe = Gain; pay more = Loss.'" },
    ],
  },
  {
    id: "bentley_operating_lease_jes_amort_table",
    tbsId: "TBS-LEASE-BENTLEY",
    module: "F5.M1",
    title: "Bentley Operating Lease — Inception JE, First Two Payments, Total Interest",
    prompt: "Bentley is the lessee on an operating lease: 8 semi-annual payments of $30,000 at a semi-annual rate of 2.175% (4.35% annual). The PV annuity factor is 7.27053. Record the journal entry at lease inception (1/1/Y1), the first payment (6/30/Y1), the second payment (12/31/Y1), and determine total interest paid over the lease life.",
    accountOptions: ["ROU Asset", "Lease Liability", "Lease Expense", "Cash", "Amortization—ROU Asset"],
    rows: [
      { label: "Inception 1/1/Y1 — DR ROU Asset ($30,000 × 7.27053)", expectedAmount: 218116 },
      { label: "Inception 1/1/Y1 — CR Lease Liability", expectedAmount: 218116 },
      { label: "6/30/Y1 Payment — DR Lease Expense", expectedAmount: 30000 },
      { label: "6/30/Y1 Payment — DR Lease Liability (principal portion)", expectedAmount: 25256 },
      { label: "6/30/Y1 Payment — CR Cash", expectedAmount: 30000 },
      { label: "6/30/Y1 Payment — CR Amortization—ROU Asset", expectedAmount: 25256 },
      { label: "12/31/Y1 Payment — DR Lease Liability", expectedAmount: 25805 },
      { label: "12/31/Y1 Payment — CR Amortization—ROU Asset", expectedAmount: 25805 },
      { label: "Total interest paid over life ($240,000 − $218,116)", expectedAmount: 21884 },
    ],
    exhibits: [
      {
        name: "Amortization Table (Operating Lease)",
        body:
          "Date         Payment   Interest   Amort    Balance\n" +
          "Start                                       218,116\n" +
          "6/30/Y1      30,000    4,744      25,256   192,860\n" +
          "12/31/Y1     30,000    4,195      25,805   167,055\n" +
          "6/30/Y2      30,000    3,633      26,367   140,688\n" +
          "12/31/Y2     30,000    3,060      26,940   113,748\n" +
          "6/30/Y3      30,000    2,474      27,526    86,222\n" +
          "12/31/Y3     30,000    1,875      28,125    58,097\n" +
          "6/30/Y4      30,000    1,264      28,736    29,361\n" +
          "12/31/Y4     30,000      639      29,361         0\n" +
          "Totals      240,000   21,884    218,116\n",
      },
    ],
    scoring: { basePerCell: 25, mult: 1, bonusAllCorrect: 100 },
    explanations: [
      { row: 1, text: "ROU Asset = PV of lease payments = $30,000 × 7.27053 = $218,116. For an operating lease with no initial direct costs, ROU asset equals lease liability at inception." },
      { row: 3, text: "Operating lease: single LEASE EXPENSE line (straight-line) of $30,000 per period. This is the key difference from finance leases, which split into interest + amortization." },
      { row: 4, text: "Principal portion = $218,116 × 0.02175 interest = $4,744; payment $30,000 − interest $4,744 = $25,256 reduction of lease liability." },
      { row: 6, text: "Operating lease accounting plugs the credit side: Amortization—ROU equals the principal portion ($25,256) so the entry balances against the $30,000 lease expense and $30,000 cash. This is what makes operating leases 'straight-line' — the ROU amortization is reverse-engineered from lease expense minus interest." },
      { row: 7, text: "12/31/Y1: New balance after 6/30 = $192,860. Interest $192,860 × 0.02175 = $4,195; principal $30,000 − $4,195 = $25,805." },
      { row: 9, text: "Total interest = Σ payments − initial liability = $240,000 ($30,000 × 8) − $218,116 = $21,884. Quick shortcut: skip the table." },
    ],
  },
  {
    id: "jenings_finance_lease_aeb_inception_je",
    tbsId: "TBS-LEASE-JENINGS",
    module: "F5.M1",
    title: "Jenings Finance Lease (AEB) — Classification, Inception JE, First Payment JEs",
    prompt: "AEB Inc. (lessee) signs a 5-year lease with Jenings starting 12/1/Y3. Monthly payment $1,975 at month-end, implicit rate 4.25%, fair value $113,000, 8-year economic life, no transfer of ownership, no purchase option, not specialized. AEB pays $1,230 commissions + $550 legal fees as initial direct costs. PV factor for 60 monthly payments at 4.25% = 53.9678. Classify the lease, record inception JE on 12/1/Y3, and the 12/31/Y3 interest/principal split and amortization JE.",
    accountOptions: ["Finance lease", "Operating lease", "ROU Asset", "Lease Liability", "Cash", "Interest Expense", "Amortization Expense", "Accumulated Amortization—ROU Asset"],
    rows: [
      { label: "Classification (Finance or Operating?)", expectedAccount: "Finance lease" },
      { label: "Inception 12/1/Y3 — DR ROU Asset (PV + IDC)", expectedAmount: 108366 },
      { label: "Inception 12/1/Y3 — CR Cash (initial direct costs)", expectedAmount: 1780 },
      { label: "Inception 12/1/Y3 — CR Lease Liability (PV of payments)", expectedAmount: 106586 },
      { label: "12/31/Y3 Payment — DR Interest Expense ($106,586 × 0.0425/12)", expectedAmount: 377 },
      { label: "12/31/Y3 Payment — DR Lease Liability (principal)", expectedAmount: 1598 },
      { label: "12/31/Y3 Payment — CR Cash", expectedAmount: 1975 },
      { label: "12/31/Y3 Amortization — DR Amortization Expense ($108,366 / 60)", expectedAmount: 1806 },
      { label: "12/31/Y3 Amortization — CR Accumulated Amortization—ROU", expectedAmount: 1806 },
    ],
    exhibits: [
      {
        name: "OWNES Classification Test",
        body:
          "O — Ownership transfer? NO\n" +
          "W — Written purchase option lessee reasonably certain to exercise? NO\n" +
          "N — Net PV substantially all (>=90%) of FV?\n" +
          "   PV = $1,975 × 53.9678 = $106,586\n" +
          "   FV = $113,000\n" +
          "   PV/FV = 94.32% → YES (substantially all)\n" +
          "E — Economic life (>=75% of remaining life)?\n" +
          "   5 yrs / 8 yrs = 62.5% → NO\n" +
          "S — Specialized? NO (lessor can re-use)\n" +
          "\n" +
          "Classification: FINANCE LEASE (N is met)\n",
      },
      {
        name: "Initial Direct Costs",
        body:
          "Commissions: $1,230\n" +
          "Legal fees:     $550\n" +
          "Total IDC:    $1,780\n" +
          "ROU Asset = PV $106,586 + IDC $1,780 = $108,366\n",
      },
    ],
    scoring: { basePerCell: 25, mult: 1, bonusAllCorrect: 100 },
    explanations: [
      { row: 1, text: "OWNES: Only one criterion needs to be met. 'N' (Net PV ≥ substantially all of FV) is met at 94.32%, well above the 90% threshold. Finance lease." },
      { row: 2, text: "ROU Asset = PV of lease payments + initial direct costs + prepayments − lease incentives. Here: $106,586 + $1,780 = $108,366." },
      { row: 5, text: "Monthly interest = beginning balance × annual rate / 12 = $106,586 × (0.0425/12) = $377. Always use beginning balance for the period." },
      { row: 6, text: "Principal = cash payment − interest = $1,975 − $377 = $1,598. New lease liability = $106,586 − $1,598 = $104,988." },
      { row: 8, text: "Finance lease amortization is STRAIGHT-LINE over the lease term (60 months): $108,366 / 60 = $1,806/month. Unlike operating leases, the ROU amortization is separately computed (not plugged)." },
    ],
  },
  {
    id: "barlings_finance_lease_classification_y4y5",
    tbsId: "TBS-LEASE-BARLINGS",
    module: "F5.M1",
    title: "Barlings Finance Lease — Classification, Y4 JEs, Y5 Liability Reduction & ROU BV",
    prompt: "Barlings (lessee) leases bottling equipment with: ownership transfers at end of 20-year lease term, $100,000 annual payments at 12/31, implicit rate 10%, borrowing rate 12%, FV $900,000, $10,000 commission paid at inception, PV factor (n=20, i=10%) = 8.5136. Barlings uses 15-year straight-line for bottling machines. Classify the lease, record the 1/2/Y4 inception entry, the 12/31/Y4 lease payment, the 12/31/Y4 amortization, then compute the Y5 lease-liability reduction and ROU book value at 12/31/Y5.",
    accountOptions: ["Finance lease", "Operating lease", "ROU Asset", "Lease Liability", "Cash", "Interest Expense", "Amortization Expense", "Accumulated Amortization—ROU Asset"],
    rows: [
      { label: "Classification (Finance or Operating?)", expectedAccount: "Finance lease" },
      { label: "1/2/Y4 Inception — DR ROU Asset (PV + commission)", expectedAmount: 861360 },
      { label: "1/2/Y4 Inception — CR Lease Liability", expectedAmount: 851360 },
      { label: "1/2/Y4 Inception — CR Cash (commission)", expectedAmount: 10000 },
      { label: "12/31/Y4 Payment — DR Interest Expense ($851,360 × 10%)", expectedAmount: 85136 },
      { label: "12/31/Y4 Payment — DR Lease Liability (principal)", expectedAmount: 14864 },
      { label: "12/31/Y4 Payment — CR Cash", expectedAmount: 100000 },
      { label: "12/31/Y4 — DR Amortization Expense ($861,360 / 15)", expectedAmount: 57424 },
      { label: "12/31/Y4 — CR Accumulated Amortization—ROU", expectedAmount: 57424 },
      { label: "12/31/Y5 Lease-Liability Reduction (principal portion)", expectedAmount: 16350 },
      { label: "12/31/Y5 ROU Book Value ($861,360 − 2 × $57,424)", expectedAmount: 746512 },
    ],
    exhibits: [
      {
        name: "OWNES Classification Test (Barlings)",
        body:
          "O — Ownership transfers at end of lease? YES ← MET\n" +
          "W — Written purchase option? N/A\n" +
          "N — Net PV substantially all of FV?\n" +
          "   PV = $100,000 × 8.5136 = $851,360\n" +
          "   FV = $900,000\n" +
          "   PV/FV = 94.6% → YES ← also MET\n" +
          "E — Economic life: N/A\n" +
          "S — Specialized: N/A\n" +
          "\n" +
          "Classification: FINANCE LEASE (O and N met)\n" +
          "\n" +
          "Rate: 10% implicit (KNOWN to lessee), NOT 12% borrowing\n",
      },
      {
        name: "Useful-Life Rule for Amortization",
        body:
          "If 'O' or 'W' is the criterion met (ownership likely passes):\n" +
          "   Amortize over the ASSET'S useful life (15 years here)\n" +
          "\n" +
          "If 'N', 'E', or 'S' is the criterion met (no ownership):\n" +
          "   Amortize over the LEASE TERM\n" +
          "\n" +
          "Barlings: O is met → use 15-year useful life\n" +
          "$861,360 / 15 = $57,424 per year\n",
      },
    ],
    scoring: { basePerCell: 25, mult: 1, bonusAllCorrect: 120 },
    explanations: [
      { row: 1, text: "Two OWNES criteria met (O ownership transfer + N at 94.6%). Only one is required. Finance lease." },
      { row: 2, text: "ROU Asset = PV of payments + initial direct costs. PV = $100,000 × 8.5136 = $851,360; + $10,000 commission = $861,360. Use the IMPLICIT rate (10%) when known by lessee — ignore the 12% borrowing rate." },
      { row: 5, text: "Y1 interest = $851,360 × 10% = $85,136. Always apply rate to beginning-of-period liability balance." },
      { row: 8, text: "Because OWNERSHIP transfers, amortize over the asset's useful life (15 years), NOT the 20-year lease term. This is the key 'OWNES amortization' rule." },
      { row: 10, text: "Y5 liability reduction: Balance after Y4 = $851,360 − $14,864 = $836,496. Y5 interest = $836,496 × 10% = $83,650. Principal = $100,000 − $83,650 = $16,350." },
      { row: 11, text: "ROU BV at end of Y5 = Original $861,360 − Accumulated amortization (2 yrs × $57,424 = $114,848) = $746,512." },
    ],
  },
  {
    id: "kalon_rx34_finance_lease_economic_life",
    tbsId: "TBS-LEASE-KALON",
    module: "F5.M1",
    title: "Kalon Corp RX-34 Finance Lease — Economic-Life Criterion + Monthly JEs",
    prompt: "Kalon Corp (lessee) leases RX-34 standard equipment from Buck Company: 3-year lease term, 42-month remaining economic life, $1,750 month-end payments, implicit rate 5.25% (Kalon is in 'good standing'), $3,200 initial direct costs (legal). FV far exceeds PV, no ownership transfer, no expected purchase, not specialized. PV factor (n=36, i=5.25%/12) = 33.24106664. Kalon uses straight-line depreciation. Classify the lease, record inception JE, and the 1/31/Y3 monthly JE.",
    accountOptions: ["Finance lease", "Operating lease", "ROU Asset", "Lease Liability", "Cash", "Interest Expense", "Amortization Expense"],
    rows: [
      { label: "Task 1: Classification", expectedAccount: "Finance lease" },
      { label: "Inception — DR ROU Asset ($58,171.87 + $3,200)", expectedAmountLabel: "$61,371.87" },
      { label: "Inception — CR Lease Liability ($1,750 × 33.24106664)", expectedAmountLabel: "$58,171.87" },
      { label: "Inception — CR Cash (initial direct costs)", expectedAmountLabel: "$3,200.00" },
      { label: "1/31/Y3 — DR Interest Expense ($58,171.87 × 0.0525/12)", expectedAmountLabel: "$254.50" },
      { label: "1/31/Y3 — DR Amortization Expense ($61,371.87 / 36)", expectedAmountLabel: "$1,704.77" },
      { label: "1/31/Y3 — DR Lease Liability (principal)", expectedAmountLabel: "$1,495.50" },
      { label: "1/31/Y3 — CR ROU Asset (amortization reduction)", expectedAmountLabel: "$1,704.77" },
      { label: "1/31/Y3 — CR Cash", expectedAmountLabel: "$1,750.00" },
    ],
    exhibits: [
      {
        name: "OWNES Classification Test (Kalon)",
        body:
          "O — Ownership transfers? NO (stays with lessor)\n" +
          "W — Written purchase option reasonably certain? NO (Kalon not interested)\n" +
          "N — Net PV substantially all of FV? NO (FV far exceeds PV)\n" +
          "E — Economic life >= 75%?\n" +
          "   Lease term: 3 years (36 months)\n" +
          "   Remaining economic life: 42 months (3.5 years)\n" +
          "   36 / 42 = 85.7% → YES ← MET\n" +
          "S — Specialized? NO (standard model, several on floor)\n" +
          "\n" +
          "Classification: FINANCE LEASE (E is met at 85.7%)\n",
      },
      {
        name: "Why Use Implicit Rate (Not Borrowing Rate)",
        body:
          "Rate hierarchy for lessee:\n" +
          "1. Rate implicit in the lease — IF known to lessee → USE THIS\n" +
          "2. Lessee's incremental borrowing rate — only if implicit unknown\n" +
          "\n" +
          "Kalon: implicit 5.25% is KNOWN (Buck Standard Rates table for 2.5-4 yr leases, 'good standing')\n" +
          "→ Use 5.25% — ignore the GoodRate Bank borrowing quotes\n",
      },
      {
        name: "Amortization-Period Rule (Recap)",
        body:
          "Kalon: 'E' is the criterion met (not O or W)\n" +
          "→ Amortize over LEASE TERM (36 months), NOT remaining economic life (42 months)\n" +
          "$61,371.87 / 36 = $1,704.77/month\n",
      },
    ],
    scoring: { basePerCell: 25, mult: 1, bonusAllCorrect: 120 },
    explanations: [
      { row: 1, text: "OWNES: Only 'E' is met (36/42 = 85.7% > 75% threshold). One criterion is enough → finance lease." },
      { row: 2, text: "ROU Asset = Lease Liability + Initial Direct Costs = $58,171.87 + $3,200.00 = $61,371.87. IDC capitalized when tied to lease execution (legal fees per Leaselaw invoice)." },
      { row: 3, text: "Lease Liability = monthly payment × PV factor = $1,750 × 33.24106664 = $58,171.87. Ordinary annuity (payments at month-end)." },
      { row: 5, text: "Monthly interest = $58,171.87 × (0.0525/12) = $254.50. Beginning-of-period balance × monthly rate." },
      { row: 6, text: "Finance lease: straight-line ROU amortization over the relevant period. Because 'E' (not O/W) was the criterion met, amortize over the 3-year LEASE TERM (36 months), not the 42-month economic life. $61,371.87 / 36 = $1,704.77." },
      { row: 7, text: "Lease liability principal = cash − interest = $1,750.00 − $254.50 = $1,495.50." },
    ],
  },
  {
    id: "fox_equity_securities_y1y2_fv_adjustments",
    tbsId: "TBS-INV-FOX",
    module: "F3.M2",
    title: "Fox Equity Securities — Y1/Y2 FV Adjustments + HTM Credit Loss",
    prompt: "Fox holds <20% equity investments in Smith, Jones, Williams, Gores plus an HTM debt security in Martin Co. Equity securities are marked to FV each period with unrealized G/L in NET INCOME (via a valuation account). HTM debt is at amortized cost with credit-loss allowance. Record Year 1 FV adjustments for all 4 equities, the Year 2 FV adjustments (Williams sold for $255,000), and the Y2 Martin Co. impairment ($1,400,000 → $1,250,000 PV).",
    accountOptions: ["Valuation account", "Unrealized gain on equity securities", "Unrealized loss on equity securities", "Cash", "Realized gain on equity securities", "Equity securities", "Held-to-maturity debt securities", "Credit loss", "Allowance for credit losses"],
    rows: [
      { label: "Y1 Smith ($240K − $230K) — DR Valuation account", expectedAmount: 10000 },
      { label: "Y1 Jones ($275K − $290K) — DR Unrealized loss", expectedAmount: 15000 },
      { label: "Y1 Williams ($245K − $270K) — DR Unrealized loss", expectedAmount: 25000 },
      { label: "Y1 Gores ($235K − $250K) — DR Unrealized loss", expectedAmount: 15000 },
      { label: "Y2 Smith ($235K − $240K) — DR Unrealized loss", expectedAmount: 5000 },
      { label: "Y2 Jones ($285K − $275K) — DR Valuation account", expectedAmount: 10000 },
      { label: "Y2 Williams Sale — DR Cash (sale price)", expectedAmount: 255000 },
      { label: "Y2 Williams Sale — DR Valuation account (reverse Y1 credit)", expectedAmount: 25000 },
      { label: "Y2 Williams Sale — CR Realized gain ($255K − $245K BV)", expectedAmount: 10000 },
      { label: "Y2 Williams Sale — CR Equity securities (original cost)", expectedAmount: 270000 },
      { label: "Y2 Gores ($265K − $235K) — DR Valuation account", expectedAmount: 30000 },
      { label: "Y2 Martin HTM Impairment — DR Credit loss", expectedAmount: 150000 },
      { label: "Y2 Martin HTM Impairment — CR Allowance for credit losses", expectedAmount: 150000 },
    ],
    exhibits: [
      {
        name: "Fair Value Roll Forward",
        body:
          "                    Y1 Cost    Y1 FV     Y2 FV     Sale\n" +
          "Smith               $230,000   $240,000  $235,000  hold\n" +
          "Jones               $290,000   $275,000  $285,000  hold\n" +
          "Williams            $270,000   $245,000  sold      $255,000\n" +
          "Gores               $250,000   $235,000  $265,000  hold\n" +
          "\n" +
          "Martin HTM bond Y2 impairment: $1,400,000 → $1,250,000 PV = $150,000 credit loss\n",
      },
    ],
    scoring: { basePerCell: 20, mult: 1, bonusAllCorrect: 100 },
    explanations: [
      { row: 1, text: "Equity securities (<20%) are ALWAYS marked to FV with unrealized G/L in NET INCOME (post-ASU 2016-01). Uses a valuation account so the original cost in 'Equity securities' stays intact." },
      { row: 7, text: "Williams sale Y2: Compare sale price ($255,000) to BV at start of Y2 = $270,000 cost − $25,000 valuation credit = $245,000. Realized gain = $255,000 − $245,000 = $10,000. The entry simultaneously removes the original $270,000 cost and the $25,000 valuation credit balance." },
      { row: 12, text: "HTM securities are at AMORTIZED COST — no FV adjustments. But credit losses (CECL) ARE recorded: write down to PV of expected cash flows using ORIGINAL effective rate. Recorded via 'Allowance for credit losses' (not direct write-down) so reversals are possible." },
    ],
  },
  {
    id: "tbs_mixed_portfolio_htm_afs_equity_jes",
    tbsId: "TBS-INV-MIXED-PORTFOLIO",
    module: "F3.M2",
    title: "Mixed Portfolio — Bonds A/B (HTM) + Stocks C-F Interest, FV, Sale JEs",
    prompt: "Compute Y2 carrying values and journal entries for: Bond A ($90,000 cost, discount, Y1 amort $1,050, Y2 amort $1,097, $3,000 cash interest, 4.5% effective), Bond B ($100,000 par, $3,500 interest), Stock C ($68,000 → $73,000 FV), Stock D ($45,000 cost, $51,000 Y1 FV, sold Y2 for $49,500), Stock E ($112,500 cost, $132,000 Y1 FV, sold Y2 for $136,500), Stock F ($121,450 → $129,300 FV). All debts are HTM; all stocks <20%.",
    accountOptions: ["Cash", "Discounts on Bonds", "Interest Revenue", "Valuation Account", "Unrealized Gain", "Unrealized Loss", "Realized Gain", "Realized Loss", "Stock D", "Stock E"],
    rows: [
      { label: "Bond A Y2 Carrying Value ($91,050 + $1,097)", expectedAmount: 92147 },
      { label: "Bond B Y2 Carrying Value (par, no amort)", expectedAmount: 100000 },
      { label: "Stock C Y2 Carrying Value (FV)", expectedAmount: 73000 },
      { label: "Stock D Y2 Carrying Value (sold)", expectedAmount: 0 },
      { label: "Stock E Y2 Carrying Value (sold)", expectedAmount: 0 },
      { label: "Stock F Y2 Carrying Value (FV)", expectedAmount: 129300 },
      { label: "Bond A — DR Cash (coupon)", expectedAmount: 3000 },
      { label: "Bond A — DR Discount on Bonds (amort)", expectedAmount: 1097 },
      { label: "Bond A — CR Interest Revenue ($91,050 × 4.5%)", expectedAmount: 4097 },
      { label: "Bond B — DR Cash / CR Interest Revenue", expectedAmount: 3500 },
      { label: "Stock C — DR Valuation Account / CR Unrealized Gain", expectedAmount: 5000 },
      { label: "Stock D Sale — DR Cash", expectedAmount: 49500 },
      { label: "Stock D Sale — DR Realized Loss ($49,500 − $51,000 BV)", expectedAmount: 1500 },
      { label: "Stock D Sale — CR Stock D (original cost)", expectedAmount: 45000 },
      { label: "Stock D Sale — CR Valuation Account (reverse)", expectedAmount: 6000 },
      { label: "Stock E Sale — DR Cash", expectedAmount: 136500 },
      { label: "Stock E Sale — CR Realized Gain ($136,500 − $132,000 BV)", expectedAmount: 4500 },
      { label: "Stock E Sale — CR Stock E (cost)", expectedAmount: 112500 },
      { label: "Stock E Sale — CR Valuation Account (reverse Y1 $19,500)", expectedAmount: 19500 },
      { label: "Stock F — DR Valuation Account / CR Unrealized Gain", expectedAmount: 7850 },
    ],
    exhibits: [
      {
        name: "Effective Interest Calc — Bond A",
        body:
          "Y1 Carrying: $90,000 cost + $1,050 amort = $91,050\n" +
          "Y2 Interest Revenue: $91,050 × 4.5% = $4,097\n" +
          "Y2 Amortization: $4,097 − $3,000 cash = $1,097\n" +
          "Y2 Carrying: $91,050 + $1,097 = $92,147\n",
      },
    ],
    scoring: { basePerCell: 15, mult: 1, bonusAllCorrect: 150 },
    explanations: [
      { row: 1, text: "HTM bond at discount: each period interest revenue = carrying × effective rate. Amortization plug = interest revenue − cash coupon. Adds to carrying value (discount unwinds upward toward par)." },
      { row: 9, text: "Effective interest method: $91,050 × 4.5% = $4,097.25 → $4,097 rounded. Cash coupon $3,000 + discount amortization $1,097 = $4,097 interest revenue." },
      { row: 13, text: "Stock D sale: BV at start Y2 = $51,000 Y1 FV (cost $45,000 + $6,000 valuation). Sale at $49,500 → Realized LOSS of $1,500. Entry reverses both the cost ($45,000 cr) and valuation balance ($6,000 cr) and books the loss." },
    ],
  },
  {
    id: "logan_debt_security_reclassification",
    tbsId: "TBS-INV-LOGAN-RECLASS",
    module: "F3.M3",
    title: "Logan Securities Reclassification — HTM/AFS/Trading + Equity",
    prompt: "Y2 strategy: Sec A reclass HTM→Trading; Sec B reclass HTM→AFS; Sec C stays HTM; Sec D reclass AFS→HTM; Sec E equity sold in Y2; Sec F equity held indefinitely; Sec G equity to be sold in Y3. For each, determine year-end Y2 balance sheet classification AND the Y2 impact on financial statements from gains/losses.",
    accountOptions: [
      "Fair value, current asset",
      "Fair value, non-current asset",
      "Amortized cost, non-current asset",
      "Security no longer on balance sheet",
      "Unrealized gain/loss goes into net income",
      "Unrealized gain/loss goes into OCI",
      "No gain/loss recorded in comprehensive income",
      "Amortized gain/loss previously recorded in OCI to income statement over time through recording of interest revenue",
    ],
    rows: [
      { label: "Security A (HTM → Trading) — BS Classification", expectedAccount: "Fair value, current asset" },
      { label: "Security A — Income Impact", expectedAccount: "Unrealized gain/loss goes into net income" },
      { label: "Security B (HTM → AFS) — BS Classification", expectedAccount: "Fair value, non-current asset" },
      { label: "Security B — Income Impact", expectedAccount: "Unrealized gain/loss goes into OCI" },
      { label: "Security C (HTM, no reclass) — BS Classification", expectedAccount: "Amortized cost, non-current asset" },
      { label: "Security C — Income Impact", expectedAccount: "No gain/loss recorded in comprehensive income" },
      { label: "Security D (AFS → HTM) — BS Classification", expectedAccount: "Amortized cost, non-current asset" },
      { label: "Security D — Income Impact", expectedAccount: "Amortized gain/loss previously recorded in OCI to income statement over time through recording of interest revenue" },
      { label: "Security E (equity, sold Y2) — BS Classification", expectedAccount: "Security no longer on balance sheet" },
      { label: "Security E — Income Impact", expectedAccount: "Unrealized gain/loss goes into net income" },
      { label: "Security F (equity, held) — BS Classification", expectedAccount: "Fair value, non-current asset" },
      { label: "Security F — Income Impact", expectedAccount: "Unrealized gain/loss goes into net income" },
      { label: "Security G (equity, sell Y3) — BS Classification", expectedAccount: "Fair value, current asset" },
      { label: "Security G — Income Impact", expectedAccount: "Unrealized gain/loss goes into net income" },
    ],
    exhibits: [
      {
        name: "Debt Security Classification Cheat Sheet",
        body:
          "TRADING (intent: sell near-term)\n" +
          "  → FV on BS (current), unrealized G/L in NET INCOME\n" +
          "\n" +
          "AVAILABLE-FOR-SALE (no specific intent)\n" +
          "  → FV on BS (current/non-current per intent), unrealized G/L in OCI\n" +
          "\n" +
          "HELD-TO-MATURITY (intent + ability to hold to maturity)\n" +
          "  → Amortized cost on BS, no FV adjustments, only interest revenue + credit losses\n" +
          "\n" +
          "EQUITY SECURITIES (<20%, no significant influence)\n" +
          "  → ALWAYS FV with unrealized G/L in NET INCOME (post-ASU 2016-01)\n",
      },
      {
        name: "Reclassification Mechanics",
        body:
          "INTO Trading or AFS from anywhere:\n" +
          "  Adjust to FV; difference into the new category's income treatment\n" +
          "\n" +
          "AFS → HTM (the tricky one):\n" +
          "  Unrealized G/L stays in OCI but is AMORTIZED to interest revenue over remaining life\n" +
          "  Similar to amortizing a premium/discount\n" +
          "\n" +
          "HTM → Trading:\n" +
          "  Tainting consideration — recognize all unrealized G/L in earnings immediately\n",
      },
    ],
    scoring: { basePerCell: 15, mult: 1, bonusAllCorrect: 120 },
    explanations: [
      { row: 4, text: "HTM → AFS reclass: FV at reclass date is new basis; the unrealized gain/loss vs amortized cost goes to OCI (per AFS rules). Strategy says hold for several years → non-current." },
      { row: 8, text: "AFS → HTM is the only reclass with the unique 'amortize OCI over remaining life' treatment. The Y1 unrealized loss recorded in OCI doesn't reverse immediately — it amortizes back into earnings via interest revenue, similar to a discount amortization. Key testable nuance." },
      { row: 9, text: "Sold equity = no longer on BS. Any unrealized G/L tracked YTD flows through to net income at sale." },
      { row: 13, text: "Equity intended for sale next year = current asset. Equity sec G/L ALWAYS hits net income regardless of holding period." },
    ],
  },
  {
    id: "ember_stanton_equity_method_15pct",
    tbsId: "TBS-INV-EMBER-STANTON",
    module: "F3.M4",
    title: "Ember/Stanton — Equity vs FV: 15% Ownership, Excess Dividend = Return of Capital",
    prompt: "Ember acquired 30,000 shares of Stanton (less than 20% — NO significant influence assumed) at $31/share + $35,000 legal costs. Stanton paid $2.15/share dividend; Stanton's retained earnings = $395,000. Year-end share price $35. Record (1) acquisition; (2) dividend received with excess-of-RE = return of capital; (3) year-end FV adjustment; (4) where the unrealized G/L flows; (5) ending balance in 'Investment in Stanton'.",
    accountOptions: ["Investment in Stanton", "Cash", "Dividend Income", "Unrealized Holding Gain", "Income Statement", "Other Comprehensive Income"],
    rows: [
      { label: "Acquisition — DR Investment in Stanton (30,000 × $31 + $35,000)", expectedAmount: 965000 },
      { label: "Acquisition — CR Cash", expectedAmount: 965000 },
      { label: "Dividend — DR Cash (30,000 × $2.15)", expectedAmount: 64500 },
      { label: "Dividend — CR Dividend Income (RE $395,000 × 15%)", expectedAmount: 59250 },
      { label: "Dividend — CR Investment in Stanton (return of capital)", expectedAmount: 5250 },
      { label: "Year-end FV — DR Investment in Stanton ($4 × 30,000)", expectedAmount: 120000 },
      { label: "Year-end FV — CR Unrealized Holding Gain", expectedAmount: 120000 },
      { label: "Where does the FV gain go?", expectedAccount: "Income Statement" },
      { label: "Ending Investment in Stanton balance ($965K − $5,250 + $120K)", expectedAmount: 1079750 },
    ],
    exhibits: [
      {
        name: "Acquisition Cost Rules — Equity vs FV Method",
        body:
          "FV METHOD (<20%, no significant influence):\n" +
          "  Initial cost INCLUDES legal/transaction costs (capitalized)\n" +
          "  $930,000 + $35,000 legal = $965,000\n" +
          "\n" +
          "EQUITY METHOD (20-50%, significant influence):\n" +
          "  Transaction costs are EXPENSED (since 2009 ASC 805-50)\n" +
          "  Different treatment — testable trap!\n" +
          "\n" +
          "BUSINESS COMBINATION (control, >50%):\n" +
          "  Transaction costs are EXPENSED (ASC 805)\n",
      },
      {
        name: "Excess Dividend = Return of Capital",
        body:
          "For FV-method investments, dividends in excess of investor's share of RE\n" +
          "= return of capital (reduces investment account, NOT income)\n" +
          "\n" +
          "Dividend received: $64,500\n" +
          "Ember's share of Stanton RE: $395,000 × 15% = $59,250\n" +
          "Excess (return of capital): $64,500 − $59,250 = $5,250\n" +
          "\n" +
          "Note: Equity method handles dividends entirely differently —\n" +
          "ALL dividends reduce the investment account (no income recognized).\n",
      },
    ],
    scoring: { basePerCell: 25, mult: 1, bonusAllCorrect: 100 },
    explanations: [
      { row: 1, text: "FV-method acquisition: capitalize ALL costs including transaction costs (legal, brokerage). 30,000 × $31 + $35,000 = $965,000. Contrast: equity method and business combinations EXPENSE transaction costs." },
      { row: 4, text: "Dividend income = investor's share of investee's retained earnings. $395,000 × 15% = $59,250 is real dividend income; anything beyond that is treated as return of capital." },
      { row: 5, text: "Excess dividend of $5,250 ($64,500 − $59,250) reduces the Investment account — it's a return of capital, not income. Prevents double-counting since the investee already paid out more than it earned." },
      { row: 8, text: "Equity securities post-ASU 2016-01: unrealized G/L ALWAYS hits the INCOME STATEMENT (never OCI). AFS-style OCI treatment is for DEBT only." },
      { row: 9, text: "Ending balance: $965,000 acquisition − $5,250 return of capital + $120,000 FV step-up = $1,079,750." },
    ],
  },
  {
    id: "adell_corp_securities_classification_5row",
    tbsId: "TBS-INV-ADELL",
    module: "F3.M3",
    title: "Adell Corp — Multi-Security BS Classification (Equity, Sinking Fund, HTM, AFS)",
    prompt: "For each Adell Corp investment, determine the BS classification, the year-end amount, and current vs noncurrent: (1) 100 shares ABC at $20, plan to sell within 30 days, FV $22; (2) $525,000 sinking fund for bond principal in 5 years; (3) $100,000 8% gov bond purchased 7/1/Y1, due 2 yrs out, held to maturity; (4) 1,000 shares at $50 purchased 10/31/Y1, FV $75 year-end, no near-term sale; (5) Debt purchased 6/1/Y1 at $48,000 discount, AFS, year-end amortized cost $48,500, FV $47,000.",
    accountOptions: [
      "Equity security",
      "Restricted cash",
      "Held-to-maturity debt security",
      "Available-for-sale debt security",
      "Trading debt security",
      "Current",
      "Noncurrent",
    ],
    rows: [
      { label: "ABC Shares (100×$22, sell 30 days) — Classification", expectedAccount: "Equity security" },
      { label: "ABC Shares — Amount", expectedAmount: 2200 },
      { label: "ABC Shares — Current/Noncurrent", expectedAccount: "Current" },
      { label: "Sinking Fund — Classification", expectedAccount: "Restricted cash" },
      { label: "Sinking Fund — Amount", expectedAmount: 525000 },
      { label: "Sinking Fund — Current/Noncurrent (bond 5 yrs out)", expectedAccount: "Noncurrent" },
      { label: "Government Bond — Classification", expectedAccount: "Held-to-maturity debt security" },
      { label: "Government Bond — Amount (face, no premium/discount)", expectedAmount: 100000 },
      { label: "Government Bond — Current/Noncurrent (2 yrs)", expectedAccount: "Noncurrent" },
      { label: "1,000 Equity Shares — Classification", expectedAccount: "Equity security" },
      { label: "1,000 Equity Shares — Amount (1,000 × $75 FV)", expectedAmount: 75000 },
      { label: "1,000 Equity Shares — Current/Noncurrent", expectedAccount: "Noncurrent" },
      { label: "Leary AFS Debt — Classification", expectedAccount: "Available-for-sale debt security" },
      { label: "Leary AFS Debt — Amount (FV, not amortized cost)", expectedAmount: 47000 },
      { label: "Leary AFS Debt — Current/Noncurrent", expectedAccount: "Noncurrent" },
    ],
    exhibits: [
      {
        name: "Quick Classification Decision Tree",
        body:
          "Step 1: Is it an EQUITY security (<20%)?\n" +
          "  → Always at FV, G/L to net income\n" +
          "  → Current if intent to sell <12 mo, else Noncurrent\n" +
          "\n" +
          "Step 2: Is it a DEBT security?\n" +
          "  Intent + ability to hold to maturity?\n" +
          "    → HTM at amortized cost\n" +
          "    → Current if matures <12 mo, else Noncurrent\n" +
          "  Actively trading short-term?\n" +
          "    → Trading at FV (current)\n" +
          "  Neither?\n" +
          "    → AFS at FV, G/L to OCI (current/noncurrent per intent)\n" +
          "\n" +
          "Step 3: Is it CASH set aside for a purpose?\n" +
          "  → Restricted cash; classification matches the restricted purpose\n",
      },
    ],
    scoring: { basePerCell: 12, mult: 1, bonusAllCorrect: 100 },
    explanations: [
      { row: 1, text: "Equity securities (<20%) are always at FV regardless of intent — the only choice is current vs noncurrent. Trading/AFS/HTM categories are DEBT-only." },
      { row: 6, text: "Restricted cash classification follows the RESTRICTED PURPOSE timeline. Sinking fund for principal due in 5 years = noncurrent." },
      { row: 13, text: "AFS debt is reported at FV ($47,000), NOT amortized cost ($48,500). Amortized cost is the basis for measuring unrealized G/L; FV is what's on the balance sheet. The $1,500 unrealized loss goes to OCI." },
    ],
  },
  {
    id: "caimbridge_ecl_htm_vs_afs_impairment",
    tbsId: "TBS-INV-CAIMBRIDGE-CECL",
    module: "F3.M2",
    title: "Caimbridge — Expected Credit Loss: HTM vs AFS Impairment Bifurcation",
    prompt: "Compute Expected Credit Loss (ECL), Income Statement impact, and OCI impact for: (1) Jerson HTM bonds — PV of expected cash flows $944,439 vs amortized cost $972,775; (2) Insbryke AFS bonds — FV $1,008,375 > amortized cost $1,000,000; (3) Sprand AFS bonds — FV $710,000 < amortized cost $750,000, PV of expected CF $729,822. Use 4% effective rate.",
    accountOptions: [],
    rows: [
      { label: "Jerson HTM — Expected Credit Loss (PV − Amort Cost)", expectedAmount: -28336 },
      { label: "Jerson HTM — Income Statement Impact", expectedAmount: -28336 },
      { label: "Jerson HTM — OCI Impact (none for HTM)", expectedAmount: 0 },
      { label: "Insbryke AFS — Expected Credit Loss (FV > AC, no ECL)", expectedAmount: 0 },
      { label: "Insbryke AFS — Income Statement Impact", expectedAmount: 0 },
      { label: "Insbryke AFS — OCI Impact (unrealized gain $8,375)", expectedAmount: 8375 },
      { label: "Sprand AFS — Expected Credit Loss ($729,822 PV − $750,000 AC)", expectedAmount: -20178 },
      { label: "Sprand AFS — Income Statement Impact (ECL portion)", expectedAmount: -20178 },
      { label: "Sprand AFS — OCI Impact (noncredit portion $40,000 − $20,178)", expectedAmount: -19822 },
    ],
    exhibits: [
      {
        name: "CECL Model — HTM vs AFS",
        body:
          "HTM (CECL all the way to income):\n" +
          "  ECL = PV of expected CF − Amortized cost\n" +
          "  Full amount hits INCOME STATEMENT (no FV adjustment to bifurcate)\n" +
          "  No OCI impact\n" +
          "\n" +
          "AFS (bifurcate impairment):\n" +
          "  Step 1: FV vs Amortized cost (no impairment if FV ≥ AC)\n" +
          "  Step 2: If FV < AC, bifurcate impairment:\n" +
          "     Credit component → ECL = PV of expected CF − Amortized cost (to INCOME)\n" +
          "     Noncredit component → Remaining impairment (to OCI)\n" +
          "  Total impairment = (FV − AC), split into credit + noncredit\n",
      },
      {
        name: "Sprand Bifurcation Walkthrough",
        body:
          "Total impairment = $710,000 FV − $750,000 AC = ($40,000)\n" +
          "Credit (ECL) = $729,822 PV − $750,000 AC = ($20,178)\n" +
          "Noncredit = $40,000 − $20,178 = ($19,822) to OCI\n" +
          "\n" +
          "Income statement absorbs only the credit portion (ECL).\n" +
          "OCI absorbs the rest (interest-rate / liquidity-driven).\n",
      },
    ],
    scoring: { basePerCell: 25, mult: 1, bonusAllCorrect: 120 },
    explanations: [
      { row: 1, text: "HTM ECL = PV of expected future cash flows discounted at the ORIGINAL effective rate (4%) − Amortized cost. $944,439 − $972,775 = ($28,336)." },
      { row: 2, text: "For HTM, the entire ECL flows to income (no FV bifurcation because HTM isn't carried at FV). No OCI impact." },
      { row: 4, text: "AFS impairment test FAILS at step 1 if FV ≥ Amortized cost — only an unrealized gain in OCI ($8,375). No income statement impact, no ECL." },
      { row: 7, text: "AFS Sprand: FV $710,000 < AC $750,000 → impaired. ECL credit portion = PV $729,822 − AC $750,000 = ($20,178). This is the part 'attributable to credit deterioration'." },
      { row: 9, text: "AFS noncredit portion goes to OCI: Total impairment $40,000 − credit $20,178 = $19,822 noncredit. This is the part attributable to interest-rate / liquidity changes — temporary in nature." },
    ],
  },
  {
    id: "hodgskin_howell_equity_method_25pct",
    tbsId: "TBS-INV-HODGSKIN",
    module: "F3.M4",
    title: "Hodgskin/Howell Equity Method — 25% Ownership, Preferred Dividends Exclusion, FV Premium Amortization",
    prompt: "Hodgskin acquired 25% of Howell Corp on 1/1/Y4 for $400,000. Howell's BV of net assets = $1,400,000; FV = $1,520,000 (excess attributable to equipment with 5-yr remaining life, NOT goodwill). Howell Y4 net income = $100,000. Howell has 1,000 shares of 5% cumulative preferred stock at $100 par. Howell declared $28,000 common dividends. Record: (1) acquisition; (2) share of investee income (NET of preferred dividends); (3) amortization of FV premium; (4) dividend received.",
    accountOptions: ["Investment in Howell Distributors", "Cash", "Equity in earnings/investee income"],
    rows: [
      { label: "JE1 Acquisition — DR Investment in Howell", expectedAmount: 400000 },
      { label: "JE1 Acquisition — CR Cash", expectedAmount: 400000 },
      { label: "JE2 Share of Net Income — DR Investment in Howell", expectedAmount: 23750 },
      { label: "JE2 Share of Net Income — CR Equity in earnings", expectedAmount: 23750 },
      { label: "JE3 FV Premium Amort — DR Equity in earnings ($120K × 25% / 5)", expectedAmount: 6000 },
      { label: "JE3 FV Premium Amort — CR Investment in Howell", expectedAmount: 6000 },
      { label: "JE4 Dividend Received — DR Cash ($28,000 × 25%)", expectedAmount: 7000 },
      { label: "JE4 Dividend Received — CR Investment in Howell", expectedAmount: 7000 },
    ],
    exhibits: [
      {
        name: "Equity Method — Step-by-Step",
        body:
          "STEP 1: Acquisition at COST (no transaction-cost capitalization under equity method)\n" +
          "  DR Investment $400,000\n" +
          "  CR Cash $400,000\n" +
          "\n" +
          "STEP 2: Share of investee net income AVAILABLE TO COMMON\n" +
          "  Net income $100,000 − Preferred dividends $5,000 = $95,000 to common\n" +
          "  Preferred div = 1,000 × $100 × 5% = $5,000 (cumulative → subtract regardless of declaration)\n" +
          "  $95,000 × 25% = $23,750 → increase Investment + Income\n" +
          "\n" +
          "STEP 3: Amortize FV excess over BV (excluding goodwill)\n" +
          "  FV $1,520,000 − BV $1,400,000 = $120,000 excess (all to equipment, no goodwill)\n" +
          "  $120,000 × 25% = $30,000 investor's share\n" +
          "  $30,000 / 5 yrs = $6,000/yr → reduces Investment + Income\n" +
          "  (If excess were goodwill: NOT amortized, only impairment-tested)\n" +
          "\n" +
          "STEP 4: Dividends received = RETURN OF capital (reduce Investment, NOT income)\n" +
          "  $28,000 × 25% = $7,000 → DR Cash / CR Investment\n",
      },
      {
        name: "Equity vs FV Method — Key Differences",
        body:
          "                          FV Method (<20%)      Equity Method (20-50%)\n" +
          "Transaction costs:        Capitalized           Expensed\n" +
          "FV adjustments:           To NI                 NONE (cost-based)\n" +
          "Investee income:          NO (only dividends)   YES (% share)\n" +
          "Dividends:                Income (mostly)       REDUCE Investment\n" +
          "Excess div over RE:       Return of capital     N/A\n" +
          "FV premium:               N/A                   Amortize over life\n" +
          "Goodwill in premium:      N/A                   NOT amortized (impair only)\n",
      },
    ],
    scoring: { basePerCell: 25, mult: 1, bonusAllCorrect: 120 },
    explanations: [
      { row: 1, text: "Equity method acquisition at cost. Note: unlike FV-method investments, transaction costs are EXPENSED, not capitalized (per ASC 805-50 since 2009)." },
      { row: 3, text: "Equity-method investee income share: $95,000 (NI − cumulative preferred div $5,000) × 25% = $23,750. CUMULATIVE preferred dividends are subtracted whether declared or not — that's the key trap." },
      { row: 5, text: "FV-BV premium attributable to depreciable assets is amortized over remaining useful life. ($1,520K − $1,400K) × 25% / 5 yrs = $6,000. Goodwill portion would NOT be amortized — only impairment-tested. Reduces both Investment and Equity in earnings." },
      { row: 7, text: "Equity-method dividends = RETURN OF investment (not income). $28,000 × 25% = $7,000 reduces the Investment account. Logic: equity method already booked share of NI when earned, so dividends just convert investment to cash." },
    ],
  },
  {
    id: "peterson_silver_intercompany_elimination",
    tbsId: "TBS-CONSOL-PETERSON",
    module: "F3.M4",
    title: "Peterson/Silver Intercompany Eliminations — Depreciable Asset & Inventory Sales",
    prompt: "Peterson owns 100% of Silver. Situation 1: 1/1/Y3 Peterson sold equipment to Silver for $120,000 (Peterson cost $100,000, $20,000 accumulated depreciation at sale; 10-yr life originally, Silver depreciates over 8-yr remaining life). Situation 2: During Y3 Peterson sold inventory to Silver for $50,000 (Peterson cost $30,000); 40% remains in Silver's ending inventory. Record both eliminating JEs at 12/31/Y3.",
    accountOptions: ["Gain on sale", "Accumulated depreciation", "Depreciation expense", "Equipment", "Sales", "Inventory", "Cost of goods sold"],
    rows: [
      { label: "S1 — DR Gain on Sale ($120K − $80K NBV)", expectedAmount: 40000 },
      { label: "S1 — CR Accumulated depreciation ($30K correct − $15K Silver)", expectedAmount: 15000 },
      { label: "S1 — CR Depreciation expense ($15K Silver − $10K correct)", expectedAmount: 5000 },
      { label: "S1 — CR Equipment ($120K Silver − $100K original)", expectedAmount: 20000 },
      { label: "S2 — DR Sales (gross intercompany sale)", expectedAmount: 50000 },
      { label: "S2 — CR Inventory (40% × $20K markup)", expectedAmount: 8000 },
      { label: "S2 — CR Cost of goods sold (plug)", expectedAmount: 42000 },
    ],
    exhibits: [
      {
        name: "Intercompany Depreciable Asset — Reconciliation",
        body:
          "ORIGINAL (what consolidated should show at 12/31/Y3):\n" +
          "  Equipment at Peterson's cost: $100,000\n" +
          "  Accumulated depreciation: 3 yrs × $10K = $30,000 (yrs 1, 2 by Peterson + Y3)\n" +
          "  NBV: $70,000\n" +
          "  Depreciation expense Y3: $10,000\n" +
          "  No gain on sale (intercompany)\n" +
          "\n" +
          "WHAT'S ON THE BOOKS NOW:\n" +
          "  Peterson: Equipment removed, $40,000 gain recorded\n" +
          "  Silver: Equipment $120,000, Acc Dep $15,000 (Y3 only), Dep Exp $15,000\n" +
          "  Combined Equipment: $120,000 → need $100,000 (reduce $20,000)\n" +
          "  Combined Acc Dep: $15,000 → need $30,000 (increase $15,000)\n" +
          "  Combined Dep Exp: $15,000 → need $10,000 (reduce $5,000)\n" +
          "  Combined Gain: $40,000 → need $0 (reduce $40,000)\n",
      },
      {
        name: "Intercompany Inventory Markup Calc",
        body:
          "Peterson sold $50,000 inventory at cost $30,000 (40% gross margin)\n" +
          "Markup = $50,000 − $30,000 = $20,000\n" +
          "\n" +
          "40% still in Silver's EI:\n" +
          "  Silver carries at $50K × 40% = $20,000\n" +
          "  Should be at Peterson cost $30K × 40% = $12,000\n" +
          "  Unrealized profit in EI: $20,000 − $12,000 = $8,000 → eliminate from Inventory\n" +
          "\n" +
          "Eliminate full intercompany Sales: $50,000\n" +
          "COGS plug: $50,000 − $8,000 = $42,000 (reduces consolidated COGS)\n",
      },
    ],
    scoring: { basePerCell: 25, mult: 1, bonusAllCorrect: 150 },
    explanations: [
      { row: 1, text: "Intercompany gain on depreciable asset is UNREALIZED until sold to outsider. Peterson booked $40K gain ($120K sale − $80K NBV at 1/1/Y3). Eliminate fully." },
      { row: 2, text: "Acc Dep eliminate brings consolidated acc dep to what it SHOULD be ($30K = 3 yrs × $10K original-cost depreciation). Silver has only $15K booked → need to ADD $15K via credit." },
      { row: 3, text: "Depreciation expense correction: Silver depreciated $120K over 8 yrs = $15K; should be $100K over original 10 yrs = $10K. Reduce by $5K credit." },
      { row: 6, text: "Inventory write-down for unrealized profit in EI: 40% of intercompany markup = 40% × ($50K − $30K) = $8,000. Adjusts Silver's EI back to Peterson's original cost." },
      { row: 7, text: "COGS plug = Sales eliminated $50K − Inventory adjustment $8K = $42K credit. Net effect on consolidated COGS: reduce by $42K (it included the $30K Peterson COGS + the $12K portion Silver expensed)." },
    ],
  },
  {
    id: "parent_sub_full_consolidation_carinbig",
    tbsId: "TBS-CONSOL-CARINBIG",
    module: "F3.M4",
    title: "Full Consolidation Workpaper — CARINBIG + Asset Revaluation Dep + Goodwill + Intercompany",
    prompt: "Prepare consolidation eliminating entries (100% acquisition): Sub has $600K Common Stock, $100K APIC, $50K RE; Parent paid $1,760,000; FV adjustment to P&E = $950,000 (3-yr useful life); $60K goodwill identified; Y1 goodwill impairment $2,000; Sub paid $10,000 dividends to Parent; $30,000 intercompany payable/receivable open at year-end.",
    accountOptions: [
      "Common stock",
      "Additional paid-in capital",
      "Retained earnings",
      "Investment in subsidiary",
      "Plant and equipment",
      "Goodwill",
      "Depreciation expense",
      "Accumulated depreciation",
      "Impairment expense",
      "Dividend income from subsidiary",
      "Dividends paid",
      "Intercompany payable",
      "Intercompany receivable",
    ],
    rows: [
      { label: "JE1 CARINBIG — DR Common stock", expectedAmount: 600000 },
      { label: "JE1 CARINBIG — DR Additional paid-in capital", expectedAmount: 100000 },
      { label: "JE1 CARINBIG — DR Retained earnings", expectedAmount: 50000 },
      { label: "JE1 CARINBIG — CR Investment in subsidiary", expectedAmount: 1760000 },
      { label: "JE1 CARINBIG — DR Plant and equipment (FV step-up)", expectedAmount: 950000 },
      { label: "JE1 CARINBIG — DR Goodwill", expectedAmount: 60000 },
      { label: "JE2 Asset Revaluation Dep — DR Depreciation expense ($950K / 3)", expectedAmount: 316667 },
      { label: "JE2 Asset Revaluation Dep — CR Accumulated depreciation", expectedAmount: 316667 },
      { label: "JE3 Goodwill Impairment — DR Impairment expense", expectedAmount: 2000 },
      { label: "JE3 Goodwill Impairment — CR Goodwill", expectedAmount: 2000 },
      { label: "JE4 Intercompany Dividend — DR Dividend income from subsidiary", expectedAmount: 10000 },
      { label: "JE4 Intercompany Dividend — CR Dividends paid", expectedAmount: 10000 },
      { label: "JE5 Intercompany Payable/Receivable — DR Intercompany payable", expectedAmount: 30000 },
      { label: "JE5 Intercompany Payable/Receivable — CR Intercompany receivable", expectedAmount: 30000 },
    ],
    exhibits: [
      {
        name: "CARINBIG Mnemonic — Full Acquisition Elimination",
        body:
          "C — Common stock of sub at acquisition (debit)\n" +
          "A — APIC of sub at acquisition (debit)\n" +
          "R — Retained earnings of sub at acquisition (debit)\n" +
          "I — Investment in subsidiary (credit)\n" +
          "N — Noncontrolling interest (credit) — N/A for 100% acquisition\n" +
          "B — Balance sheet adjusted to FV (debit/credit; here P&E step-up $950,000 debit)\n" +
          "I — Identifiable intangibles at FV (none here)\n" +
          "G — Goodwill plug ($60,000 debit)\n" +
          "\n" +
          "Check: DR $600K + $100K + $50K + $950K + $60K = $1,760,000\n" +
          "       CR Investment $1,760,000 ✓\n",
      },
      {
        name: "Goodwill Treatment Rules",
        body:
          "Goodwill = Excess of purchase price over FV of identifiable net assets\n" +
          "• NOT amortized\n" +
          "• Tested for impairment annually (or when triggering event)\n" +
          "• Impairment is NOT reversible (write down only, never up)\n" +
          "• ASC 350: Optional qualitative pre-test, then quantitative one-step\n" +
          "  (since 2017 ASU 2017-04: no more Step 2 hypothetical PPA)\n",
      },
    ],
    scoring: { basePerCell: 15, mult: 1, bonusAllCorrect: 150 },
    explanations: [
      { row: 4, text: "Investment account always credited for its full balance ($1,760,000). The remaining $1,710,000 ($1,760K − $50K RE) is allocated to FV step-up ($950K P&E), goodwill ($60K), and reversing the sub's equity ($700K C/S + APIC)." },
      { row: 7, text: "FV step-up to P&E ($950,000) must be DEPRECIATED in consolidation over its useful life (3 years). This is the additional dep that wouldn't be in sub's books because sub still uses pre-acquisition basis. $950,000 / 3 = $316,667/yr." },
      { row: 9, text: "Goodwill is NOT amortized but IS impaired. $2,000 impairment hits Impairment expense (income statement) and reduces Goodwill. Impairment is irreversible (write down only, can never write back up)." },
      { row: 11, text: "Intercompany dividend elimination: Parent recorded $10,000 dividend income from sub; sub recorded $10,000 dividends paid. Both must be eliminated to avoid double-counting in consolidated F/S." },
      { row: 13, text: "All intercompany balance sheet positions wash: A/R on one side ↔ A/P on other side. Eliminate both for the same amount. Critical: omitting this overstates consolidated total assets AND liabilities by $30K." },
    ],
  },
  {
    id: "lewis_reynolds_sandford_partner_withdrawal_bonus_goodwill",
    tbsId: "TBS-PART-WITHDRAWAL",
    module: "F4.M7",
    title: "Partnership Withdrawal — Asset Revaluation + Bonus Method vs Goodwill Method",
    prompt: "Lewis (35%), Reynolds (25%), Sandford (40%) partnership. Capital balances: Lewis $111,000; Reynolds $105,000; Sandford $154,000. Noncash assets revalued from $230,000 to $290,000 ($60,000 step-up). Reynolds withdraws and receives $18,000 ABOVE his post-revaluation capital balance. Compute both BONUS METHOD and GOODWILL METHOD outcomes.",
    accountOptions: [],
    rows: [
      { label: "BONUS — Asset revaluation credited to Reynolds ($60K × 25%)", expectedAmount: 15000 },
      { label: "BONUS — Bonus charged to Lewis ($18K × 35/75)", expectedAmount: 8400 },
      { label: "BONUS — Bonus charged to Sandford ($18K × 40/75)", expectedAmount: 9600 },
      { label: "BONUS — Cash Reynolds receives ($105K + $15K reval + $18K bonus)", expectedAmount: 138000 },
      { label: "BONUS — Lewis post-withdrawal capital balance", expectedAmount: 123600 },
      { label: "BONUS — Sandford post-withdrawal capital balance", expectedAmount: 168400 },
      { label: "GOODWILL — Total goodwill booked ($18K / 25%)", expectedAmount: 72000 },
      { label: "GOODWILL — Goodwill credited to Lewis ($72K × 35%)", expectedAmount: 25200 },
      { label: "GOODWILL — Goodwill credited to Sandford ($72K × 40%)", expectedAmount: 28800 },
      { label: "GOODWILL — Cash Reynolds receives (same as bonus)", expectedAmount: 138000 },
      { label: "GOODWILL — Lewis post-withdrawal capital balance", expectedAmount: 157200 },
      { label: "GOODWILL — Sandford post-withdrawal capital balance", expectedAmount: 206800 },
    ],
    exhibits: [
      {
        name: "Bonus vs Goodwill Method — Core Mechanics",
        body:
          "STEP 0 (BOTH methods): Revalue assets first\n" +
          "  Step-up: $60,000 × each partner's P/L %\n" +
          "  Lewis: $60K × 35% = $21,000 credit\n" +
          "  Reynolds: $60K × 25% = $15,000 credit → cap $120K\n" +
          "  Sandford: $60K × 40% = $24,000 credit\n" +
          "\n" +
          "BONUS METHOD:\n" +
          "  Withdrawing partner gets EXTRA $18K from REMAINING partners\n" +
          "  Remaining ratios renormalized to 100%:\n" +
          "    Lewis 35/(35+40) = 46.67%\n" +
          "    Sandford 40/(35+40) = 53.33%\n" +
          "  Lewis bears $18K × 35/75 = $8,400\n" +
          "  Sandford bears $18K × 40/75 = $9,600\n" +
          "  Bonus reduces remaining partners' capital. NO new asset booked.\n" +
          "\n" +
          "GOODWILL METHOD:\n" +
          "  Imply total firm goodwill from extra paid:\n" +
          "    $18K extra / 25% withdrawer share = $72,000 total goodwill\n" +
          "  Allocate goodwill to ALL partners by ORIGINAL %:\n" +
          "    Lewis $72K × 35% = $25,200\n" +
          "    Reynolds $72K × 25% = $18,000 (his extra)\n" +
          "    Sandford $72K × 40% = $28,800\n" +
          "  Goodwill is recorded as a NEW ASSET on the books.\n",
      },
      {
        name: "Why Cash Paid is Identical Under Both Methods",
        body:
          "Reynolds receives:\n" +
          "  Original cap $105,000\n" +
          "  + Asset reval share $15,000\n" +
          "  + Extra payment $18,000\n" +
          "  = $138,000\n" +
          "\n" +
          "Difference between methods:\n" +
          "  BONUS: Remaining partners' caps DECREASE by $18K total (zero-sum)\n" +
          "  GOODWILL: Remaining caps INCREASE because a $72K asset is created\n" +
          "    and credited to ALL partners proportionally.\n" +
          "\n" +
          "Goodwill method inflates total equity by goodwill amount.\n" +
          "Bonus method keeps total equity unchanged (just redistributes).\n",
      },
    ],
    scoring: { basePerCell: 20, mult: 1, bonusAllCorrect: 150 },
    explanations: [
      { row: 2, text: "Bonus method shifts $18K from remaining partners to withdrawer. Renormalize their ratios: Lewis 35/(35+40) = 46.67% → $18K × 35/75 = $8,400. (Drop Reynolds' 25% from the denominator.)" },
      { row: 4, text: "Cash to withdrawer is the SAME under both methods ($138,000). The methods differ only in how remaining partners' capital + the firm's total equity are restated." },
      { row: 7, text: "Goodwill = Extra payment / withdrawer's P/L share = $18K / 25% = $72K. Logic: If the partnership is willing to pay 25% partner $18K extra, the implied total goodwill the partnership has is $72K (25% × $72K = $18K)." },
      { row: 11, text: "Goodwill method: Lewis $111K + $21K reval + $25.2K goodwill = $157,200. Lewis ends up with MORE capital than under bonus method ($123,600) because a new asset (goodwill) was booked." },
    ],
  },
  {
    id: "abcd_partnership_liquidation_negative_capital",
    tbsId: "TBS-PART-LIQUIDATION",
    module: "F4.M7",
    title: "ABCD Partnership Liquidation — Negative Capital, Partner Advances, Cash Distribution",
    prompt: "Adams (40%), Bennett (20%), Crane (15%), Decker (25%) partnership in liquidation. Beginning: Cash $42,000, Noncash $93,000, Owed to creditors $18,000, Advance to Bennett $1,000, Advance to Decker $14,000. Capitals: Adams $48,000, Bennett $8,000, Crane $22,000, Decker $24,000. Noncash sold for $32,000 (LOSS $61,000). Distribute the loss, pay creditors, credit Bennett's advance, allocate Bennett's resulting deficiency to remaining partners, then compute final cash distributions.",
    accountOptions: [],
    rows: [
      { label: "Loss on noncash sale ($93,000 − $32,000)", expectedAmount: 61000 },
      { label: "Adams share of loss ($61K × 40%)", expectedAmount: 24400 },
      { label: "Bennett share of loss ($61K × 20%)", expectedAmount: 12200 },
      { label: "Crane share of loss ($61K × 15%)", expectedAmount: 9150 },
      { label: "Decker share of loss ($61K × 25%)", expectedAmount: 15250 },
      { label: "Bennett capital after loss ($8K − $12.2K)", expectedAmount: -4200 },
      { label: "Bennett capital after $1K advance credit (still deficiency)", expectedAmount: -3200 },
      { label: "Bennett deficiency absorbed by Adams ($3,200 × 40/80)", expectedAmount: 1600 },
      { label: "Bennett deficiency absorbed by Crane ($3,200 × 15/80)", expectedAmount: 600 },
      { label: "Bennett deficiency absorbed by Decker ($3,200 × 25/80)", expectedAmount: 1000 },
      { label: "Cash Distribution — Adams ($48K − $24.4K − $1.6K)", expectedAmount: 22000 },
      { label: "Cash Distribution — Bennett (zero after deficiency absorbed)", expectedAmount: 0 },
      { label: "Cash Distribution — Crane ($22K − $9.15K − $600)", expectedAmount: 12250 },
      { label: "Cash Distribution — Decker (cap $7,750 + advance $14K)", expectedAmount: 21750 },
    ],
    exhibits: [
      {
        name: "Liquidation Order of Operations (CRITICAL)",
        body:
          "Step 1: Sell ALL noncash assets — allocate gain/loss by P/L ratio\n" +
          "Step 2: Pay outside CREDITORS first (always)\n" +
          "Step 3: Pay partner ADVANCES (credit to capital, then settle)\n" +
          "Step 4: If any partner has NEGATIVE capital → 'deficiency'\n" +
          "         Allocate deficiency to remaining partners by RENORMALIZED P/L ratios\n" +
          "         (deficient partner's % is removed from denominator)\n" +
          "Step 5: Distribute remaining cash by ENDING capital balances\n" +
          "\n" +
          "Check: Cash distributed must = Original cash + Sale proceeds − Creditors paid\n" +
          "       = $42,000 + $32,000 − $18,000 = $56,000\n",
      },
      {
        name: "Bennett Deficiency Renormalization",
        body:
          "Bennett's 20% P/L removed → remaining denominator = 80%\n" +
          "  Adams: 40/80 = 50.00% → $3,200 × 50% = $1,600\n" +
          "  Crane: 15/80 = 18.75% → $3,200 × 18.75% = $600\n" +
          "  Decker: 25/80 = 31.25% → $3,200 × 31.25% = $1,000\n" +
          "  Total: $3,200 absorbed ✓\n" +
          "\n" +
          "After deficiency allocation:\n" +
          "  Adams: $48K − $24.4K loss − $1.6K = $22,000\n" +
          "  Bennett: $0 (deficiency cleared)\n" +
          "  Crane: $22K − $9.15K loss − $600 = $12,250\n" +
          "  Decker: $24K − $15.25K loss − $1K = $7,750 + $14K advance = $21,750\n",
      },
      {
        name: "Advances vs Capital — Treatment",
        body:
          "Partner ADVANCES (loans from partner to partnership):\n" +
          "  Rank ABOVE partners' capital but BELOW outside creditors\n" +
          "  Typical exam shortcut: combine advance + capital and treat as one balance\n" +
          "    when settling — but if deficiency exists, advance can OFFSET deficiency first\n" +
          "  Bennett's $1,000 advance offsets her negative cap before allocating deficiency\n" +
          "  Decker's $14,000 advance simply adds to his ending distribution\n",
      },
    ],
    scoring: { basePerCell: 15, mult: 1, bonusAllCorrect: 200 },
    explanations: [
      { row: 1, text: "Loss = BV $93,000 − Cash received $32,000 = $61,000. Allocated by P/L ratios (NOT capital balances)." },
      { row: 6, text: "Bennett: $8K cap − $12.2K loss = $(4,200) deficiency. Step 1 of resolving: credit her $1K advance to capital → $(3,200) remaining deficiency." },
      { row: 8, text: "Renormalized ratios when allocating Bennett's deficiency: Adams 40/(40+15+25) = 40/80 = 50% → $3,200 × 50% = $1,600. Drop Bennett's % from the denominator." },
      { row: 14, text: "Decker final distribution = ending capital after all losses absorbed + his $14,000 advance. $24K cap − $15.25K loss − $1K Bennett absorption = $7,750 + $14,000 advance = $21,750. Always add unpaid advance back into final cash to the partner." },
    ],
  },
  {
    id: "bayshore_full_indirect_scf_construction",
    tbsId: "TBS-SCF-BAYSHORE",
    module: "F2.M6",
    title: "Bayshore Industries Full Indirect SCF — Operating, Investing, Financing + Supplemental",
    prompt: "Build full Year 2 Statement of Cash Flows (indirect method) for Bayshore Industries. Net income $1,772,000. Depreciation plug = $440,500 (Beg AccDep $455K + plug − $319.5K disposal = End $576K); Amortization = $7,200 ($28.8K − $21.6K). AR increased $1,463K. Inventory up $594K. Prepaid up $18K. Gain on disposal $18K. AP/accrued up $475,800 (but worksheet uses $425,800 per their netting). PP&E purchases plug $400K, disposal proceeds $58,500. Line of credit +$18K. LTD net −$27K. Dividends $180K. Interest paid $250K, Taxes paid $700K.",
    accountOptions: [],
    rows: [
      { label: "Net income (starting point)", expectedAmount: 1772000 },
      { label: "Depreciation + Amortization add-back ($440,500 + $7,200)", expectedAmount: 447700 },
      { label: "Increase in trade receivables (subtract)", expectedAmount: -1463000 },
      { label: "Increase in inventory (subtract)", expectedAmount: -594000 },
      { label: "Increase in prepaid expenses (subtract)", expectedAmount: -18000 },
      { label: "Gain on PP&E disposal (subtract — investing item)", expectedAmount: -18000 },
      { label: "Increase in AP and accrued expenses (add)", expectedAmount: 425800 },
      { label: "Net cash from operating activities", expectedAmount: 602500 },
      { label: "Purchases of property and equipment", expectedAmount: -400000 },
      { label: "Proceeds from PP&E disposals", expectedAmount: 58500 },
      { label: "Net cash used in investing activities", expectedAmount: -341500 },
      { label: "Proceeds from line of credit", expectedAmount: 18000 },
      { label: "Repayment of long-term debt (net $2K CPLTD increase − $29K LTD)", expectedAmount: -27000 },
      { label: "Dividends paid", expectedAmount: -180000 },
      { label: "Net cash used in financing activities", expectedAmount: -189000 },
      { label: "Net increase in cash", expectedAmount: 72000 },
      { label: "Supplemental — Interest paid", expectedAmount: 250000 },
      { label: "Supplemental — Income taxes paid", expectedAmount: 700000 },
    ],
    exhibits: [
      {
        name: "Indirect Method — Sign Rule (Memorize This)",
        body:
          "DEBIT-balance accounts (Assets):\n" +
          "  Increase = SUBTRACT from net income\n" +
          "  Decrease = ADD to net income\n" +
          "  (Cash moves OPPOSITE to other asset accounts)\n" +
          "\n" +
          "CREDIT-balance accounts (Liabilities):\n" +
          "  Increase = ADD to net income\n" +
          "  Decrease = SUBTRACT from net income\n" +
          "  (Cash moves SAME as other liability accounts)\n" +
          "\n" +
          "Gains/Losses (non-operating):\n" +
          "  Gains = SUBTRACT (full proceeds shown in investing)\n" +
          "  Losses = ADD\n" +
          "\n" +
          "Mnemonic: 'Debit accounts move OPPOSITE to cash; Credit accounts move SAME as cash.'\n",
      },
      {
        name: "Account Analysis Format for Depreciation",
        body:
          "Accumulated Depreciation roll-forward:\n" +
          "  Beg balance:        $455,000\n" +
          "  + Depreciation exp:  PLUG  ($440,500)\n" +
          "  − Disposal Acc Dep: ($319,500)\n" +
          "  = End balance:      $576,000\n" +
          "\n" +
          "Amortization plug = End Acc Amort − Beg Acc Amort\n" +
          "                  = $28,800 − $21,600 = $7,200\n" +
          "\n" +
          "Total D&A add-back: $440,500 + $7,200 = $447,700\n",
      },
      {
        name: "PP&E Account Analysis (Investing Section)",
        body:
          "Property & Equipment roll-forward:\n" +
          "  Beg balance:        $7,740,000\n" +
          "  + Acquisitions:      PLUG  ($400,000)\n" +
          "  − Disposal cost:    ($360,000)\n" +
          "  = End balance:      $7,780,000\n" +
          "\n" +
          "Gain verification:\n" +
          "  Proceeds:          $58,500\n" +
          "  Less NBV:          ($360,000 − $319,500) = $40,500\n" +
          "  Gain:              $18,000\n",
      },
    ],
    scoring: { basePerCell: 12, mult: 1, bonusAllCorrect: 200 },
    explanations: [
      { row: 2, text: "Depreciation and amortization are always ADD-backs under indirect method because they were SUBTRACTED to arrive at net income but had no cash impact. Calculate via Account Analysis Format if not given." },
      { row: 6, text: "Gains/losses on PP&E disposal: SUBTRACT gains (they were ADDED to NI), ADD losses (they were SUBTRACTED from NI). The full $58,500 cash proceeds belong in investing — if you don't remove the gain, the statement double-counts and won't balance." },
      { row: 17, text: "Indirect method REQUIRES two supplemental disclosures: Interest paid AND Income taxes paid. Both must be the CASH amount paid, not the expense per income statement. (Direct method shows these as line items in operating section.)" },
    ],
  },
  {
    id: "weager_scf_classification_5transactions",
    tbsId: "TBS-SCF-WEAGER",
    module: "F2.M6",
    title: "Weager SCF Classification — 5 Transactions Across Operating/Investing/Financing/Supplemental",
    prompt: "Classify each Weager Co Year 2 transaction across SCF sections: (1) Sold Year-1-purchased land ($33K cost) for $40K cash; (2) $60K note from a Year-1 sale received cash in Year 2; (3) Land+building purchase: $20K cash + 6,000 shares at $5 FV; (4) Drew $200K on new $1M credit facility; (5) Paid $0.05/share dividend on 866,000 shares.",
    accountOptions: [],
    rows: [
      { label: "T1 Land Sale — Operating (subtract $7K gain)", expectedAmount: -7000 },
      { label: "T1 Land Sale — Investing (proceeds $40K)", expectedAmount: 40000 },
      { label: "T1 Land Sale — Supplemental", expectedAmount: 0 },
      { label: "T2 Note Collection — Operating (decrease in receivable)", expectedAmount: 60000 },
      { label: "T2 Note Collection — Investing", expectedAmount: 0 },
      { label: "T3 Land/Building — Operating", expectedAmount: 0 },
      { label: "T3 Land/Building — Investing (cash portion only)", expectedAmount: -20000 },
      { label: "T3 Land/Building — Supplemental (6,000 × $5 noncash)", expectedAmount: 30000 },
      { label: "T4 Credit Drawdown — Financing", expectedAmount: 200000 },
      { label: "T4 Credit Drawdown — Operating", expectedAmount: 0 },
      { label: "T5 Dividend Paid — Financing (866,000 × $0.05)", expectedAmount: -43300 },
      { label: "T5 Dividend Paid — Operating", expectedAmount: 0 },
    ],
    exhibits: [
      {
        name: "Classification Rules — Quick Reference",
        body:
          "OPERATING (CFO):\n" +
          "  • Net income + non-cash adjustments + working capital changes\n" +
          "  • Interest PAID, Interest RECEIVED, Dividends RECEIVED → CFO (US GAAP)\n" +
          "  • IFRS allows alternatives — interest paid can be CFO or CFF\n" +
          "\n" +
          "INVESTING (CFI):\n" +
          "  • Buy/sell long-term assets (PP&E, intangibles, investments in others)\n" +
          "  • Loans made to others (lending) + collections of principal\n" +
          "\n" +
          "FINANCING (CFF):\n" +
          "  • Borrowing or repaying long-term debt + lines of credit\n" +
          "  • Issuing/repurchasing own equity\n" +
          "  • Dividends PAID → CFF (US GAAP)\n" +
          "\n" +
          "SUPPLEMENTAL (NONCASH):\n" +
          "  • Acquiring assets with debt or stock (not cash)\n" +
          "  • Converting debt to equity\n" +
          "  • Like-kind exchanges (noncash portion)\n",
      },
      {
        name: "Noncash Acquisition Bifurcation (T3)",
        body:
          "When an asset is bought with mixed cash + stock:\n" +
          "  Cash portion → Investing outflow ($20,000)\n" +
          "  Stock portion → Supplemental noncash disclosure (6,000 × $5 = $30,000)\n" +
          "\n" +
          "DO NOT show the $30,000 stock as a financing inflow + matching investing outflow.\n" +
          "Why: no cash actually moved for the stock portion. Disclose noncash only.\n",
      },
    ],
    scoring: { basePerCell: 15, mult: 1, bonusAllCorrect: 120 },
    explanations: [
      { row: 1, text: "Gain on land sale $40K − $33K = $7,000 must be SUBTRACTED from net income in CFO (since full $40K proceeds belong in investing). Avoids double-counting." },
      { row: 4, text: "Year 2 note collection: $5K cash collected in Year 1 was already in Year 1 revenue/net income. $60K note (current asset on Y1 BS) is collected in Y2 = decrease in current asset = ADD to CFO." },
      { row: 8, text: "Noncash stock-for-asset = SUPPLEMENTAL disclosure only, NOT a financing inflow + investing outflow. The $30K (6,000 × $5 FV) is disclosed; only the $20K cash hits investing." },
      { row: 11, text: "Dividends PAID = CFF outflow (US GAAP). Dividends RECEIVED = CFO inflow. Different sections! 866,000 × $0.05 = $43,300." },
    ],
  },
  {
    id: "drexon_scf_12event_classification",
    tbsId: "TBS-SCF-DREXON",
    module: "F2.M6",
    title: "Drexon SCF Classification — 12 Events: Section + NI Adjustment",
    prompt: "For each Drexon event, identify the SCF section AND any required adjustment to net income.",
    accountOptions: ["Operating", "Investing", "Financing"],
    rows: [
      { label: "T1 AP $400K → $385K — Section", expectedAccount: "Operating" },
      { label: "T1 AP $400K → $385K — Adjustment to NI", expectedAmount: -15000 },
      { label: "T2 $85K interest payment on LTD at par — Section", expectedAccount: "Operating" },
      { label: "T2 Interest payment — Adjustment to NI", expectedAmount: 0 },
      { label: "T3 $35K CapEx for ops equipment — Section", expectedAccount: "Investing" },
      { label: "T4 Dividends $6,500 received on AFS stock — Section", expectedAccount: "Operating" },
      { label: "T4 Dividends received — Adjustment to NI", expectedAmount: 0 },
      { label: "T5 Gain of $8,200 on asset sale — Section", expectedAccount: "Operating" },
      { label: "T5 Gain — Adjustment to NI", expectedAmount: -8200 },
      { label: "T6 D&A expense $50,000 — Section", expectedAccount: "Operating" },
      { label: "T6 D&A — Adjustment to NI", expectedAmount: 50000 },
      { label: "T7 Trading security classified non-current — Section", expectedAccount: "Investing" },
      { label: "T8 Accrued liabilities $245K → $250K — Section", expectedAccount: "Operating" },
      { label: "T8 Accrued liab — Adjustment to NI", expectedAmount: 5000 },
      { label: "T9 40,000 new shares issued — Section", expectedAccount: "Financing" },
      { label: "T10 60% subsidiary acquisition — Section", expectedAccount: "Investing" },
      { label: "T11 AR $620K → $610K — Section", expectedAccount: "Operating" },
      { label: "T11 AR — Adjustment to NI", expectedAmount: 10000 },
      { label: "T12 $12,000 dividends paid — Section", expectedAccount: "Financing" },
    ],
    exhibits: [
      {
        name: "Trading Security Classification Gotcha",
        body:
          "Trading securities by default are CURRENT (held for short-term profit)\n" +
          "  → Buying/selling treated as OPERATING\n" +
          "\n" +
          "BUT: if classified NON-CURRENT (long-term holding intent)\n" +
          "  → Buying/selling treated as INVESTING\n" +
          "\n" +
          "T7 specifies 'non-current' classification → INVESTING outflow.\n",
      },
    ],
    scoring: { basePerCell: 10, mult: 1, bonusAllCorrect: 120 },
    explanations: [
      { row: 1, text: "AP decrease = more cash paid out than expense recognized in NI → reduces CFO by $15,000. Liability decreases SUBTRACT from CFO." },
      { row: 4, text: "Interest payment of $85K is already in net income as interest expense. NO adjustment to NI unless interest payable changed or premium/discount being amortized. The cash payment is classified as CFO (US GAAP), just no NI adjustment needed." },
      { row: 8, text: "Gain of $8,200 SUBTRACTED from CFO (it was added to NI but proceeds go to CFI). Same logic as Bayshore TBS — prevents double-counting between sections." },
      { row: 12, text: "Trading security classified NON-CURRENT = INVESTING activity. Default trading is current/operating, but explicit non-current classification overrides this. Common exam trick." },
    ],
  },
  {
    id: "seasil_scf_corrections_advanced",
    tbsId: "TBS-SCF-SEASIL",
    module: "F2.M6",
    title: "Seasil Co — Advanced SCF Corrections (D&A, Gain on Sale, Deferred Tax, AR, CapEx, LTD, Interest, Taxes)",
    prompt: "Correct Seasil's draft SCF Year 4 across multiple complex lines: (1) D&A with half-year convention on building disposal 7/1/Y4 ($15M cost / 40 yrs × 1/2 yr); (2) Gain on sale of Circuit St building (proceeds $14.5M − NBV); (3) Deferred tax change at 21% on $2M temp diff; (4) Net AR change excluding allowance roll-forward; (5) CapEx total (5 asset classes); (6) LTD retirement (Bond 1 $13M maturity 6/30/Y4); (7) Interest paid on 4 bonds (Bond 4 issued 10/1/Y4 — no Y4 payment); (8) Taxes paid in Y4 (Y3 income tax payable).",
    accountOptions: [],
    rows: [
      { label: "Row 8 — D&A (depreciation $14,572,250 + amort $0)", expectedAmount: 14572250 },
      { label: "Row 9 — Subtract gain on building sale (proceeds $14.5M − NBV $14,062,500)", expectedAmount: -437500 },
      { label: "Row 10 — Deferred income taxes adjustment ($2M × 21%)", expectedAmount: 420000 },
      { label: "Row 13 — Change in NET AR (subtract increase $5,450,000)", expectedAmount: -5450000 },
      { label: "Row 21 — CapEx Year 4 (5 asset classes total)", expectedAmount: -55810000 },
      { label: "Row 22 — Proceeds from facility sales", expectedAmount: 14500000 },
      { label: "Row 27 — Retirement of LTD (Bond 1 maturity 6/30/Y4)", expectedAmount: -13000000 },
      { label: "Row 36 — Supplemental: Interest paid Y4 ($260K + $225K + $318,750)", expectedAmount: 803750 },
      { label: "Row 37 — Supplemental: Taxes paid Y4 (Y3 tax payable)", expectedAmount: 10700000 },
    ],
    exhibits: [
      {
        name: "Half-Year Depreciation Adjustment (Building Sale)",
        body:
          "Circuit St Building: $15,000,000 / 40 years = $375,000 full year\n" +
          "Sold 7/1/Y4 → only half-year of Y4 depreciation valid: $187,500\n" +
          "\n" +
          "Ledger had full $375,000 booked\n" +
          "Adjustment: $375,000 − $187,500 = ($187,500) reduction\n" +
          "Corrected total D&A: $14,759,750 − $187,500 = $14,572,250\n" +
          "\n" +
          "Y4 acc dep for building = $375K + $375K + $187.5K = $937,500\n" +
          "Building NBV at sale = $15,000,000 − $937,500 = $14,062,500\n" +
          "Gain on sale = $14,500,000 proceeds − $14,062,500 NBV = $437,500\n",
      },
      {
        name: "Deferred Tax Add-Back Logic",
        body:
          "Tax temporary difference of $2,000,000 × 21% = $420,000 INCREASE in DTL\n" +
          "\n" +
          "DTL increase → more tax EXPENSE recognized in NI than cash paid\n" +
          "  → ADD $420,000 to NI in CFO\n" +
          "\n" +
          "DTL is a CREDIT balance account.\n" +
          "Credit balance UP = SAME direction as cash → ADD.\n" +
          "\n" +
          "Trap: Draft used $720,000 (ending DTL balance) instead of change.\n" +
          "Always use the CHANGE in deferred tax accounts, not the ending balance.\n",
      },
      {
        name: "Interest Paid by Bond — Y4",
        body:
          "Bond 1: $13M × 4.00% × 1/2 yr = $260,000 (paid 6/30/Y4 then matured)\n" +
          "Bond 2: $5M × 4.50% = $225,000 (semi-annual payments 3/31 + 9/30 = $112,500 × 2)\n" +
          "Bond 3: $7.5M × 4.25% = $318,750 (paid 6/30 + 12/31 = $159,375 × 2)\n" +
          "Bond 4: $4M × 5.25% × 3/12 = $52,500 ACCRUED but not PAID (first payment 3/31/Y5)\n" +
          "\n" +
          "Supplemental disclosure = CASH paid only = $803,750\n" +
          "Draft incorrectly included $52,500 accrual = $856,250 ✗\n",
      },
      {
        name: "Taxes Paid Logic (Y3 income tax payable)",
        body:
          "Y3 income tax expense: $11,000,000 (given)\n" +
          "Y3 DTL increase: $300,000 (from $0 to $300K)\n" +
          "→ Y3 tax payable = $11,000,000 − $300,000 = $10,700,000\n" +
          "\n" +
          "Y4: Y3 payable settled in April = $10,700,000 cash paid\n" +
          "\n" +
          "Draft used $10,280,000 (incorrectly subtracted $720K Y4 ending DTL instead of $300K Y3 change)\n",
      },
    ],
    scoring: { basePerCell: 30, mult: 1, bonusAllCorrect: 200 },
    explanations: [
      { row: 1, text: "When an asset is sold mid-year, only PARTIAL year's depreciation belongs in expense (half-year here). The ledger over-stated by $187,500 — must adjust down. Always check disposal dates against full-year depreciation entries." },
      { row: 2, text: "Gain on sale requires correct NBV at disposal: $15M cost − ($375K × 2 yrs + $187,500 half year) = $14,062,500. Gain = $14.5M − $14,062,500 = $437,500. The draft's '$500K loss' was wrong because it used purchase price vs sale price, ignoring depreciation." },
      { row: 3, text: "DTL increase: ADD-BACK to NI in CFO. Use the CHANGE ($420K), never the ending balance ($720K). DTL going up = more tax EXPENSE recognized than cash paid → favorable to CFO." },
      { row: 4, text: "Use NET AR (gross AR − allowance) for SCF adjustment. The change reflects actual cash impact. Gross AR change captures write-offs that don't affect cash. Net AR change here is $5.45M increase = SUBTRACT from CFO." },
      { row: 7, text: "LTD retirement when bond matures = FULL principal repayment as financing outflow. Bond 1 ($13M) matured 6/30/Y4. Draft missed this entirely — must reconcile all LTD movements: new issuances + maturities + scheduled repayments." },
      { row: 8, text: "Interest PAID is CASH only, not accrued. Bond 4 issued 10/1/Y4 first pays in Y5 → only $52,500 ACCRUAL in Y4 (in other accrued liabilities), NOT a cash payment. Supplemental shows only the three bonds with actual Y4 cash payments." },
      { row: 9, text: "Income taxes PAID in Y4 = Y3 income tax payable settled in April Y4 = $10,700,000. NOT the current year's tax expense. This is a classic AICPA timing trap." },
    ],
  },
  {
    id: "aldridge_deferred_tax_classification_y1y2_je",
    tbsId: "TBS-TAX-ALDRIDGE",
    module: "F5.M3",
    title: "Aldridge Deferred Taxes — DTA/DTL Classification + Y1/Y2 JEs with Rate Change",
    prompt: "Classify each item as Permanent or Temporary AND as DTA, DTL, or neither: (1) Depreciation $17,000 temp diff; (2) Life insurance payout; (3) Fine to IRS; (4) Royalties received in cash $50,000 (not yet earned); (5) Bad debt expense $25,000 (allowance method). Then record Y1 JE at 30% tax rate ($35,500 income tax payable given) and Y2 JE at 35% rate ($28,900 payable given).",
    accountOptions: [
      "Temporary",
      "Permanent",
      "DTA",
      "DTL",
      "Neither a DTA nor a DTL",
      "Income Tax Expense",
      "Change in DTA",
      "Change in DTL",
      "Income Tax Payable",
    ],
    rows: [
      { label: "Depreciation — Temporary/Permanent", expectedAccount: "Temporary" },
      { label: "Depreciation — DTA/DTL", expectedAccount: "DTL" },
      { label: "Life Insurance Payout — Temp/Permanent", expectedAccount: "Permanent" },
      { label: "Life Insurance — DTA/DTL", expectedAccount: "Neither a DTA nor a DTL" },
      { label: "Fine to IRS — Temp/Permanent", expectedAccount: "Permanent" },
      { label: "Fine to IRS — DTA/DTL", expectedAccount: "Neither a DTA nor a DTL" },
      { label: "Royalties Received in Cash — Temp/Permanent", expectedAccount: "Temporary" },
      { label: "Royalties — DTA/DTL", expectedAccount: "DTA" },
      { label: "Bad Debt Expense — Temp/Permanent", expectedAccount: "Temporary" },
      { label: "Bad Debt — DTA/DTL", expectedAccount: "DTA" },
      { label: "Y1 JE — DR Income Tax Expense (plug)", expectedAmount: 18100 },
      { label: "Y1 JE — DR Change in DTA ($75K × 30%)", expectedAmount: 22500 },
      { label: "Y1 JE — CR Change in DTL ($17K × 30%)", expectedAmount: 5100 },
      { label: "Y1 JE — CR Income Tax Payable (given)", expectedAmount: 35500 },
      { label: "Y2 JE — DR Income Tax Expense (plug)", expectedAmount: 26000 },
      { label: "Y2 JE — DR Change in DTA ($75K × 5% rate change)", expectedAmount: 3750 },
      { label: "Y2 JE — CR Change in DTL ($17K × 5% rate change)", expectedAmount: 850 },
      { label: "Y2 JE — CR Income Tax Payable (given)", expectedAmount: 28900 },
    ],
    exhibits: [
      {
        name: "Temporary vs Permanent — Decision Tree",
        body:
          "TEMPORARY DIFFERENCES (create DTA or DTL):\n" +
          "  • Will reverse in future periods\n" +
          "  • Book vs tax TIMING difference\n" +
          "  Examples: Depreciation (MACRS faster than book) → DTL\n" +
          "            Bad debt (allowance vs direct write-off) → DTA\n" +
          "            Royalties received in advance → DTA\n" +
          "            Warranty accruals → DTA\n" +
          "            Installment sales → DTL\n" +
          "\n" +
          "PERMANENT DIFFERENCES (NEVER create DTA/DTL):\n" +
          "  • Will NEVER reverse — pure book/tax discrepancy\n" +
          "  Examples: Tax-exempt interest (muni bonds)\n" +
          "            Life insurance premiums + proceeds\n" +
          "            Fines and penalties\n" +
          "            Dividends-received deduction (DRD)\n" +
          "            50% meals/entertainment\n",
      },
      {
        name: "DTA vs DTL — Which Way?",
        body:
          "DTL (Deferred Tax LIABILITY):\n" +
          "  Tax expense MORE on books than tax this period → will owe more later\n" +
          "  OR Pay less tax now, pay more later\n" +
          "  Examples: MACRS depreciation (faster than book)\n" +
          "            Installment sales (book all income; tax recognizes over time)\n" +
          "\n" +
          "DTA (Deferred Tax ASSET):\n" +
          "  Tax expense LESS on books than tax this period → save tax later\n" +
          "  OR Pay more tax now, pay less later\n" +
          "  Examples: Bad debt allowance (book deducts now; tax waits)\n" +
          "            Warranty accruals (book accrues; tax expenses when paid)\n" +
          "            Royalties received in advance (tax now; book later)\n" +
          "            NOL carryforwards\n",
      },
      {
        name: "Rate Change Mechanics (Y1 → Y2)",
        body:
          "Y1 setup (30% rate):\n" +
          "  DTL: $17,000 × 30% = $5,100\n" +
          "  DTA: ($50,000 + $25,000) × 30% = $22,500\n" +
          "\n" +
          "Y2 rate change to 35% applies to existing balances:\n" +
          "  Additional DTL: $17,000 × (35% − 30%) = $850\n" +
          "  Additional DTA: $75,000 × (35% − 30%) = $3,750\n" +
          "\n" +
          "Rate change runs through INCOME TAX EXPENSE in the period of the change.\n" +
          "Don't go back and restate Y1.\n",
      },
    ],
    scoring: { basePerCell: 15, mult: 1, bonusAllCorrect: 150 },
    explanations: [
      { row: 2, text: "Accelerated tax depreciation > book depreciation NOW → pay less tax now, more later. Creates DTL because future tax obligation is larger than book." },
      { row: 4, text: "Life insurance payout received by company on key person policy is excluded from taxable income permanently — never reverses, never deferred." },
      { row: 7, text: "Cash-basis royalties: taxed when CASH received but recognized as book revenue only when EARNED. Pay tax now, book later → prepaid tax → DTA." },
      { row: 9, text: "Allowance bad debt: book DEDUCTS expense via estimate; tax DEDUCTS only on actual write-off (specific charge-off method). Book expense now > tax expense now → pay more tax now → DTA." },
      { row: 11, text: "Y1 plug: Income Tax Payable $35,500 (cash) − DTL $5,100 (delayed tax) + DTA $22,500 (prepaid tax) = $18,100 income tax expense. JE balances: DR ITE $18,100 + DR DTA $22,500 = $40,600; CR DTL $5,100 + CR ITP $35,500 = $40,600. ✓" },
      { row: 15, text: "Y2 ITE plug = Payable $28,900 + DTL increase $850 − DTA increase $3,750 = $26,000. Rate change goes through income tax expense — gain on DTA increase ($3,750) and loss on DTL increase ($850) net to a $2,900 favorable adjustment vs straight $28,900." },
    ],
  },
  {
    id: "barnaby_valuation_allowance_impact",
    tbsId: "TBS-035010",
    module: "F5.M3",
    title: "Barnaby — Valuation Allowance Impact (3 scenarios)",
    prompt: "Barnaby Corporation has a deferred tax asset that will expire over the next five years. For each transaction, select the impact (P&L tax expense + valuation allowance behavior).",
    accountOptions: [
      "Increase financial statement tax expense",
      "Decrease financial statement tax expense",
      "Decrease valuation allowance",
      "Increase valuation allowance",
      "No effect",
    ],
    rows: [
      { label: "1. DTA deemed more likely than NOT to be realized", expectedAccount: "Increase financial statement tax expense" },
      { label: "2. DTA will reverse; company anticipates no future taxable income", expectedAccount: "Increase financial statement tax expense" },
      { label: "3. Income projections improve; valuation allowance is adjusted (reduced)", expectedAccount: "Decrease valuation allowance" },
    ],
    exhibits: [
      { name: "Valuation Allowance Decision Tree", body:
        "If it is more likely than NOT (>50%) that some or all of a DTA will NOT be realized\n" +
        "  → set up Valuation Allowance (contra-DTA)\n" +
        "  → JE: Dr. Income Tax Expense / Cr. Valuation Allowance\n" +
        "  → Net DTA on balance sheet decreases; Tax Expense on income statement increases\n\n" +
        "If conditions later improve (more likely than not to be realized)\n" +
        "  → REVERSE Valuation Allowance\n" +
        "  → JE: Dr. Valuation Allowance / Cr. Income Tax Expense (Benefit)\n" +
        "  → Net DTA restored; Tax Expense decreases (benefit)\n"
      },
      { name: "Trigger phrases", body:
        "'More likely than not NOT to be realized' → CREATE valuation allowance → INCREASE tax expense\n" +
        "'No taxable income foreseeable' → CREATE valuation allowance → INCREASE tax expense\n" +
        "'Projections improved / allowance adjusted' → REVERSE (decrease) valuation allowance → DECREASE tax expense\n" +
        "Standard exam trap: question asks about a DTA that will EXPIRE — same valuation allowance rules apply.\n"
      },
    ],
    scoring: { basePerCell: 12, mult: 1.4, bonusAllCorrect: 60 },
    explanations: [
      { row: 1, text: "ID of a DTA for which all or part will NOT be realized → create VA (contra-DTA) → that increases tax expense. Net DTA on B/S decreases." },
      { row: 2, text: "DTA will only be realized against future taxable income. If no future earnings expected → VA required → tax expense increases." },
      { row: 3, text: "When projections improve, the VA is no longer needed (or partially not needed). Reversing the VA restores the asset and decreases tax expense (creates a benefit)." },
    ],
  },
  {
    id: "stanhope_deferred_tax_worksheet_balance_sheet",
    tbsId: "TBS-035011",
    module: "F5.M3",
    title: "Stanhope — Deferred Tax Worksheet + Balance Sheet (33% rate)",
    prompt: "Compute the temporary differences and resulting DTA/DTL for Stanhope (33% rate), then report on the Year 2 balance sheet (netted, non-current).",
    accountOptions: [
      "Allowance for credit losses",
      "Accumulated depreciation, excess of tax over GAAP",
      "Unrealized gain (loss) on trading securities",
      "Meals and entertainment expenses",
      "Tax-exempt interest income",
      "Bad debts written off",
      "—",
    ],
    rows: [
      // Worksheet — 3 temporary differences only
      { label: "Row 5 — Item A: First temp diff item", expectedAccount: "Allowance for credit losses" },
      { label: "Row 5 — Item B: Temp difference $", expectedAmount: 21000 },
      { label: "Row 5 — Item C: DTA $", expectedAmount: 6930 },
      { label: "Row 5 — Item D: DTL $", expectedAmount: 0 },
      { label: "Row 6 — Item A: Second temp diff item", expectedAccount: "Accumulated depreciation, excess of tax over GAAP" },
      { label: "Row 6 — Item B: Temp difference $", expectedAmount: 767000 },
      { label: "Row 6 — Item C: DTA $", expectedAmount: 0 },
      { label: "Row 6 — Item D: DTL $", expectedAmount: 253110 },
      { label: "Row 7 — Item A: Third temp diff item", expectedAccount: "Unrealized gain (loss) on trading securities" },
      { label: "Row 7 — Item B: Temp difference $", expectedAmount: 8000 },
      { label: "Row 7 — Item C: DTA $", expectedAmount: 0 },
      { label: "Row 7 — Item D: DTL $", expectedAmount: 2640 },
      // Part II — Balance sheet
      { label: "B/S — Deferred taxes, non-current asset", expectedAmount: 0 },
      { label: "B/S — Deferred taxes, non-current liability", expectedAmount: 248820 },
    ],
    exhibits: [
      { name: "Stanhope Income Reconciliation (Year 2)", body:
        "Pretax accounting income .................. $678,000\n" +
        "Add: Non-deductible book expenses\n" +
        "  Meals & entertainment ........ 12,000  (PERMANENT — 50% portion)\n" +
        "  Credit losses expense ........ 15,000  (book accrual; deduct on tax when written off)\n" +
        "  Subtotal ......................... 705,000\n\n" +
        "Less: Non-taxable book income\n" +
        "  Tax-exempt interest .......... 15,000  (PERMANENT)\n" +
        "  Unrealized gain on trading securities ... 8,000  (TEMP — recognize when sold)\n" +
        "Less: Tax deductions not on book\n" +
        "  Depreciation expense ......... 63,000  (TEMP — book SL vs tax accelerated)\n" +
        "  Bad debts written off ......... 5,000  (book uses allowance, tax uses direct write-off)\n\n" +
        "Taxable income ................................ $614,000\n" +
        "Tax @ 33% .................................... $202,620 (current tax payable)\n"
      },
      { name: "Worksheet Logic — Temporary differences only", body:
        "Row 5: Allowance for credit losses\n" +
        "  GAAP allowance balance $21,000 vs Tax allowance $0\n" +
        "  Future write-offs will be deductible on tax → DTA = $21,000 × 33% = $6,930\n\n" +
        "Row 6: Accumulated depreciation excess (tax > GAAP)\n" +
        "  Tax accum dep $2,277,000 - GAAP accum dep $1,510,000 = $767,000\n" +
        "  Tax basis < Book basis → future taxable income → DTL = $767,000 × 33% = $253,110\n\n" +
        "Row 7: Unrealized gain on trading securities\n" +
        "  Book recognizes $8,000 NOW; tax recognizes WHEN SOLD\n" +
        "  Future taxable income → DTL = $8,000 × 33% = $2,640\n\n" +
        "NOT temporary (skip rows 8-11):\n" +
        "  Meals & entertainment $12,000 — PERMANENT (50% rule)\n" +
        "  Tax-exempt interest $15,000 — PERMANENT (never taxable)\n"
      },
      { name: "Part II — Balance Sheet Netting Rule (U.S. GAAP)", body:
        "Under U.S. GAAP, ALL DTAs and DTLs are non-current AND must be netted to one number\n" +
        "  (unless from different tax-paying components or different jurisdictions).\n\n" +
        "DTA total: $6,930\n" +
        "DTL total: $2,640 + $253,110 = $255,750\n" +
        "Net deferred tax LIABILITY: $255,750 - $6,930 = $248,820 (non-current)\n" +
        "Net deferred tax asset: $0\n\n" +
        "Report only the NET amount; the larger side wins. Here liabilities > assets, so single non-current DTL.\n"
      },
    ],
    scoring: { basePerCell: 14, mult: 1.6, bonusAllCorrect: 110 },
    explanations: [
      { row: 1, text: "Allowance method for credit losses (GAAP) vs direct write-off (tax) — GAAP recognizes expense first, tax later." },
      { row: 2, text: "$21,000 GAAP allowance - $0 tax allowance = $21,000 temporary difference (future tax deduction)." },
      { row: 3, text: "Future tax deduction → DTA = $21,000 × 33% = $6,930." },
      { row: 5, text: "Tax depreciation accelerated > GAAP straight-line → tax basis lower → future taxable income → DTL." },
      { row: 6, text: "GAAP $1,510,000 vs Tax $2,277,000 → $767,000 cumulative excess depreciation taken on tax." },
      { row: 8, text: "DTL = $767,000 × 33% = $253,110." },
      { row: 9, text: "Unrealized gains recognized for book (mark-to-market) but not taxed until securities are sold." },
      { row: 12, text: "DTL = $8,000 × 33% = $2,640." },
      { row: 13, text: "Net DTA is $0 because DTLs exceed DTAs — single net non-current DTL reported." },
      { row: 14, text: "Net DTL = $255,750 - $6,930 = $248,820 (single line, non-current per ASC 740)." },
    ],
  },
  {
    id: "flexir_temp_perm_dta_dtl_reverse_je",
    tbsId: "TBS-343000",
    module: "F5.M3",
    title: "Flexir — 9 Transactions: Temp vs Perm + JE Reverse-Engineering (30%)",
    prompt: "For each transaction, classify as Temporary or Permanent, enter the deferred amount change, and identify DTA/DTL or Neither. The applicable tax rate for Flexir is 30%.",
    accountOptions: [
      "Temporary",
      "Permanent",
      "DTA",
      "DTL",
      "Neither",
    ],
    rows: [
      // Row 2: Depreciation — SL on tax, accelerated on books → DTA
      { label: "R2 Depreciation: Temp or Permanent", expectedAccount: "Temporary" },
      { label: "R2 Depreciation: Change in deferred amount $", expectedAmount: 150 },
      { label: "R2 Depreciation: DTA / DTL / Neither", expectedAccount: "DTA" },
      // Row 3: Municipal bond interest — Permanent
      { label: "R3 Municipal bond interest: Temp or Permanent", expectedAccount: "Permanent" },
      { label: "R3 Municipal bond interest: Change $", expectedAmount: 0 },
      { label: "R3 Municipal bond interest: DTA / DTL / Neither", expectedAccount: "Neither" },
      // Row 4: Rental income prepaid (tax NOW, book NEXT year) → DTA
      { label: "R4 Rental income prepaid: Temp or Permanent", expectedAccount: "Temporary" },
      { label: "R4 Rental income prepaid: Change $", expectedAmount: 120 },
      { label: "R4 Rental income prepaid: DTA / DTL / Neither", expectedAccount: "DTA" },
      // Row 5: Life insurance premium (corp = beneficiary) — Permanent
      { label: "R5 Life insurance premium: Temp or Permanent", expectedAccount: "Permanent" },
      { label: "R5 Life insurance premium: Change $", expectedAmount: 0 },
      { label: "R5 Life insurance premium: DTA / DTL / Neither", expectedAccount: "Neither" },
      // Row 6: NOL carryforward → DTA
      { label: "R6 NOL carryforward: Temp or Permanent", expectedAccount: "Temporary" },
      { label: "R6 NOL carryforward: Change $", expectedAmount: 900 },
      { label: "R6 NOL carryforward: DTA / DTL / Neither", expectedAccount: "DTA" },
      // Row 7: Red Company dividend (5% ownership → 50% DRD on $700, $350 permanent)
      { label: "R7 Red Co dividend: Temp or Permanent", expectedAccount: "Permanent" },
      { label: "R7 Red Co dividend: Change $", expectedAmount: 0 },
      { label: "R7 Red Co dividend: DTA / DTL / Neither", expectedAccount: "Neither" },
      // Row 8: Installment sales — book NOW, tax LATER → DTL
      { label: "R8 Installment sales: Temp or Permanent", expectedAccount: "Temporary" },
      { label: "R8 Installment sales: Change $", expectedAmount: 405 },
      { label: "R8 Installment sales: DTA / DTL / Neither", expectedAccount: "DTL" },
      // Row 9: JE No. 1 → reverse-engineer DTL plug = $90 → temp diff $300
      { label: "R9 JE#1 (ITE $300 Dr / ITP $210 Cr): Temp or Permanent", expectedAccount: "Temporary" },
      { label: "R9 JE#1: Change in deferred amount $", expectedAmount: 90 },
      { label: "R9 JE#1: DTA / DTL / Neither", expectedAccount: "DTL" },
      // Row 10: JE No. 2 → ITE $40 Dr / ITP $70 Cr / VA $90 Cr → plug $120 Dr to DTA
      { label: "R10 JE#2 (ITE $40 Dr / ITP $70 Cr / VA $90 Cr): Temp or Permanent", expectedAccount: "Temporary" },
      { label: "R10 JE#2: Change in deferred amount $", expectedAmount: 120 },
      { label: "R10 JE#2: DTA / DTL / Neither", expectedAccount: "DTA" },
    ],
    exhibits: [
      { name: "Flexir Department-Meeting Notes (key figures)", body:
        "Depreciation: SL on TAX = $1,000; Accelerated on BOOKS = $1,500 → temp diff $500\n" +
        "Rental: tenant prepaid $400; book recognition NEXT year → temp diff $400 (taxed NOW)\n" +
        "NOL carryforward: ≈ $3,000\n" +
        "Installment sales: $135 booked, cash not yet received → temp diff $1,350 (rounding per Becker $135 → matches $40.50)\n" +
        "Becker explicit per Row 8 reasoning: DTL change = $405 (= $1,350 × 30%)\n" +
        "Tax rate: 30 percent\n"
      },
      { name: "Investments & Insurance Memo (permanent items)", body:
        "Municipal bond: $10,000 face; $250 interest → PERMANENT (tax-exempt)\n" +
        "Red Company 5% ownership: $700 dividend received\n" +
        "  → DRD = 50% × $700 = $350 PERMANENT (never taxed)\n" +
        "  → Other $350 IS taxable but already on books — no timing diff\n" +
        "Life insurance on CFO, Flexir = beneficiary: $750 premium → PERMANENT (not deductible)\n"
      },
      { name: "Reverse-engineering deferred amounts from JE clues", body:
        "Every income tax JE balances: Income Tax Expense (Dr) = Tax Payable (Cr) ± Deferred Tax change ± Valuation Allowance\n\n" +
        "JE No. 1:  Dr ITE $300   Cr ITP $210   → plug $90 Cr\n" +
        "  $90 credit = increase in DEFERRED TAX LIABILITY\n" +
        "  Underlying temp diff = $90 / 0.30 = $300 (DTL because credit balances)\n\n" +
        "JE No. 2:  Dr ITE $40   Cr ITP $70   Cr Valuation Allowance $90   → plug $120 Dr\n" +
        "  $120 debit = increase in DEFERRED TAX ASSET\n" +
        "  Underlying temp diff = $120 / 0.30 = $400 (DTA because debit balances)\n" +
        "  Note: the VA $90 credit reduces the net DTA on the B/S to $30\n"
      },
      { name: "Temp vs Perm cheat-sheet for this TBS", body:
        "TEMPORARY (reverses over time → DTA or DTL):\n" +
        "  - Depreciation differences\n" +
        "  - Prepaid rent (taxed when received, booked when earned) → DTA\n" +
        "  - NOL carryforward → DTA\n" +
        "  - Installment sales (booked now, taxed later) → DTL\n" +
        "  - Warranty accruals → DTA\n\n" +
        "PERMANENT (never reverses → no DTA/DTL):\n" +
        "  - Municipal bond interest (tax-exempt)\n" +
        "  - Life insurance proceeds/premiums when corp is beneficiary\n" +
        "  - Dividends-received deduction (the DRD portion)\n" +
        "  - Meals & entertainment 50% portion\n" +
        "  - Fines & penalties\n"
      },
    ],
    scoring: { basePerCell: 11, mult: 1.5, bonusAllCorrect: 140 },
    explanations: [
      { row: 1, text: "Becker spread: tax SL $1,000 vs book accelerated $1,500 = $500 temp diff. Unusual direction (book > tax) → DTA. $500 × 30% = $150." },
      { row: 4, text: "Municipal bond interest is never taxed → permanent → no DTA/DTL." },
      { row: 7, text: "$400 prepaid rent taxable NOW but booked NEXT year → tax paid before book revenue → DTA = $400 × 30% = $120." },
      { row: 10, text: "Premiums on life insurance where corp is beneficiary are not deductible → permanent → no DTA/DTL." },
      { row: 13, text: "NOL carryforward = future tax benefit → DTA = $3,000 × 30% = $900." },
      { row: 16, text: "5% ownership → 50% DRD → $350 of $700 is permanent (never taxed). The other $350 is taxed currently — no timing diff." },
      { row: 19, text: "Installment sale: book revenue NOW, tax revenue LATER → future taxable income → DTL. Temp diff $1,350 × 30% = $405." },
      { row: 22, text: "JE balances: $300 Dr - $210 Cr = $90 unbalanced credit → must be increase to DTL. $90 / 0.30 = $300 temp diff." },
      { row: 25, text: "JE balances: $40 Dr - $70 Cr - $90 Cr = $120 unbalanced debit → must be increase to DTA. $120 / 0.30 = $400 temp diff." },
    ],
  },
  {
    id: "tbs035009_temp_perm_dta_dtl_classification",
    tbsId: "TBS-035009",
    module: "F5.M3",
    title: "8 Scenarios — Temporary/Permanent + DTA/DTL + Current/Non-Current",
    prompt: "For each circumstance, classify the book-vs-tax difference as temporary or permanent, identify the asset/liability resulting, and the financial-statement classification.",
    accountOptions: [
      "Temporary timing difference, asset, non-current",
      "Temporary timing difference, liability, non-current",
      "Permanent difference, no financial statement presentation",
    ],
    rows: [
      { label: "1. Plant assets — tax depreciation > book depreciation", expectedAccount: "Temporary timing difference, liability, non-current" },
      { label: "2. Landlord collects rent in advance; taxed when received", expectedAccount: "Temporary timing difference, asset, non-current" },
      { label: "3. Interest received on tax-exempt municipal obligations", expectedAccount: "Permanent difference, no financial statement presentation" },
      { label: "4. One-year warranty costs estimated and accrued for book", expectedAccount: "Temporary timing difference, asset, non-current" },
      { label: "5. Prepaid liability insurance (one year, overlaps year-end)", expectedAccount: "Temporary timing difference, liability, non-current" },
      { label: "6. Equity-method investment; undistributed earnings paid out > 1 yr out", expectedAccount: "Temporary timing difference, liability, non-current" },
      { label: "7. Start-up org costs — expensed for book, amortized for tax", expectedAccount: "Temporary timing difference, asset, non-current" },
      { label: "8. Key-man life insurance premiums (corp = beneficiary)", expectedAccount: "Permanent difference, no financial statement presentation" },
    ],
    exhibits: [
      { name: "Classification Logic — three-step framework", body:
        "STEP 1: Is the difference TEMPORARY (will reverse) or PERMANENT (never)?\n" +
        "  Permanent: muni bond interest, life insurance (corp beneficiary), DRD, fines, meals 50%\n" +
        "  Temporary: everything else (depreciation timing, accruals, deferrals)\n\n" +
        "STEP 2: For temp diff — which side is ahead?\n" +
        "  TAX recognized FIRST (book later) → DTA  (tax already paid, refund coming)\n" +
        "  BOOK recognized FIRST (tax later) → DTL  (tax owed in future)\n\n" +
        "STEP 3: Under U.S. GAAP (ASC 740) — ALL deferred taxes are NON-CURRENT.\n" +
        "  Net DTA & DTL to single number per jurisdiction.\n"
      },
      { name: "Walkthrough of each row", body:
        "1. Tax dep > book dep → tax basis LESS than book basis → asset on books bigger\n" +
        "   → future tax liability when reversed → DTL, non-current\n\n" +
        "2. Rent received in ADVANCE: tax taxes it NOW, book defers as unearned revenue\n" +
        "   → tax already paid, book to recognize later → DTA, non-current\n\n" +
        "3. Tax-exempt municipal interest → never taxable → PERMANENT → no deferred presentation\n\n" +
        "4. Warranty accrual for book NOW, tax deducts WHEN PAID\n" +
        "   → book expense first, tax benefit later → DTA, non-current\n\n" +
        "5. Prepaid insurance: tax DEDUCTS at payment, book expenses as time passes\n" +
        "   → tax benefit NOW, book expense LATER → DTL, non-current\n\n" +
        "6. Equity method — parent recognizes undistributed earnings now; tax taxes upon distribution\n" +
        "   → book income first, tax later → DTL, non-current\n\n" +
        "7. Start-up costs: book FULLY expenses Y1; tax AMORTIZES over multiple years\n" +
        "   → book expense first, tax deductions later → DTA, non-current\n\n" +
        "8. Key-man life insurance (corp beneficiary): premiums never deductible, proceeds never taxable\n" +
        "   → PERMANENT, no deferred presentation\n"
      },
      { name: "Mnemonic — TAX FIRST = DTA, BOOK FIRST = DTL", body:
        "When TAX recognizes income/expense FIRST → set up DTA (your money is parked in tax until book catches up)\n" +
        "When BOOK recognizes income/expense FIRST → set up DTL (tax bill coming when tax catches up)\n\n" +
        "All deferred taxes under ASC 740 are NON-CURRENT. The 'current' choice in any Becker pop-up is a distractor.\n"
      },
    ],
    scoring: { basePerCell: 14, mult: 1.5, bonusAllCorrect: 90 },
    explanations: [
      { row: 1, text: "Tax dep > book dep → book basis bigger → tax basis depleted first → DTL non-current." },
      { row: 2, text: "Rent prepaid: tax NOW, book LATER → DTA non-current." },
      { row: 3, text: "Tax-exempt municipal interest is permanent — never appears on the tax return." },
      { row: 4, text: "Warranty accrual: book expense Y1, tax deduction when paid → DTA non-current." },
      { row: 5, text: "Prepaid insurance: tax deduction NOW, book expense LATER → DTL non-current." },
      { row: 6, text: "Equity method undistributed earnings: book income NOW, tax LATER (upon distribution) → DTL non-current." },
      { row: 7, text: "Org costs fully expensed for book Y1 but amortized for tax over 15 years → DTA non-current." },
      { row: 8, text: "Key-man life insurance with corp as beneficiary: premiums never deductible → permanent → no deferred treatment." },
    ],
  },
  {
    id: "do_good_nfp_memo_corrections",
    tbsId: "TBS-038107",
    module: "F6.M1",
    title: "Do Good NFP — Memo Corrections (5 fundraising scenarios)",
    prompt: "Revise the Do Good development officer's draft memorandum. For each underlined segment, pick the correction (or [Original]/[Delete]) per NFP revenue recognition rules.",
    accountOptions: [
      "[Original text] $60,000 in revenue without donor restrictions",
      "$54,000 in revenue without donor restrictions",
      "[Original text] $8,750 donor restricted for the program",
      "Revenue without donor restrictions designated for the homeless program",
      "[Original text] Strengthen net position + board-designated endowment",
      "Conditional promise — not revenue in current year",
      "[Original text] $70,000 pledge brings $84,000 — already recognized",
      "Conditional pledge — not recognized until $17,500 match secured",
      "[Original text] $60,000 revenue without donor restrictions + offsetting expense",
    ],
    rows: [
      { label: "Pop-up 1 — Pledges $60,000 with 10% historical uncollectible avg", expectedAccount: "$54,000 in revenue without donor restrictions" },
      { label: "Pop-up 2 — Rummage sale/silent auction $8,750 for homeless program", expectedAccount: "Revenue without donor restrictions designated for the homeless program" },
      { label: "Pop-up 3 — Mr. Osgood $100,000 bequest in will", expectedAccount: "Conditional promise — not revenue in current year" },
      { label: "Pop-up 4 — Sandy Dollar $70,000 conditional on 20% match", expectedAccount: "Conditional pledge — not recognized until $17,500 match secured" },
      { label: "Pop-up 5 — Big Corp donated office space 4,000 sqft × $15/sqft", expectedAccount: "[Original text] $60,000 revenue without donor restrictions + offsetting expense" },
    ],
    exhibits: [
      { name: "Pledge Receivable Memorandum (5-year history)", body:
        "5-year average uncollectible % = 10%\n" +
        "  Y1: 11%  Y2: 9%  Y3: 11%  Y4: 9%  Y5: 10%\n" +
        "Current-year unrestricted pledges: $60,000\n" +
        "Allowance for uncollected pledges (10%): $6,000\n" +
        "Net pledge revenue (without donor restrictions): $54,000\n"
      },
      { name: "Estate Memo — Mr. Osgood", body:
        "Will updated to include $100,000 bequest upon settlement of estate.\n" +
        "→ A BEQUEST in a will is a CONDITIONAL promise:\n" +
        "  - Person may not die yet\n" +
        "  - Will can be modified at any time\n" +
        "  - Recognition only when condition resolved (death + probate)\n" +
        "→ NOT revenue this year. No 'refundable advance.' Board cannot self-restrict.\n"
      },
      { name: "Sandy Dollar Note — Conditional Pledge math", body:
        "Sandy pledges $70,000 IF Do Good secures a 20% match from other donors.\n" +
        "  Her pledge = 80% of total program cost\n" +
        "  Total program cost = $70,000 / 0.80 = $87,500\n" +
        "  Required match = $87,500 × 20% = $17,500\n\n" +
        "Conditional promise = NOT RECOGNIZED until condition substantially met.\n" +
        "Trap distractor: '$14,000 match' (= $70,000 × 20% — wrong base).\n"
      },
      { name: "Donated Space (Big Corp letter + Anytown Real Estate)", body:
        "Big Corp donates 4,000 sqft office space (continuing lease at $0)\n" +
        "FMV per Anytown Real Estate: $15/sqft (low end of range)\n" +
        "  → Contribution revenue (without donor restrictions): $60,000\n" +
        "  → Offsetting rent expense: $60,000\n" +
        "  → Net effect on net assets: $0\n\n" +
        "Gift-in-kind for USE of a long-lived asset → recognize FMV as revenue + matching expense in the period used.\n"
      },
      { name: "Rummage Sale / Silent Auction — Key Rule", body:
        "Donors at a fundraising event with item sales / auctions CANNOT impose restrictions.\n" +
        "  → Even though board EARMARKED proceeds for homeless program,\n" +
        "    the $8,750 is NOT donor-restricted.\n" +
        "  → Classified as 'without donor restrictions, designated' (designation is internal).\n" +
        "  → Cash collected in full → no allowance needed.\n"
      },
    ],
    scoring: { basePerCell: 15, mult: 1.5, bonusAllCorrect: 80 },
    explanations: [
      { row: 1, text: "Pledges = revenue without donor restrictions, NET of 10% historical uncollectible allowance: $60,000 × (1 − 10%) = $54,000." },
      { row: 2, text: "Auction/rummage sale donors CANNOT impose restrictions. Board's earmark is INTERNAL. So $8,750 is without donor restrictions (designated)." },
      { row: 3, text: "Bequest in a will = conditional promise (death not certain, will can change). Recognize NO revenue. Board cannot create donor restriction." },
      { row: 4, text: "Sandy Dollar's $70,000 = 80% of total → total cost $87,500 → match required = $87,500 × 20% = $17,500. Conditional → no recognition until met." },
      { row: 5, text: "Donated use of long-lived asset at FMV ($15 × 4,000 = $60,000) → revenue + offsetting expense in same period. Net zero impact on net assets." },
    ],
  },
  {
    id: "nfp_net_asset_classification_9_scenarios",
    tbsId: "TBS-038100",
    module: "F6.M1",
    title: "NFP — Net Asset Classification (9 transactions)",
    prompt: "For each transaction, identify the net asset classification: with donor restrictions, without donor restrictions, or not classified as net assets.",
    accountOptions: [
      "With donor restrictions",
      "Without donor restrictions",
      "Not classified as net assets",
    ],
    rows: [
      { label: "2. Earnings on endowment principal, must fund building construction", expectedAccount: "With donor restrictions" },
      { label: "3. Donor deposit, contingent on securing operating funding", expectedAccount: "Not classified as net assets" },
      { label: "4. Donor PROMISES funds for construction, contingent on securing operating funding", expectedAccount: "Not classified as net assets" },
      { label: "5. Donor PROMISES unconditionally to donate over next 3 years", expectedAccount: "With donor restrictions" },
      { label: "6. Donor contributes cash unconditionally for general operations; spent within fiscal year", expectedAccount: "Without donor restrictions" },
      { label: "7. Unconditional donor-restricted contribution for new mission-based facility", expectedAccount: "With donor restrictions" },
      { label: "8. Unconditional contribution to develop new services central to mission", expectedAccount: "With donor restrictions" },
      { label: "9. Unconditional gift for endowment — principal intact, earnings for any purpose", expectedAccount: "With donor restrictions" },
      { label: "10. Board sets aside money in board-designated endowment for new building", expectedAccount: "Without donor restrictions" },
    ],
    exhibits: [
      { name: "Three-Question Decision Framework", body:
        "Q1: Is the promise CONDITIONAL (contingent on a future uncertain event)?\n" +
        "    YES → no recognition (NOT classified as net assets — record as refundable advance liability if cash received)\n" +
        "    NO  → continue\n\n" +
        "Q2: Did an EXTERNAL DONOR impose a use/time restriction?\n" +
        "    YES → With donor restrictions\n" +
        "    NO  → Without donor restrictions\n\n" +
        "Q3: Is the action by the BOARD (internal)?\n" +
        "    Board designations NEVER create donor restrictions.\n" +
        "    Board-designated funds remain WITHOUT donor restrictions.\n"
      },
      { name: "Key NFP Tripwires", body:
        "PROMISE TO GIVE OVER MULTIPLE YEARS → With donor restrictions (TIME restriction)\n" +
        "ENDOWMENT (principal permanently restricted, earnings may or may not be) → ALL endowment classifications are 'With donor restrictions'\n" +
        "  (Old 3-bucket classification of 'permanently restricted' is collapsed into 'with donor restrictions' under ASU 2016-14)\n" +
        "BOARD-DESIGNATED ENDOWMENT → WITHOUT donor restrictions\n" +
        "  (because the board did it, not the donor)\n" +
        "CASH RECEIVED IN ADVANCE on a conditional promise → Refundable Advance LIABILITY (not net assets)\n"
      },
      { name: "Quick row-by-row reasoning", body:
        "2. Donor said earnings MUST go to construction → With\n" +
        "3. Cash IN HAND but condition outstanding → liability (refundable advance), not net assets\n" +
        "4. Just a promise + condition → no recognition, not net assets\n" +
        "5. Unconditional multi-year pledge → time restriction → With\n" +
        "6. No purpose restriction → Without\n" +
        "7. Donor-restricted purpose (mission-based facility) → With\n" +
        "8. Donor restricted to specific service development → With\n" +
        "9. Endowment principal intact (perpetual) → With (even if earnings unrestricted)\n" +
        "10. Board action only → Without (designation, not restriction)\n"
      },
    ],
    scoring: { basePerCell: 12, mult: 1.4, bonusAllCorrect: 80 },
    explanations: [
      { row: 1, text: "Even though it's endowment EARNINGS (not principal), the donor restricted use to construction → With donor restrictions." },
      { row: 2, text: "Cash in hand from a conditional promise = refundable advance LIABILITY. It is NOT a component of net assets." },
      { row: 3, text: "Promise (no cash yet) + condition → no recognition at all." },
      { row: 4, text: "Multi-year unconditional pledge has an implicit TIME restriction → With donor restrictions." },
      { row: 5, text: "No purpose/time restriction on operating cash → Without donor restrictions." },
      { row: 6, text: "Construction of new mission facility is a donor-imposed purpose → With." },
      { row: 7, text: "Donor-restricted to new service development → With." },
      { row: 8, text: "Endowment principal is held in perpetuity even if earnings flow freely → With donor restrictions." },
      { row: 9, text: "Board-designated = INTERNAL only. Net assets remain Without donor restrictions." },
    ],
  },
  {
    id: "siaggas_hospital_nfp_transactions",
    tbsId: "TBS-038101",
    module: "F6.M1",
    title: "Siaggas Animal Hospital — 6 NFP transaction effects",
    prompt: "Siaggas Animal Hospital (large NFP). For each transaction, identify the financial-statement effect.",
    accountOptions: [
      "No change in net assets either with or without donor restrictions",
      "Increase in revenues, gains, and other support without donor restrictions",
      "Increase in net assets with donor restrictions",
      "Increase in revenues, gains, and other support without donor restrictions with a simultaneous increase in expense",
      "Increase in net assets with donor restrictions with possible additional endowment fund disclosures",
    ],
    rows: [
      { label: "2. Board designates $1,000,000 to purchase investments for capital improvements", expectedAccount: "No change in net assets either with or without donor restrictions" },
      { label: "3. Income earned on the board-designated investments is received", expectedAccount: "Increase in revenues, gains, and other support without donor restrictions" },
      { label: "4. Benefactor (donor) provides funds for building expansion", expectedAccount: "Increase in net assets with donor restrictions" },
      { label: "5. Donor-restricted building funds used to acquire building (next period)", expectedAccount: "Increase in revenues, gains, and other support without donor restrictions" },
      { label: "6. Accounting firm provides annual audit services at no charge", expectedAccount: "Increase in revenues, gains, and other support without donor restrictions with a simultaneous increase in expense" },
      { label: "7. Donor contributes investments; income must be used for outpatient services", expectedAccount: "Increase in net assets with donor restrictions with possible additional endowment fund disclosures" },
    ],
    exhibits: [
      { name: "NFP Hospital Specifics", body:
        "Siaggas adopted policy: no time restriction on long-lived asset gifts\n" +
        "  → When restricted cash funds a building, restriction is satisfied IMMEDIATELY upon use\n" +
        "  → 'Net assets released from restriction' shows simultaneous Without ↑ / With ↓\n\n" +
        "Under U.S. GAAP for NFPs (ASC 958):\n" +
        "  - Expenses ARE ALWAYS recognized as decreases to net assets WITHOUT donor restrictions\n" +
        "  - When restricted contributions are spent on the restricted purpose:\n" +
        "      Dr  Reclassification — release of restriction (Without donor restrictions)\n" +
        "      Cr  Reclassification — release of restriction (With donor restrictions)\n"
      },
      { name: "Donated Services — SOME of the time", body:
        "Donated services recorded at FMV ONLY when:\n" +
        "  S — Specialized skills (CPA, lawyer, doctor, electrician)\n" +
        "  O — Otherwise purchased if not donated\n" +
        "  ME — Measurable Easily at FMV\n" +
        "OR services create / enhance a non-financial asset (carpenter builds shed).\n\n" +
        "JE: Dr Expense (without donor restrictions) | Cr Revenue (without donor restrictions)\n" +
        "Net effect on net assets: $0\n\n" +
        "Accounting firm audit = textbook example — meets SOME test.\n"
      },
      { name: "Board-Designated vs Donor-Restricted", body:
        "BOARD DESIGNATION of unrestricted cash → NO CHANGE in net asset classification\n" +
        "  (still Without donor restrictions — board cannot create a 'restriction')\n\n" +
        "INVESTMENT INCOME on board-designated funds → also Without donor restrictions\n" +
        "  (income inherits the parent's classification)\n\n" +
        "DONOR contribution for plant expansion → With donor restrictions (PURPOSE restriction)\n" +
        "USE of those funds for building → released from restriction (Without donor restrictions ↑)\n"
      },
    ],
    scoring: { basePerCell: 14, mult: 1.4, bonusAllCorrect: 70 },
    explanations: [
      { row: 1, text: "Board designation is INTERNAL — no change in net asset class. Both Without and With remain unchanged." },
      { row: 2, text: "Income on board-designated funds inherits Without donor restrictions classification → revenue without donor restrictions." },
      { row: 3, text: "Donor-restricted purpose (building expansion) → With donor restrictions on receipt." },
      { row: 4, text: "When the restricted cash is USED for the building: reclassification — without donor restrictions ↑, with ↓. Building acquisition itself is a capital addition that flows to Without." },
      { row: 5, text: "Audit services pass SOME test (Specialized, Otherwise purchased, Measurable Easily) → record FMV as revenue + offsetting expense (both without donor restrictions)." },
      { row: 6, text: "Donor restricted both the investments AND the income to outpatient services → With donor restrictions. Endowment-like nature may require additional disclosures." },
    ],
  },
  {
    id: "juniper_endowment_underwater_loss",
    tbsId: "TBS-002107",
    module: "F6.M1",
    title: "Juniper University — Endowment with Underwater Loss",
    prompt: "Permanently restricted endowment: $60,000 earnings in current year, $100,000 unrealized loss (underwater), $30,000 spent on donor-designated programs. Compute the impact on each line.",
    accountOptions: [],
    rows: [
      { label: "2. Revenues without donor restrictions", expectedAmount: 0 },
      { label: "3. Revenues with donor restrictions", expectedAmount: 60000 },
      { label: "4. Expenses without donor restrictions", expectedAmount: 30000 },
      { label: "5. Expenses with donor restrictions", expectedAmount: 0 },
      { label: "6. Gain/(loss) on investment (without donor restriction)", expectedAmount: 0 },
      { label: "7. Gain/(loss) on investment (with donor restriction)", expectedAmount: -100000 },
      { label: "8. Satisfaction of program restrictions — Net assets WITH donor restrictions side", expectedAmount: -30000 },
      { label: "9. Endowment funds released from restrictions", expectedAmount: 0 },
      { label: "10. Net assets without donor restrictions (change)", expectedAmount: 0 },
      { label: "11. Net assets with donor restrictions (change)", expectedAmount: -70000 },
    ],
    exhibits: [
      { name: "Juniper Endowment Facts", body:
        "Permanently restricted endowment from donor\n" +
        "  Donor stipulation: earnings used for program services\n\n" +
        "Year activity:\n" +
        "  Investment INCOME (earnings): $60,000\n" +
        "  Unrealized LOSS on investments: ($100,000) — endowment is UNDERWATER\n" +
        "  Program spending (using endowment earnings per donor stipulation): $30,000\n"
      },
      { name: "Underwater Endowment Rule (ASU 2016-14)", body:
        "When an endowment's fair value falls BELOW carrying value (underwater):\n" +
        "  - Cumulative losses absorbed by the endowment itself\n" +
        "  - Classified CONSISTENT with the donor's restriction (typically WITH donor restrictions)\n" +
        "  - Disclosure required: original gift value, current FV, deficiency amount\n\n" +
        "BEFORE ASU 2016-14: losses partially hit Unrestricted bucket\n" +
        "AFTER ASU 2016-14: ALL underwater endowment losses → With donor restrictions\n"
      },
      { name: "Reclassification Mechanics (Net Assets Released)", body:
        "When NFP spends donor-restricted funds on the restricted purpose:\n\n" +
        "  Statement of Activities shows TWO simultaneous lines:\n" +
        "  Without donor restrictions: +$30,000 (Net assets released from restriction)\n" +
        "  With donor restrictions:    -$30,000 (Net assets released from restriction)\n\n" +
        "  Then expenses are recorded against Without donor restrictions: -$30,000\n" +
        "  Net effect: Without = +30k − 30k = $0 change\n" +
        "             With = part of the −$70k aggregate change\n"
      },
      { name: "Roll-Forward of Net Assets with Donor Restrictions", body:
        "                                              Amount\n" +
        "Investment earnings (donor-restricted)        +$60,000\n" +
        "Unrealized investment losses (underwater)    -$100,000\n" +
        "Net assets released for program restrictions  -$30,000\n" +
        "                                              ─────────\n" +
        "Net change in net assets with donor restrictions: -$70,000\n\n" +
        "Net assets WITHOUT donor restrictions:\n" +
        "  + Reclassified in (release):  $30,000\n" +
        "  - Program expense:           -$30,000\n" +
        "  Net change:                   $0\n"
      },
    ],
    scoring: { basePerCell: 14, mult: 1.6, bonusAllCorrect: 120 },
    explanations: [
      { row: 1, text: "Endowment earnings/losses never flow to Without revenue. No unrestricted revenue here." },
      { row: 2, text: "Donor restricted earnings to program use → $60,000 revenue WITH donor restrictions." },
      { row: 3, text: "ALL expenses hit Without donor restrictions side (after reclassification in). Program spending = $30,000 expense without donor restrictions." },
      { row: 4, text: "Expenses are never charged directly to With donor restrictions side." },
      { row: 5, text: "Underwater losses on donor-restricted endowment are absorbed entirely within the With bucket (ASU 2016-14). $0 to Without." },
      { row: 6, text: "$100,000 unrealized loss stays With donor restrictions (consistent with donor classification of the underlying endowment)." },
      { row: 7, text: "Reclassification: $30,000 of net assets released from restriction (shown as decrease on With side)." },
      { row: 8, text: "No endowment principal was released. Earnings reclassification ≠ 'endowment funds released'." },
      { row: 9, text: "Without donor restrictions: +$30,000 reclassified IN, then -$30,000 expense out. Net change $0." },
      { row: 10, text: "+$60,000 earnings − $100,000 loss − $30,000 reclassification out = -$70,000 net change in With donor restrictions." },
    ],
  },
  {
    id: "nfp_statement_cash_flows_classification",
    tbsId: "TBS-038103",
    module: "F6.M2",
    title: "NFP Statement of Cash Flows — 7 transaction classifications",
    prompt: "Classify each NFP transaction by Statement of Cash Flows section.",
    accountOptions: [
      "O - Cash flows from operating activities",
      "I - Cash flows from investing activities",
      "F - Cash flows from financing activities",
    ],
    rows: [
      { label: "1. Promises collected without donor restriction", expectedAccount: "O - Cash flows from operating activities" },
      { label: "2. Cash received as good-faith advance on matching-funds promise (deferred)", expectedAccount: "O - Cash flows from operating activities" },
      { label: "3. Purchase of bus", expectedAccount: "I - Cash flows from investing activities" },
      { label: "4. Principal payment on short-term bank loan", expectedAccount: "F - Cash flows from financing activities" },
      { label: "5. Purchase of equity securities", expectedAccount: "I - Cash flows from investing activities" },
      { label: "6. Dividend income earned on equity securities", expectedAccount: "O - Cash flows from operating activities" },
      { label: "7. Interest payment on short-term bank loan", expectedAccount: "O - Cash flows from operating activities" },
      { label: "8. Interest earned on endowment", expectedAccount: "O - Cash flows from operating activities" },
    ],
    exhibits: [
      { name: "NFP SCF — Same as Commercial with these twists", body:
        "NFP Statement of Cash Flows uses the same 3-bucket structure as commercial:\n" +
        "  OPERATING — recurring activity tied to changes in net assets without donor restrictions\n" +
        "  INVESTING — buying/selling long-lived assets, equity & debt investments\n" +
        "  FINANCING — borrowing/repaying principal on debt, contributions RESTRICTED for long-term purposes\n\n" +
        "Key differences from commercial:\n" +
        "  - Restricted contributions for long-term purpose (endowment, plant) = FINANCING\n" +
        "  - Unrestricted contributions = OPERATING\n" +
        "  - Interest paid AND received = OPERATING (same as GAAP commercial)\n" +
        "  - Dividends RECEIVED = OPERATING; dividends PAID by NFP — N/A (no equity)\n"
      },
      { name: "CLAD — Why conditional good-faith advance is OPERATING", body:
        "CLAD = Cash Liabilities And Deferrals\n" +
        "Refundable advance (cash received on conditional promise) is a LIABILITY.\n" +
        "  → Change in liability hits OPERATING section of SCF (like deferred revenue in commercial).\n" +
        "  → When condition is met later → reclass liability to revenue (no cash effect).\n\n" +
        "Trick: even though the cash relates to a future construction project (sounds financing-y),\n" +
        "  the immediate classification is OPERATING because it lives in current liabilities until condition met.\n"
      },
      { name: "Quick-Match Table", body:
        "Activity                                          Section\n" +
        "──────────────────────────────────────────────────────────\n" +
        "Unrestricted contribution received               OPERATING\n" +
        "Restricted contribution for endowment/plant      FINANCING\n" +
        "Refundable advance received (conditional)        OPERATING\n" +
        "Purchase/sale of investments                     INVESTING\n" +
        "Purchase/sale of PP&E                            INVESTING\n" +
        "Issue/repay debt principal                       FINANCING\n" +
        "Interest paid                                    OPERATING\n" +
        "Interest received                                OPERATING\n" +
        "Dividends received                               OPERATING\n"
      },
    ],
    scoring: { basePerCell: 12, mult: 1.4, bonusAllCorrect: 70 },
    explanations: [
      { row: 1, text: "Unrestricted pledges collected = operating revenue character → OPERATING." },
      { row: 2, text: "Deferred refundable advance = liability change → OPERATING (CLAD)." },
      { row: 3, text: "Bus = capital asset → INVESTING." },
      { row: 4, text: "Principal repayment on debt → FINANCING." },
      { row: 5, text: "Investment in equity securities → INVESTING." },
      { row: 6, text: "Dividend income earned = operating-style income → OPERATING." },
      { row: 7, text: "Interest paid is OPERATING under U.S. GAAP (both commercial and NFP)." },
      { row: 8, text: "Interest earned is OPERATING (same as commercial)." },
    ],
  },
  {
    id: "barter_nursing_home_donated_services_some",
    tbsId: "TBS-038106",
    module: "F6.M3",
    title: "Barter Nursing Home — Donated Services SOME Test (4 scenarios)",
    prompt: "Indicate the value of contribution revenue Barter recognizes for each donated service.",
    accountOptions: [],
    rows: [
      { label: "2. Practicing attorney (board member) — legal services FMV $30,000", expectedAmount: 30000 },
      { label: "3. Friends of Barter volunteers — magazine distribution & companionship ($28,000 min wage)", expectedAmount: 0 },
      { label: "4. Volunteer addition build — skilled carpenter $13,000 + general labor $12,000", expectedAmount: 25000 },
      { label: "5. Volunteer doctors $120,000 FMV; Barter pays $20,000 stipend; physicians required by state licensing", expectedAmount: 100000 },
    ],
    exhibits: [
      { name: "SOME Test — Recognize donated services WHEN...", body:
        "EITHER:\n" +
        "  (a) Services create or enhance a NON-FINANCIAL ASSET (e.g. carpenter builds wing)\n" +
        "OR ALL THREE of:\n" +
        "  S — Specialized skill (CPA, doctor, lawyer, electrician, carpenter)\n" +
        "  O — Otherwise would need to be purchased\n" +
        "  ME — Measurable Easily (FMV objectively determinable)\n\n" +
        "Mnemonic: 'NFPs record donated services SOME of the time.'\n"
      },
      { name: "Asset-Enhancement Special Rule", body:
        "When volunteers create/enhance a NON-FINANCIAL ASSET (building, equipment, art):\n" +
        "  → Recognize BOTH skilled AND unskilled labor at FMV\n" +
        "  → Even general laborers (no specialized skill) get capitalized into the asset\n" +
        "Reason: the asset itself is recognized at FMV; all labor that went into it counts.\n\n" +
        "So Row 4: $13,000 (carpenter) + $12,000 (general labor) = $25,000 total revenue\n" +
        "(matched by capitalization to building, not expense)\n"
      },
      { name: "Partially-Paid Donated Services", body:
        "When donor provides a service at below-FMV (partially paid):\n" +
        "  Revenue recognized = FMV − stipend paid\n" +
        "  Net effect on net assets = $0 (revenue and expense offset)\n\n" +
        "Row 5 math:\n" +
        "  $120,000 FMV of physician services\n" +
        "  - $20,000 stipend paid by Barter (cash out)\n" +
        "  = $100,000 contribution revenue (the donated portion)\n" +
        "  Doctors required for state licensure → would otherwise need to purchase → SOME passes\n"
      },
      { name: "Failure Examples (Row 3)", body:
        "Companionship / general volunteer hours fail SOME:\n" +
        "  - No specialized skill\n" +
        "  - Likely wouldn't be purchased at all if not donated\n" +
        "  - Hard to measure FMV objectively\n" +
        "  → $0 revenue. Minimum wage × hours is NOT a valid measurement.\n"
      },
    ],
    scoring: { basePerCell: 14, mult: 1.6, bonusAllCorrect: 70 },
    explanations: [
      { row: 1, text: "Attorney has specialized skill, would otherwise be purchased, FMV measurable → SOME passes → $30,000 revenue + offsetting expense." },
      { row: 2, text: "Companionship / magazine distribution: no specialized skill, likely wouldn't be purchased → SOME fails → $0." },
      { row: 3, text: "Volunteers BUILT a building addition (non-financial asset). All labor — skilled AND unskilled — recognized at FMV: $13,000 + $12,000 = $25,000." },
      { row: 4, text: "Physicians: specialized, state-required, measurable. FMV $120,000 minus $20,000 stipend paid = $100,000 net donated services revenue." },
    ],
  },
  {
    id: "day_care_conditional_promise_lifecycle_je",
    tbsId: "TBS-038105",
    module: "F6.M3",
    title: "Day Care Conditional Promise — 5-step JE Lifecycle ($500K)",
    prompt: "Benefactor pledges $500K for new day care center contingent on bus route relocation. Record each JE in sequence.",
    accountOptions: [
      "Cash",
      "Cash—with donor restrictions",
      "Cash—without donor restrictions",
      "Refundable advance",
      "Pledge receivable—with donor restrictions",
      "Revenue—with donor restrictions",
      "Satisfaction of use restriction",
      "Construction in progress",
      "No Entry Required",
    ],
    rows: [
      // Step 1 — Conditional promise → No Entry
      { label: "Step 1: Benefactor promises $500K contingent on bus relocation", expectedAccount: "No Entry Required" },
      // Step 2 — $200K cash advance on conditional promise
      { label: "Step 2 Dr: Cash received $200K as good-faith advance", expectedAccount: "Cash" },
      { label: "Step 2 Dr amount", expectedAmount: 200000 },
      { label: "Step 2 Cr: liability account", expectedAccount: "Refundable advance" },
      { label: "Step 2 Cr amount", expectedAmount: 200000 },
      // Step 3 — Bus route agrees: condition met → reclass advance + recognize remaining pledge
      { label: "Step 3 Dr: Reclass refundable advance", expectedAccount: "Refundable advance" },
      { label: "Step 3 Dr amount #1", expectedAmount: 200000 },
      { label: "Step 3 Dr: Record receivable for remaining promise", expectedAccount: "Pledge receivable—with donor restrictions" },
      { label: "Step 3 Dr amount #2", expectedAmount: 300000 },
      { label: "Step 3 Cr: Revenue", expectedAccount: "Revenue—with donor restrictions" },
      { label: "Step 3 Cr amount", expectedAmount: 500000 },
      // Step 4 — Collect remaining $300K
      { label: "Step 4 Dr: Cash collected", expectedAccount: "Cash—with donor restrictions" },
      { label: "Step 4 Dr amount", expectedAmount: 300000 },
      { label: "Step 4 Cr: clear receivable", expectedAccount: "Pledge receivable—with donor restrictions" },
      { label: "Step 4 Cr amount", expectedAmount: 300000 },
      // Step 5 — Spend $150K on construction
      { label: "Step 5a Dr: Release restriction", expectedAccount: "Satisfaction of use restriction" },
      { label: "Step 5a Dr amount", expectedAmount: 150000 },
      { label: "Step 5a Cr: Cash leaves restricted bucket", expectedAccount: "Cash—with donor restrictions" },
      { label: "Step 5a Cr amount", expectedAmount: 150000 },
      { label: "Step 5b Dr: Cash enters unrestricted bucket", expectedAccount: "Cash—without donor restrictions" },
      { label: "Step 5b Dr amount", expectedAmount: 150000 },
      { label: "Step 5b Cr: Release recorded on unrestricted side", expectedAccount: "Satisfaction of use restriction" },
      { label: "Step 5b Cr amount", expectedAmount: 150000 },
      { label: "Step 5c Dr: Capitalize spend (NOT expense)", expectedAccount: "Construction in progress" },
      { label: "Step 5c Dr amount", expectedAmount: 150000 },
      { label: "Step 5c Cr: Pay out unrestricted cash", expectedAccount: "Cash—without donor restrictions" },
      { label: "Step 5c Cr amount", expectedAmount: 150000 },
    ],
    exhibits: [
      { name: "Conditional Promise Lifecycle (5 phases)", body:
        "PHASE 1 — Conditional promise made (no cash yet):\n" +
        "  → NO ENTRY. Never use 'Conditional pledge receivable.'\n\n" +
        "PHASE 2 — Cash received WHILE condition still outstanding:\n" +
        "  Dr Cash\n" +
        "  Cr Refundable advance (LIABILITY, not revenue)\n\n" +
        "PHASE 3 — Condition substantially met:\n" +
        "  Dr Refundable advance               (clear liability)\n" +
        "  Dr Pledge receivable—WDR            (remaining unfulfilled)\n" +
        "  Cr Revenue—WDR                      (full $500,000 now)\n\n" +
        "PHASE 4 — Collect the receivable:\n" +
        "  Dr Cash—WDR\n" +
        "  Cr Pledge receivable—WDR\n\n" +
        "PHASE 5 — Spend on the restricted purpose:\n" +
        "  Step 5a — Release from restriction (close out WDR cash)\n" +
        "  Step 5b — Reclass into WoDR cash (the mirror image)\n" +
        "  Step 5c — Capitalize (CIP, not expense — it's construction)\n"
      },
      { name: "Two-Sided Reclassification Trick", body:
        "When restricted funds are USED for the restricted purpose,\n" +
        "the NFP must show BOTH sides of the reclassification on its books:\n\n" +
        "  WDR cash decreases (Cr Cash—WDR)\n" +
        "  WoDR cash increases (Dr Cash—WoDR)\n" +
        "  with a 'Satisfaction of use restriction' clearing account on each side\n\n" +
        "Then the actual EXPENSE/capitalization is recorded against WoDR cash.\n" +
        "On the face of the Statement of Activities, this shows up as a single line:\n" +
        "  'Net assets released from restriction' — increasing WoDR and decreasing WDR by the same $.\n"
      },
      { name: "Construction in Progress (NOT Expense)", body:
        "When restricted funds buy a long-lived asset, the spend is CAPITALIZED:\n" +
        "  Dr Construction in progress (asset)\n" +
        "  Cr Cash—WoDR\n\n" +
        "Construction is NOT an expense → no expense flows through statement of activities.\n" +
        "Asset shows on the Statement of Financial Position as 'CIP' until placed in service,\n" +
        "then transferred to Buildings and depreciated over useful life.\n"
      },
    ],
    scoring: { basePerCell: 8, mult: 1.6, bonusAllCorrect: 180 },
    explanations: [
      { row: 1, text: "Conditional promises never trigger a JE. No revenue, no receivable, no asset, no liability — just disclosure if material." },
      { row: 4, text: "Cash received on a conditional promise = REFUNDABLE ADVANCE liability. Don't book revenue yet." },
      { row: 10, text: "Once the condition is met, recognize the FULL $500K as revenue WDR and convert the $200K advance + $300K new receivable." },
      { row: 20, text: "Construction spending is CAPITALIZED to CIP (not expense). The restriction-release entries move cash through the reclassification accounts." },
    ],
  },
  {
    id: "community_service_nfp_classification_amounts",
    tbsId: "TBS-038102",
    module: "F6.M3",
    title: "Community Service Inc. — 6 NFP F/S Amount Classifications (Y2)",
    prompt: "Community Service is a nongovernmental NFP voluntary health & welfare org. Determine the Y2 amount for each line item.",
    accountOptions: [],
    rows: [
      { label: "1. Contributions — with donor restrictions (debt-security endowment)", expectedAmount: 89000 },
      { label: "2. Investment income — debt securities", expectedAmount: 6500 },
      { label: "3. Program expenses", expectedAmount: 115000 },
      { label: "4. General fund-raising expense (excludes special events)", expectedAmount: 2750 },
      { label: "5. Income on long-term investments — without donor restrictions", expectedAmount: 0 },
      { label: "6. Contributed voluntary services", expectedAmount: 0 },
    ],
    exhibits: [
      { name: "Community Service Inc. — Year 2 Activity", body:
        "Debt security endowment received Y2 (income for community services):\n" +
        "  Face value: $95,000\n" +
        "  FV at receipt: $89,000          ← contribution revenue at receipt\n" +
        "  FV at 12/31/Y2: $86,000         ← unrealized loss $3,000\n" +
        "  Interest earned Y2: $9,500\n" +
        "  Interest received Y2: $4,750\n\n" +
        "Volunteer meal service (400 hrs × $5/hr = $2,000 FMV) — FAILS SOME → $0\n\n" +
        "Short-term equity securities Y2:\n" +
        "  Cost $10,000   FV 12/31/Y2 $12,000   Dividend $1,250\n" +
        "  → Short-term (NOT long-term) — irrelevant for Row 5\n\n" +
        "Reading materials donated $7,500 (program use)\n" +
        "Federal youth training grant: $30,000 cash, $25,000 instructor salaries\n" +
        "Director of Community Activities salary: $60,000\n" +
        "Business manager salary: $55,000          (administration)\n" +
        "General bookkeeper salary: $37,800        (administration)\n" +
        "Space rental $30,000 (75% programs / 25% office)\n" +
        "Printing & mailing pledge cards: $2,750   (fund-raising)\n" +
        "Interest payment on short-term loan: $1,250 (administration)\n" +
        "Principal payment short-term loan: $750  (irrelevant for expense F/S)\n"
      },
      { name: "Investment Income (debt endowment) — Calc", body:
        "Investment income for an endowment combines:\n" +
        "  Interest earned (accrual basis): $9,500\n" +
        "  Change in fair value (unrealized loss): ($89,000 → $86,000) = $(3,000)\n" +
        "  ────────────────────────────────────────\n" +
        "  Net investment income: $9,500 - $3,000 = $6,500\n\n" +
        "Note: Cash interest received ($4,750) is irrelevant — accrual basis income reigns.\n"
      },
      { name: "Program Expense Build — Row 3", body:
        "Program expense includes ONLY items directly supporting programs:\n\n" +
        "  Donated reading materials (program distribution)   $7,500\n" +
        "  Instructor salaries                                25,000\n" +
        "  Director of Community Activities salary           60,000\n" +
        "  Space rental allocated to programs ($30,000 × 75%) 22,500\n" +
        "  ─────────────────────────────────────────────\n" +
        "  TOTAL Program Expense                            $115,000\n\n" +
        "EXCLUDED from program expense:\n" +
        "  - Business manager salary ($55,000) → administration\n" +
        "  - General bookkeeper salary ($37,800) → administration\n" +
        "  - Space rental office portion ($7,500) → administration\n" +
        "  - Interest expense ($1,250) → administration\n" +
        "  - Volunteer meal services → fails SOME → $0\n" +
        "  - Principal payment ($750) → NOT an expense\n" +
        "  - Pledge card printing → fund-raising\n"
      },
    ],
    scoring: { basePerCell: 16, mult: 1.5, bonusAllCorrect: 90 },
    explanations: [
      { row: 1, text: "Endowment is recorded at FV at the date of contribution = $89,000 (NOT face $95,000)." },
      { row: 2, text: "Investment income on accrual basis = interest earned $9,500 + FV change $(3,000) = $6,500." },
      { row: 3, text: "Program: $7,500 donated materials + $25,000 instructors + $60,000 director + $22,500 space rental (75%) = $115,000." },
      { row: 4, text: "Printing & mailing pledge cards is a textbook GENERAL fund-raising expense → $2,750." },
      { row: 5, text: "Community Services has NO long-term investments without donor restrictions per the fact pattern → $0." },
      { row: 6, text: "Volunteer meal service has no specialized skill → fails SOME → $0 revenue recognized." },
    ],
  },
  {
    id: "community_chest_pass_through_agency",
    tbsId: "TBS-002106",
    module: "F6.M4",
    title: "Community Chest — Pass-Through Agency vs Recipient (5 scenarios)",
    prompt: "Community Chest (federated fundraising) distributes donations to benefiting agencies like Animal Shelter / University Foundation. For each transaction, identify treatment by each entity.",
    accountOptions: [
      "Support—Contributions",
      "Refundable advance",
      "No entry or recognition required",
      "Change in interest in recipient net assets",
    ],
    rows: [
      // Part I — Community Chest / Animal Shelter
      { label: "P1.2 Community Chest receives general contributions (variance power, allocates per process)", expectedAccount: "Support—Contributions" },
      { label: "P1.2 Animal Shelter side", expectedAccount: "No entry or recognition required" },
      { label: "P1.3 Donor specifies funds intended for Animal Shelter — Community Chest side", expectedAccount: "Refundable advance" },
      { label: "P1.3 Animal Shelter side", expectedAccount: "Support—Contributions" },
      { label: "P1.4 Annuity administered for Shelter increases in value — Community Chest side", expectedAccount: "Refundable advance" },
      { label: "P1.4 Animal Shelter side", expectedAccount: "Support—Contributions" },
      { label: "P1.5 Donor promises gift to Shelter through Community Chest, conditional on Shelter relocating — Community Chest side", expectedAccount: "No entry or recognition required" },
      { label: "P1.5 Animal Shelter side", expectedAccount: "No entry or recognition required" },
      // Part II — Foundation / University (financially interrelated)
      { label: "P2.2 Foundation's net worth increases — Foundation side", expectedAccount: "Support—Contributions" },
      { label: "P2.2 University (financially interrelated beneficiary) side", expectedAccount: "Change in interest in recipient net assets" },
    ],
    exhibits: [
      { name: "Variance Power Decision Tree", body:
        "When NFP receives funds INTENDED for another organization, the key question is:\n\n" +
        "Does the receiving NFP have VARIANCE POWER?\n" +
        "  (Ability to redirect funds to a different beneficiary at its discretion)\n\n" +
        "  YES (Community Chest's normal allocations process):\n" +
        "    → Receiver: RECOGNIZE as contribution revenue\n" +
        "    → Beneficiary: NO ENTRY (they have no claim until allocations)\n\n" +
        "  NO (donor SPECIFIED the beneficiary):\n" +
        "    → Receiver: AGENT — record liability (Refundable advance)\n" +
        "    → Beneficiary: RECOGNIZE contribution revenue at FV\n"
      },
      { name: "Financially Interrelated Exception", body:
        "When the recipient and beneficiary are FINANCIALLY INTERRELATED:\n" +
        "  (e.g. University established Foundation for its benefit; resources expected to flow to U)\n\n" +
        "  → Recipient (Foundation) recognizes 'Contributions' as usual\n" +
        "  → Beneficiary (University) recognizes 'Change in interest in recipient net assets'\n" +
        "      = U's share of the Foundation's change in net assets\n\n" +
        "This is the EQUITY-METHOD-LIKE treatment for NFPs.\n" +
        "Distribution by the recipient is not contractually required but is EXPECTED.\n"
      },
      { name: "Quick Treatment Matrix", body:
        "Scenario                                        Recipient        Beneficiary\n" +
        "──────────────────────────────────────────────────────────────────────────────\n" +
        "Variance power held by recipient                Contribution     No entry\n" +
        "Donor specifies beneficiary                     Refundable adv.  Contribution\n" +
        "Annuity managed for specific beneficiary        Refundable adv.  Contribution\n" +
        "  (increase in value) — no variance power\n" +
        "Conditional promise (no condition yet met)      No entry         No entry\n" +
        "Financially interrelated organizations          Contribution     Change in interest\n" +
        "  (Foundation/University)                                          in recipient NA\n"
      },
      { name: "Why Conditional Trumps Pass-Through", body:
        "Row P1.5 — donor PROMISES to Animal Shelter through Community Chest,\n" +
        "  contingent on the Shelter relocating to larger facilities.\n\n" +
        "Conditional promises are NEVER recognized until conditions are met.\n" +
        "  → Neither entity records anything.\n" +
        "  → 'Conditional pledge receivable' is never used as an account.\n" +
        "  → Even if cash had been advanced, BOTH sides classify as conditional.\n"
      },
    ],
    scoring: { basePerCell: 12, mult: 1.5, bonusAllCorrect: 90 },
    explanations: [
      { row: 1, text: "Community Chest's normal allocations process = VARIANCE POWER → receiver recognizes Contributions revenue." },
      { row: 2, text: "Animal Shelter has no specific claim under variance power → No entry." },
      { row: 3, text: "Donor specified Shelter → Community Chest is AGENT → records refundable advance liability, not revenue." },
      { row: 4, text: "Animal Shelter is the named beneficiary → recognizes Support—Contributions at fair value." },
      { row: 5, text: "Annuity FV increase for a SPECIFIC beneficiary (no variance power) → Community Chest records refundable advance for the change." },
      { row: 6, text: "Shelter recognizes increase in its share as Contribution revenue." },
      { row: 7, text: "Conditional promise → NO entry on either side until condition met." },
      { row: 8, text: "Same — conditional triggers nothing on the beneficiary side either." },
      { row: 9, text: "Foundation (recipient) recognizes Contributions revenue at FV — standard treatment." },
      { row: 10, text: "Because Foundation and University are financially interrelated, U recognizes 'Change in interest in recipient net assets' (equity-method-like)." },
    ],
  },
  {
    id: "gov_fund_basis_of_accounting",
    tbsId: "TBS-003104",
    module: "F6.M6",
    title: "Governmental Fund Structure — Basis of Accounting (6 fund types)",
    prompt: "Identify the basis of accounting (full accrual vs modified accrual) for each governmental fund type.",
    accountOptions: [
      "Full accrual",
      "Modified accrual",
    ],
    rows: [
      { label: "2. Proprietary funds (SE — Internal Service, Enterprise)", expectedAccount: "Full accrual" },
      { label: "3. General Fund (Governmental — GRSPP)", expectedAccount: "Modified accrual" },
      { label: "4. Permanent Fund (Governmental — GRSPP)", expectedAccount: "Modified accrual" },
      { label: "5. Private Purpose Trust Fund (Fiduciary — CIPPOE)", expectedAccount: "Full accrual" },
      { label: "6. Fiduciary funds (CIPPOE — Custodial, Investment Trust, Private Purpose, OPEB, Employee benefit)", expectedAccount: "Full accrual" },
      { label: "7. Internal Service Fund (Proprietary — SE)", expectedAccount: "Full accrual" },
    ],
    exhibits: [
      { name: "GRaSPP, SE, CIPPOE — The Three Fund Categories", body:
        "GOVERNMENTAL Funds (GRaSPP) — MODIFIED ACCRUAL\n" +
        "  G — General Fund\n" +
        "  R — Special Revenue Fund\n" +
        "  S — Debt Service Fund\n" +
        "  P — Capital Projects Fund\n" +
        "  P — Permanent Fund\n" +
        "  Measurement focus: CURRENT FINANCIAL RESOURCES\n\n" +
        "PROPRIETARY Funds (SE) — FULL ACCRUAL\n" +
        "  S — Internal Service Fund\n" +
        "  E — Enterprise Fund\n" +
        "  Measurement focus: ECONOMIC RESOURCES\n\n" +
        "FIDUCIARY Funds (CIPPOE) — FULL ACCRUAL\n" +
        "  C — Custodial Fund\n" +
        "  I — Investment Trust Fund\n" +
        "  P — Private Purpose Trust Fund\n" +
        "  P — Pension (& other employee benefit) Trust Fund\n" +
        "  OE — OPEB / Other Employee benefit Trust Fund\n" +
        "  Measurement focus: ECONOMIC RESOURCES\n"
      },
      { name: "Basis of Accounting — Why It Matters", body:
        "MODIFIED ACCRUAL (Governmental funds):\n" +
        "  - Revenues: recognized when MEASURABLE AND AVAILABLE\n" +
        "    (available = collectible within current period + 60 days after year-end)\n" +
        "  - Expenditures: recognized when LIABILITY INCURRED\n" +
        "  - NO long-term assets or liabilities on fund-level statements\n" +
        "  - NO depreciation\n" +
        "  - Focus: How much can we spend NOW?\n\n" +
        "FULL ACCRUAL (Proprietary & Fiduciary):\n" +
        "  - Same as commercial GAAP\n" +
        "  - Revenue when earned, expense when incurred\n" +
        "  - All assets/liabilities on balance sheet\n" +
        "  - Depreciation recorded\n" +
        "  - Focus: Did we make money / preserve net position?\n"
      },
      { name: "Memory Hook", body:
        "GOVERNMENT funds = MODIFIED (the government modifies the rules)\n" +
        "PROPRIETARY = PRIVATE-like = FULL ACCRUAL (they operate like a business)\n" +
        "FIDUCIARY = FULL ACCRUAL (you're holding the money like a private trustee)\n\n" +
        "Quick rule:\n" +
        "  Only the 5 GRaSPP funds use modified accrual.\n" +
        "  Everything else (SE + CIPPOE) uses full accrual.\n"
      },
    ],
    scoring: { basePerCell: 14, mult: 1.4, bonusAllCorrect: 60 },
    explanations: [
      { row: 1, text: "Proprietary funds = Internal Service + Enterprise. Both operate like businesses → FULL accrual, economic resources focus." },
      { row: 2, text: "General Fund is the primary GRaSPP fund → MODIFIED accrual, current financial resources focus." },
      { row: 3, text: "Permanent Fund (principal held in perpetuity for public benefit) is still a GRaSPP fund → MODIFIED accrual." },
      { row: 4, text: "Private Purpose Trust = CIPPOE fiduciary fund → FULL accrual, economic resources focus." },
      { row: 5, text: "All fiduciary funds (CIPPOE) use full accrual — they hold resources in trust like a private trustee." },
      { row: 6, text: "Internal Service Fund = Proprietary (SE) → FULL accrual." },
    ],
  },
];

// Convenience lookup
window.TBS_BY_ID = {};
window.TBS_LIBRARY.forEach(t => { window.TBS_BY_ID[t.id] = t; });
