import { defineTheme } from "@hyper-elements/react";

// The Offer — "The Badge", in Carbon & Lime. The joining
// announcement is an employee ID badge drawn at poster size:
// near-black carbon plastic, off-white print, one electric
// chartreuse spent the way a badge spends its accent — the strap,
// the access strip, the granted tick — and a gold smart chip that
// stays gold in every colorway, as it does on real badges.
// On paper the same identity prints in carbon-black on ivory,
// the lime kept as a signal (the rule, the panel edge), never as
// small text. Inter is the corporate-ID grotesque throughout;
// IBM Plex Mono is for badge numbers and figures that must not
// wobble.
export const palette = {
  // the desk the badge lies on
  ground: "#0B0B0D",
  glow: "#A8D93A",
  groundText: "#B9BCBF",
  groundDim: "#6E7076",
  // the badge body and its print (dark)
  carbon: "#191A1D",
  carbonDeep: "#141518",
  offWhite: "#F2F3EF",
  softDark: "#9BA09B", // secondary print on carbon
  hairlineDark: "#34363B",
  photoBg: "#26282C",
  // the signal
  lime: "#B1E83C",
  limeInk: "#141518", // print on lime
  limeDim: "rgba(20,21,24,0.62)",
  // the chip — constant, as on real badges
  gold: "#D9A441",
  goldLine: "#A87B24",
  // hardware
  slot: "#050506",
  metal: "#C9CDD4",
  metalLine: "#8E939B",
  // the letter / page, on paper (light)
  paper: "#FAF6EB",
  panel: "#FFFFFF",
  ink: "#1E2023", // carbon-black print
  soft: "#6E7268", // secondary print on ivory
  hairline: "#DED8C4",
  tint: "rgba(25,26,29,0.045)",
  chipBorder: "rgba(25,26,29,0.16)",
};

export const fonts = {
  display: "Inter, Arial, Helvetica, sans-serif",
  body: "Inter, Arial, Helvetica, sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

// Webfont faces for the HTML outputs (Page / Document print HTML) —
// the same SIL OFL files kept in assets/fonts/, served from the
// Fontsource CDN (the sibling kits' pattern).
const face = (family: string, file: string, weight: number) => ({
  family,
  src: `https://cdn.jsdelivr.net/fontsource/fonts/${file}.woff`,
  format: "woff" as const,
  weight,
});

export const fontFaces = [
  face("Inter", "inter@latest/latin-400-normal", 400),
  face("Inter", "inter@latest/latin-500-normal", 500),
  face("Inter", "inter@latest/latin-600-normal", 600),
  face("Inter", "inter@latest/latin-700-normal", 700),
  face("IBM Plex Mono", "ibm-plex-mono@latest/latin-400-normal", 400),
  face("IBM Plex Mono", "ibm-plex-mono@latest/latin-600-normal", 600),
];

/** The same faces, served by the demo site itself (site/public/fonts)
 *  so the live demo is self-contained: pass an origin like
 *  "https://demo.example" or "" for same-origin relative root. */
export const localFaces = (origin: string) => {
  const f = (family: string, file: string, weight: number) => ({
    family,
    src: `${origin}/fonts/${file}.woff`,
    format: "woff" as const,
    weight,
  });
  return [
    f("Inter", "Inter-Regular", 400),
    f("Inter", "Inter-Medium", 500),
    f("Inter", "Inter-SemiBold", 600),
    f("Inter", "Inter-Bold", 700),
    f("IBM Plex Mono", "IBMPlexMono-Regular", 400),
    f("IBM Plex Mono", "IBMPlexMono-SemiBold", 600),
  ];
};

const headingEl = {
  fontFamily: fonts.display,
  fontWeight: 700,
  lineHeight: 1.12,
  letterSpacing: -0.3,
};

/** The badge's own theme — dark plastic, light print. */
export const badgeTheme = defineTheme({
  colors: {
    background: palette.carbon,
    foreground: palette.offWhite,
    primary: palette.lime,
    primaryForeground: palette.limeInk,
    muted: palette.softDark,
    border: palette.lime,
  },
  fonts: { body: fonts.body, heading: fonts.display },
  fontSizes: { body: 16 },
  lineHeights: { body: 1.55 },
  elements: {
    Heading: headingEl,
    Text: { lineHeight: 1.55 },
  },
});

/** The paper theme — the letter and the onboarding page. */
export const paperTheme = defineTheme({
  colors: {
    background: palette.paper,
    foreground: palette.ink,
    primary: palette.carbon,
    primaryForeground: palette.offWhite,
    muted: palette.soft,
    border: palette.carbon,
  },
  fonts: { body: fonts.body, heading: fonts.display },
  fontSizes: { body: 16 },
  lineHeights: { body: 1.55 },
  elements: {
    Heading: headingEl,
    Text: { lineHeight: 1.55 },
    Button: {
      backgroundColor: palette.carbon,
      color: palette.offWhite,
      borderRadius: 10,
      padding: [13, 24],
      fontWeight: 600,
      fontSize: 14.5,
      hover: { backgroundColor: palette.carbonDeep },
    },
  },
});

/** The email theme — the paper identity, email-safe. */
export const emailTheme = defineTheme({
  colors: {
    background: palette.paper,
    foreground: palette.ink,
    primary: palette.carbon,
    primaryForeground: palette.offWhite,
    muted: palette.soft,
    border: palette.carbon,
  },
  fonts: { body: fonts.body, heading: fonts.display },
  fontSizes: { body: 16 },
  lineHeights: { body: 1.55 },
  elements: {
    Heading: headingEl,
    Text: { lineHeight: 1.55 },
    Button: {
      backgroundColor: palette.carbon,
      color: palette.offWhite,
      borderRadius: 10,
      padding: [13, 24],
      fontWeight: 600,
      fontSize: 14.5,
    },
  },
});

/** Small caps label — the badge's printed field labels. */
export const kick = (size: number, color: string) => ({
  fontFamily: fonts.body,
  fontSize: size,
  fontWeight: 700,
  letterSpacing: 2.2,
  textTransform: "uppercase" as const,
  color,
});
