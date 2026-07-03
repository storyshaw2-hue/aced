/* packs/originals/reg-batch-07.js — CPA · REG original question bank (batch 07).
   ============================================================================
   8 original Regulation items modeled on the QUESTION PATTERNS in the Becker R6
   MCQ sets — the LEGAL side of business structure and corporate governance
   (as distinct from the entity TAX rules in batches 02/06). Mapped by CONTENT to:
     REG.R2 Business Law → 8
            (sole proprietorship, general partnership, limited partnership, LLC,
             corporate formation, piercing the corporate veil, directors' duties
             & the business judgment rule, shareholder rights)
   This completes the Business Law coverage of Area II. Topics are distinct from
   batches 03/04/05. Rules are the common law / model business statutes. Keys
   balanced 2/2/2/2 across A/B/C/D; distractor lengths varied so the correct
   choice is not the longest. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

{
  id:"cpa-reg-r2-22", source:"REG.R2", diff:"medium",
  q:"Which statement about a sole proprietorship is correct?",
  choices:[
    "The owner is personally liable for the business's debts, and its income is reported on the owner's own return",
    "It is a separate legal entity that shields the owner from all business liabilities",
    "It must file articles of organization with the state in order to exist",
    "It is taxed as a separate corporation at the entity level and then a second time when its profits are distributed to the owner"],
  answer:0,
  explain:"A sole proprietorship is not a separate legal entity: the owner is personally liable for its debts and reports its income on Schedule C of the owner's return. It needs no formation filing and is not a separately taxed corporation.",
  ref:"Business organizations — sole proprietorship"
},
{
  id:"cpa-reg-r2-23", source:"REG.R2", diff:"medium",
  q:"A general partnership:",
  choices:[
    "Requires a written agreement filed with the state in order to be formed",
    "Can be formed without formalities, and each general partner has unlimited personal liability for partnership debts",
    "Shields all of its partners from personal liability, just like a corporation",
    "Prevents any one of the individual partners from acting as an agent who is able to bind the entire partnership to a contract"],
  answer:1,
  explain:"A general partnership can form without formalities (even by conduct); each partner is an agent who can bind the partnership, and all partners have unlimited joint and several liability. It needs no state filing and does not shield partners like a corporation.",
  ref:"Partnership law — formation & liability"
},
{
  id:"cpa-reg-r2-24", source:"REG.R2", diff:"hard",
  q:"In a limited partnership, a limited partner:",
  choices:[
    "Has unlimited personal liability, the same as a general partner",
    "Must actively manage the partnership's daily business",
    "Generally has liability limited to the amount invested, but can lose that protection by taking part in control",
    "Is not permitted to hold or own any interest of any kind in the partnership or to share in its profits at all under state law"],
  answer:2,
  explain:"A limited partner's liability is generally limited to the capital invested, but taking part in control of the business can cost that protection. A limited partnership must have a general partner with unlimited liability; the limited partner neither has unlimited liability nor is required to manage.",
  ref:"Limited partnership law"
},
{
  id:"cpa-reg-r2-25", source:"REG.R2", diff:"medium",
  q:"A limited liability company (LLC):",
  choices:[
    "Subjects its members to unlimited personal liability for the entity's debts",
    "Must in every case be managed by an outside professional manager and can never be managed by any of its own members",
    "Is, by default, taxed as a C corporation at the entity level",
    "Gives its members limited liability and, by default, pass-through taxation"],
  answer:3,
  explain:"An LLC gives members limited liability (only their investment at risk) and, by default, pass-through taxation. Members are not personally liable, an LLC may be member- or manager-managed, and it is not taxed as a C corporation by default.",
  ref:"LLC law"
},
{
  id:"cpa-reg-r2-26", source:"REG.R2", diff:"medium",
  q:"A corporation comes into existence when:",
  choices:[
    "Articles of incorporation are filed with the state, creating a separate legal entity",
    "Two or more people simply reach an oral agreement to run a business together for profit and share its earnings",
    "The business begins earning revenue from its customers",
    "The shareholders each sign a partnership agreement"],
  answer:0,
  explain:"A corporation is created by filing articles of incorporation with the state, forming a separate legal person distinct from its owners. An oral agreement forms a partnership, mere revenue does not create a corporation, and shareholders do not sign a partnership agreement.",
  ref:"Corporate law — formation"
},
{
  id:"cpa-reg-r2-27", source:"REG.R2", diff:"hard",
  q:"A court may 'pierce the corporate veil' and hold shareholders personally liable when:",
  choices:[
    "The corporation earns a profit in its first year of operations",
    "Shareholders commingle personal and corporate funds, undercapitalize the corporation, or use it to commit fraud",
    "The corporation has more than one class of stock outstanding",
    "The corporation, acting entirely within the law, pays out regular dividends to each of its shareholders during the year"],
  answer:1,
  explain:"Courts pierce the veil to reach shareholders when the corporate form is abused — commingling funds, undercapitalization, ignoring formalities, or using the corporation to perpetrate fraud. Earning a profit, having multiple stock classes, or paying lawful dividends do not justify piercing.",
  ref:"Corporate law — piercing the veil"
},
{
  id:"cpa-reg-r2-28", source:"REG.R2", diff:"hard",
  q:"Under the business judgment rule, a corporate director who makes an informed, good-faith decision that later turns out badly is:",
  choices:[
    "Automatically personally liable to the shareholders for the resulting losses",
    "Liable unless a majority of the shareholders ratify the decision afterward",
    "Generally protected from liability for the decision",
    "Required to personally reimburse the corporation for the full amount of any loss it suffered"],
  answer:2,
  explain:"The business judgment rule shields directors from liability for honest, informed, good-faith decisions, even unprofitable ones, absent a conflict of interest, fraud, or gross negligence. Directors are not automatically liable, and no shareholder ratification or reimbursement is required.",
  ref:"Corporate law — business judgment rule"
},
{
  id:"cpa-reg-r2-29", source:"REG.R2", diff:"medium",
  q:"Which is a right of a corporation's common shareholders?",
  choices:[
    "The right to personally manage and direct all of the corporation's day-to-day business operations and decisions",
    "The right to compel the board of directors to declare a dividend each year",
    "The right to bind the corporation to contracts as its agent",
    "The right to vote to elect directors and to inspect the corporation's books for a proper purpose"],
  answer:3,
  explain:"Shareholders may vote to elect directors and inspect corporate books and records for a proper purpose (and may bring derivative suits). They do not manage daily operations (the board and officers do), cannot compel dividends (a matter of board discretion), and are not agents who bind the corporation.",
  ref:"Corporate law — shareholder rights"
}

]);
