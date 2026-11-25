import React from "react";
import {
  Canvas,
  Column,
  Ellipse,
  Layer,
  LineBreak,
  Path,
  Rect,
  Row,
  Span,
  Svg,
  Text,
} from "@hyper-elements/react";
import { badgeTheme, fonts, kick, palette as p } from "./theme";
import { ArcMark, Barcode, Chip, Hardware, Portrait, dateBadge } from "./components";
import { candidate, company, figuresFor, offer, product } from "./data";
import { inr } from "./engine";

// —————————————————————————————————————————————————————————————————————
// The Offer — Canvas (1080×1350): the joining announcement IS the
// employee badge, drawn at poster size, in Carbon & Lime. Near-
// black plastic, off-white print, the chartreuse spent on the
// strap, the arc, the role and the access strip; the chip stays
// gold. Every figure on it is computed from the candidate file —
// move the CTC and the badge reprints.
// —————————————————————————————————————————————————————————————————————

const f = fonts;

function BadgeField({ label, value }: { label: string; value: string }) {
  return (
    <Column style={{ flex: 1, gap: 3 }}>
      <Text style={kick(9, p.softDark)}>{label}</Text>
      <Text style={{ fontFamily: f.display, fontWeight: 700, fontSize: 17.5, color: p.offWhite }}>{value}</Text>
    </Column>
  );
}

function Badge({ ctc }: { ctc?: number }) {
  const fig = figuresFor(ctc ?? offer.ctcAnnual);
  const { payroll, joining } = fig;
  return (
    <Column
      style={{
        width: 740,
        height: 916,
        backgroundColor: p.carbon,
        border: { width: 1, style: "solid", color: p.hairlineDark },
        borderRadius: 44,
        padding: [22, 42, 30],
        gap: 0,
        justifyContent: "space-between",
      }}
    >
      <Column style={{ gap: 0 }}>
        <Row style={{ justifyContent: "center" }}>
          <Hardware />
        </Row>

        <Row style={{ gap: 14, alignItems: "center", padding: [16, 0, 0] }}>
          <ArcMark />
          <Column style={{ flex: 1, gap: 1 }}>
            <Text style={{ fontFamily: f.display, fontWeight: 700, fontSize: 21, letterSpacing: 2.2, color: p.lime }}>
              {company.name.toUpperCase()}
            </Text>
            <Text style={{ fontSize: 10, fontWeight: 500, color: p.softDark }}>
              {company.line}
            </Text>
          </Column>
          <Column style={{ alignItems: "end", gap: 2 }}>
            <Text style={kick(9.5, p.lime)}>Employee access</Text>
            <Text style={kick(9.5, p.softDark)}>Bengaluru studio</Text>
          </Column>
        </Row>

        <Column style={{ padding: [20, 0, 0] }}>
          <Column style={{ height: 2, backgroundColor: p.hairlineDark }} />
        </Column>

        <Row style={{ gap: 30, padding: [26, 0, 0] }}>
          <Column style={{ flex: "none", width: 232, gap: 0 }}>
            <Portrait />
            <Row style={{ gap: 12, alignItems: "center", padding: [14, 0, 0] }}>
              <Chip />
              <Column style={{ gap: 2 }}>
                <Text style={{ fontFamily: f.mono, fontWeight: 600, fontSize: 14, color: p.offWhite }}>AL·0118</Text>
                <Text style={kick(8, p.softDark)}>Smart access</Text>
              </Column>
            </Row>
          </Column>

          <Column style={{ flex: 1, gap: 0 }}>
            <Text style={kick(10.5, p.lime)}>New joiner · Jan 2027</Text>
            <Text style={{ fontFamily: f.display, fontWeight: 700, fontSize: 58, lineHeight: 1.04, color: p.offWhite, padding: [10, 0, 0] }}>
              {candidate.name}
            </Text>
            <Text style={{ fontFamily: f.display, fontWeight: 600, fontSize: 23, color: p.lime, padding: [8, 0, 0] }}>
              {candidate.role}
            </Text>
            <Text style={{ fontFamily: f.mono, fontSize: 12.5, color: p.softDark, padding: [10, 0, 0] }}>
              BADGE AL·0118 — {company.city.toUpperCase()} STUDIO
            </Text>

            <Column style={{ padding: [22, 0, 0] }}>
              <Column style={{ height: 2, backgroundColor: p.hairlineDark }} />
            </Column>

            <Row style={{ gap: 20, padding: [18, 0, 0] }}>
              <BadgeField label="Joining" value={dateBadge(joining.joining)} />
              <BadgeField label="Team" value={candidate.team} />
            </Row>
            <Row style={{ gap: 20, padding: [16, 0, 0] }}>
              <BadgeField label="Level" value={candidate.level} />
              <BadgeField label="Cost to company" value={`${inr(payroll.ctc)} / yr`} />
            </Row>
            <Row style={{ gap: 20, padding: [16, 0, 0] }}>
              <BadgeField label="Reports to" value={candidate.manager} />
              <BadgeField label="Work mode" value={`Hybrid · ${company.city}`} />
            </Row>
          </Column>
        </Row>
      </Column>

      <Column style={{ gap: 0 }}>
        <Text style={{ fontSize: 10.5, fontWeight: 500, color: p.softDark }}>
          This badge stays with {company.name}. If found, please return it to the Indiranagar
          studio — the coffee is on us.
        </Text>

        <Column style={{ padding: [16, 0, 0] }}>
          <Column style={{ backgroundColor: p.lime, borderRadius: 18, padding: [18, 22] }}>
            <Row style={{ gap: 20, alignItems: "center" }}>
              <Barcode />
              <Column style={{ flex: 1, gap: 3 }}>
                <Text style={{ fontFamily: f.body, fontWeight: 700, fontSize: 8.5, letterSpacing: 1.8, textTransform: "uppercase", color: p.limeDim }}>
                  Take-home · every month, after tax
                </Text>
                <Text style={{ fontFamily: f.display, fontWeight: 700, fontSize: 26, color: p.limeInk }}>
                  {inr(payroll.inHandMonthly)} <Span style={{ fontSize: 14, fontWeight: 600 }}>/ month</Span>
                </Text>
              </Column>
              <Column style={{ flex: "none", width: 132, alignItems: "end", gap: 5 }}>
                <Column style={{ width: 30, height: 30, backgroundColor: p.carbonDeep, borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
                  <Svg width={16} height={16} viewBox="0 0 16 16">
                    <Path d="M3 8.5 L6.5 12 L13 4.5" style={{ fill: "rgba(0,0,0,0)", stroke: p.lime, strokeWidth: 2.6 }} />
                  </Svg>
                </Column>
                <Text style={{ fontFamily: f.body, fontWeight: 700, fontSize: 11.5, letterSpacing: 1.6, color: p.limeInk, textAlign: "right" }}>
                  ACCESS<LineBreak />GRANTED
                </Text>
              </Column>
            </Row>
          </Column>
        </Column>
      </Column>
    </Column>
  );
}

/** The desk the badge lies on: neutral black, one soft pool of
 *  lime light behind the card (layered light, no gradient syntax). */
function DeskField({ w, h }: { w: number; h: number }) {
  const rings: React.ReactNode[] = [];
  const cx = w / 2;
  const cy = h * 0.52;
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    rings.push(
      <Ellipse
        key={i}
        cx={cx}
        cy={cy}
        rx={620 * (1 - 0.82 * t)}
        ry={560 * (1 - 0.82 * t)}
        style={{ fill: p.glow, opacity: 0.012 + 0.03 * t * t }}
      />,
    );
  }
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Rect x={0} y={0} width={w} height={h} style={{ fill: p.ground }} />
      {rings}
    </Svg>
  );
}

/** The badge's cast shadow, drawn as layered rounded rects — the
 *  style system has no box-shadow, so the shadow is printed. */
function BadgeShadow({ w, h }: { w: number; h: number }) {
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Rect x={30} y={38} width={740} height={916} rx={48} style={{ fill: "#000000", opacity: 0.22 }} />
      <Rect x={22} y={27} width={740} height={916} rx={46} style={{ fill: "#000000", opacity: 0.16 }} />
    </Svg>
  );
}

export default function OfferCanvas({ ctc }: { ctc?: number }) {
  return (
    <Canvas
      theme={badgeTheme}
      width={1080}
      height={1350}
      title={`The Offer — ${candidate.name} joins ${company.name}`}
      style={{ backgroundColor: p.ground, padding: [54, 60], gap: 0 }}
    >
      <Layer style={{ height: 1242 }}>
        <DeskField w={960} h={1242} />
        <Column style={{ height: 1242, gap: 0, justifyContent: "space-between" }}>
          <Row style={{ gap: 16, alignItems: "center" }}>
            <Text style={{ ...kick(10.5, p.groundText), flex: 1 }}>
              {product.name} — {product.kit}
            </Text>
            <Text style={{ ...kick(10.5, p.groundText), flex: "none", width: 360, textAlign: "right" }}>
              One candidate file · every figure computed
            </Text>
          </Row>

          <Column style={{ alignItems: "center" }}>
            <Layer style={{ width: 776, height: 960 }}>
              <BadgeShadow w={776} h={960} />
              <Column style={{ width: 776, padding: [4, 18, 40, 18] }}>
                <Badge ctc={ctc} />
              </Column>
            </Layer>
          </Column>

          <Row style={{ gap: 16, alignItems: "center" }}>
            <Text style={{ fontSize: 12.5, fontWeight: 500, color: p.groundDim, flex: 1 }}>
              The letter, the annexure and the first-day plan are on their way — this badge is
              drawn from the same file.
            </Text>
            <Text style={{ ...kick(10.5, p.groundText), flex: "none", width: 220, textAlign: "right" }}>
              Ref {offer.ref}
            </Text>
          </Row>
        </Column>
      </Layer>
    </Canvas>
  );
}
