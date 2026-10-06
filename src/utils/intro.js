// Session-scoped intro: plays on the first load of the site in a tab (sessionStorage is per tab, so a new tab
// or window plays it again; reloads and in-site navigation do not). Skipped for reduced motion.
export const INTRO_STORAGE_KEY = 'ifa-intro-v1';

import { isSlowConnection } from './network';

export function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;
  if (isSlowConnection()) return false; // never make a slow connection wait for an intro
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== 'done';
  } catch {
    return false; // storage blocked: never replay on every load
  }
}

export function markIntroDone() {
  try {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, 'done');
  } catch {
    /* ignore */
  }
}

// Tiny external store so the footer can replay the intro and the layout can react (same pattern as useConsent).
const first = shouldPlayIntro();
let state = { playing: first, ready: !first }; // ready: the first intro has finished (or was skipped)
const listeners = new Set();
const set = (next) => {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
};

export const intro = {
  subscribe: (l) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot: () => state,
  // Called by the footer: back to the top, then play again.
  replay: () => {
    // The site uses CSS smooth scrolling; jump instantly so the page is at the top before the overlay locks scrolling.
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
    set({ playing: true });
  },
  done: () => {
    markIntroDone();
    set({ playing: false, ready: true });
  },
};

// cubic-bezier easing (same as CSS cubic-bezier(x1, y1, x2, y2)).
export function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const dx = sampleX(t) - x;
      if (Math.abs(dx) < 1e-5) return sampleY(t);
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= dx / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (lo < hi) {
      const v = sampleX(t);
      if (Math.abs(v - x) < 1e-5) break;
      if (x > v) lo = t;
      else hi = t;
      t = (hi - lo) / 2 + lo;
      if (hi - lo < 1e-6) break;
    }
    return sampleY(t);
  };
}
