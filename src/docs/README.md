# Invent Fine Art — Project Documentation & Tracker

Rebuild of https://www.inventfineart.com/ as a modern **multi-page** site (13 routes + 404; React + Vite + Tailwind CSS 4.3 + React Router).
Source content (read-only archive): `../../../old data/`
Code: `frontend/` (Vite + React 19)

## Document Index

| # | Document | Purpose | Status |
|---|----------|---------|--------|
| 01 | [SOW](01-SOW.md) | Scope, deliverables, timeline, budget, exclusions | Draft – needs client sign-off |
| 02 | [BRD](02-BRD.md) | Goals, audience, functional requirements, contact form | Draft |
| 03 | [IA / Sitemap](03-IA-Sitemap.md) | Section map and navigation flow | Draft |
| 04 | [Wireframes](04-Wireframes.md) | Low-fi layouts, desktop + mobile | Draft |
| 05 | [UI/UX Mockups](05-UI-UX-Mockups.md) + [HTML preview](05-mockup-preview.html) | Design tokens, components, visual spec | Draft |
| 06 | [Content Inventory](06-Content-Inventory.md) | All copy, assets, fonts, counts, gaps | Draft |
| 07 | [TRD](07-TRD.md) | Stack, hosting, domain, SEO, performance | Draft |
| 08 | [Folder Structure](08-Folder-Structure.md) | Directory layout + conventions | Done |
| 09 | [Master Build Prompt](09-BUILD-PROMPT.md) | Standalone prompt to build the whole site | Ready |
| 10 | [Design Rules & Audit](10-Design-Rules-and-Audit.md) | Root causes, banned patterns, audit commands | Ready |
| 11 | [Multi-page Migration Prompt](11-MULTIPAGE-MIGRATION-PROMPT.md) | Prompt to migrate the existing single-page build to 13 routes | Ready |

## Build Progress Tracker

| Phase | Work | Status |
|-------|------|--------|
| 0 | Documentation (this folder), revised for multi-page | ✅ Done |
| 1 | Single-page build (assets, tokens, components, SEO files) | ✅ Superseded — assets/data/components reused |
| M1 | Router, RootLayout, tokens cleanup, design-rule fixes (doc 10), Nav/Footer, Home | ✅ Done |
| M2 | Gallery hub + `GalleryCategory` (6 routes) + Lightbox | ✅ Done |
| M3 | About, Services, Clients, Contact, 404 | ✅ Done |
| M4 | Per-page SEO (`usePageMeta`, sitemap 13 URLs), `vercel.json` (redirects, SPA fallback, headers), a11y | ✅ Done — `vercel.json` validated as JSON only; not yet exercised on Vercel |
| M5 | Visual QA (360/768/1024/1440) on all routes, audit, Lighthouse | ✅ Done locally — see change log for measured numbers and known gaps |
| M6 | Deploy + domain (Vercel project, DNS) | ⬜ Not started — needs Vercel/DNS access |

## Open Decisions

| # | Question | Default if no answer | Decided |
|---|----------|----------------------|---------|
| D1 | Dark or light theme | Dark (artwork stands out) | ⬜ |
| D2 | Contact form delivery | Prefilled WhatsApp/email (no backend) | ⬜ |
| D3 | Artwork captions | Category + number only | ⬜ |
| D4 | Budget & final deadline | TBD by client | ⬜ |
| D5 | Hosting + domain registrar access | **Vercel (decided)**; domain registrar/DNS access still needed from client | ✅ host / ⬜ DNS access |
| D6 | Social links (old site: FB/Twitter/Pinterest/G+) | Placeholders (`url: null`) shown disabled in footer; real URLs needed from client; Google+ dropped | ⬜ URLs pending |
| D10 | Newsletter signup | Static, disabled until an endpoint (`footer.newsletter.endpoint`) is chosen | ⬜ service pending |
| D7 | Styling stack | **Tailwind CSS v4.3** (`@tailwindcss/vite`) | ✅ |
| D8 | Single page vs multi-page | **Multi-page, 13 routes + 404** | ✅ |
| D9 | Build-time prerender of all routes (SEO for non-JS crawlers) | Optional; recommended | ⬜ |

## Change Log

| Date | Change |
|------|--------|
| 2026-10-05 | Initial documentation set created from archived site data. |
| 2026-10-05 | **Footer: static newsletter form + social icons** (null placeholders, disabled until real endpoint/URLs). Owner-approved exception to the earlier "no newsletter" rule. |
| 2026-10-05 | **Footer enhanced:** direct-channels row (WhatsApp/Call/Email), 4-column grid with category counts, both addresses + "Get directions", all 3 phones. |
| 2026-10-05 | **FAQ added:** `/faq` (12 Q&A, 3 groups, FAQPage JSON-LD) + 6-question teaser on Home; route 13, nav/footer link, sitemap now 13 URLs. |
| 2026-10-05 | **Multi-page build delivered.** Lint + build pass; doc-10 audit clean (all `rounded-full` hits reviewed: CTA buttons / floating WhatsApp only). Lighthouse mobile (local `vite preview`, simulated throttling): a11y 100, best-practices 100, SEO 100 on all pages tested; Performance varies run to run — Services 96, Gallery hub 96, Contact 91, Home 83–91 (LCP 3.5–4.5 s), category pages 79–87 (LCP 3.9–5.3 s). **Performance ≥90 is not consistently met on Home and category pages** (JS bundle ~107 KB gz incl. react-router, plus thumbnail weight on slow 4G). Options: build-time prerender (D9), smaller thumbnails. |
| 2026-10-05 | Home "Trusted by" kept as two rows scrolling in opposite directions (owner request). Accent darkened to `#b93a25` (+ `--accent-light` for text) after WCAG contrast failure at 4.2:1. |
| 2026-10-05 | D5: hosting = Vercel; `vercel.json` replaces the Netlify/Vercel dual-config plan. |
| 2026-10-05 | **D8 resolved: multi-page (13 routes + 404).** Docs 01–10 revised; added 11-MULTIPAGE-MIGRATION-PROMPT. |
| 2026-10-05 | Tailwind CSS v4.3 adopted (D7); docs 03/04/05/07/08/09 synced; added 10-Design-Rules-and-Audit (root causes, banned patterns, audit); D8 page-structure opened. |
