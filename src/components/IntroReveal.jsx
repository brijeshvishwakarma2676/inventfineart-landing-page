import { useCallback, useEffect, useRef, useState } from 'react';
import { cubicBezier, intro } from '../utils/intro';

// Adapted from the supplied "arc-preloader-hero" (ArcRevealHero). A site-level overlay that steps through what the studio
// makes (museum-label captions with real work counts), lands on the brand, then a curved curtain rises and reveals the site.
// Plain React state + CSS keyframes + one requestAnimationFrame loop (no animation library). Plays once per tab session
// (utils/intro.js) and can be replayed from the footer. Skip button and Esc end it immediately.
const ease = cubicBezier(0.85, 0, 0.15, 1);
const arc = (p) => {
  const edge = 110 - p * 140; // chord goes from below the screen (110) to above it (-30)
  return `M 0 ${edge} Q 50 ${edge + 25} 100 ${edge} L 100 110 L 0 110 Z`;
};

export function IntroReveal({ steps, tagline, corners, greetingHold = 340, revealDuration = 1100 }) {
  const [phase, setPhase] = useState('intro'); // intro -> reveal -> leaving
  const [index, setIndex] = useState(0);
  const pathRef = useRef(null);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setPhase('leaving');
    window.setTimeout(intro.done, 220);
  }, []);

  const holdFor = (i) => steps[i].hold ?? greetingHold;

  // Step cycle.
  useEffect(() => {
    if (phase !== 'intro') return undefined;
    const last = index >= steps.length - 1;
    const t = window.setTimeout(() => (last ? setPhase('reveal') : setIndex((i) => i + 1)), holdFor(index) + (last ? 120 : 0));
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, steps]);

  // Curtain: drive the arc path from a single 0 -> 1 progress.
  useEffect(() => {
    if (phase !== 'reveal') return undefined;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / revealDuration);
      pathRef.current?.setAttribute('d', arc(ease(p)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, revealDuration, finish]);

  // Esc skips; the page cannot scroll underneath.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && finish();
    window.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [finish]);

  const total = steps.reduce((sum, st) => sum + (st.hold ?? greetingHold), 0) + 120 + revealDuration;
  const step = steps[index];
  const isBrand = index === steps.length - 1;

  return (
    <div className={`fixed inset-0 z-[100] overflow-hidden bg-accent text-text ${phase === 'leaving' ? 'intro-leave' : ''}`} data-intro>
      <p className="sr-only" role="status">
        Welcome to Invent Fine Art
      </p>

      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 md:px-8 pt-5 md:pt-6 font-body text-[11px] font-semibold uppercase tracking-[0.16em]" aria-hidden="true">
        <span>{corners[0]}</span>
        <span>{corners[1]}</span>
      </div>

      {/* Museum-label composition: the word, a pedestal rule, then a small caption */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center" aria-hidden="true">
        {phase === 'intro' && (
          <div key={index} className="intro-word flex flex-col items-center select-none">
            <span className={`font-display font-normal tracking-tight ${isBrand ? 'text-5xl sm:text-7xl md:text-8xl' : 'text-6xl sm:text-7xl md:text-9xl'}`}>{step.word}</span>
            <span className="mt-5 md:mt-7 block h-px w-16 md:w-24 bg-text/70" />
            <span className="mt-4 font-body text-[11px] md:text-xs font-semibold uppercase tracking-[0.18em]">
              {String(index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')} · {step.caption}
            </span>
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 px-5 md:px-8 pb-5 md:pb-6" aria-hidden="true">
        <span className="hidden sm:block font-body text-[11px] uppercase tracking-[0.16em]">{tagline}</span>
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-3 right-3 md:bottom-5 md:right-6 z-10 min-h-[44px] px-4 font-body text-[11px] font-semibold uppercase tracking-[0.16em] underline underline-offset-4 cursor-pointer"
      >
        Skip intro
      </button>

      <span className="intro-progress absolute bottom-0 left-0 h-[2px] bg-text/60" style={{ animationDuration: `${total}ms` }} aria-hidden="true" />

      {/* Rising curved curtain in the page background colour */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path ref={pathRef} d={arc(0)} className="fill-bg" />
      </svg>
    </div>
  );
}

export default IntroReveal;
