import React from "react";
import {
  Column,
  Document,
  Heading,
  LineBreak,
  PageBreak,
  PageFooter,
  PageHeader,
  PageNumber,
  Rect,
  Row,
  Span,
  Svg,
  Text,
} from "@hyper-elements/react";
import { fontFaces, fonts, kick, palette as p, paperTheme } from "./theme";
import { ArcMark, DateChip, InkBand, MiniBadge, MoneyRow, dateBadge } from "./components";
import { candidate, company, figuresFor, hr, offer } from "./data";
import { dateLabel, inr } from "./engine";

// —————————————————————————————————————————————————————————————————————
// The Offer — Document (A4, exactly 2 pages): the offer letter and
// its annexure. The badge's companion paper: carbon-black print on
// ivory, the lime spent only as a signal — the two-tone rule, the
// take-home panel's edge — and the badge itself, pocket-sized, at
// the head of page 1. Page 2 is Annexure A: the full structure's
// assumptions, printed, so the arithmetic can be checked.
// —————————————————————————————————————————————————————————————————————

export default function OfferLetter({
  ctc,
  faces,
}: {
  ctc?: number;
  faces?: typeof fontFaces;
}) {
  const fig = figuresFor(ctc ?? offer.ctcAnnual);
  const { payroll, joining } = fig;
  return (
    <Document
      theme={paperTheme}
      size="A4"
      margin={52}
      title={`The Offer — Offer of employment, ${candidate.name} — ${offer.ref}`}
      fonts={faces ?? fontFaces}
      style={{ backgroundColor: p.paper, gap: 0 }}
    >
      <PageHeader style={{ padding: [8, 0, 0] }}>
        <Row style={{ gap: 12, alignItems: "center" }}>
          <ArcMark w={40} h={30} main={p.carbon} inner={p.lime} />
          <Text style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif", fontWeight: 700, fontSize: 11.5, letterSpacing: 2.4, color: p.ink, flex: 1 }}>
            {company.name.toUpperCase()}
          </Text>
          <Text style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif", fontWeight: 600, fontSize: 8.4, letterSpacing: 1.6, textTransform: "uppercase", color: p.soft }}>
            Offer · {offer.ref}
          </Text>
        </Row>
        <Column style={{ padding: [13, 0, 0] }}>
          <InkBand w={491} />
        </Column>
      </PageHeader>

      <PageFooter style={{ padding: [8, 0, 0], border: { top: { width: 1, style: "solid", color: p.hairline } } }}>
        <Row style={{ gap: 12 }}>
          <Text style={{ fontSize: 8.2, color: p.soft, flex: 1 }}>
            {company.legalName} · Bengaluru · Fictional sample, real arithmetic.
          </Text>
          <Text style={{ fontSize: 8.6, fontWeight: 700, color: p.ink }}>
            Page <PageNumber /> of <PageNumber total />
          </Text>
        </Row>
      </PageFooter>

      <Column style={{ gap: 18 }}>
        <Row style={{ gap: 20 }}>
          <Column style={{ flex: 1, gap: 9 }}>
            <Text style={kick(9.5, p.ink)}>
              Offer of employment — {dateLabel(offer.offerDate)}
            </Text>
            <Heading level={1} style={{ fontSize: 27, color: p.ink }}>
              Welcome aboard, {candidate.firstName}.
            </Heading>
            <Text style={{ fontSize: 10.6, fontWeight: 500, color: p.soft, lineHeight: 1.5 }}>
              {candidate.role}, {candidate.team} team — starting {dateLabel(offer.joiningDate)},
              from our Indiranagar studio in {company.city}. Your badge is already printed;
              it is waiting with this letter.
            </Text>
          </Column>
          <MiniBadge joiningLabel={`JOINS ${dateBadge(joining.joining).slice(4).toUpperCase()}`} />
        </Row>

        <Text style={{ fontSize: 10.7, lineHeight: 1.66, color: p.ink }}>
          Dear {candidate.firstName} — after your conversations with {candidate.manager} and the{" "}
          {candidate.team} team, we are delighted to offer you this role. You will report to{" "}
          {candidate.manager} ({candidate.managerTitle.toLowerCase()}); the rhythm is hybrid, three
          days a week in the studio. Everything about the offer is on this page, and every figure
          in it is computed from the salary structure — the assumptions are printed on page two.
        </Text>

        <Row style={{ gap: 16 }}>
          <DateChip label="Joining" value={dateBadge(joining.joining)} sub="Your first day" />
          <DateChip label="Probation ends" value={dateLabel(joining.probationEnd)} sub="Confirmation the next day" />
          <DateChip label="First salary" value={dateLabel(joining.firstSalaryDate)} sub={`Pro-rated · ${joining.firstMonthDaysWorked} of ${joining.firstMonthDaysTotal} days`} />
        </Row>

        <Column style={{ backgroundColor: p.panel, border: { width: 1, style: "solid", color: p.hairline }, borderRadius: 16, padding: [22, 24, 18], gap: 4 }}>
          <Row style={{ gap: 12, alignItems: "center", padding: [0, 0, 10] }}>
            <Text style={{ fontWeight: 700, fontSize: 16.5, color: p.ink, flex: 1 }}>The money, in full</Text>
            <Text style={kick(8.6, p.soft)}>
              Per year · new-regime tax
            </Text>
          </Row>
          {payroll.rows
            .filter((r) => r.kind !== "deduction")
            .map((r) => (
              <MoneyRow key={r.key} label={r.label} note={r.note} value={inr(r.annual)} />
            ))}
          <MoneyRow label="Cost to company" value={inr(payroll.ctc)} strong />
          {payroll.rows
            .filter((r) => r.kind === "deduction")
            .map((r) => (
              <MoneyRow key={r.key} label={`Less: ${r.label.toLowerCase()}`} note={r.note} value={`− ${inr(-r.annual)}`} />
            ))}
          <Column style={{ backgroundColor: p.carbon, borderRadius: 12, padding: [0, 0, 16], gap: 0 }}>
            <Svg width={443} height={4} viewBox="0 0 443 4">
              <Rect x={0} y={0} width={443} height={4} style={{ fill: p.lime }} />
            </Svg>
            <Row style={{ gap: 12, alignItems: "center", padding: [15, 18, 0] }}>
              <Column style={{ flex: 1, gap: 3 }}>
                <Text style={{ fontWeight: 700, fontSize: 15.5, color: p.offWhite }}>
                  Take-home {inr(payroll.inHandMonthly)} <Span style={{ fontSize: 11, fontWeight: 600 }}>/ month</Span>
                </Text>
                <Text style={{ fontSize: 9.2, fontWeight: 500, color: "rgba(242,243,239,0.72)" }}>
                  {inr(payroll.inHandAnnual)} a year · February is ₹100 lower — professional tax is ₹300 that month
                </Text>
              </Column>
              <Text style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase", color: p.lime, textAlign: "right" }}>
                Tax {payroll.effectiveTaxRatePct.toFixed(1)}%<LineBreak />of CTC
              </Text>
            </Row>
          </Column>
        </Column>

        <Row style={{ gap: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 10.4, lineHeight: 1.6, color: p.ink, flex: 1 }}>
            To accept, sign and return one copy by <Span style={{ fontWeight: 700 }}>{dateLabel(offer.acceptBy)}</Span>.
            Your onboarding page — documents, first week, your buddy — opens the day you accept.
          </Text>
          <Column style={{ gap: 3, alignItems: "end" }}>
            <Text style={{ fontWeight: 700, fontSize: 14.5, color: p.ink }}>{hr.name}</Text>
            <Text style={{ fontSize: 9.2, fontWeight: 500, color: p.soft }}>
              {hr.title} · {hr.email}
            </Text>
          </Column>
        </Row>
      </Column>

      <PageBreak />

      <Column style={{ gap: 14 }}>
        <Text style={kick(9.5, p.ink)}>
          Annexure A · The assumptions
        </Text>
        <Heading level={2} style={{ fontSize: 20, color: p.ink }}>
          How every figure was worked out
        </Heading>
        {/* Numbered rows, not a List: the print renderer's List items
            overflow the right edge instead of wrapping (Phase-2 QA).
            Body width = content 491 − number 26 − gap 12. */}
        <Column style={{ gap: 13 }}>
          {[
            "Structure: basic 40% of CTC; HRA 50% of basic; employer PF (12% of basic) and the gratuity accrual (4.81% of basic) sit inside the CTC; special allowance is the balancing figure, so the components sum to the CTC exactly.",
            "Tax: new regime, FY 2026-27 — taxable salary is basic + HRA + special less the ₹75,000 standard deduction; slabs nil to 30%; Section 87A rebate up to ₹60,000 at or below ₹12,00,000 taxable (marginal relief just above); 4% cess; total rounded to the nearest ₹10. No HRA exemption or Chapter VI-A deductions.",
            "Professional tax: Karnataka, ₹200 a month and ₹300 in February. Monthly figures are the annual figure ÷ 12, rounded; the first salary is pro-rated for the days worked in the joining month.",
            "Move the CTC and this letter, its annexure, the offer email, the onboarding page and the joining badge all regenerate from the same engine — that is the kit.",
          ].map((text, i) => (
            <Row key={i} style={{ gap: 12 }}>
              <Text style={{ fontFamily: fonts.mono, fontWeight: 600, fontSize: 10.2, color: p.ink, flex: "none", width: 26 }}>
                {i + 1}.
              </Text>
              <Text style={{ fontSize: 10.2, lineHeight: 1.68, color: p.ink, width: 452 }}>{text}</Text>
            </Row>
          ))}
        </Column>
        <Column style={{ backgroundColor: p.carbon, borderRadius: 12, padding: [0, 0, 18], gap: 0 }}>
          <Svg width={491} height={4} viewBox="0 0 491 4">
            <Rect x={0} y={0} width={491} height={4} style={{ fill: p.lime }} />
          </Svg>
          <Text style={{ fontSize: 9.6, fontWeight: 500, color: "rgba(242,243,239,0.85)", lineHeight: 1.6, padding: [15, 18, 0] }}>
            One candidate file, figured end to end — the letter above, its annexure, the offer
            email, the onboarding page and the badge she will wear on day one are all drawn
            from it.
          </Text>
        </Column>
      </Column>
    </Document>
  );
}
