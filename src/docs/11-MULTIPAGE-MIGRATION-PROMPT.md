# 11 — Multi-page Migration Prompt

> **Historical:** this prompt produced the original 12-route build. A 13th route (`/faq`) was added afterwards; see `README.md` change log.
> Give everything below the line to Claude Code, started in the repo root.
> It converts the **existing single-page build** into the **12-route multi-page site** and fixes the design-rule violations found in review. Do not use `09-BUILD-PROMPT.md` to build from scratch for this; use it as the design/content reference.

---

# TASK: Migrate the Invent Fine Art site from single-page to multi-page (12 routes + 404) and fix design-rule violations

The site already exists in `frontend/` (Vite 8, React 19, Tailwind CSS 4.3). **Do not rebuild from scratch.** Reuse the existing components, data files, hooks, assets and generated gallery manifest wherever they fit; restructure and fix what doesn't.

## Read first (in order)
1. `frontend/src/docs/03-IA-Sitemap.md` — routes, flow, prefill rules, redirects (source of truth for structure)
2. `frontend/src/docs/09-BUILD-PROMPT.md` — design, copy, behaviour (source of truth for look and content; see "SITE STRUCTURE — MULTI-PAGE" and "PAGES & BLOCKS")
3. `frontend/src/docs/10-Design-Rules-and-Audit.md` — banned patterns and audit commands
4. `frontend/src/docs/04-Wireframes.md` (page composition table), `08-Folder-Structure.md`, `07-TRD.md`

## Hard rules
- **Never modify anything inside `old data/`.** No git commits or state-changing git commands.
- Keep Tailwind CSS v4.3 (D7). Keep all business facts, copy and asset paths exactly as in the docs.
- No fabricated business info (clients, stats, claims, social URLs). Remove unsupported wording like "Verified" in comments/copy.
- Do not add dependencies other than `react-router` (and a prerender tool only if D9 is chosen; default: not).

## Part A — Migrate to multi-page
1. Add `react-router`. Create `src/routes.jsx` with exactly these routes, pages lazy-loaded, plus `*` → NotFound:
   `/`, `/about`, `/services`, `/gallery`, `/gallery/sculptures`, `/gallery/wall-murals`, `/gallery/water-fountains`, `/gallery/grc-products`, `/gallery/planters`, `/gallery/other`, `/clients`, `/contact`.
   An unknown `/gallery/<slug>` must render 404.
2. Create `src/layouts/RootLayout.jsx`: Nav + `<Outlet/>` + Footer + FloatingWhatsApp. On every navigation scroll to top, move focus to `<main>`, ≤300ms opacity fade (no slide/zoom). `main.jsx` mounts the router; `App.jsx` shrinks to routing glue or is removed.
3. Create `src/pages/`: `Home, About, Services, GalleryHub, GalleryCategory, Clients, Contact, NotFound`. **Pages compose components and read content from `src/data/`.** Each page uses its own composition per `04-Wireframes.md` (Home lean and teaser-based; no duplicated full content; no identical hero+cards+CTA stack on every page).
4. Add `src/data/categories.js` (slug, label, source key into `gallery.js`, cover image, real count, short intro line) and drive `GalleryHub` and `GalleryCategory` from it. One `GalleryCategory` page serves all six routes.
5. Re-split existing components:
   - `Hero`, `Intro` → Home. Add a services-name teaser, a featured-works block and a two-row client marquee (opposite directions) to Home.
   - `Services` → `/services`, with two actions per service: **Enquire** (`/contact?service=<slug>`) and **View related work** (`/gallery/<category>` per the mapping in doc 03).
   - `Gallery` → masonry + load-more inside `GalleryCategory`. **Delete the All-filter / URL-hash filtering logic.** Add the category sub-nav (text links), PageHeader (breadcrumb + title + real count) and the prev/next-category strip.
   - `Lightbox` → on category pages. "Request a quote" navigates to `/contact?service=<slug>&ref=<category>-<nnn>`. Reflect the open image in `?img=<n>` so Back closes it.
   - `About` → `/about`. Clients → `/clients` as a static grid of all 30 logos, plus the two-row marquee on Home. `Contact` → `/contact`, reading `?service=` and `?ref=` with `useSearchParams` (**remove the prop-drilled `selectedService/artworkRef` state from `App`**).
   - `CtaBand` shared where doc 04 says. `Footer` and `Nav` use `Link`/`NavLink` (real routes).
6. Delete single-page artefacts: `useScrollSpy`, scroll-progress bar, anchor `href="#…"` navigation, `hashchange` handling. Create `PageHeader` as a shared component.
7. Per-page head: add `usePageMeta({title, description, path})` (sets `document.title`, meta description, canonical, `og:url`) and call it in **every page**. Titles ≤60 chars, descriptions ≤155. Add `BreadcrumbList` JSON-LD on category pages and keep `LocalBusiness` JSON-LD for Home and Contact.
8. SEO/hosting files: `public/sitemap.xml` with all 12 URLs (no 404); update `robots.txt`. Hosting is **Vercel** (D5): create `frontend/vercel.json` (project root, not `public/`) with (a) permanent `redirects` for the 12 legacy `.html` URLs (table in doc 03 §5), (b) a `rewrites` SPA fallback `/(.*)` → `/index.html`, (c) `headers`: immutable long-cache for `/assets/*`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. Do **not** create a Netlify `_redirects` file. Validate the JSON, and if the Vercel CLI is available run `vercel build` or `vercel dev` locally to check that deep links and one legacy redirect work; otherwise say that this was not tested.
9. Update `src/docs/README.md` tracker and change log honestly when done.

## Part B — Fix the design-rule violations (from review; see doc 10)
1. Remove **all** `shadow-*`/`drop-shadow-*`/box-shadow (Hero CTA, FloatingWhatsApp, Services CTA, Nav, Lightbox, …). Use hairlines/tonal layers.
2. Pills: `rounded-full` only on primary/ghost CTA buttons, slider dots and the floating WhatsApp button. Remove it elsewhere (filters are now route links; service applications/materials are plain hairline-separated text).
3. Remove `hover:-translate-y-*` and other lift effects; hover = colour change. Hero zoom `scale-[1.04]` max; hover scale ≤ `scale-[1.02]`.
4. Remove off-palette colours (`#25d366`, arbitrary hex, default Tailwind palette); use token utilities only.
5. `tokens.css`: single `@theme` source. Remove duplicate colour/font/radius/easing definitions from `:root` (keep only non-token values such as gradients/layout sizes).
6. Remove `console.error` in `Contact.jsx` (show the failure in the UI). Delete or make portable `scripts/run-visual-qa.mjs` (it hardcodes `/home/krushang-oss/.gemini/...` and port 9222); state which you chose.
7. Fix the unsupported "Verified" comment in `src/data/clients.js` and similar.

## Part C — Verify (mandatory; repeat until clean)
1. Run **every audit command** in doc 10 §3 and §4. Each must print nothing (except expected counts/paths and the pill grep, whose hits you review and justify).
2. `npm run lint` and `npm run build` pass. Confirm the build splits per-route chunks (Home must not contain gallery/lightbox code).
3. Run `npm run dev` and **actually inspect all 12 routes + a bad URL** at **1440, 1024, 768 and 360 px**. Fix problems, then re-inspect. Check: nav active states, mobile menu, PageHeader on inner pages, category sub-nav, masonry, load more, lightbox (keys/swipe/focus trap/Back), prefill links, form validation + WhatsApp/mailto handoff, 404, reduced motion, deep-link refresh.
4. Counts: 77 / 35 / 18 / 15 / 4 / 17 = 166 shown correctly on hub and category pages.
5. Lighthouse mobile on at least Home, one category page and Contact (scores + LCP/CLS/INP), or "Not measured".
6. Run the Final Art-Direction Review from doc 09 on every page. Each page must look compositionally different; redesign any that look templated.
7. Confirm `old data/` is untouched.

## Final report (short, honest)
- Part A items 1–9 and Part B items 1–7: what changed (file names) or why unnecessary
- Audit output before/after
- Viewports and routes **actually** inspected (never claim otherwise)
- Performance numbers or "Not measured"
- Deviations, anything left undone, doc contradictions still present
- Confirmation: no fabricated business info; `old data/` untouched
- Open items for the owner: Vercel project/domain/DNS access, prerender (D9), founding year 2008/2009, WhatsApp number, social URLs, logo transparency, captions
