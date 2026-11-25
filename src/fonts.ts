import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Local font files only (assets/fonts) — full-coverage builds instanced
// from the Google Fonts variable fonts, cmap-verified for ₹ (U+20B9):
// the Fontsource latin subsets used for web faces do NOT carry the
// rupee sign, and the PDF/image renderers do no glyph fallback.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fontFile = (name: string) => readFile(join(root, "assets", "fonts", name));

type RenderFont = {
  family: string;
  src: Buffer;
  weight: number;
  style?: "italic";
};

export async function loadRenderFonts(): Promise<RenderFont[]> {
  const F = async (
    family: string,
    file: string,
    weight: number,
    style?: "italic",
  ): Promise<RenderFont> => ({ family, src: await fontFile(file), weight, style });
  return [
    // Dir 1 — Fraunces (display serif, WONK cut)
    await F("Fraunces", "Fraunces-Medium.ttf", 500),
    await F("Fraunces", "Fraunces-MediumItalic.ttf", 500, "italic"),
    await F("Fraunces", "Fraunces-SemiBold.ttf", 600),
    await F("Fraunces", "Fraunces-SemiBoldItalic.ttf", 600, "italic"),
    await F("Fraunces", "Fraunces-Bold.ttf", 700),
    // Shared body — Inter
    await F("Inter", "Inter-Regular.ttf", 400),
    await F("Inter", "Inter-Medium.ttf", 500),
    await F("Inter", "Inter-SemiBold.ttf", 600),
    await F("Inter", "Inter-Bold.ttf", 700),
    // Dir 2 — Archivo + Archivo Expanded + IBM Plex Mono
    await F("Archivo", "Archivo-Regular.ttf", 400),
    await F("Archivo", "Archivo-Medium.ttf", 500),
    await F("Archivo", "Archivo-SemiBold.ttf", 600),
    await F("Archivo", "Archivo-Bold.ttf", 700),
    await F("Archivo", "Archivo-Black.ttf", 900),
    await F("Archivo Expanded", "ArchivoExpanded-Bold.ttf", 700),
    await F("Archivo Expanded", "ArchivoExpanded-Black.ttf", 900),
    await F("IBM Plex Mono", "IBMPlexMono-Regular.ttf", 400),
    await F("IBM Plex Mono", "IBMPlexMono-SemiBold.ttf", 600),
    // Dir 3 — Bricolage Grotesque + Manrope
    await F("Bricolage Grotesque", "BricolageGrotesque-SemiBold.ttf", 600),
    await F("Bricolage Grotesque", "BricolageGrotesque-Bold.ttf", 700),
    await F("Bricolage Grotesque", "BricolageGrotesque-ExtraBold.ttf", 800),
    await F("Manrope", "Manrope-Regular.ttf", 400),
    await F("Manrope", "Manrope-Medium.ttf", 500),
    await F("Manrope", "Manrope-Bold.ttf", 700),
    await F("Manrope", "Manrope-ExtraBold.ttf", 800),
  ];
}

// Webfont faces for the Document print HTML (Phase 2 demo site) — the
// same SIL OFL families as the local files, served from Fontsource.
const face = (family: string, file: string, weight: number, style?: "italic") => ({
  family,
  src: `https://cdn.jsdelivr.net/fontsource/fonts/${file}.woff`,
  format: "woff" as const,
  weight,
  ...(style ? { style } : {}),
});

export const fontFaces = [
  face("Fraunces", "fraunces@latest/latin-500-normal", 500),
  face("Fraunces", "fraunces@latest/latin-500-italic", 500, "italic"),
  face("Fraunces", "fraunces@latest/latin-600-normal", 600),
  face("Fraunces", "fraunces@latest/latin-600-italic", 600, "italic"),
  face("Fraunces", "fraunces@latest/latin-700-normal", 700),
  face("Inter", "inter@latest/latin-400-normal", 400),
  face("Inter", "inter@latest/latin-500-normal", 500),
  face("Inter", "inter@latest/latin-600-normal", 600),
  face("Inter", "inter@latest/latin-700-normal", 700),
  face("Archivo", "archivo@latest/latin-400-normal", 400),
  face("Archivo", "archivo@latest/latin-500-normal", 500),
  face("Archivo", "archivo@latest/latin-600-normal", 600),
  face("Archivo", "archivo@latest/latin-700-normal", 700),
  face("Archivo", "archivo@latest/latin-900-normal", 900),
  face("Archivo Expanded", "archivo@latest/latin-700-normal", 700),
  face("Archivo Expanded", "archivo@latest/latin-900-normal", 900),
  face("IBM Plex Mono", "ibm-plex-mono@latest/latin-400-normal", 400),
  face("IBM Plex Mono", "ibm-plex-mono@latest/latin-600-normal", 600),
  face("Bricolage Grotesque", "bricolage-grotesque@latest/latin-600-normal", 600),
  face("Bricolage Grotesque", "bricolage-grotesque@latest/latin-700-normal", 700),
  face("Bricolage Grotesque", "bricolage-grotesque@latest/latin-800-normal", 800),
  face("Manrope", "manrope@latest/latin-400-normal", 400),
  face("Manrope", "manrope@latest/latin-500-normal", 500),
  face("Manrope", "manrope@latest/latin-700-normal", 700),
  face("Manrope", "manrope@latest/latin-800-normal", 800),
];
