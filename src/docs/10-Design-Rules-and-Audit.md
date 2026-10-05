# 10 — Design Rules, Root Causes & Pre-Dev Audit

Purpose: stop design-rule violations (shadows, pills everywhere, lift hovers, wrong stack…) from reaching the build. These are caught by **checks run during development**, not discovered afterwards.

## 1. What went wrong in the first build, and why (root causes)

> These are inferred from the docs and the resulting code; they are process gaps, not blame.

| Symptom found in code | Likely root cause | Fix now in docs |
|-----------------------|-------------------|-----------------|
| Tailwind v4.3 used although docs said "plain CSS, no Tailwind" | Stack was never *locked* as a decision; 07-TRD and 09 said "no Tailwind" but nothing made that binding, and the tracker recorded Tailwind only after the fact | **D7: Tailwind CSS v4.3 is the official stack.** 07-TRD, 08, 09 and README updated |
| Design tokens defined twice (`@theme` and `:root`) | 09 said "tokens.css is the only place" but not *how* under Tailwind | 09/08: single `@theme` block, no duplicate `:root` copy |
| `shadow-*` on CTAs, nav, lightbox, floating button | Rule "no shadows" existed only as prose in 09; **05-UI-UX said hover = lift, and the Tailwind idiom for a button is `shadow-md`**; no banned-utility list | Banned list in 09 §Code requirements + audit below; 05 now says "no shadows, hover = colour change" |
| `rounded-full` / pill styling in ~10 files | Older docs (04, 05, 05-preview, 03) still showed **pill filter chips and chip lists** after 09 had removed them; the builder had conflicting sources | 03/04/05/preview synced: text tabs and text lists; pill only on CTA buttons |
| Hero zoom 5%, hover lift, brand-green WhatsApp, `console.error` | Numeric limits and palette rules were not testable; no grep gate | Exact limits + audit commands (below) |
| Dev-only QA script with a machine-specific path left in the repo | Not covered by any rule | 09: no machine-specific absolute paths; dev scripts must be portable or deleted |
| Stale/contradictory docs (160+, count-up, 1.04 hover) | 09 was revised after 03–08 were written, and nothing re-synced them | 160+ → real count; docs synced; **rule: when 09 changes, update 03–08 in the same change** |

**Page structure (single page vs. multiple pages):** the docs (01 SOW, 03 IA, 04 wireframes, 09 prompt) all specified a **single scrolling page**, so the build followed that. The original brief was ambiguous on this point and it was never confirmed in writing, so the mismatch only surfaced after the build. **Resolved in §4 (multi-page).** Lesson: decisions that change page count/scope must be confirmed and recorded before 03/04/09 are written.

## 2. Binding rules (checkable)

1. Stack: React 19 + Vite 8 + **Tailwind CSS 4.3** (`@tailwindcss/vite`). No `tailwind.config.js`.
2. Tokens: one `@theme` block in `src/styles/tokens.css`. Components use token utilities only.
3. **No shadows** of any kind.
4. **Pill radius** only on: primary/ghost CTA buttons, slider dots, the floating WhatsApp button.
5. **No lift/translate hover**, no bounce/spin/pulse/ping, no gradient text, no parallax, no count-up.
6. Hero zoom ≤ `scale-[1.04]`; hover scale ≤ `scale-[1.02]`.
7. **No off-palette colours** (no default Tailwind colours, no arbitrary hex in classes, no brand-green WhatsApp).
8. No `console.*`, no TODO/lorem, no machine-specific absolute paths in committed files.
9. Content integrity: no invented clients/stats/claims/comments such as "verified".
10. `prefers-reduced-motion` respected for every animation.

## 3. Pre-dev / per-phase audit (run from `frontend/`, all must print nothing)

```bash
# shadows
grep -rnE "shadow-|drop-shadow|box-shadow" src --include=*.jsx --include=*.css
# lift / flashy motion
grep -rnE "hover:-?translate-y|animate-(bounce|spin|pulse|ping)|parallax|count-?up" src --include=*.jsx --include=*.css
# oversize scale
grep -rnE "scale-(105|110|125|150)|hover:scale-\[?1\.0[3-9]" src --include=*.jsx
# off-palette / arbitrary hex in classes
grep -rnE "\[#[0-9a-fA-F]{3,8}\]|(bg|text|border)-(red|green|blue|gray|slate|zinc|neutral|stone|emerald)-[0-9]" src --include=*.jsx
# console (src only; CLI scripts in scripts/ may print progress) / TODO / machine paths
grep -rnE "console\.|TODO|FIXME|lorem" src --include=*.jsx --include=*.js
grep -rnE "/home/" src scripts index.html vercel.json
# duplicated token definitions (should list only tokens.css @theme)
grep -rn "^:root" src/styles src/index.css
# review pill usage manually: every hit must be a CTA button, slider dot or floating WhatsApp
grep -rnE "rounded-(full|3xl|2xl|xl)" src --include=*.jsx
```

Then: `npm run lint && npm run build`, and the visual QA loop at 360 / 768 / 1024 / 1440 px (see 09 Quality Bar).

## 4. Decision D8 — page structure: RESOLVED → multi-page
**Multi-page, 13 routes + 404** (Home, About, Services, Gallery hub, 6 gallery category pages, Clients, FAQ, Contact). Recorded 2026-10-05. Docs 01, 02, 03, 04, 05, 06, 07, 08, 09 and README were revised to match; the existing single-page code must be migrated (see `11-MULTIPAGE-MIGRATION-PROMPT.md`).

Extra audit for multi-page (run from `frontend/`):
```bash
# every route in the sitemap exists in routes.jsx and vice-versa
grep -o "<loc>[^<]*</loc>" public/sitemap.xml | wc -l          # expect 13
grep -nE "path[:=]" src/routes.jsx                              # expect the 13 paths + "*"
# no leftover single-page artefacts
grep -rnE "href=\"#(home|intro|services|gallery|about|clients|contact)\"|useScrollSpy|scrollProgress|hashchange|cat=" src --include=*.jsx --include=*.js
# per-page head set everywhere
grep -rLn "usePageMeta" src/pages
```
All three of the last greps must print nothing (the first two print only the expected counts/paths).
