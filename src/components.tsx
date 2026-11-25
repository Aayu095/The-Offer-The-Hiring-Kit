import React from "react";
import {
  Circle,
  Column,
  Grid,
  Path,
  Rect,
  Row,
  Span,
  Svg,
  Text,
} from "@hyper-elements/react";
import { fonts, palette } from "./theme";
import { candidate, company } from "./data";
import { dateLabel, type IsoDate } from "./engine";

// Shared blocks for The Offer — "The Badge" in Carbon & Lime.
// Everything here is drawn (Svg) or laid out (Columns) — no images
// exist anywhere in the kit. Label/value pairs are Grid rows, per
// the house trap: flex:"none" text in a Row mis-measures.

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "Mon 11 Jan 2027" — the way a badge prints a date. */
export function dateBadge(d: IsoDate): string {
  const wd = WEEKDAYS_SHORT[new Date(Date.UTC(d.y, d.m - 1, d.d)).getUTCDay()];
  return `${wd} ${d.d} ${MONTHS_SHORT[d.m - 1]} ${d.y}`;
}

/** "11 Jan 2027". */
export function dateShort(d: IsoDate): string {
  return `${d.d} ${MONTHS_SHORT[d.m - 1]} ${d.y}`;
}

export { dateLabel };

/** The Arcline mark: three arcs over a baseline — a bridge, a
 *  sunrise, the arc the company is named for. Colors are props so
 *  the same mark prints on carbon, on ivory and on lime. */
export function ArcMark({
  w = 46,
  h = 34,
  main = palette.lime,
  inner = palette.offWhite,
}: {
  w?: number;
  h?: number;
  main?: string;
  inner?: string;
}) {
  return (
    <Svg width={w} height={h} viewBox="0 0 46 34">
      <Path d="M5 29 A18 18 0 0 1 41 29" style={{ fill: "rgba(0,0,0,0)", stroke: main, strokeWidth: 4.4 }} />
      <Path d="M12.5 29 A10.5 10.5 0 0 1 33.5 29" style={{ fill: "rgba(0,0,0,0)", stroke: inner, strokeWidth: 4.4 }} />
      <Rect x={2} y={29} width={42} height={3.4} style={{ fill: main }} />
    </Svg>
  );
}

/** Badge hardware: the strap coming in from the badge's top edge,
 *  the steel ring, and the slot it passes through. */
export function Hardware({ strap = palette.lime }: { strap?: string }) {
  return (
    <Svg width={240} height={88} viewBox="0 0 240 88">
      <Path d="M84 0 L103 0 L115 46 L99 46 Z" style={{ fill: strap }} />
      <Path d="M137 0 L156 0 L141 46 L125 46 Z" style={{ fill: strap }} />
      <Rect x={60} y={72} width={120} height={14} rx={7} style={{ fill: palette.slot }} />
      <Rect x={103} y={28} width={34} height={20} rx={5} style={{ fill: palette.metal, stroke: palette.metalLine, strokeWidth: 1.6 }} />
      <Circle cx={120} cy={58} r={17} style={{ fill: "rgba(0,0,0,0)", stroke: palette.metal, strokeWidth: 7 }} />
      <Circle cx={120} cy={58} r={17} style={{ fill: "rgba(0,0,0,0)", stroke: palette.metalLine, strokeWidth: 1.2, opacity: 0.6 }} />
    </Svg>
  );
}

/** The photo, drawn: a portrait silhouette in badge-print lime —
 *  a placeholder person, never a fake photograph. */
export function Portrait({
  w = 232,
  h = 300,
  bg = palette.photoBg,
  ink = palette.lime,
  ring = palette.lime,
}: {
  w?: number;
  h?: number;
  bg?: string;
  ink?: string;
  ring?: string;
}) {
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Rect x={0} y={0} width={w} height={h} rx={10} style={{ fill: bg }} />
      <Circle cx={w / 2} cy={h * 0.37} r={w * 0.2} style={{ fill: ink }} />
      <Path
        d={`M ${w * 0.09} ${h} L ${w * 0.09} ${h * 0.94} A ${w * 0.41} ${h * 0.3} 0 0 1 ${w * 0.91} ${h * 0.94} L ${w * 0.91} ${h} Z`}
        style={{ fill: ink }}
      />
      <Rect x={1} y={1} width={w - 2} height={h - 2} rx={10} style={{ fill: "rgba(0,0,0,0)", stroke: ring, strokeWidth: 1.6, opacity: 0.3 }} />
    </Svg>
  );
}

/** The smart chip, drawn the way it is printed on the card — gold
 *  in every colorway, as on real badges. */
export function Chip() {
  return (
    <Svg width={56} height={42} viewBox="0 0 56 42">
      <Rect x={1} y={1} width={54} height={40} rx={8} style={{ fill: palette.gold, stroke: palette.goldLine, strokeWidth: 1.6 }} />
      <Rect x={19} y={12} width={18} height={18} rx={4} style={{ fill: "rgba(0,0,0,0)", stroke: palette.goldLine, strokeWidth: 1.6 }} />
      <Path d="M1 21 L19 21 M37 21 L55 21 M28 1 L28 12 M28 30 L28 41" style={{ fill: "rgba(0,0,0,0)", stroke: palette.goldLine, strokeWidth: 1.6 }} />
    </Svg>
  );
}

/** A barcode for the access strip: a fixed bar pattern, printed in
 *  whatever ink the strip carries. */
export function Barcode({ w = 168, h = 46, fill = palette.limeInk }: { w?: number; h?: number; fill?: string }) {
  const units = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 1, 1, 3, 1, 2];
  const totalUnits = units.reduce((a, b) => a + b, 0) + (units.length - 1);
  const unit = w / totalUnits;
  const bars: React.ReactNode[] = [];
  let x = 0;
  units.forEach((u, i) => {
    bars.push(<Rect key={i} x={x} y={0} width={u * unit} height={h} style={{ fill }} />);
    x += (u + 1) * unit;
  });
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {bars}
    </Svg>
  );
}

/** A two-tone rule, printed as blocks: carbon, then lime. Used at
 *  the head of the letter and above its closing panel. */
export function InkBand({ w, h = 5, first = palette.carbon, second = palette.lime }: { w: number; h?: number; first?: string; second?: string }) {
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Rect x={0} y={0} width={w * 0.68} height={h} style={{ fill: first }} />
      <Rect x={w * 0.68} y={0} width={w * 0.32 + 1} height={h} style={{ fill: second }} />
    </Svg>
  );
}

/** A ruled money row for the paper outputs: label + note left,
 *  figure right, hairline under. */
export function MoneyRow({
  label,
  note,
  value,
  strong,
}: {
  label: string;
  note?: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <Grid
      columns={2}
      style={{
        gap: 12,
        padding: [3.6, 0],
        border: { bottom: { width: 1, style: "solid", color: palette.hairline } },
      }}
    >
      <Text style={{ fontSize: 10.4, fontWeight: strong ? 700 : 600, color: palette.ink }}>
        {label}
        {note ? <Span style={{ color: palette.soft, fontWeight: 500, fontSize: 9.2 }}> · {note}</Span> : null}
      </Text>
      <Text style={{ fontFamily: fonts.display, fontWeight: strong ? 700 : 600, fontSize: strong ? 12.5 : 11.5, color: palette.ink, textAlign: "right" }}>{value}</Text>
    </Grid>
  );
}

/** A tinted date chip for the paper outputs. */
export function DateChip({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <Column style={{ flex: 1, backgroundColor: palette.tint, border: { width: 1, style: "solid", color: palette.chipBorder }, borderRadius: 14, padding: [11, 14], gap: 2 }}>
      <Text style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 8.4, letterSpacing: 1.6, textTransform: "uppercase", color: palette.soft }}>{label}</Text>
      <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 13.5, color: palette.ink }}>{value}</Text>
      <Text style={{ fontSize: 9, fontWeight: 500, color: palette.soft }}>{sub}</Text>
    </Column>
  );
}

/** The badge again, pocket-sized, in Carbon & Lime — printed at
 *  the head of the letter and on the onboarding page: the same
 *  object, come along in the envelope. Built from plain columns
 *  (no Svg inside a flex-sized cell) per the house traps. */
export function MiniBadge({ joiningLabel }: { joiningLabel: string }) {
  return (
    <Column
      style={{
        flex: "none",
        width: 148,
        backgroundColor: palette.carbon,
        border: { width: 1, style: "solid", color: palette.carbonDeep },
        borderRadius: 14,
        padding: [10, 10, 11],
        gap: 0,
      }}
    >
      <Row style={{ justifyContent: "center" }}>
        <Column style={{ width: 44, height: 7, backgroundColor: palette.slot, borderRadius: 999 }} />
      </Row>
      <Column style={{ padding: [9, 0, 0] }}>
        <Column style={{ backgroundColor: palette.lime, borderRadius: 8, padding: [6, 4] }}>
          <Text style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 7.5, letterSpacing: 1.4, color: palette.limeInk, textAlign: "center" }}>
            {company.name.toUpperCase()}
          </Text>
        </Column>
      </Column>
      <Column style={{ padding: [8, 0, 0] }}>
        <Column style={{ backgroundColor: palette.photoBg, borderRadius: 8, height: 76, alignItems: "center", justifyContent: "end", gap: 5 }}>
          <Column style={{ width: 27, height: 27, backgroundColor: palette.lime, borderRadius: 999 }} />
          <Column style={{ width: 54, height: 25, backgroundColor: palette.lime, borderRadius: 999 }} />
        </Column>
      </Column>
      <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 9.5, color: palette.offWhite, textAlign: "center", padding: [8, 0, 0] }}>
        {candidate.name.toUpperCase()}
      </Text>
      <Text style={{ fontSize: 6.8, fontWeight: 600, letterSpacing: 0.8, color: palette.softDark, textAlign: "center", padding: [2, 0, 0] }}>
        SR. SOFTWARE ENGINEER
      </Text>
      <Column style={{ padding: [9, 0, 0] }}>
        <Column style={{ backgroundColor: palette.lime, borderRadius: 6, padding: [5, 4] }}>
          <Text style={{ fontFamily: fonts.mono, fontWeight: 600, fontSize: 7, color: palette.limeInk, textAlign: "center" }}>
            {joiningLabel}
          </Text>
        </Column>
      </Column>
    </Column>
  );
}
