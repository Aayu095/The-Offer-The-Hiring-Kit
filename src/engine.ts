// —————————————————————————————————————————————————————————————————————
// The Offer — payroll engine (new tax regime, FY 2026-27)
//
// A pure function of the annual CTC: give it a number and it returns
// the full salary structure, the tax, the take-home, and the dates
// that follow from a joining date. The live demo's CTC slider calls
// exactly this — move the salary and every template in the kit
// (offer letter, annexure, email, onboarding page, joining card)
// regenerates from the same figures.
//
// ASSUMPTIONS — every one of these is also printed on the annexure,
// so a reader can check the arithmetic against their own offer:
//  1. Structure: Basic = 40% of CTC; HRA = 50% of Basic; employer PF
//     = 12% of Basic and sits INSIDE the CTC; gratuity = 4.81% of
//     Basic (the Payment of Gratuity Act accrual, 15/26 of a month
//     per year) and also sits inside the CTC; special allowance is
//     the balancing figure, so the components sum to the CTC exactly.
//  2. Employee PF = 12% of Basic, deducted from the cash gross.
//     (No wage-ceiling cap is applied — the uncapped 12% is the
//     structure this fictional company offers at every level.)
//  3. Professional tax, Karnataka: ₹200 a month, ₹300 in February —
//     ₹2,400 a year. That is the top slab; it applies because the
//     monthly gross clears the ₹25,000 threshold at every CTC this
//     kit models.
//  4. Income tax, NEW REGIME, FY 2026-27: standard deduction
//     ₹75,000. Taxable salary = Basic + HRA + Special − ₹75,000.
//     The employer PF (statutory 12%) and the gratuity accrual are
//     not current income, so they never enter the taxable salary.
//     The new regime allows no HRA exemption and no Chapter VI-A
//     deductions, and none are taken.
//  5. Slabs: 0–4L nil · 4–8L 5% · 8–12L 10% · 12–16L 15% ·
//     16–20L 20% · 20–24L 25% · above 24L 30%.
//  6. Section 87A rebate: up to ₹60,000 when the taxable income is
//     ₹12,00,000 or less; just above ₹12L, marginal relief caps the
//     tax at the excess over ₹12,00,000.
//  7. Health & education cess: 4% on the tax after rebate. The
//     total tax is rounded to the nearest ₹10 (Section 288B).
//     Surcharge (taxable income above ₹50L) is not modelled.
//  8. Monthly figures are the annual figure ÷ 12, rounded to the
//     nearest rupee; TDS is spread evenly across the year. February
//     take-home is ₹100 lower (professional tax is ₹300 that month).
// —————————————————————————————————————————————————————————————————————

export interface TaxComputation {
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate: number;
  taxAfterRebate: number;
  cess: number;
  totalTax: number;
}

export interface StructureRow {
  key: string;
  label: string;
  annual: number;
  monthly: number;
  /** earning = paid in cash · ctcOnly = inside CTC, not monthly cash · deduction = taken out of cash */
  kind: "earning" | "ctcOnly" | "deduction";
  note: string;
}

export interface Payroll {
  ctc: number;
  basic: number;
  hra: number;
  special: number;
  employerPf: number;
  gratuity: number;
  /** Basic + HRA + Special — the cash the salary is actually paid from. */
  grossCashAnnual: number;
  employeePf: number;
  professionalTaxAnnual: number;
  tax: TaxComputation;
  tdsMonthly: number;
  inHandAnnual: number;
  inHandMonthly: number;
  /** February take-home: professional tax is ₹300 that month, not ₹200. */
  inHandFebruary: number;
  /** Total tax as a percentage of the CTC. */
  effectiveTaxRatePct: number;
  rows: StructureRow[];
}

const round = (n: number) => Math.round(n);
const round10 = (n: number) => Math.round(n / 10) * 10;

export const STANDARD_DEDUCTION = 75_000;
export const PROFESSIONAL_TAX_ANNUAL = 2_400;
export const REBATE_LIMIT = 1_200_000;
export const REBATE_MAX = 60_000;

// New-regime slabs FY 2026-27: [upper bound of the band, rate].
const SLABS: Array<[number, number]> = [
  [400_000, 0],
  [800_000, 0.05],
  [1_200_000, 0.1],
  [1_600_000, 0.15],
  [2_000_000, 0.2],
  [2_400_000, 0.25],
  [Number.POSITIVE_INFINITY, 0.3],
];

export function computeTax(taxableIncome: number): TaxComputation {
  const taxable = Math.max(0, taxableIncome);
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of SLABS) {
    if (taxable <= lower) break;
    tax += (Math.min(taxable, upper) - lower) * rate;
    lower = upper;
  }
  let rebate = 0;
  let taxAfter = tax;
  if (taxable <= REBATE_LIMIT) {
    rebate = Math.min(tax, REBATE_MAX);
    taxAfter = tax - rebate;
  } else {
    // Marginal relief: just above ₹12L the tax cannot exceed the
    // amount by which the income crosses ₹12L.
    taxAfter = Math.min(tax, taxable - REBATE_LIMIT);
    rebate = tax - taxAfter;
  }
  const cess = taxAfter * 0.04;
  return {
    taxableIncome: taxable,
    taxBeforeRebate: tax,
    rebate,
    taxAfterRebate: taxAfter,
    cess,
    totalTax: round10(taxAfter + cess),
  };
}

export function computePayroll(ctcAnnual: number): Payroll {
  const ctc = round(ctcAnnual);
  const basic = round(0.4 * ctc);
  const hra = round(0.5 * basic);
  const employerPf = round(0.12 * basic);
  const gratuity = round(0.0481 * basic);
  // The balancing figure — this is what makes the components sum
  // to the CTC exactly, at any salary the slider can land on.
  const special = ctc - basic - hra - employerPf - gratuity;

  const grossCashAnnual = basic + hra + special;
  const employeePf = round(0.12 * basic);
  const professionalTaxAnnual = PROFESSIONAL_TAX_ANNUAL;
  const tax = computeTax(grossCashAnnual - STANDARD_DEDUCTION);

  const inHandAnnual = grossCashAnnual - employeePf - professionalTaxAnnual - tax.totalTax;
  const inHandMonthly = round(inHandAnnual / 12);
  const per = (annual: number) => round(annual / 12);

  const rows: StructureRow[] = [
    { key: "basic", label: "Basic salary", annual: basic, monthly: per(basic), kind: "earning", note: "40% of CTC" },
    { key: "hra", label: "House rent allowance", annual: hra, monthly: per(hra), kind: "earning", note: "50% of basic" },
    { key: "special", label: "Special allowance", annual: special, monthly: per(special), kind: "earning", note: "Balancing figure" },
    { key: "employerPf", label: "Employer PF contribution", annual: employerPf, monthly: per(employerPf), kind: "ctcOnly", note: "12% of basic · inside CTC" },
    { key: "gratuity", label: "Gratuity accrual", annual: gratuity, monthly: per(gratuity), kind: "ctcOnly", note: "4.81% of basic · inside CTC" },
    { key: "employeePf", label: "Employee PF", annual: -employeePf, monthly: -per(employeePf), kind: "deduction", note: "12% of basic" },
    { key: "tds", label: "Income tax (TDS)", annual: -tax.totalTax, monthly: -per(tax.totalTax), kind: "deduction", note: "New regime, FY 2026-27" },
    { key: "pt", label: "Professional tax — Karnataka", annual: -professionalTaxAnnual, monthly: -200, kind: "deduction", note: "₹200/mo · ₹300 in Feb" },
  ];

  return {
    ctc,
    basic,
    hra,
    special,
    employerPf,
    gratuity,
    grossCashAnnual,
    employeePf,
    professionalTaxAnnual,
    tax,
    tdsMonthly: per(tax.totalTax),
    inHandAnnual,
    inHandMonthly,
    inHandFebruary: inHandMonthly - 100,
    effectiveTaxRatePct: (tax.totalTax / ctc) * 100,
    rows,
  };
}

// ——— Dates that follow from a joining date ———

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface IsoDate {
  y: number;
  m: number; // 1–12
  d: number;
}

export const iso = (y: number, m: number, d: number): IsoDate => ({ y, m, d });

export function addMonths(date: IsoDate, months: number): IsoDate {
  const total = date.y * 12 + (date.m - 1) + months;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { y, m, d: Math.min(date.d, lastDay) };
}

export function addDays(date: IsoDate, days: number): IsoDate {
  const t = new Date(Date.UTC(date.y, date.m - 1, date.d + days));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

export function endOfMonth(date: IsoDate): IsoDate {
  return { y: date.y, m: date.m, d: new Date(Date.UTC(date.y, date.m, 0)).getUTCDate() };
}

export function dateLabel(date: IsoDate): string {
  return `${date.d} ${MONTHS[date.m - 1]} ${date.y}`;
}

export function dateLabelLong(date: IsoDate): string {
  const wd = WEEKDAYS[new Date(Date.UTC(date.y, date.m - 1, date.d)).getUTCDay()];
  return `${wd}, ${dateLabel(date)}`;
}

export interface JoiningFacts {
  joining: IsoDate;
  probationEnd: IsoDate;
  confirmation: IsoDate;
  firstSalaryDate: IsoDate;
  /** Days actually worked in the joining month, and the month's length. */
  firstMonthDaysWorked: number;
  firstMonthDaysTotal: number;
  /** Pro-rated gross cash for the joining month. */
  firstMonthGrossCash: number;
}

export function joiningFacts(joining: IsoDate, payroll: Payroll): JoiningFacts {
  const eom = endOfMonth(joining);
  const worked = eom.d - joining.d + 1;
  return {
    joining,
    probationEnd: addMonths(joining, 6),
    confirmation: addDays(addMonths(joining, 6), 1),
    firstSalaryDate: eom,
    firstMonthDaysWorked: worked,
    firstMonthDaysTotal: eom.d,
    firstMonthGrossCash: round((payroll.grossCashAnnual / 12) * (worked / eom.d)),
  };
}

// ——— Formatting (en-IN digit grouping, ₹-first) ———

const inrFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function inr(n: number): string {
  return `₹${inrFmt.format(Math.round(n))}`;
}

/** ₹24,00,000 → "₹24 lakh" · ₹1,87,04,840 → "₹1.87 crore" · below a lakh, the full figure. */
export function inrShort(n: number): string {
  if (n >= 10_000_000) return `₹${trimNum(n / 10_000_000)} crore`;
  if (n >= 100_000) return `₹${trimNum(n / 100_000)} lakh`;
  return inr(n);
}

function trimNum(n: number): string {
  const s = n.toFixed(2);
  return s.endsWith(".00") ? s.slice(0, -3) : s.endsWith("0") ? s.slice(0, -1) : s;
}

export function pct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}
