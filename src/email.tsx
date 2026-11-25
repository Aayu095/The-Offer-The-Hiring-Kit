import React from "react";
import {
  Button,
  Column,
  Email,
  Grid,
  Heading,
  Row,
  Section,
  Span,
  Text,
} from "@hyper-elements/react";
import { emailTheme, fonts, palette as p } from "./theme";
import { dateBadge } from "./components";
import { candidate, company, demoUrl, figuresFor, hr, offer } from "./data";
import { dateLabel, inr, inrShort } from "./engine";

// —————————————————————————————————————————————————————————————————————
// The Offer — Email (600px): the offer, in the inbox. Email-safe
// tables only — no Svg in email, so the badge becomes its colours:
// a carbon masthead with a lime strip, the take-home as the hero
// figure on carbon, the money as ruled rows, and the access strip
// echoed as a carbon band near the foot. Every figure computed.
// —————————————————————————————————————————————————————————————————————

const metaText = {
  fontFamily: fonts.mono,
  fontSize: 9.5,
  letterSpacing: 1.6,
  textTransform: "uppercase" as const,
  fontWeight: 600,
};

/** A thin strip section (email-safe rule). */
function Strip({ color, height = 4 }: { color: string; height?: number }) {
  return (
    <Section style={{ backgroundColor: color, padding: [0, 40] }}>
      <Text style={{ fontSize: height, lineHeight: 1, color }}>·</Text>
    </Section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <Column style={{ gap: 3 }}>
      <Text style={{ ...metaText, color: p.soft }}>{label}</Text>
      <Text style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 14.5, color: p.ink, lineHeight: 1.2 }}>
        {value}
      </Text>
    </Column>
  );
}

function MoneyLine({
  label,
  note,
  value,
  first = false,
  strong = false,
}: {
  label: string;
  note?: string;
  value: string;
  first?: boolean;
  strong?: boolean;
}) {
  return (
    <Grid
      columns={2}
      style={{
        gap: 12,
        padding: [7, 0],
        border: first ? undefined : { top: { width: 1, style: "solid", color: p.hairline } },
      }}
    >
      <Text style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: strong ? 700 : 500, color: p.ink }}>
        {label}
        {note ? <Span style={{ color: p.soft, fontSize: 11.5 }}> · {note}</Span> : null}
      </Text>
      <Text style={{ fontFamily: fonts.mono, fontSize: 12, fontWeight: 600, color: p.ink, textAlign: "right" }}>
        {value}
      </Text>
    </Grid>
  );
}

export default function OfferEmail({ ctc }: { ctc?: number }) {
  const fig = figuresFor(ctc ?? offer.ctcAnnual);
  const { payroll, joining } = fig;
  return (
    <Email
      theme={emailTheme}
      width={600}
      title={`The Offer — ${candidate.name}, your offer from ${company.name}`}
      previewText={`Your offer from ${company.name}: ${candidate.role}, ${candidate.team} team — take-home ${inr(payroll.inHandMonthly)} a month on a CTC of ${inrShort(payroll.ctc)}. Joining ${dateLabel(joining.joining)}.`}
      style={{ backgroundColor: p.paper, gap: 0 }}
    >
      {/* Masthead — the badge's colours, email-safe */}
      <Section style={{ backgroundColor: p.carbon, padding: [24, 40, 20] }}>
        <Grid columns={2} style={{ gap: 12, alignItems: "center" }}>
          <Row style={{ gap: 10, alignItems: "center" }}>
            <Column style={{ width: 13, height: 10, backgroundColor: p.lime, flex: "none" }} />
            <Text style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 19, letterSpacing: 3, color: p.offWhite, lineHeight: 1 }}>
              {company.name.toUpperCase()}
            </Text>
          </Row>
          <Text style={{ ...metaText, color: p.lime, textAlign: "right" }}>
            Offer · {offer.ref}
          </Text>
        </Grid>
      </Section>
      <Strip color={p.lime} height={4} />

      {/* Meta strip */}
      <Section style={{ backgroundColor: p.paper, padding: [14, 40, 2] }}>
        <Grid columns={2} style={{ gap: 10 }}>
          <Text style={{ ...metaText, color: p.soft }}>Offer of employment — {dateLabel(offer.offerDate)}</Text>
          <Text style={{ ...metaText, color: p.soft, textAlign: "right" }}>
            Status — <Span style={{ color: p.ink }}>Awaiting your signature</Span>
          </Text>
        </Grid>
      </Section>

      {/* Headline + intro */}
      <Section style={{ backgroundColor: p.paper, padding: [20, 40, 4] }}>
        <Column style={{ gap: 12 }}>
          <Heading level={1} style={{ fontSize: 34, lineHeight: 1.1, color: p.ink }}>
            Your offer, {candidate.firstName}.
          </Heading>
          <Text style={{ fontFamily: fonts.body, fontSize: 14.5, lineHeight: 1.55, color: p.ink }}>
            We are delighted to offer you the role of <Span style={{ fontWeight: 600 }}>{candidate.role}</Span> on
            the {candidate.team} team at {company.name}, reporting to {candidate.manager}. Your first day
            is <Span style={{ fontWeight: 600 }}>{dateLabel(joining.joining)}</Span>, from our Indiranagar studio
            in {company.city} — hybrid, three days a week in the studio. The letter and its annexure
            travel with this email; the figures below are the same ones, computed from the salary
            structure — not rounded for the brochure.
          </Text>
        </Column>
      </Section>

      {/* Take-home hero — carbon panel, lime signal */}
      <Section style={{ backgroundColor: p.paper, padding: [18, 40, 4] }}>
        <Column style={{ backgroundColor: p.carbon, padding: [20, 24, 22] }}>
          <Column style={{ gap: 4 }}>
            <Text style={{ ...metaText, color: p.lime }}>Take-home · every month, after tax</Text>
            <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 40, lineHeight: 1.05, color: p.offWhite }}>
              {inr(payroll.inHandMonthly)} <Span style={{ fontSize: 17, fontWeight: 600, color: p.softDark }}>/ month</Span>
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 12.5, lineHeight: 1.5, color: p.softDark }}>
              On a cost to company of {inr(payroll.ctc)} a year · income tax {inr(payroll.tax.totalTax)} (
              {payroll.effectiveTaxRatePct.toFixed(1)}% of CTC, new regime) · February is ₹100 lower —
              professional tax is ₹300 that month.
            </Text>
          </Column>
        </Column>
      </Section>

      {/* Facts */}
      <Section style={{ backgroundColor: p.paper, padding: [22, 40, 2] }}>
        <Grid columns={2} style={{ gap: 16, rowGap: 15 }}>
          <Fact label="Role" value={`${candidate.role}`} />
          <Fact label="Team · level" value={`${candidate.team} · ${candidate.level}`} />
          <Fact label="Joining" value={dateBadge(joining.joining)} />
          <Fact label="Probation ends" value={dateLabel(joining.probationEnd)} />
          <Fact label="First salary" value={`${dateLabel(joining.firstSalaryDate)} · pro-rated`} />
          <Fact label="Accept by" value={dateLabel(offer.acceptBy)} />
        </Grid>
      </Section>

      {/* The money, in short */}
      <Section style={{ backgroundColor: p.paper, padding: [20, 40, 2] }}>
        <Column style={{ gap: 4 }}>
          <Text style={{ ...metaText, fontSize: 10.5, letterSpacing: 2, color: p.soft }}>The money, in short — per year</Text>
          <Column>
            {payroll.rows
              .filter((r) => r.kind !== "deduction")
              .map((r, i) => (
                <MoneyLine key={r.key} label={r.label} note={r.note} value={inr(r.annual)} first={i === 0} />
              ))}
            <MoneyLine label="Cost to company" value={inr(payroll.ctc)} strong />
            {payroll.rows
              .filter((r) => r.kind === "deduction")
              .map((r) => (
                <MoneyLine key={r.key} label={`Less: ${r.label.toLowerCase()}`} note={r.note} value={`− ${inr(-r.annual)}`} />
              ))}
            <MoneyLine label="Take-home, per month" value={inr(payroll.inHandMonthly)} strong />
          </Column>
          <Text style={{ fontFamily: fonts.body, fontSize: 12.5, lineHeight: 1.5, color: p.soft }}>
            The annexure to your letter prints every assumption behind these figures — structure,
            slabs, rebate, professional tax — so you can check the arithmetic yourself.
          </Text>
        </Column>
      </Section>

      {/* Access strip echo */}
      <Section style={{ backgroundColor: p.paper, padding: [18, 40, 4] }}>
        <Column style={{ backgroundColor: p.carbon, padding: [16, 24, 18] }}>
          <Grid columns={2} style={{ gap: 12, alignItems: "center" }}>
            <Text style={{ fontFamily: fonts.mono, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, color: p.offWhite }}>
              BADGE AL·0118
            </Text>
            <Text style={{ ...metaText, color: p.lime, textAlign: "right" }}>Access granted ✓</Text>
          </Grid>
          <Text style={{ fontFamily: fonts.body, fontSize: 12.5, lineHeight: 1.5, color: p.softDark, padding: [6, 0, 0] }}>
            Your badge is already printed. Collect it at reception on your first morning — it opens
            the studio, the fourth floor and the pantry.
          </Text>
        </Column>
      </Section>

      {/* Buttons */}
      <Section style={{ backgroundColor: p.paper, padding: [24, 40, 4] }}>
        <Column style={{ gap: 14 }}>
          <Row style={{ gap: 12, justifyContent: "center" }}>
            <Button href={demoUrl}>Read the full offer</Button>
            <Button
              href={demoUrl}
              style={{
                backgroundColor: p.paper,
                color: p.ink,
                border: { width: 1.5, style: "solid", color: p.carbon },
              }}
            >
              See your first week
            </Button>
          </Row>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.5, color: p.ink, textAlign: "center" }}>
            Or reply to this email — {hr.name}, {hr.email}.
          </Text>
        </Column>
      </Section>

      {/* Sign-off + footer */}
      <Section style={{ backgroundColor: p.paper, padding: [10, 40, 2] }}>
        <Column style={{ gap: 2 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: 13.5, color: p.ink }}>With excitement,</Text>
          <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 15.5, color: p.ink }}>{hr.name}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: p.soft }}>
            {hr.title}, {company.name} · {hr.email}
          </Text>
        </Column>
      </Section>
      <Strip color={p.carbon} height={2.5} />
      <Section style={{ backgroundColor: p.paper, padding: [16, 40, 32] }}>
        <Column style={{ gap: 7, alignItems: "center" }}>
          <Text style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 600, color: p.ink, textAlign: "center" }}>
            {offer.ref} · {company.name} · {company.city}
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, lineHeight: 1.5, color: p.soft, textAlign: "center" }}>
            The Offer — one candidate file, the whole first day written. This is a sample
            template — the people, the company and the offer are fictional; the arithmetic is real.
          </Text>
        </Column>
      </Section>
    </Email>
  );
}
