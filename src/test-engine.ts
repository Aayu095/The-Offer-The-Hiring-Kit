import assert from "node:assert";
import {
  computePayroll,
  computeTax,
  inr,
  iso,
  joiningFacts,
} from "./engine";

// —————————————————————————————————————————————————————————————————————
// Engine verification. Every expected figure below was computed by
// hand from the spec (structure percentages, FY 2026-27 new-regime
// slabs, 87A rebate with marginal relief, 4% cess, §288B rounding)
// BEFORE the engine was run against it.
// —————————————————————————————————————————————————————————————————————

let passed = 0;
const eq = (actual: unknown, expected: unknown, label: string) => {
  assert.strictEqual(actual, expected, `${label}: expected ${expected}, got ${actual}`);
  passed++;
};
const near = (actual: number, expected: number, tol: number, label: string) => {
  assert.ok(Math.abs(actual - expected) <= tol, `${label}: expected ~${expected}, got ${actual}`);
  passed++;
};

// ——— CTC ₹12,00,000 — the rebate case: tax must come to ₹0 ———
// By hand: Basic 4,80,000 · HRA 2,40,000 · EPF 57,600 · gratuity
// 23,088 · special 3,99,312. Gross cash 11,19,312; taxable 10,44,312;
// slab tax 20,000 + 24,431.20 = 44,431.20 — fully rebated under 87A.
{
  const p = computePayroll(1_200_000);
  eq(p.basic, 480_000, "12L basic");
  eq(p.hra, 240_000, "12L hra");
  eq(p.employerPf, 57_600, "12L employer PF");
  eq(p.gratuity, 23_088, "12L gratuity");
  eq(p.special, 399_312, "12L special");
  eq(p.basic + p.hra + p.special + p.employerPf + p.gratuity, 1_200_000, "12L sums to CTC");
  eq(p.grossCashAnnual, 1_119_312, "12L gross cash");
  eq(p.tax.taxableIncome, 1_044_312, "12L taxable");
  near(p.tax.taxBeforeRebate, 44_431.2, 0.01, "12L slab tax");
  eq(p.tax.totalTax, 0, "12L total tax is zero after rebate");
  eq(p.inHandAnnual, 1_059_312, "12L annual in-hand");
  eq(p.inHandMonthly, 88_276, "12L monthly in-hand");
  console.log(`CTC ₹12L  → tax ₹0 · in-hand ${inr(p.inHandMonthly)}/mo`);
}

// ——— CTC ₹24,00,000 — the sample case, computed by hand in full ———
// Basic 9,60,000 · HRA 4,80,000 · EPF 1,15,200 · gratuity 46,176 ·
// special 7,98,624. Gross cash 22,38,624; taxable 21,63,624.
// Slab tax: 20,000 + 40,000 + 60,000 + 80,000 + 25% × 1,63,624
// (40,906) = 2,40,906. Cess 4% = 9,636.24 → 2,50,542.24 → ₹2,50,540
// (§288B, nearest ₹10). In-hand: 22,38,624 − 1,15,200 − 2,400 −
// 2,50,540 = 18,70,484 a year → ₹1,55,874 a month.
{
  const p = computePayroll(2_400_000);
  eq(p.basic, 960_000, "24L basic");
  eq(p.hra, 480_000, "24L hra");
  eq(p.employerPf, 115_200, "24L employer PF");
  eq(p.gratuity, 46_176, "24L gratuity");
  eq(p.special, 798_624, "24L special");
  eq(p.basic + p.hra + p.special + p.employerPf + p.gratuity, 2_400_000, "24L sums to CTC");
  eq(p.grossCashAnnual, 2_238_624, "24L gross cash");
  eq(p.tax.taxableIncome, 2_163_624, "24L taxable");
  eq(p.tax.taxBeforeRebate, 240_906, "24L slab tax");
  eq(p.tax.rebate, 0, "24L no rebate above ₹12L taxable");
  near(p.tax.cess, 9_636.24, 0.01, "24L cess");
  eq(p.tax.totalTax, 250_540, "24L total tax");
  eq(p.tdsMonthly, 20_878, "24L monthly TDS");
  eq(p.inHandAnnual, 1_870_484, "24L annual in-hand");
  eq(p.inHandMonthly, 155_874, "24L monthly in-hand");
  eq(p.inHandFebruary, 155_774, "24L February in-hand (PT ₹300)");
  near(p.effectiveTaxRatePct, 10.44, 0.01, "24L effective tax rate %");
  console.log(
    `CTC ₹24L  → tax ${inr(p.tax.totalTax)} · TDS ${inr(p.tdsMonthly)}/mo · in-hand ${inr(p.inHandMonthly)}/mo · effective ${p.effectiveTaxRatePct.toFixed(2)}%`,
  );
}

// ——— CTC ₹8,00,000 — below the rebate line, tax ₹0 ———
// Basic 3,20,000 · HRA 1,60,000 · EPF 38,400 · gratuity 15,392 ·
// special 2,66,208. Taxable 6,71,208 → slab tax 13,560.40, rebated.
{
  const p = computePayroll(800_000);
  eq(p.special, 266_208, "8L special");
  eq(p.tax.totalTax, 0, "8L total tax");
  eq(p.inHandAnnual, 705_408, "8L annual in-hand");
  eq(p.inHandMonthly, 58_784, "8L monthly in-hand");
  console.log(`CTC ₹8L   → tax ₹0 · in-hand ${inr(p.inHandMonthly)}/mo`);
}

// ——— CTC ₹50,00,000 — into the 30% slab ———
// Basic 20,00,000 · HRA 10,00,000 · EPF 2,40,000 · gratuity 96,200 ·
// special 16,63,800. Taxable 45,88,800. Slab tax 3,00,000 (to 24L) +
// 30% × 21,88,800 (6,56,640) = 9,56,640; cess 38,265.60 → total
// 9,94,905.60 → ₹9,94,910. In-hand 34,26,490 → ₹2,85,541/mo.
{
  const p = computePayroll(5_000_000);
  eq(p.special, 1_663_800, "50L special");
  eq(p.tax.taxableIncome, 4_588_800, "50L taxable");
  eq(p.tax.taxBeforeRebate, 956_640, "50L slab tax");
  eq(p.tax.totalTax, 994_910, "50L total tax");
  eq(p.inHandAnnual, 3_426_490, "50L annual in-hand");
  eq(p.inHandMonthly, 285_541, "50L monthly in-hand");
  console.log(`CTC ₹50L  → tax ${inr(p.tax.totalTax)} · in-hand ${inr(p.inHandMonthly)}/mo`);
}

// ——— Marginal relief — CTC ₹14,00,000 ———
// Taxable 12,30,864: slab tax 64,629.60, but marginal relief caps
// the tax at the excess over ₹12L = 30,864; cess → ₹32,100 total.
{
  const p = computePayroll(1_400_000);
  eq(p.tax.taxableIncome, 1_230_864, "14L taxable");
  near(p.tax.taxBeforeRebate, 64_629.6, 0.01, "14L slab tax");
  eq(p.tax.taxAfterRebate, 30_864, "14L tax capped at the excess (marginal relief)");
  eq(p.tax.totalTax, 32_100, "14L total tax with cess");
  console.log(`CTC ₹14L  → marginal relief caps tax at ${inr(p.tax.totalTax)}`);
}

// ——— The ladder: in-hand strictly rises, nothing goes negative,
//     and the components sum to the CTC exactly at every step ———
{
  const ladder = [600_000, 800_000, 1_000_000, 1_200_000, 1_250_000, 1_400_000, 1_500_000, 1_800_000, 2_400_000, 3_000_000, 4_000_000, 5_000_000, 7_500_000, 10_000_000];
  let prev = -1;
  for (const ctc of ladder) {
    const p = computePayroll(ctc);
    eq(p.basic + p.hra + p.special + p.employerPf + p.gratuity, ctc, `ladder ${ctc} sums to CTC`);
    assert.ok(p.special >= 0 && p.inHandAnnual > 0, `ladder ${ctc} no negatives`);
    assert.ok(p.inHandMonthly > prev, `ladder ${ctc} in-hand rises (${p.inHandMonthly} > ${prev})`);
    prev = p.inHandMonthly;
    passed += 2;
  }
  // A fine sweep for the exact-sum invariant the annexure promises.
  for (let ctc = 500_000; ctc <= 12_000_000; ctc += 50_000) {
    const p = computePayroll(ctc);
    eq(p.basic + p.hra + p.special + p.employerPf + p.gratuity, ctc, `sweep ${ctc} sums to CTC`);
  }
  console.log(`Ladder + sweep: in-hand monotonic, components sum exactly at ${ladder.length} + 231 CTCs`);
}

// ——— Joining-derived dates ———
{
  const p = computePayroll(2_400_000);
  const j = joiningFacts(iso(2027, 1, 11), p);
  eq(j.probationEnd.y * 10000 + j.probationEnd.m * 100 + j.probationEnd.d, 20270711, "probation ends 11 Jul 2027");
  eq(j.firstSalaryDate.d, 31, "first salary on 31 Jan 2027");
  eq(j.firstMonthDaysWorked, 21, "21 of 31 days in the joining month");
  eq(j.firstMonthDaysTotal, 31, "January has 31 days");
  console.log(`Joining 11 Jan 2027 → probation ends 11 Jul 2027 · first salary 31 Jan 2027 (21/31 days)`);
}

console.log(`\nAll ${passed} assertions passed.`);
