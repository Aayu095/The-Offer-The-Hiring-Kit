import React from "react";
import {
  Button,
  Column,
  Divider,
  Grid,
  LineBreak,
  Page,
  Row,
  Section,
  Span,
  Text,
} from "@hyper-elements/react";
import { fontFaces, fonts, kick, palette as p, paperTheme } from "./theme";
import { ArcMark, InkBand, Portrait, dateBadge } from "./components";
import { buddy, candidate, company, demoUrl, figuresFor, hr, offer } from "./data";
import { addDays, dateLabel, inr } from "./engine";

// —————————————————————————————————————————————————————————————————————
// The Offer — Page (1120px): the onboarding page, "Your first
// week". It opens the day the offer is accepted: day one hour by
// hour, the documents to bring (their deadline computed from the
// joining date), the people, the badge — and the money, briefly,
// with the first salary's pro-rated figure computed. Ivory
// ground, carbon panels, lime signals: the badge's family.
// —————————————————————————————————————————————————————————————————————

function SectionHead({ index, label, right }: { index: string; label: string; right?: string }) {
  return (
    <Column style={{ gap: 10 }}>
      <Row style={{ gap: 12, alignItems: "center" }}>
        <Column style={{ width: 10, height: 10, backgroundColor: p.lime, flex: "none" }} />
        <Text style={{ fontFamily: fonts.mono, fontWeight: 600, fontSize: 12, color: p.soft }}>{index}</Text>
        <Text style={{ fontWeight: 700, fontSize: 14.5, letterSpacing: 2.2, textTransform: "uppercase", color: p.ink, flex: 1 }}>
          {label}
        </Text>
        {right ? (
          <Text style={{ fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 1.2, color: p.soft, width: 380, textAlign: "right" }}>
            {right}
          </Text>
        ) : null}
      </Row>
      <Divider style={{ borderTop: { width: 1, style: "solid", color: p.ink } }} />
    </Column>
  );
}

function ScheduleRow({
  time,
  title,
  note,
  place,
  first = false,
}: {
  time: string;
  title: string;
  note: string;
  place: string;
  first?: boolean;
}) {
  return (
    <Row
      style={{
        gap: 20,
        padding: [13, 0],
        alignItems: "start",
        border: first ? undefined : { top: { width: 1, style: "solid", color: p.hairline } },
      }}
    >
      <Text style={{ fontFamily: fonts.mono, fontWeight: 600, fontSize: 13, color: p.ink, flex: "none", width: 96 }}>
        {time}
      </Text>
      <Column style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontWeight: 600, fontSize: 15.5, color: p.ink }}>{title}</Text>
        <Text style={{ fontSize: 13.5, lineHeight: 1.5, color: p.soft }}>{note}</Text>
      </Column>
      <Text style={{ fontSize: 12.5, fontWeight: 500, color: p.soft, flex: "none", width: 210, textAlign: "right" }}>
        {place}
      </Text>
    </Row>
  );
}

function DocItem({ label, note }: { label: string; note: string }) {
  return (
    <Row style={{ gap: 12, alignItems: "start" }}>
      <Column
        style={{
          flex: "none",
          width: 17,
          height: 17,
          border: { width: 1.6, style: "solid", color: p.carbon },
          borderRadius: 5,
          backgroundColor: p.panel,
        }}
      />
      <Column style={{ flex: 1, gap: 1 }}>
        <Text style={{ fontWeight: 600, fontSize: 14.5, color: p.ink }}>{label}</Text>
        <Text style={{ fontSize: 12.5, color: p.soft }}>{note}</Text>
      </Column>
    </Row>
  );
}

function PersonCard({ name, role, note, line }: { name: string; role: string; note: string; line: string }) {
  return (
    <Column
      style={{
        flex: 1,
        backgroundColor: p.panel,
        border: { width: 1, style: "solid", color: p.hairline },
        borderRadius: 18,
        padding: [20, 20],
        gap: 10,
      }}
    >
      <Portrait w={64} h={82} />
      <Column style={{ gap: 2 }}>
        <Text style={{ fontWeight: 700, fontSize: 17, color: p.ink }}>{name}</Text>
        <Text style={{ fontSize: 12.5, fontWeight: 600, color: p.soft }}>{role}</Text>
      </Column>
      <Text style={{ fontSize: 13.5, lineHeight: 1.55, color: p.ink }}>{note}</Text>
      <Text style={{ fontFamily: fonts.mono, fontSize: 11, color: p.soft }}>{line}</Text>
    </Column>
  );
}

function MoneyLine({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <Grid
      columns={2}
      style={{ gap: 12, padding: [8, 0], border: { top: { width: 1, style: "solid", color: p.hairline } } }}
    >
      <Text style={{ fontSize: 14, fontWeight: strong ? 700 : 500, color: p.ink }}>{label}</Text>
      <Text style={{ fontFamily: fonts.mono, fontSize: 13, fontWeight: 600, color: p.ink, textAlign: "right" }}>{value}</Text>
    </Grid>
  );
}

export default function OfferPage({
  ctc,
  faces,
}: {
  ctc?: number;
  faces?: typeof fontFaces;
}) {
  const fig = figuresFor(ctc ?? offer.ctcAnnual);
  const { payroll, joining } = fig;
  const docsDue = addDays(joining.joining, -3);
  return (
    <Page
      theme={paperTheme}
      width={1120}
      title={`The Offer — ${candidate.name}, your first week at ${company.name}`}
      description="The onboarding page for a new joiner: day one hour by hour, the documents to bring, your people, your badge — every date and figure computed from one candidate file."
      fonts={faces ?? fontFaces}
      style={{ backgroundColor: p.paper, gap: 0 }}
    >
      {/* ——— Masthead + hero ——— */}
      <Section style={{ backgroundColor: p.paper, padding: [44, 64, 40] }}>
        <Column style={{ gap: 0 }}>
          <Row style={{ gap: 12, alignItems: "center" }}>
            <ArcMark w={40} h={30} main={p.carbon} inner={p.lime} />
            <Text style={{ fontWeight: 700, fontSize: 13, letterSpacing: 2.6, color: p.ink, flex: 1 }}>
              {company.name.toUpperCase()}
            </Text>
            <Text style={{ fontFamily: fonts.mono, fontSize: 11, color: p.soft }}>
              Onboarding · {offer.ref}
            </Text>
          </Row>
          <Column style={{ padding: [14, 0, 0] }}>
            <InkBand w={992} />
          </Column>

          <Row style={{ gap: 44, padding: [38, 0, 0] }}>
            <Column style={{ flex: 1.7, gap: 16 }}>
              <Text style={kick(11, p.ink)}>
                Your first week — {candidate.team} team
              </Text>
              <Text style={{ fontWeight: 700, fontSize: 54, lineHeight: 1.04, letterSpacing: -0.5, color: p.ink }}>
                Welcome aboard,
                <LineBreak />
                {candidate.firstName}.
              </Text>
              <Text style={{ fontSize: 16, lineHeight: 1.6, color: p.ink, maxWidth: 560 }}>
                You start on <Span style={{ fontWeight: 700 }}>{dateLabel(joining.joining)}</Span> as a{" "}
                {candidate.role} ({candidate.level}) on the {candidate.team} team. This page is your
                first week, written down: what happens on day one, what to bring, who is waiting
                for you, and the badge that is already being printed with your name on it. Every
                date below is computed from your joining date; every figure, from your offer.
              </Text>
              <Row style={{ gap: 26, padding: [6, 0, 0] }}>
                <Column style={{ gap: 2 }}>
                  <Text style={kick(9.5, p.soft)}>Joining</Text>
                  <Text style={{ fontWeight: 700, fontSize: 16.5, color: p.ink }}>{dateBadge(joining.joining)}</Text>
                </Column>
                <Column style={{ gap: 2 }}>
                  <Text style={kick(9.5, p.soft)}>Probation ends</Text>
                  <Text style={{ fontWeight: 700, fontSize: 16.5, color: p.ink }}>{dateLabel(joining.probationEnd)}</Text>
                </Column>
                <Column style={{ gap: 2 }}>
                  <Text style={kick(9.5, p.soft)}>First salary</Text>
                  <Text style={{ fontWeight: 700, fontSize: 16.5, color: p.ink }}>{dateLabel(joining.firstSalaryDate)}</Text>
                </Column>
              </Row>
              <Row style={{ gap: 14, alignItems: "center", padding: [8, 0, 0] }}>
                <Button href={demoUrl}>Download your offer letter</Button>
                <Text style={{ fontSize: 13, color: p.soft }}>
                  The annexure with it prints every assumption.
                </Text>
              </Row>
            </Column>

            {/* Badge activation panel */}
            <Column
              style={{
                flex: 1,
                backgroundColor: p.carbon,
                borderRadius: 20,
                padding: [24, 24],
                gap: 0,
              }}
            >
              <Row style={{ gap: 10, alignItems: "center" }}>
                <ArcMark w={34} h={25} />
                <Text style={kick(9.5, p.lime)}>Badge AL·0118</Text>
              </Row>
              <Text style={{ fontWeight: 700, fontSize: 23, lineHeight: 1.2, color: p.offWhite, padding: [14, 0, 0] }}>
                Your badge is being printed.
              </Text>
              <Text style={{ fontSize: 13.5, lineHeight: 1.55, color: p.softDark, padding: [8, 0, 0] }}>
                Collect it at reception on {dateBadge(joining.joining)}, 9:30 AM — bring one photo
                ID. It is live from the moment it is handed over.
              </Text>
              <Column style={{ padding: [16, 0, 0], gap: 8 }}>
                {["Studio doors, all floors", "The fourth-floor lab", "The pantry (the coffee is on us)"].map((t) => (
                  <Row key={t} style={{ gap: 10, alignItems: "center" }}>
                    <Column style={{ width: 8, height: 8, backgroundColor: p.lime, flex: "none" }} />
                    <Text style={{ fontSize: 13.5, fontWeight: 500, color: p.offWhite }}>{t}</Text>
                  </Row>
                ))}
              </Column>
              <Column style={{ padding: [18, 0, 0] }}>
                <Column style={{ backgroundColor: p.lime, borderRadius: 12, padding: [12, 16] }}>
                  <Text style={{ fontFamily: fonts.mono, fontWeight: 600, fontSize: 12, color: p.limeInk }}>
                    STATUS — AT THE PRINTER · ACCESS GRANTED FROM DAY ONE
                  </Text>
                </Column>
              </Column>
            </Column>
          </Row>
        </Column>
      </Section>

      {/* ——— 01 · Day one ——— */}
      <Section style={{ backgroundColor: p.paper, padding: [10, 64, 40] }}>
        <SectionHead index="01" label="Day one, hour by hour" right={`All times IST · ${dateBadge(joining.joining)}`} />
        <Column style={{ padding: [10, 0, 0] }}>
          <ScheduleRow first time="9:30 AM" title="Collect your badge" note="Badge AL·0118 is waiting at reception with your name on it — the same badge on your joining card." place="Reception, ground floor" />
          <ScheduleRow time="9:45 AM" title={`Coffee with ${buddy.name.split(" ")[0]}, your buddy`} note="No agenda. Ask him where things are, who to ping, and how the studio really works." place="Pantry, 4th floor" />
          <ScheduleRow time="10:30 AM" title="Welcome & paperwork" note={`With ${hr.name} (${hr.title}). Sign the joining forms — bring the documents listed below.`} place="People & Culture, 4th floor" />
          <ScheduleRow time="11:30 AM" title="Desk, laptop & accounts" note="Your machine is imaged and waiting. Your badge is tested against every door it should open." place="IT desk, 4th floor" />
          <ScheduleRow time="1:00 PM" title="Team lunch" note="The whole Platform team. Still no agenda — that is the point of this one." place="The long table, pantry" />
          <ScheduleRow time="2:30 PM" title={`Meet ${candidate.manager}, your manager`} note="Your first week's plan, your first project, and what good looks like at L5 on this team." place="Studio 4B" />
          <ScheduleRow time="4:00 PM" title="Studio tour & access test" note={`With ${buddy.name.split(" ")[0]} — doors, labs, the library wall and the roof. Wave the badge at everything.`} place="Starts at reception" />
          <ScheduleRow time="5:30 PM" title="Day-one retro" note="Five lines in the team log: what surprised you. Everyone writes one on their first day." place="Team log, from your desk" />
        </Column>
      </Section>

      {/* ——— 02 · Documents ——— */}
      <Section style={{ backgroundColor: p.paper, padding: [10, 64, 40] }}>
        <SectionHead index="02" label="Before you arrive — documents" right={`Upload scans by ${dateLabel(docsDue)} · originals on day one`} />
        <Grid columns={2} style={{ gap: 22, rowGap: 18, padding: [20, 0, 0] }}>
          <DocItem label="Aadhaar card" note="Original + one copy — the name must match the offer letter" />
          <DocItem label="PAN card" note="Original + one copy — payroll cannot run without it" />
          <DocItem label="Passport photographs × 2" note="One for the badge, one for the file" />
          <DocItem label="Signed offer copy" note="The letter that travelled with this page, signed on both pages" />
          <DocItem label="Relieving letter" note="From your previous employer; an accepted-resignation email works for now" />
          <DocItem label="Last three payslips" note="For the PF transfer and the Form 11 declaration" />
          <DocItem label="Cancelled cheque" note="The account your salary lands in — the name must be yours" />
          <DocItem label="Degree certificate" note="Final-year marksheet is fine if the certificate is still on its way" />
        </Grid>
        <Text style={{ fontSize: 13.5, lineHeight: 1.55, color: p.soft, padding: [18, 0, 0] }}>
          Anything missing? Tell {hr.name.split(" ")[0]} before {dateLabel(docsDue)} — almost everything
          has a workaround except the PAN.
        </Text>
      </Section>

      {/* ——— 03 · Your people ——— */}
      <Section style={{ backgroundColor: p.paper, padding: [10, 64, 40] }}>
        <SectionHead index="03" label="Your people" right="Three humans before any tool" />
        <Row style={{ gap: 20, padding: [20, 0, 0] }}>
          <PersonCard
            name={candidate.manager}
            role={`${candidate.managerTitle}`}
            note="Your manager. The 2:30 PM on day one is his — bring your questions about the work, not the paperwork."
            line="STUDIO 4B · PLATFORM"
          />
          <PersonCard
            name={buddy.name}
            role="Your buddy · first month"
            note={buddy.note}
            line="SITS TWO DESKS DOWN"
          />
          <PersonCard
            name={hr.name}
            role={hr.title}
            note="Your person for everything in this kit — the offer, the documents, the badge, the first salary."
            line={hr.email.toUpperCase()}
          />
        </Row>
      </Section>

      {/* ——— 04 · The money, briefly ——— */}
      <Section style={{ backgroundColor: p.paper, padding: [10, 64, 48] }}>
        <SectionHead index="04" label="The money, briefly" right="Full structure in the letter's annexure" />
        <Row style={{ gap: 20, padding: [20, 0, 0] }}>
          <Column
            style={{
              flex: 1.4,
              backgroundColor: p.panel,
              border: { width: 1, style: "solid", color: p.hairline },
              borderRadius: 18,
              padding: [18, 22, 14],
            }}
          >
            <MoneyLine label="Cost to company, a year" value={inr(payroll.ctc)} />
            <MoneyLine label="Take-home, every month after tax" value={inr(payroll.inHandMonthly)} strong />
            <MoneyLine
              label={`First salary, ${dateLabel(joining.firstSalaryDate)}`}
              value={`${inr(joining.firstMonthGrossCash)} gross`}
            />
            <Text style={{ fontSize: 12.5, lineHeight: 1.55, color: p.soft, padding: [10, 0, 4] }}>
              The first salary is pro-rated — {joining.firstMonthDaysWorked} of {joining.firstMonthDaysTotal}{" "}
              days in your joining month. February's take-home is ₹100 lower: professional tax is
              ₹300 that month.
            </Text>
          </Column>
          <Column
            style={{
              flex: 1,
              backgroundColor: p.carbon,
              borderRadius: 18,
              padding: [20, 22],
              gap: 8,
            }}
          >
            <Text style={kick(9.5, p.lime)}>Key dates</Text>
            {[
              ["Joining", dateLabel(joining.joining)],
              ["Probation ends", dateLabel(joining.probationEnd)],
              ["Confirmation", dateLabel(joining.confirmation)],
              ["First salary", dateLabel(joining.firstSalaryDate)],
            ].map(([k, v]) => (
              <Row key={k} style={{ gap: 12, alignItems: "center" }}>
                <Text style={{ fontSize: 13.5, fontWeight: 500, color: p.softDark, flex: 1 }}>{k}</Text>
                <Text style={{ fontFamily: fonts.mono, fontSize: 12.5, fontWeight: 600, color: p.offWhite }}>{v}</Text>
              </Row>
            ))}
            <Text style={{ fontSize: 12.5, lineHeight: 1.55, color: p.softDark, padding: [6, 0, 0] }}>
              Every one of these dates is computed from your joining date — move the date and the
              page, the letter and the badge all move with it.
            </Text>
          </Column>
        </Row>
      </Section>

      {/* ——— Footer ——— */}
      <Section style={{ backgroundColor: p.paper, padding: [0, 64, 44] }}>
        <Column style={{ gap: 14, alignItems: "center" }}>
          <InkBand w={992} h={4} />
          <Text style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 600, color: p.ink, textAlign: "center" }}>
            {offer.ref} · {company.name} · {company.city}
          </Text>
          <Text style={{ fontSize: 12.5, lineHeight: 1.55, color: p.soft, textAlign: "center", maxWidth: 640 }}>
            The Offer — one candidate file, the whole first day written. The people, the company
            and the offer are fictional sample data; the arithmetic — and the dates — are real.
          </Text>
        </Column>
      </Section>
    </Page>
  );
}
