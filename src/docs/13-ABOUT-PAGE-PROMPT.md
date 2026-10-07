# 13 — About Page Enhancement Prompt (with dedicated Awards section)

Standalone prompt: paste everything under "PROMPT" into Claude Code, run from `frontend/`.
Context: the current `/about` page (`src/pages/About.jsx`) is a one-paragraph profile + disciplines list + 5-step process + 4 facility units + CtaBand.

## Gap analysis (what /about is missing today)

| # | Gap | Why it matters | Source of truth |
|---|-----|----------------|-----------------|
| G1 | **No "at a glance" proof strip** (established year, ISO cert, works count, categories, clients count, locations) | Visitors can't judge credibility in 5 seconds | `siteData`, `categoryCounts`, `clients.js` — real numbers only |
| G2 | **Profile is one long quoted paragraph** with "…" truncation; no headline statement, no short story structure | Reads as a pasted blurb, not a studio story | `old data/raw_html/about-us.html` |
| G3 | **No certification block.** ISO 9001:2008 appears only as a caption/badge | A certification deserves its own explained block (what it is, scope) | Original: "ISO 9001 : 2008 Certified" only. No certificate image/number exists |
| G4 | **No awards / recognition section** | Requested by owner | **The original website contains NO awards.** See "Awards: content rules" |
| G5 | **No people/craft imagery** — only one 3/4 photo; facility units are text only (no photos) | About pages convert on seeing real work and makers | Existing assets only (`public/assets/about`, gallery images). No new photography exists |
| G6 | **Facility section is 4 text cells**; no description of what each unit does | Original describes the units' roles ("working in close co-operation") | about-us.html |
| G7 | **No client trust strip** on About | Clients page exists, About doesn't reference it | `data/clients.js` |
| G8 | **No "where to find us" block** (address, hours TBD, phones, email, map link) | Original footer has the address; About has none | `siteData.contact` |
| G9 | **Founding year: owner decision 2026-10-07 — 2009 is the true year** (matches the original About page). The new site says 2008 in several places | Content integrity | Single `foundedYear = 2009` constant; fix every 2008 *year* reference (not "ISO 9001:2008") |
| G10 | **Process step copy is invented** (not in the original) | Content integrity | Keep steps but reword strictly from original sentences ("conceptualizations to the complete execution", "stringently examined", "premium quality packing") |
| G11 | No sub-navigation / anchors for a long page | Easier scanning on mobile | New: sticky in-page links (Story · Craft · Process · Facility · Recognition) |
| G12 | Page has no structured data / meta enrichment | SEO | `AboutPage` + `Organization` JSON-LD |

## Awards: content rules (read first)

1. The original site mentions **no awards**. **Owner decision 2026-10-07: ship MOCK awards for now** so the section can be designed and reviewed. They are placeholders and must never look like verified facts to a reviewer of the code, even though visitors will see them until replaced.
2. Mock entries live **only** in `src/data/awards.js`, every object has `mock: true`, and the file header comment says: "PLACEHOLDER DATA — replace with real awards before launch." Use generic, obviously fictional text: issuer `"Sample Awarding Body"`, titles like `"Excellence in Architectural Art (sample)"`. **Never use real organisations, real award names, real people or real rankings.** 3 entries, years 2023 / 2021 / 2019.
3. A single `SHOW_MOCK_AWARDS` boolean in `awards.js` (default `true`) controls whether `mock: true` entries render. Setting it to `false` leaves the honest empty state (headline "Recognition" + "Our credentials today: ISO 9001:2008 certification. Awards will be listed here as they are confirmed.").
4. ISO 9001:2008 is a **certification, not an award**: it is rendered in a separate "Certifications" group sourced from `certifications` (real, from the original). No certificate number/body/validity unless supplied.
5. Add a **pre-launch gate**: `npm run build` must print a warning (script `scripts/check-mock-data.mjs`, wired into `prebuild`) if any `mock: true` entry is rendered, so mock content cannot ship silently. Do not fail the build — warn loudly.
6. Future real award object: `{ id, title, issuer, year, category, image?, description?, link? }` (no `mock` key).
7. Decision D12 in the README tracks replacing the mock awards with the client's real list.

## PROMPT

You are working in `frontend/` of the Invent Fine Art site (React 19, Vite 8, Tailwind CSS 4.3, React Router). Read `src/docs/09-BUILD-PROMPT.md` (design rules), `10-Design-Rules-and-Audit.md`, `src/pages/About.jsx`, `src/data/site.js` (`about`), `src/components/PageHeader.jsx`, `SmartImage.jsx`, `CtaBand.jsx`, `src/hooks/useReveal.js`, and the **original** `../old data/raw_html/about-us.html` first. Never write to `old data/`. Do not commit or push unless asked.

### Goal
Turn `/about` from a thin profile page into a credible studio story page, and add a dedicated **Awards & Recognition** section. Use only facts present in the original website or the codebase's real data — **except the awards section, which ships with flagged MOCK data by owner decision** (see rules above). Founding year is **2009**.

### Page structure (top to bottom)
1. **PageHeader** — keep; title "Master craftsmen & art installers"; intro keeps the ISO line.
2. **At-a-glance strip** (G1): 4–5 cells in a hairline-divided row (stacks 2×2 on mobile): *Established* (**2009**, from the single `foundedYear` constant), *ISO 9001:2008 certified*, *Works in gallery* (`totalWorksCount`), *Art categories* (6), *Clients listed* (count from `clients.js`). No count-up animation (banned).
3. **Studio story** (G2) — two-column: the existing 3/4 `SmartImage` + a short pull-statement (one sentence from the original, e.g. "We provide start to end solutions from conceptualizations to the complete execution.") followed by 2–3 short paragraphs rewritten in clean English from the original (fix spacing/grammar; keep meaning; no new claims). Keep the disciplines list, but as a two-column list on `md+`.
4. **Craft & materials strip** (G5) — a horizontal band of 4–6 real images from existing gallery assets (sculptures, murals, GRC, fountains) with captions = category name only, each linking to its `/gallery/...` page. Uses `SmartImage`, art-directed crops, no new image generation.
5. **Process** (G10) — keep the 5 steps; rewrite descriptions only from original phrases. Keep the horizontal snap scroller on mobile.
6. **Facility** (G6) — the 4 units, each with one line from the original context (manufacturing; warehousing & packaging; quality control; research & development; "working in close co-operation… hassle-free working environment"). Add a note line "Delivered in premium quality packing." Text-only is acceptable; do not add photos that don't depict the facility.
7. **Certifications & Awards** (the new dedicated section; `id="recognition"`, `aria-label="Awards and recognition"`):
   - Left: eyebrow "Recognition", H2 "Certifications & awards".
   - **Certifications group:** ISO 9001:2008 card — name, "Quality Management System", "Certified company" (as in original). No certificate number/body/validity unless supplied in data; if `certificate.image` is provided, show it with a lightbox-less enlarged view (simple `<dialog>` or link to the image).
   - **Awards group:** renders `awards` (mock entries while `SHOW_MOCK_AWARDS` is true) from `src/data/awards.js`. Cards: year (large display numeral), title, issuer, optional category, optional description, optional image, optional link. Layout: 3-col ≥ lg, 2-col md, 1-col mobile; hairline borders, no shadows; `useReveal`. Mock cards show **no** trophy photos (use a typographic card only — no stock/fake imagery).
   - **Empty state** (when no entries render): per rule 3.
   - Heading level order must stay h1 → h2 → h3.
8. **Clients trust strip** (G7) — reuse the existing client marquee/logo list component if one exists (otherwise a simple logo row from `clients.js`) with a link "See all clients" → `/clients`. Respect reduced motion.
9. **Visit / contact block** (G8) — address (No. 14, Jay Bharat Zip Sangh, Vadar Pada, Kandivali East, Mumbai 400101), phones, email — read from `siteData.contact` (never hard-code); buttons: Call, WhatsApp, Email, "Get directions" (plain link to Google Maps search — no iframe, no cookies). Opening hours: **omit** (not in the original).
10. **CtaBand** — keep.

Add a **sticky in-page sub-nav** (G11) under the header on `md+`: Story · Craft · Process · Facility · Recognition. Smooth scroll respects reduced motion; each link is a real `<a href="#id">`; highlight current section with IntersectionObserver (no scroll listeners). Hidden on mobile (single-column page is short enough) — or a horizontally scrollable text row if you judge it needed.

### Data & files
- `src/data/site.js` → extend `about` (stats, story paragraphs, craft strip entries, facility descriptions). Add `foundedYear = 2009` and replace every 2008 **year** reference (hero eyebrow/stats, intro caption, About badge/profile, chatbot knowledge, docs 01/02/06, `chatbot/SOURCES.md`, JSON-LD `foundingDate`). **Keep "ISO 9001:2008"** — that is the standard's edition, not a year of founding. Run `grep -rn 2008 src chatbot` and justify each remaining hit. Rebuild `api/_lib/knowledge.generated.js` (`npm run knowledge`).
- New `src/data/awards.js` (`SHOW_MOCK_AWARDS`, `awards` with 3 `mock: true` entries, `certifications`) and `scripts/check-mock-data.mjs` (prebuild warning).
- New small components only if reused or complex: `AboutStatsStrip`, `AwardsSection` (+ `AwardCard`). Keep them in `src/components/`. Page composes them.
- `usePageMeta` for the page already exists — update the description to mention ISO 9001:2008 and Kandivali East (≤155 chars). Add `AboutPage` JSON-LD (name, url, `about` → Organization, address) alongside existing JSON-LD handling; add `hasCredential` only for the ISO certification.
- Update `public/sitemap.xml` only if the URL set changes (it shouldn't).

### Design rules (binding, from doc 10)
No shadows; hairline borders; pill radius only on CTA buttons; hover = colour change only; no translate-lift, bounce, parallax, count-up; tokens only (no arbitrary hex, no default Tailwind colours); `prefers-reduced-motion` respected; `SmartImage` for every photo (explicit aspect ratio → no layout shift); no `console.*`, TODO, lorem. Accent text on `bg` must pass AA (use `text-accent-light` where needed). Keep section rhythm consistent with the other pages (`py-20 md:py-28`, `max-w-[1280px]`).

### Responsive & a11y
360 / 768 / 1024 / 1440 widths, no horizontal page scroll (the process scroller scrolls internally). Landmarks via `<section aria-label>`; skip-friendly headings; all links ≥ 44px hit area; focus-visible visible; images with meaningful `alt` (decorative → `alt=""`).

### Acceptance / verification (run and report results)
1. `npm run lint` and `npm run build` pass; run the doc-10 audit greps — all empty.
2. Puppeteer/Chrome screenshots of `/about` at 360, 768, 1024, 1440 (view them); check no horizontal overflow and no console errors.
3. Lighthouse mobile on `/about` (preview build): Accessibility, Best Practices, SEO = 100; Performance reported honestly; CLS < 0.05.
4. Awards section: verify the 3 mock cards at all widths; set `SHOW_MOCK_AWARDS=false` temporarily and verify the empty state renders; restore `true`; confirm the prebuild warning prints.
5. Content-integrity check: every sentence on the page traces to `about-us.html` or real site data. List anything you could not source.
6. Update `src/docs/README.md` (add doc 13 to the index, a change-log row, and open decision D12 for awards + the 2008/2009 year) and `chatbot/SOURCES.md` if any chatbot-visible fact changed.

### Final report must contain
What changed per section; every 2008→2009 edit; a clear note that awards are MOCK and must be replaced; facts still needing owner confirmation (real awards list, certificate scan/number/body, opening hours, team/factory photos); measured numbers; and anything intentionally not done.
