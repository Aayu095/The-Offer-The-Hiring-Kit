import { computePayroll, iso, joiningFacts } from "./engine";

// —————————————————————————————————————————————————————————————————————
// The Offer — one candidate file. Every template in the kit reads
// from here and from the payroll engine: change the CTC (the live
// demo has a slider for exactly that) and the offer letter, the
// annexure, the email, the onboarding page and the joining card all
// recompute. All people, the company and the figures' owner are
// fictional; the payroll arithmetic is real.
// —————————————————————————————————————————————————————————————————————

export const product = {
  name: "The Offer",
  kit: "The Hiring Kit",
  tagline: "One candidate file — the whole first day, written.",
};

export const company = {
  name: "Arcline Labs",
  legalName: "Arcline Labs Private Limited",
  line: "Workflow software for architecture & construction teams",
  addressLine: "4th Floor, 100 Feet Road, Indiranagar, Bengaluru 560038",
  city: "Bengaluru",
};

export const candidate = {
  name: "Aditi Nair",
  firstName: "Aditi",
  role: "Senior Software Engineer",
  team: "Platform",
  level: "L5",
  manager: "Vikram Shetty",
  managerTitle: "Engineering Manager, Platform",
  workMode: "Hybrid — Indiranagar studio, Bengaluru",
  addressLine: "HSR Layout, Bengaluru",
};

export const hr = {
  name: "Priya Raghavan",
  title: "Head of People & Culture",
  email: "people@arclinelabs.in",
  phone: "+91 98450 00000", // fictional — documentation-style number
};

export const offer = {
  ref: "ARC/HR/2026/118",
  ctcAnnual: 2_400_000,
  offerDate: iso(2026, 11, 24),
  acceptBy: iso(2026, 12, 1),
  joiningDate: iso(2027, 1, 11),
  probationMonths: 6,
  noticePeriod: "60 days",
};

/** The people around the new joiner (the manager is on the
 *  candidate record; the buddy is assigned by the team). */
export const buddy = {
  name: "Rohan Iyer",
  role: "Senior Software Engineer, Platform",
  note: "Your buddy for the first month — coffee, questions, where the good filter coffee lives.",
};

/** Where the kit's buttons point (the live demo; set at deploy). */
export const demoUrl = "https://the-offer-the-hiring-kit.vercel.app/";

// The one call every template makes.
export const payroll = computePayroll(offer.ctcAnnual);
export const joining = joiningFacts(offer.joiningDate, payroll);

/** Everything a template needs at a given CTC — the demo's slider
 *  calls this per value; the printed kit calls it once. */
export interface KitFigures {
  ctcAnnual: number;
  payroll: ReturnType<typeof computePayroll>;
  joining: ReturnType<typeof joiningFacts>;
}

export function figuresFor(ctcAnnual: number): KitFigures {
  const p = computePayroll(ctcAnnual);
  return { ctcAnnual: p.ctc, payroll: p, joining: joiningFacts(offer.joiningDate, p) };
}

export const defaultFigures = figuresFor(offer.ctcAnnual);
