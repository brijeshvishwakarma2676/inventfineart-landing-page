# 14 — Motion, Transitions & Animation System Plan

**Document:** `14-MOTION-AND-ANIMATIONS-PLAN.md`  
**Status:** Verified against the codebase on 2026-10-07 and amended (see §0). Implemented 2026-10-07 (steps 1–5).  
**Target Date:** 2026-10-07  
**Scope:** Whole-site motion design across scroll reveals, page loads, open/close interactions, hover states, and micro-animations.

---

## 0. Verification report (what was checked, what was wrong, what was added)

Checked against `base.css`, `tokens.css`, `useReveal.js`, `RootLayout.jsx`, `Nav.jsx`, `Lightbox.jsx`, `FaqList.jsx`, `ChatWindow`/`index.jsx`, `ClientMarquee`, `About.jsx`, `awards.js` and docs 09/10.

**Errors / conflicts in the original plan (all corrected below)**

| # | Finding | Fix applied |
|---|---------|-------------|
| V1 | §2.1 defines tokens in a `:root` block. Doc 10 rule: tokens live **only** in the `@theme` block of `tokens.css`; no duplicate `:root` definitions. `--ease-custom` already exists; `--ease-in-out` is unused | §2.1 rewritten: add duration/stagger tokens to `@theme`, keep one easing |
| V2 | Page fade `to { transform: translateY(0) }` with `both` leaves a permanent `transform` on the page wrapper. A non-`none` transform makes the wrapper the containing block for any `position: fixed` descendant (sticky/fixed sub-nav, in-page overlays), which silently breaks them | §3 Pillar 2: `to { transform: none }`, fill-mode `backwards`, no `will-change` left behind |
| V3 | PageHeader "metadata pill" — pills are banned except CTA buttons / slider dots / WhatsApp | Removed |
| V4 | About "Process steps (4 stages)" — there are **5** steps (`site.js`); Facility 4 units ✔, Awards 4 mock cards ✔, Stats 5 ✔ | Counts corrected |
| V5 | "Replaces sudden pop-in" for the mobile menu and "hamburger-to-cross morph" — the morph **already exists** (`Nav.jsx` bars rotate/fade). The menu is mounted conditionally (`isMenuOpen &&`), so there is **no exit animation possible** without keeping it mounted while it plays | Morph marked done; Pillar 3 now specifies a mount-for-exit pattern (§3.3) |
| V6 | FAQ uses native `<details>`; `grid-template-rows: 0fr→1fr` cannot animate closed `<details>` content (not rendered) | §3.3: use `::details-content` + `interpolate-size` (Chromium) as progressive enhancement; Safari/Firefox open instantly (acceptable); icon rotate already exists |
| V7 | §4.2 forbids animating `height`/geometry, yet the plan (FAQ accordion) and the existing desktop nav strip (`transition-[height,opacity]`) do. Self-contradiction | §4.2 now lists the **only allowed exceptions**: user-triggered (click) disclosure widgets, never scroll/hover-driven |
| V8 | Lightbox "frosted blur entrance … opacity over 240ms" — animating `backdrop-filter` is not compositor-only and is expensive on mobile | Keep a **static** `backdrop-blur`, animate only the layer's `opacity` |
| V9 | ChatWindow close animation: keyframes `chatWindowDesktopClose/MobileClose` **do not exist** and the window unmounts the instant `isOpen` flips (`index.jsx`). Plan didn't say how to delay unmount, nor how it interacts with the new focus-return effect | §3.3 spec: `closing` state, unmount on `animationend`, focus return after unmount |
| V10 | "Route Progress Bar … upgrade" — already implemented (`route-bar`, `useNavigation`) | Marked existing; no work |
| V11 | Marquee "60s linear + hover pause" — already implemented (also pauses on `:focus-within`) | Marked existing; only add off-screen pause (§Pillar 5) |
| V12 | `.reveal` hides content until an IntersectionObserver fires (one observer per `useReveal` call; only 2 pages attach it to a section). The plan's stagger needs a ref **per section**, and a parent `.reveal` plus child `.reveal-child` would double-animate | §3 Pillar 1 rewritten (single mechanism, no nesting) |
| V13 | Reveal on above-the-fold content hurts LCP (Hero, `h1`, PageHeader) | Rule added: never reveal the LCP element; PageHeader entrance ≤ 400 ms total, transform+opacity only |
| V14 | Reduced-motion section says "transforms default to none" but the existing global rule only collapses durations | Explicit `.reveal-stagger > *` reset added (§4.1) |
| V15 | No handling of touch devices (hover polish fires on tap), Save-Data / slow connections, tab restore (bfcache) | New §3 Pillar 5 + §4.3 |
| V16 | No measurable acceptance criteria (CLS, long tasks, reduced-motion emulation) | New §5b test matrix |

---

## 1. Vision & Architectural Aesthetic

Invent Fine Art is a high-end architectural artwork, stone carving, and monumental metalcraft studio established in 2009. The digital motion design must evoke a **luxury fine art monograph or museum atelier**:
- **Calm, deliberate, and weight-bearing**: Motion should feel like physical materials settling into place (bronze, stone, crystal), never frantic or bouncy.
- **Hardware-accelerated performance**: Strictly animate `transform`, `opacity`, and `filter`. No layout shifts (CLS = 0) and zero jank.
- **Strict adherence to design audit rules** (from `10-Design-Rules-and-Audit.md`):
  - No drop shadows or box shadows.
  - No translation lift on hover (`hover:-translate-y-*` banned).
  - No bounce, ping, pulse, or parallax.
  - Hover zoom capped at `scale-[1.02]`.
  - Palette locked to design tokens (`accent`, `accent-2`, `accent-light`, `line`, `bg`, `bg-raised`).
  - Total `prefers-reduced-motion` compliance across 100% of animations.

---

## 2. Core Motion Design System

### 2.1 Easing & timing tokens

Define once, in the `@theme` block of `src/styles/tokens.css` (no `:root` copy). `--ease-custom` already exists — keep it as the single easing curve.

```css
@theme {
  --ease-custom: cubic-bezier(0.2, 0.7, 0.2, 1); /* existing */
  --duration-fast: 200ms;    /* micro-interactions, icons */
  --duration-base: 300ms;    /* disclosure, drawer, border/colour */
  --duration-slow: 500ms;    /* lightbox image, image scale */
  --duration-reveal: 650ms;  /* scroll entrances */
  --stagger-step: 60ms;      /* delay between cascading children */
}
```

Existing hard-coded durations (`600ms` in `.reveal`, `260ms` page fade, `240/280ms` chat, `300ms` nav) are migrated to these tokens in Step 1 so there is one source.

---

## 3. Five-Pillar Implementation Architecture

### Pillar 1: Scroll-driven entrance & stagger pipeline
*Upgrades `src/hooks/useReveal.js` and `src/styles/base.css`.*

1. **Current**: `useReveal()` adds `.reveal` (opacity 0, `translateY(20px)`) to one element and `.is-revealed` once it is 12 % visible. Children appear together.
2. **One mechanism, no nesting**: extend the hook — `useReveal({ stagger: true })` adds `.reveal-stagger` instead of `.reveal`. The container itself is **not** faded; its direct children are:
   ```css
   .reveal-stagger > * { opacity: 0; transform: translateY(14px);
     transition: opacity var(--duration-reveal) var(--ease-custom), transform var(--duration-reveal) var(--ease-custom);
     transition-delay: calc(var(--stagger-i, 0) * var(--stagger-step)); }
   .reveal-stagger.is-revealed > * { opacity: 1; transform: none; }
   /* zero-config order for up to 8 children */
   .reveal-stagger > :nth-child(1){--stagger-i:0} … .reveal-stagger > :nth-child(8){--stagger-i:7}
   .reveal-stagger > :nth-child(n+9){--stagger-i:8}
   ```
   Grids that need per-card order set `style={{'--stagger-i': i}}` (cap the delay at `8 × 60 = 480 ms` so long lists never feel slow).
3. **One ref per section.** Pages that have several sections call the hook once per section (or the hook accepts a list). Do **not** wrap the same element in both `.reveal` and `.reveal-stagger`.
4. **Share the observer**: one module-level `IntersectionObserver` (threshold 0.12, rootMargin `0 0 -40px 0`) used by every hook call instead of one observer per call.
5. **Never reveal above-the-fold / LCP content**: Hero, page `h1` and PageHeader do not use `.reveal*` (they use the load animation in Pillar 2).
6. **Targets** (counts verified): About — stats strip (5), craft cards (6), process steps (**5**), facility units (4), recognition (ISO + 4 mock awards); Services — service blocks; Clients — client groups/logo cells; Gallery hub — category cards; Home — intro quote, featured works, FAQ teaser.

---

### Pillar 2: Route loads & page transitions
*Upgrades `RootLayout.jsx`, `PageHeader.jsx`, `base.css`.*

1. **Page fade → editorial rise** (replaces the current opacity-only `pageFade`):
   ```css
   @keyframes pageFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
   .page-fade { animation: pageFade var(--duration-base) var(--ease-custom) backwards; }
   ```
   `to` must be `transform: none` and fill-mode `backwards` (not `both`) so no transform remains on the wrapper afterwards — a lingering transform would re-parent `position: fixed` children (V2).
2. **PageHeader**: breadcrumb static; `h1` rises 12 px → 0 (`--duration-slow`); intro paragraph follows after 80 ms. Total ≤ 400 ms; opacity+transform only; **no pill/metadata chip**.
3. **Route progress bar** (`.route-bar`) — already implemented; no work.
4. **Skip the fade** on the very first paint when the session intro is playing (avoids animating under the overlay) and on back/forward restores (`pageshow` with `persisted`).

---

### Pillar 3: Open & close dynamics
*Upgrades `Nav.jsx`, `Lightbox.jsx`, `FaqList.jsx`, `index.jsx` / `ChatWindow.jsx`.*

#### 3.3 Mount-for-exit pattern (shared)
Components that render conditionally cannot play an exit animation. Use one tiny hook, `usePresence(isOpen, exitMs)` → `{ mounted, state: 'open' | 'closing' }`: stays mounted for the exit duration (or until `animationend`), sets `data-state="closing"` for CSS, and under reduced motion unmounts immediately. All overlays below use it.

1. **Mobile menu** (`Nav.jsx`): hamburger→cross morph **already exists**. Add: enter = fade + `translateY(-8px)→0` (`--duration-base`); exit = reverse (200 ms) via `usePresence`; links stagger at 40 ms (`--stagger-i`). While `closing`, the `[aria-label="Site navigation"]` node still exists — the chat launcher's menu watcher must treat `data-state="closing"` as closed.
2. **Lightbox** (`Lightbox.jsx`, already portaled): backdrop keeps a **static** `backdrop-blur`; animate only the layer's `opacity` (0→1, 240 ms) — never animate `backdrop-filter` (V8). Image frame: `scale(0.98)→1` + opacity. Exit mirrors it via `usePresence`. Prev/next: crossfade between two stacked images (no layout change); the existing blur-up (`transition-[filter]`) is kept.
3. **FAQ** (`FaqList.jsx`, native `<details>`): the `+` rotate (45°) **already exists**. Add height animation as progressive enhancement only:
   ```css
   details { interpolate-size: allow-keywords; }
   details::details-content { block-size: 0; opacity: 0; overflow: hidden;
     transition: block-size var(--duration-base) var(--ease-custom), opacity var(--duration-base) var(--ease-custom), content-visibility var(--duration-base) allow-discrete; }
   details[open]::details-content { block-size: auto; opacity: 1; }
   ```
   Browsers without `::details-content` (Safari/Firefox at time of writing) open instantly — acceptable, nothing breaks. Keep native `<details>` (keyboard + no-JS). This is one of the two allowed geometry-animation exceptions (§4.2).
4. **Chat window**: add `chatWindowDesktopClose` (200 ms) / `chatWindowMobileClose` keyframes. In `index.jsx` introduce `closing` state: `handleClose` sets it; the window unmounts on `animationend` (fallback timeout 300 ms; instant under reduced motion). The focus-return-to-launcher effect must run **after** the unmount, not when `isOpen` flips.

---

### Pillar 4: Micro-Interactions & Hover Polish

1. **Interactive Cards (Awards, Craft Mediums, Services, Gallery)**:
   - Border transition: `border-line` to `border-accent-2/60` (`duration-300`).
   - Artwork image micro-scale: strictly capped at `scale-[1.02]` inside `overflow-hidden` containers.
2. **Text Links & Nav Items**:
   - Active and hover indicators: horizontal expansion from left origin (`after:scale-x-0 group-hover:after:scale-x-100 duration-300`).
3. **Interactive Buttons**:
   - Smooth background transitions: `bg-accent` → `hover:bg-accent-hover` with matching border transitions.
4. **Client trust marquee** — 60 s linear loop, hover/focus pause and reduced-motion static wrap **already exist**; no work except the off-screen pause in Pillar 5.
5. **Gate hover polish to real hover devices**: wrap card/link hover effects in `@media (hover: hover)` (or Tailwind `hover:` is already gated in v4 — verify) so a tap on touch does not leave a stuck hover state.
6. **Press state**: buttons get `active:` colour step (no scale, no translate).
7. **Focus**: `:focus-visible` outline appears instantly (no transition); never animate it away.

### Pillar 5: Additions found during verification
1. **Marquee off-screen pause** — IntersectionObserver sets `animation-play-state: paused` when the marquee is not visible (saves CPU on long pages).
2. **AboutSubNav active indicator** — slide the 1.5 px underline between items with `transform: translateX()` + `scaleX()` (no width animation); section tracking stays IntersectionObserver-based.
3. **Form feedback** (`ContactForm`, `NewsletterForm`): error/success messages fade in (`--duration-fast`); invalid field border colour transitions; submit button shows disabled state — no shake/bounce.
4. **SmartImage**: keep shimmer → fade-in; ensure the fade uses `--duration-slow` and is skipped for images already in cache (avoid a flash on revisit).
5. **Anchor scrolling**: `scroll-padding-top: var(--header-h)` (+ sub-nav height on About) so smooth scroll lands below the sticky bars.
6. **Existing motion is out of scope but must not regress**: hero slideshow crossfade, session intro, CtaBand marquee (framer-motion, lazy), 3D gallery, cookie notice, floating WhatsApp, chat message/typing animations.

---

---

## 4. Accessibility & Performance Guardrails

### 4.1 Strict `prefers-reduced-motion` Standard

Every single animation and transition must respect the user's OS accessibility settings. Under `prefers-reduced-motion: reduce`:
- All animation durations collapse to `0.001ms`.
- All transitions collapse to `0.001ms`.
- Transforms default to `none` (no translations, no scaling).
- Accordions and modals open instantly without motion.
- Marquees pause immediately and wrap statically.
- `.reveal-stagger > *`, `.page-fade`, overlay enter/exit keyframes and the nav-link stagger are reset to final state (`opacity: 1; transform: none; animation: none`); `usePresence` unmounts instantly.

### 4.2 GPU Compositing Rules

- Only properties handled by the browser's compositor thread are animated (`transform`, `opacity`, `filter`).
- Geometry properties (`width`, `height`, `margin`, `padding`, `top`, `left`) are **never** animated on scroll or hover.
- **Allowed exceptions (user-triggered click only, contained, one at a time):** the FAQ `<details>` open/close and the existing desktop nav strip. Nothing else.
- `backdrop-filter` and `box-shadow` are never animated; `will-change` is not left set after an animation ends; no more than ~12 elements animate at once (cap stagger index at 8).
- Preserves 0 Cumulative Layout Shift (CLS = 0) and smooth 60fps/120fps scrolling on mobile and desktop devices.

---

### 4.3 Slow / low-power devices
`isSlowConnection()` (`utils/network.js`, includes Save-Data) → reveal/stagger/page-rise are replaced by a plain 150 ms opacity fade with no delays. Keeps the site calm on slow networks and avoids animation work competing with image loads.

## 5. Verification & Audit Commands

Run from `frontend/` to confirm compliance:

```bash
# 1. Verify no banned lift hovers, bounce, spin, or pulse
grep -rnE "hover:-?translate-y|animate-(bounce|spin|pulse|ping)|parallax" src --include=*.jsx --include=*.css

# 2. Verify no oversized scales (must be <= 1.02)
grep -rnE "scale-(105|110|125|150)|hover:scale-\[?1\.0[3-9]" src --include=*.jsx

# 3. Verify no box-shadows or drop-shadows
grep -rnE "shadow-|drop-shadow|box-shadow" src --include=*.jsx --include=*.css

# 4. Lingering transforms / tokens duplicated outside @theme
grep -rnE "animation:.* both" src/styles/base.css | grep -i "pageFade"   # must print nothing (use 'backwards')
grep -n "^:root" src/styles/tokens.css                                    # only non-token values (container, header-h)
# 5. No geometry animation outside the allowed exceptions
grep -rnE "transition-\[(width|height|margin|padding|top|left)" src --include=*.jsx
# 6. Lint and production build
npm run lint && npm run build
```

---

## 5b. Verification matrix (run after implementation; report numbers)

| Check | Method | Pass |
|-------|--------|------|
| Reduced motion | Puppeteer `emulateMediaFeatures prefers-reduced-motion: reduce`; every route: no element with `opacity<1`/transform after 100 ms; overlays open/close instantly | 0 violations |
| CLS | Lighthouse + PerformanceObserver on all 13 routes incl. FAQ open/close | < 0.05 (interaction-driven shifts excluded) |
| LCP not regressed | Lighthouse mobile before/after on Home, About, a category page | ≤ +100 ms vs baseline |
| Long tasks | trace during scroll through About (stagger) | no task > 50 ms from animation code |
| Fixed-position integrity | Lightbox, chat window, cookie notice, sub-nav render viewport-relative after a route change | pass (guards V2) |
| Exit animations | menu, lightbox, chat: closes fully, focus returns correctly (launcher / menu button / thumbnail) | pass |
| Touch | emulated mobile: no stuck hover after tap | pass |
| Slow connection | Save-Data emulation: simple fades only | pass |
| Back/forward | no page-rise replay on bfcache restore | pass |

## 6. Implementation Rollout Sequence

| Step | Milestone | Files |
|------|-----------|-------|
| **1** | Tokens + stagger engine + shared observer + reduced-motion resets + Save-Data fallback | `styles/tokens.css`, `styles/base.css`, `hooks/useReveal.js` |
| **2** | `usePresence` hook; route page-rise (V2-safe); PageHeader entrance | `hooks/usePresence.js`, `layouts/RootLayout.jsx`, `components/PageHeader.jsx`, `base.css` |
| **3** | Overlays: mobile menu (+ link stagger), lightbox, chat close, FAQ `::details-content` | `Nav.jsx`, `Lightbox.jsx`, `FaqList.jsx`, `chatbot/index.jsx`, `chatbot/components/ChatWindow.jsx`, `base.css`; update the chat launcher's menu watcher |
| **4** | Section/grid stagger adoption (one ref per section) | `pages/About.jsx`, `AboutStatsStrip.jsx`, `AwardsSection.jsx`, `AboutVisitBlock.jsx`, `ServiceDetail.jsx`/`pages/Services.jsx`, `pages/Clients.jsx`, `pages/GalleryHub.jsx`, `pages/Home.jsx` sections, `FeaturedWorks.jsx`, `FaqTeaser.jsx` |
| **5** | Additions: marquee off-screen pause, sub-nav indicator, form feedback, anchor offsets, hover gating | `ClientMarquee.jsx`, `AboutSubNav.jsx`, `ContactForm.jsx`, `NewsletterForm.jsx`, `base.css` |
| **6** | QA: §5 audit commands + §5b matrix, screenshots at 360/768/1024/1440, update `README.md` change log | — |
