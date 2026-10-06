import { useEffect, useRef, useState } from 'react';
import { consent, useConsent } from '../hooks/useConsent';

const SHOW_DELAY_MS = 1400; // let the page paint first
const LEAVE_MS = 320;

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full border transition-colors cursor-pointer shrink-0 shadow-inner ${
        checked ? 'bg-[#2a1712] border-accent' : 'bg-[#0c0a09] border-line'
      }`}
    >
      <span
        className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full transition-transform duration-300 ease-custom shadow-[0_1px_3px_rgba(0,0,0,0.6)] ${
          checked
            ? 'translate-x-5 bg-gradient-to-br from-accent-light via-accent to-[#8f2515]'
            : 'translate-x-0 bg-[#8c8275]'
        }`}
      />
    </button>
  );
}

// Sculptor's Atelier Plaque: chiseled bronze plinth finish, classical bust medallion,
// corner masonry pins, and subtle classical statue watermark.
export function CookieBanner() {
  const { choice, open } = useConsent();
  const [leaving, setLeaving] = useState(false);
  const [customise, setCustomise] = useState(Boolean(choice));
  const [maps, setMaps] = useState(choice ? choice.maps : false);
  const [prevOpen, setPrevOpen] = useState(open);
  const primaryRef = useRef(null);

  // Derive state from the store while rendering (no effect needed): on open, reset the panel;
  // on close, run the exit animation.
  if (open !== prevOpen) {
    setPrevOpen(open);
    setLeaving(!open);
    if (open) {
      setCustomise(Boolean(choice));
      setMaps(choice ? choice.maps : false);
    }
  }

  // First visit: open after a short delay unless a choice is already stored.
  useEffect(() => {
    if (choice) return undefined;
    const t = setTimeout(() => consent.open(), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [choice]);

  // Unmount once the exit animation has played.
  useEffect(() => {
    if (!leaving) return undefined;
    const t = setTimeout(() => setLeaving(false), LEAVE_MS);
    return () => clearTimeout(t);
  }, [leaving]);

  // Reopened from the footer (a choice already exists): move focus into the notice.
  useEffect(() => {
    if (open && choice) primaryRef.current?.focus({ preventScroll: true });
  }, [open, choice]);

  if (!open && !leaving) return null;

  return (
    <div className="fixed z-[70] bottom-3 left-3 right-3 md:bottom-6 md:right-6 md:left-auto md:w-[460px] max-h-[calc(100dvh-24px)] overflow-y-auto">
      <section
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-desc"
        className={`relative bg-gradient-to-b from-[#1c1814] via-[#14110e] to-[#0d0b0a] border border-accent-2/35 rounded-[3px] p-5 md:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_0_1px_rgba(185,138,78,0.2)] overflow-hidden ${
          leaving ? 'cookie-out' : 'cookie-in'
        }`}
      >
        {/* Corner Masonry Pins (Museum exhibition bronze plaque mounting) */}
        <span className="absolute top-2 left-2 text-[9px] text-accent-2/45 select-none pointer-events-none font-mono" aria-hidden="true">✦</span>
        <span className="absolute top-2 right-2 text-[9px] text-accent-2/45 select-none pointer-events-none font-mono" aria-hidden="true">✦</span>
        <span className="absolute bottom-2 left-2 text-[9px] text-accent-2/45 select-none pointer-events-none font-mono" aria-hidden="true">✦</span>
        <span className="absolute bottom-2 right-2 text-[9px] text-accent-2/45 select-none pointer-events-none font-mono" aria-hidden="true">✦</span>

        {/* Top hairline rule that draws across like a fresh chisel line */}
        <span className="cookie-rule absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-2 to-transparent origin-center" aria-hidden="true" />

        {/* Classical Statue Watermark Silhouette (Bas-relief aesthetic) */}
        <svg
          className="absolute right-[-8px] bottom-[-10px] w-40 h-48 opacity-[0.09] text-accent-2 pointer-events-none select-none"
          viewBox="0 0 100 130"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Stepped Pedestal Base */}
          <path d="M15 125h70M20 120h60M25 115h50M30 115v-8h40v8" strokeWidth="1.5" />
          {/* Draped Torso / Toga folds */}
          <path d="M20 107c5-14 14-22 30-22s25 8 30 22" strokeWidth="1.5" fill="rgba(185,138,78,0.15)" />
          <path d="M28 107c6-10 12-14 22-14" strokeWidth="1" />
          <path d="M40 93c8 4 14 10 18 14" strokeWidth="1" />
          <path d="M58 93c-4 4-8 9-10 14" strokeWidth="1" />
          <path d="M72 107c-6-10-12-14-20-14" strokeWidth="1" />
          {/* Sculpted Neck & Socle Collar */}
          <path d="M42 85v-10c0-1 .8-2 2-2.5M58 85v-10c0-1-.8-2-2-2.5" strokeWidth="1.5" />
          {/* Classical Head Silhouette & Jaw */}
          <path d="M40 60c1.5 6 4 9 10 9s8.5-3 10-9" strokeWidth="1.5" />
          {/* Classical Profile & Nose / Brow */}
          <path d="M49 52v9l3 .8" strokeWidth="1.2" />
          <path d="M47 67c2 1 4 1 6 0" strokeWidth="1" />
          {/* Sculpted Hair Curls / Classical Laurel Crown */}
          <path d="M38 52c-2-8 1-18 8-22c4-2 9-2 13 1c7 5 8 14 5 21" strokeWidth="1.5" fill="rgba(185,138,78,0.12)" />
          <path d="M40 42c4-4 10-5 15-2" strokeWidth="1" />
          <path d="M42 36c3-2 7-3 11 0" strokeWidth="1" />
          <path d="M41 48c3-1 6-2 9-1" strokeWidth="1" />
          <path d="M56 46c3 2 5 5 4 8" strokeWidth="1" />
          {/* Chisel Spark / Artisan Star */}
          <path d="M78 40l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="currentColor" stroke="none" opacity="0.6" />
          <path d="M22 65l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="currentColor" stroke="none" opacity="0.4" />
        </svg>

        {/* Plaque Content */}
        <div className="relative z-10">
          <div className="flex items-start gap-3.5 mb-3">
            {/* Sculpted Classical Bust Medallion */}
            <div
              className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2b2219] to-[#13100d] border border-accent-2/50 flex items-center justify-center shrink-0 shadow-[inset_0_1px_2px_rgba(241,235,226,0.15),0_3px_10px_rgba(0,0,0,0.6)] text-accent-2"
              aria-hidden="true"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Classical Bust on Pedestal Socle */}
                <path d="M7 21h10M8.5 19h7M10 19v-2h4v2" />
                <path d="M6 16c1-2.2 3.2-3.5 6-3.5s5 1.3 6 3.5" />
                <path d="M9.5 12.5v-1.2c0-.5.3-1 .8-1.2" />
                <path d="M14.5 12.5v-1.2c0-.5-.3-1-.8-1.2" />
                <path d="M9.5 8.2c-.4-1.8.2-3.7 1.6-4.7 1.4-.9 3.2-.8 4.4.2 1.1 1 1.5 2.7.9 4.3" />
                <path d="M12 6.5v2l.8.3" />
                <path d="M10.8 11c.7.4 1.7.4 2.4 0" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-2 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-2/80 shadow-[0_0_6px_rgba(185,138,78,0.8)]" />
                  Atelier Notice
                </span>
                <span className="text-[10px] text-accent-2/40">✦</span>
                <span className="font-body text-[10px] tracking-wider text-text-dim">Invent Fine Art</span>
              </div>
              <h2 id="cookie-title" className="font-display text-xl md:text-[22px] text-text leading-tight mt-0.5">
                Sculpting your privacy
              </h2>
            </div>
          </div>

          <p id="cookie-desc" className="font-body text-[13.5px] text-text-dim leading-relaxed">
            In our atelier, monumental stone and architectural art are created with zero advertising or tracking cookies. Our studio map is provided by Google Maps and activates only if you choose to allow it.
          </p>

          {customise && (
            <ul className="mt-4 border-t border-line/80 divide-y divide-line/60 bg-[#0e0c0a]/60 rounded-[2px] px-3.5 py-1 border border-accent-2/15">
              <li className="flex items-center justify-between gap-4 py-3">
                <span>
                  <span className="font-body text-xs font-semibold text-text flex items-center gap-1.5">
                    Studio Foundation
                    <span className="text-[10px] font-normal text-accent-2/70">(Essential)</span>
                  </span>
                  <span className="font-body text-[11px] text-text-dim block mt-0.5">
                    Preserves your atelier privacy preferences. Always carved in stone.
                  </span>
                </span>
                <span className="font-body text-[10px] uppercase tracking-wider text-accent-2/80 bg-accent-2/10 px-2 py-0.5 rounded-[2px] border border-accent-2/25 shrink-0">
                  Required
                </span>
              </li>
              <li className="flex items-center justify-between gap-4 py-3">
                <span>
                  <span className="font-body text-xs font-semibold text-text">
                    Interactive Studio Map
                  </span>
                  <span className="font-body text-[11px] text-text-dim block mt-0.5">
                    Google Maps atelier coordinates on the Contact page.
                  </span>
                </span>
                <Switch checked={maps} onChange={setMaps} label="Allow embedded Google Maps" />
              </li>
            </ul>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {customise ? (
              <button
                ref={primaryRef}
                type="button"
                onClick={() => consent.save(maps)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent to-[#cc462e] hover:brightness-110 text-text text-xs font-semibold uppercase tracking-[0.12em] shadow-[0_2px_12px_rgba(185,58,37,0.35)] border border-accent-light/25 transition-all min-h-[42px] cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Save choices
              </button>
            ) : (
              <>
                <button
                  ref={primaryRef}
                  type="button"
                  onClick={() => consent.save(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent to-[#cc462e] hover:brightness-110 text-text text-xs font-semibold uppercase tracking-[0.12em] shadow-[0_2px_12px_rgba(185,58,37,0.35)] border border-accent-light/25 transition-all min-h-[42px] cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={() => consent.save(false)}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-full border border-accent-2/40 hover:border-accent-2 hover:bg-accent-2/10 text-text text-xs font-medium uppercase tracking-[0.12em] transition-all min-h-[42px] cursor-pointer"
                >
                  Essential only
                </button>
                <button
                  type="button"
                  onClick={() => setCustomise(true)}
                  className="inline-flex items-center gap-1.5 font-body text-xs font-medium uppercase tracking-[0.12em] text-text-dim hover:text-accent-2 transition-colors min-h-[42px] px-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  Customise
                </button>
              </>
            )}
            {customise && choice && (
              <button
                type="button"
                onClick={() => consent.close()}
                className="font-body text-xs font-medium uppercase tracking-[0.12em] text-text-dim hover:text-text transition-colors min-h-[42px] px-2 cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CookieBanner;

