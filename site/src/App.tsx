import React, { useEffect, useMemo, useRef, useState } from "react";
import { render } from "@hyper-elements/react";

import OfferLetter from "../../src/document";
import OfferEmail from "../../src/email";
import OfferPage from "../../src/page";
import OfferCanvas from "../../src/canvas";
import { localFaces } from "../../src/theme";
import { candidate, company, offer } from "../../src/data";
import { computePayroll, inr } from "../../src/engine";

// —————————————————————————————————————————————————————————————————————
// The Offer — live demo. The four documents below are the kit's own
// components (../../src), rendered in the browser by Hyper Elements
// on every slider move. One number — the CTC — drives a real
// payroll engine (new-regime tax, §87A rebate, Karnataka PT), and
// every figure in every document is recomputed from it. Nothing
// here is an image of a document; the letter is live text.
// —————————————————————————————————————————————————————————————————————

type TabId = "badge" | "letter" | "email" | "page";

const TABS: Array<{ id: TabId; label: string; width: number; note: string }> = [
  {
    id: "badge",
    label: "Joining badge",
    width: 1080,
    note: "Canvas · 1080 × 1350 — the badge itself. The access strip carries the take-home, computed.",
  },
  {
    id: "letter",
    label: "Offer letter",
    width: 794,
    note: "Document · A4, exactly 2 pages, rendered live as text — drag the slider and watch the table, the tax line and the annexure's logic hold.",
  },
  {
    id: "email",
    label: "Offer email",
    width: 600,
    note: "Email · 600px, email-safe tables — the same figures, in the inbox.",
  },
  {
    id: "page",
    label: "Onboarding page",
    width: 1120,
    note: "Page · 1120px — day one, the documents, your people, and the first salary's pro-rated figure, computed from the joining date.",
  },
];

const CTC_MIN = 800_000;
const CTC_MAX = 6_000_000;
const CTC_STEP = 50_000;

function Frame({ html, naturalWidth }: { html: string; naturalWidth: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [size, setSize] = useState({ w: naturalWidth, h: 700, scale: 1 });

  const measure = () => {
    const iframe = iframeRef.current;
    const wrap = wrapRef.current;
    if (!iframe || !wrap) return;
    const doc = iframe.contentDocument;
    if (!doc || !doc.documentElement) return;
    const w = Math.max(doc.documentElement.scrollWidth, naturalWidth);
    const h = Math.max(doc.documentElement.scrollHeight, 100);
    const avail = wrap.clientWidth;
    const scale = Math.min(1, avail / w);
    setSize({ w, h, scale });
  };

  useEffect(() => {
    const t = setTimeout(measure, 350);
    return () => clearTimeout(t);
  }, [html]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const onLoad = () => {
    measure();
    const doc = iframeRef.current?.contentDocument;
    if (doc?.fonts?.ready) doc.fonts.ready.then(() => measure()).catch(() => {});
    setTimeout(measure, 700);
  };

  return (
    <div ref={wrapRef} style={{ width: "100%" }}>
      <div
        className="frame-clip"
        style={{ width: Math.round(size.w * size.scale), height: Math.round(size.h * size.scale) }}
      >
        <iframe
          ref={iframeRef}
          title="Rendered document"
          srcDoc={html}
          width={size.w}
          height={size.h}
          style={{ transform: `scale(${size.scale})` }}
          onLoad={onLoad}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [ctc, setCtc] = useState(offer.ctcAnnual);
  const [tab, setTab] = useState<TabId>("badge");
  const [html, setHtml] = useState<string>("");
  const faces = useMemo(() => localFaces(window.location.origin), []);

  const payroll = useMemo(() => computePayroll(ctc), [ctc]);
  const active = TABS.find((t) => t.id === tab)!;

  useEffect(() => {
    let cancelled = false;
    const el =
      tab === "badge" ? (
        <OfferCanvas ctc={ctc} />
      ) : tab === "letter" ? (
        <OfferLetter ctc={ctc} faces={faces} />
      ) : tab === "email" ? (
        <OfferEmail ctc={ctc} />
      ) : (
        <OfferPage ctc={ctc} faces={faces} />
      );
    Promise.resolve(render(el))
      .then((out) => {
        if (!cancelled) setHtml(out.html);
      })
      .catch((e) => {
        if (!cancelled) setHtml(`<pre style="font:13px monospace;padding:20px">${String(e)}</pre>`);
      });
    return () => {
      cancelled = true;
    };
  }, [tab, ctc, faces]);

  return (
    <div>
      <header className="topbar">
        <div className="mark" />
        <h1>THE OFFER</h1>
        <span className="sub">
          The Hiring Kit — {candidate.name} · {candidate.role}, {candidate.team} ({candidate.level}) ·{" "}
          {company.name}
        </span>
        <span className="ref mono">{offer.ref}</span>
      </header>

      <div className="controls">
        <div className="controls-inner">
          <div className="slider-block">
            <div className="slider-head">
              <span className="kicker" style={{ color: "var(--lime)" }}>
                Cost to company — drag to recompute all four documents
              </span>
            </div>
            <div className="slider-head" style={{ marginTop: 8 }}>
              <span className="ctc">{inr(ctc)}</span>
              <span className="per">per year</span>
            </div>
            <input
              id="ctc-slider"
              type="range"
              min={CTC_MIN}
              max={CTC_MAX}
              step={CTC_STEP}
              value={ctc}
              onChange={(e) => setCtc(Number(e.target.value))}
              aria-label="Cost to company"
            />
            <div className="slider-scale mono">
              <span>₹8,00,000</span>
              <span>₹60,00,000</span>
            </div>
          </div>
          <div className="readouts">
            <div className="readout">
              <div className="kicker">Take-home · month</div>
              <div className="value lime" id="readout-takehome">
                {inr(payroll.inHandMonthly)}
              </div>
              <div className="note">February: {inr(payroll.inHandFebruary)}</div>
            </div>
            <div className="readout">
              <div className="kicker">Income tax · year</div>
              <div className="value" id="readout-tax">
                {inr(payroll.tax.totalTax)}
              </div>
              <div className="note">{payroll.effectiveTaxRatePct.toFixed(1)}% of CTC · new regime</div>
            </div>
            <div className="readout">
              <div className="kicker">Engine</div>
              <div className="value" style={{ fontSize: 15, paddingTop: 6 }}>
                320 checks, live
              </div>
              <div className="note">Structure · slabs · §87A · cess · Karnataka PT</div>
            </div>
          </div>
        </div>
      </div>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={t.id === tab ? "tab active" : "tab"}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <p className="stage-note">{active.note}</p>

      <main className="stage">
        <Frame html={html} naturalWidth={active.width} />
      </main>

      <footer className="footer">
        <div className="band" />
        Rendered in your browser by Hyper Elements, from the kit's own components — the same source
        files that produce the print PDF, the badge PNG and the seven email-client previews. The
        people, the company and the offer are fictional sample data; the arithmetic is real.
      </footer>
    </div>
  );
}
