import React from "react";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ElementsError,
  formatDiagnostics,
  render,
  validate,
  type Diagnostic,
} from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";
import { renderImage } from "@hyper-elements/react/image";
import { emailClients, renderInEmailClients } from "@hyper-elements/email-clients";

import { loadRenderFonts } from "./fonts";
import OfferEmail from "./email";
import OfferPage from "./page";
import OfferLetter from "./document";
import OfferCanvas from "./canvas";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");

const counts = (ds: readonly Diagnostic[]) => ({
  errors: ds.filter((d) => d.severity === "error").length,
  warnings: ds.filter((d) => d.severity === "warning").length,
  notes: ds.filter((d) => d.severity !== "error" && d.severity !== "warning").length,
});

let totalErrors = 0;
let totalWarnings = 0;
const report = (label: string, ds: readonly Diagnostic[]) => {
  const c = counts(ds);
  totalErrors += c.errors;
  totalWarnings += c.warnings;
  console.log(`\n[${label}] errors=${c.errors} warnings=${c.warnings} notes=${c.notes}`);
  const text = formatDiagnostics(ds as Diagnostic[]);
  if (text) console.log(text);
};

async function step<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ElementsError) {
      report(`${label} FAILED`, e.diagnostics);
      return null;
    }
    throw e;
  }
}

async function main() {
  await mkdir(join(outDir, "email-clients"), { recursive: true });
  const fonts = await loadRenderFonts();
  const plugin = await emailClients();

  const email = <OfferEmail />;
  const page = <OfferPage />;
  const doc = <OfferLetter />;
  const canvas = <OfferCanvas />;

  // ——— Validate everything ———
  report("validate email (with email-clients plugin)", validate(email, { plugins: [plugin] }).diagnostics);
  report("validate page", validate(page).diagnostics);
  report("validate document", validate(doc).diagnostics);
  report("validate canvas", validate(canvas).diagnostics);

  // ——— Email → HTML + text ———
  const emailOut = await step("render email", () => render(email, { plugins: [plugin] }));
  if (emailOut) {
    report("render email", emailOut.diagnostics);
    await writeFile(join(outDir, "offer-email.html"), emailOut.html);
    await writeFile(join(outDir, "offer-email.txt"), emailOut.text ?? "");
    console.log("wrote out/offer-email.html + .txt", `(${emailOut.html.length} bytes html)`);
  }

  // ——— Page → HTML + text ———
  const pageOut = await step("render page", () => render(page));
  if (pageOut) {
    report("render page", pageOut.diagnostics);
    await writeFile(join(outDir, "onboarding.html"), pageOut.html);
    await writeFile(join(outDir, "onboarding.txt"), pageOut.text ?? "");
    console.log("wrote out/onboarding.html + .txt", `(${pageOut.html.length} bytes html)`);
  }

  // ——— Document → print HTML + PDF ———
  const docOut = await step("render document", () => render(doc));
  if (docOut) {
    report("render document (print html)", docOut.diagnostics);
    await writeFile(join(outDir, "offer-letter.html"), docOut.html);
    console.log("wrote out/offer-letter.html", `(${docOut.html.length} bytes html)`);
  }
  const pdfOut = await step("renderPdf document", () => renderPdf(doc, { fonts }));
  if (pdfOut) {
    report("renderPdf document", pdfOut.diagnostics);
    await writeFile(join(outDir, "offer-letter.pdf"), pdfOut.pdf);
    console.log("wrote out/offer-letter.pdf", `(${pdfOut.pdf.length} bytes)`);
  }

  // ——— Canvas → PNG + SVG ———
  const pngOut = await step("renderImage canvas (png)", () => renderImage(canvas, { fonts, format: "png" }));
  if (pngOut) {
    report("renderImage canvas (png)", pngOut.diagnostics);
    await writeFile(join(outDir, "joining-badge.png"), pngOut.image);
    console.log("wrote out/joining-badge.png", `(${pngOut.width}x${pngOut.height}, ${pngOut.image.length} bytes)`);
  }
  const svgOut = await step("renderImage canvas (svg)", () => renderImage(canvas, { fonts, format: "svg" }));
  if (svgOut) {
    report("renderImage canvas (svg)", svgOut.diagnostics);
    await writeFile(join(outDir, "joining-badge.svg"), svgOut.image);
    console.log("wrote out/joining-badge.svg", `(${svgOut.image.length} bytes)`);
  }

  // ——— Email-client previews ———
  const previews = await step("renderInEmailClients", () =>
    renderInEmailClients(email, { plugins: [plugin] }),
  );
  if (previews) {
    report("email-client previews", previews.diagnostics);
    for (const p of previews.previews) {
      await writeFile(join(outDir, "email-clients", p.filename), p.html);
      console.log("wrote out/email-clients/" + p.filename);
    }
    if (previews.skipped.length) {
      console.log("skipped previews:", previews.skipped.map((s) => JSON.stringify(s)).join("; "));
    }
  }

  console.log(`\n=== TOTAL errors=${totalErrors} warnings=${totalWarnings} ===`);
  if (totalErrors > 0) process.exitCode = 1;
}

await main();
