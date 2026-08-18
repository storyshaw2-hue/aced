"use strict";
const assert = require("assert");
const T = require("./aced-tbs");

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("PASS", name); }
  catch (e) { console.error("FAIL", name, "\n ", e.message); process.exitCode = 1; }
}

test("legacy select + numeric grading remains exact", () => {
  assert.equal(T.gradeItem({ type: "select", answer: 2 }, 2).correct, true);
  assert.equal(T.gradeItem({ type: "select", answer: 2 }, 1).correct, false);
  assert.equal(T.gradeItem({ type: "numeric", answer: 1000, tolerance: 2 }, "$1,001").correct, true);
  assert.equal(T.gradeItem({ type: "numeric", answer: -300 }, "(300)").correct, true);
});

test("multi_select requires the exact set and ignores response order", () => {
  const item = { type: "multi_select", answer: [0, 2] };
  assert.equal(T.gradeItem(item, [2, 0]).correct, true);
  assert.equal(T.gradeItem(item, [0]).correct, false);
  assert.equal(T.gradeItem(item, [0, 1, 2]).correct, false);
});

test("journal_entry is unordered, balanced and rejects extra lines", () => {
  const item = {
    type: "journal_entry",
    answer: [
      { account: "depreciation-expense", debit: 12000, credit: 0 },
      { account: "accumulated-depreciation", debit: 0, credit: 12000 }
    ]
  };
  const reverse = [
    { account: "accumulated-depreciation", debit: "", credit: "12,000" },
    { account: "depreciation-expense", debit: "$12,000", credit: "" }
  ];
  const good = T.gradeItem(item, reverse);
  assert.equal(good.correct, true);
  assert.equal(good.detail.balanced, true);
  assert.equal(good.earned, 2);

  const extra = reverse.concat([{ account: "cash", debit: 1, credit: 1 }]);
  assert.equal(T.gradeItem(item, extra).correct, false);
});

test("table_grid supports numeric, select and text cells with partial credit", () => {
  const item = {
    type: "table_grid",
    columns: [
      { key: "amount", label: "Amount", type: "numeric" },
      { key: "class", label: "Class", type: "select", choices: ["Book", "Bank"] },
      { key: "action", label: "Action", type: "text" }
    ],
    rows: [
      { id: "fee", label: "Service fee", answer: { amount: -50, class: 0, action: "record" } },
      { id: "dit", label: "Deposit in transit", answer: { amount: 500, class: 1, action: "monitor" } }
    ]
  };
  const r = T.gradeItem(item, {
    fee: { amount: "(50)", class: 0, action: "Record!" },
    dit: { amount: 500, class: 1, action: "wrong" }
  });
  assert.equal(r.correct, false);
  assert.equal(r.earned, 5);
  assert.equal(r.possible, 6);
  assert.equal(r.detail.cells.dit.action, false);
});

test("text_response compares authored aliases after safe normalization", () => {
  const item = { type: "text_response", answers: ["ASC 230", "Accounting Standards Codification 230"] };
  assert.equal(T.gradeItem(item, "asc-230").correct, true);
  assert.equal(T.gradeItem(item, "ASC 606").correct, false);
});

test("simulation score uses sub-points from complex items", () => {
  const sim = {
    items: [
      { type: "select", answer: 0 },
      {
        type: "journal_entry",
        answer: [
          { account: "expense", debit: 10, credit: 0 },
          { account: "payable", debit: 0, credit: 10 }
        ]
      }
    ]
  };
  const g = T.gradeSimulation(sim, [
    0,
    [{ account: "expense", debit: 10 }, { account: "payable", credit: 9 }]
  ]);
  assert.equal(g.earned, 1);   // select only; an unbalanced JE earns no partial credit
  assert.equal(g.possible, 3);
  assert.equal(g.pct, 33);
});

test("validator accepts each supported type", () => {
  const items = [
    { type: "select", prompt: "p", choices: ["a", "b"], answer: 0, explain: "e" },
    { type: "numeric", prompt: "p", answer: 1, explain: "e" },
    { type: "multi_select", prompt: "p", choices: ["a", "b"], answer: [0], explain: "e" },
    {
      type: "journal_entry", prompt: "p", accounts: ["cash", "revenue"],
      answer: [{ account: "cash", debit: 1 }, { account: "revenue", credit: 1 }], explain: "e"
    },
    {
      type: "table_grid", prompt: "p", columns: [{ key: "x", label: "X", type: "numeric" }],
      rows: [{ id: "r", label: "R", answer: { x: 1 } }], explain: "e"
    },
    { type: "text_response", prompt: "p", answers: ["ASC 230"], authority: { title: "FASB ASC 230", url: "https://asc.fasb.org/" }, explain: "e" }
  ];
  items.forEach((it, i) => assert.deepEqual(T.validateItem(it, "i" + i), []));
});

test("validator catches malformed new items", () => {
  assert.ok(T.validateItem({ type: "multi_select", prompt: "p", choices: ["a"], answer: [], explain: "e" }).length >= 2);
  assert.ok(T.validateItem({
    type: "journal_entry", prompt: "p", accounts: ["a", "b"],
    answer: [{ account: "a", debit: 10 }, { account: "b", credit: 9 }], explain: "e"
  }).some(e => /not balanced/.test(e)));
  assert.ok(T.validateItem({
    type: "table_grid", prompt: "p", columns: [{ key: "x", label: "X", type: "numeric" }],
    rows: [{ id: "r", label: "R", answer: {} }], explain: "e"
  }).some(e => /answer.x/.test(e)));
});

if (process.exitCode) console.error("\naced-tbs.test.js — FAILED");
else console.log("\naced-tbs.test.js — all " + passed + " tests passed");
