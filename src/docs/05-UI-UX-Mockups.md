# 05 — UI/UX Mockups & Design Spec

Visual preview (a rough static mock of the **Home** page only; other pages follow `04-Wireframes.md`): open [`05-mockup-preview.html`](05-mockup-preview.html) in a browser (uses archived images via relative paths; read-only).

## 1. Design concept
**"Gallery at night."** A dark, editorial multi-page site where the artwork is the light source. Big serif headlines, generous spacing, thin rules, one warm accent. Avoids the generic template look: no card-heavy bootstrap grids; sections have distinct compositions (full-bleed hero, sticky split services, masonry gallery, marquee).

## 2. Colour tokens (Tailwind v4 `@theme` variables in `styles/tokens.css`, defined once)

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#0e0d0c` | page background (warm black) |
| `--bg-raised` | `#171513` | cards, form |
| `--line` | `#2a2622` | hairlines, borders |
| `--text` | `#f1ebe2` | primary text (bone white) |
| `--text-dim` | `#a89f93` | secondary text |
| `--accent` | `#b93a25` | CTA fill (4.8:1 with `--text`; the earlier `#c8402a` was 4.2:1 and failed WCAG AA at 12px) |
| `--accent-light` | `#e2705a` | accent used as text on dark backgrounds (≥4.5:1) |
| `--accent-2` | `#b98a4e` | bronze, small details/labels |
| `--light-card` | `#f4f0ea` | client-logo tiles (logos are JPG on white) |
| `--overlay` | `linear-gradient(rgba(91,48,0,.35), rgba(14,13,12,.85))` | hero image overlay (from legacy brand brown) |

Contrast: `--text` on `--bg` ≈ 16:1; `--text-dim` on `--bg` ≈ 7:1; white on `--accent` ≈ 4.6:1 (large/bold text only for small labels).

## 3. Typography

| Role | Font | Weights | Size (desktop / mobile) |
|------|------|---------|-------------------------|
| Display / H1 | Fraunces (serif) | 300–600 | 88px / 42px, line-height 1.02 |
| H2 | Fraunces | 400 | 56px / 34px |
| H3 | Fraunces | 500 | 28px / 22px |
| Body | Inter | 400, 500 | 17px / 16px, line-height 1.65 |
| Eyebrow / label | Inter | 600, uppercase, +0.14em tracking | 12px |

Fonts are **self-hosted** (`public/fonts/*.woff2`, Latin subset, OFL) via `@font-face` in `styles/base.css` with `font-display: swap` — no third-party font request and no late font swap shifting layout (CLS 0 on the Gallery hub after the change).

## 4. Spacing, shape, motion
- Spacing scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 · 112 · 160.
- Section padding: 112px desktop / 72px mobile.
- Radius: 2px (sharp, editorial) on images; 999px **only** on the few primary/ghost CTA buttons — never on filters, tags or lists.
- Shadows: **none, anywhere** (no `shadow-*` utilities, no box-shadow). Use hairlines and tonal layers. Hover = colour/underline change, not lift+shadow.
- Motion: ease `cubic-bezier(.2,.7,.2,1)`; reveal 600ms fade+translate 24px; hero crossfade 1200ms, 6s interval; marquee 60s linear. All disabled under `prefers-reduced-motion`.

## 5. Components

| Component | Spec |
|-----------|------|
| Button primary | pill, `--accent` fill, bone text, 14px/600 uppercase, hover: lighten only (no lift, no shadow) |
| Button ghost | pill, 1px `--text` border, hover fill |
| Filter tab | plain text row, active = accent colour + underline; no pill, no fill |
| Nav | 72px, transparent → `rgba(14,13,12,.85)` + blur after 40px scroll |
| Gallery tile | image only, hover: scale ≤1.02, small category label + number |
| Service list item | number + title; active: accent number + bone text, others dim |
| Input | bottom-border only, label floats; error = accent red text |
| Lightbox | full-screen `--bg` at 96% opacity, image contain, accent CTA |

## 5b. Page-level design rules (multi-page)
- Each page gets its **own composition** (see `04-Wireframes.md` page table) — no identical hero+cards+CTA stack repeated on every route.
- Inner pages open with a compact `PageHeader` (breadcrumb, display title, one dim intro line, optional count); only Home has a full-viewport hero.
- Route transitions: quiet 200–300ms fade only; no sliding/zoom page transitions.
- Active nav state by route; gallery category sub-nav is plain text links with an accent underline on the current one.

## 6. Screen mockup summaries

| Screen | Key visual |
|--------|-----------|
| Hero | `banner-1…6` crossfade, overlay gradient, huge serif headline, stats strip bottom |
| Intro | Oversized text paragraph on black; three features separated by hairlines |
| Services | Left numbered list, right large image (`media/services/*`) + hairline-separated text lists |
| Gallery hub | Asymmetric editorial grid of 6 category covers with counts |
| Gallery category | Masonry of thumbnails, category sub-nav links, real count, prev/next category |
| About | `about_us.jpg` + ISO badge + process strip |
| Clients | Page: hairline-divided grid of all 30 logos on light tiles · Home: two-row marquee (opposite directions) |
| Contact | Two columns: form / details + map |

## 7. Imagery mapping

| Slot | Source |
|------|--------|
| Hero slides | `slider/banner-1, banner-2, banner-5, banner-6` |
| Final CTA backdrop | `slider/banner3` |
| Intro showcase strip | `homepage/1–5, 7` |
| Services | `services/19, 14, 11, 7, 5, 2, ser` (murals, grills, rockery, fountains, sculpture, facades, planters) |
| About | `about/about_us.jpg` |
| Logo | `branding/logo.png` (check for transparent version; else place on a light tile) |

## 8. Accessibility
- Focus ring: 2px `--accent-2` outline offset 3px.
- Lightbox traps focus, `Esc` closes, `aria-label`s on controls.
- Alt text pattern: `"<Category> artwork <n> by Invent Fine Art"` until real captions exist.
- Marquee pauses on hover/focus; static grid with reduced motion.

## 9. Approval
| Item | Approved by | Date |
|------|-------------|------|
| Palette & typography | | |
| Hero + services concept | | |
| Gallery + lightbox | | |
| Full page | | |
