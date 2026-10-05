# 09 — Master Build Prompt (standalone)

> Copy everything below the line into a fresh Claude Code session started in the repo root.
> It is self-contained: it needs no other document, but the other docs in this folder hold the detail if you want it.

---

# ROLE
You are a senior front-end engineer and art-director-level designer. Build a **production-grade, multi-page marketing website (13 routes + 404)** for **Invent Fine Art**, replacing their dated 12-page site while keeping its page structure and giving every page a distinct, art-directed composition. It must look **hand-designed and art-directed**, not like a generic template or a Bootstrap/landing-page-kit clone.

# PROJECT LOCATIONS (strict)
- Repo root: `/home/krushang-oss/Mine-site/VernoraTech Projects/inventfineart/`
- Build here: `frontend/` (Vite 8 + React 19, JavaScript/JSX, oxlint already configured).
- **Source archive (READ-ONLY): `old data/`. NEVER create, edit, move or delete anything inside it.** Copy from it only.
  - `old data/site_data.json` — machine-readable data of the whole site
  - `old data/pages/*.md` — page copy
  - `old data/media/` — all images (≈47 MB, ~250 files)
- Docs live in `frontend/src/docs/` (read `README.md`, `08-Folder-Structure.md`; update the tracker in `README.md` as phases finish).
- Folder skeleton already exists (with `.gitkeep`): `public/assets/{brand,hero,intro,services,about,clients,gallery/{sculptures,murals,fountains,grc,planters,other}}`, `scripts/`, `src/{components,data,hooks,styles,utils}`. Use it; do not invent a different structure.

# BUSINESS FACTS (use exactly)
- Brand: **Invent Fine Art** — ISO 9001:2008 certified maker/installer of sculptures, wall murals, water fountains, GRC facades, planters, gate grills, artificial rockery.
- Tagline: *Reinventing spaces through Innovations in Art*
- Founded: homepage says 2008 (use "Since 2008"; About copy says 2009 — keep the copy verbatim but flag in your final report).
- Head office: Kandivali East, Mumbai, Maharashtra, India
- Factory/studio: Near Jag Mata Mandir, Vasai/Virar, Maharashtra (lat 19.4196725, lng 72.7856904)
- Phones: +91-9323210327, +91-9619660089, +91-8976777123
- Email: inventfineart.mum@gmail.com
- WhatsApp: `https://wa.me/919323210327`
- Google Maps embed (factory):
  `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19811.64538266773!2d72.7856903769042!3d19.419672530730246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7abef7331b6cb%3A0xfd4325d4724074cf!2sJag+mata+mandir!5e0!3m2!1sen!2sin!4v1510743982267`
- Audience: architects, interior designers, builders/developers, hotels/corporates, homeowners. Mostly mobile users in India (phone/WhatsApp-first).

# CREATIVE DIRECTION — "Gallery at night"
A dark, editorial, museum-like multi-page site where **the artwork is the light source**. Big serif display type, hairline rules, generous negative space, one warm accent. Each page — and each block within a page — must have a **different composition** (full-bleed hero on Home, oversized-type intro, sticky-split services, asymmetric category hub, masonry category pages, process strip, logo grid, two-column contact). Avoid: uniform 3-card grids everywhere, drop shadows, gradients-on-everything, stock "Lorem" feel, emoji icons, centered-everything layouts, purple/blue SaaS look.

## ANTI-TEMPLATE QUALITY GATE (mandatory)
The result must feel like a **bespoke site by a premium architectural/art studio** — never like a generic AI-generated landing page, SaaS template, Bootstrap template or component-library assembly.

**Explicitly avoid:**
- generic SaaS layouts; predictable `hero → cards → CTA` repetition
- repeated 3-card sections and repeated equal-width grids
- centered-everything layouts and excessive symmetry
- excessive rounded containers, excessive pill/chip UI, excessive borders or boxed containers
- excessive gradients, excessive shadows, animated gradients
- decorative elements without a purpose; generic UI-kit styling; stock-looking presentation
- flashy animations, unnecessary parallax, bouncing/spinning effects

**Prefer:**
- editorial compositions and intentional asymmetry
- strong typographic hierarchy; dramatic but controlled whitespace
- artwork-first layouts with varied image crops
- a **different composition for every page and major block**
- thin hairline rules, subtle overlaps where they help, strong vertical rhythm
- restrained, deliberate motion
- museum/gallery and premium architectural-studio aesthetics

> **Rule: if any section looks like a generic AI/template website, redesign that section before considering the implementation complete.**

## VISUAL HIERARCHY
Every viewport must have **one clear primary focal point**. Priority order: **1) artwork/photography → 2) main headline → 3) primary CTA → 4) supporting copy → 5) metadata/decorative elements.** UI furniture (borders, labels, badges, animations, decoration) must never compete with the artwork. The artwork is the hero of the experience, not merely a background image placed behind text.

## IMAGE ART DIRECTION
Do **not** show every image with the same crop, aspect ratio or treatment. Use intentional treatment per context:
- **Hero:** cinematic/editorial wide crop
- **Services:** large editorial crop
- **Gallery:** preserve natural proportions via masonry (no forced aspect ratio)
- **About:** portrait/editorial crop
- **CTA band:** atmospheric crop
- **Client logos:** preserve actual proportions (`object-fit: contain`, never cropped)

Never stretch images. Do not crop away important sculptures, facades, murals, fountains or architectural work; use deliberate `object-position` when the subject sits near an edge (check each hero/service/about image visually). Images should feel curated and art-directed, not dropped into generic UI cards.

## MOBILE ART DIRECTION
The mobile site is **not** a collapsed desktop layout. At ~360–430px: keep the visual hierarchy and strong typography; use intentional artwork crops (re-crop with `object-position`/different aspect ratios, not just shrink); no tiny text (body ≥16px); no horizontal overflow; generous but controlled whitespace; thumb-friendly CTAs (≥44px, reachable one-handed); artwork stays the dominant visual; fixed/sticky elements (nav, floating WhatsApp) must never cover content or form fields. **Review every major section independently on mobile** — it must look intentionally designed, not squeezed.

## Design tokens (put in `src/styles/tokens.css` as a Tailwind v4 `@theme` block — the single, only place colours/fonts/spacing/radius/easing are defined; do NOT duplicate them in a separate `:root` block)
```
--bg:#0e0d0c; --bg-raised:#171513; --line:#2a2622;
--text:#f1ebe2; --text-dim:#a89f93;
--accent:#b93a25;   /* deepened brand red; CTA fill, 4.8:1 with --text */
--accent-light:#e2705a; /* accent used as TEXT on dark (>=4.5:1) */
--accent-2:#b98a4e; /* bronze, small labels/details */
--light-card:#f4f0ea; /* client logo tiles (logos are JPG on white) */
--ease:cubic-bezier(.2,.7,.2,1);
```
- Fonts (Google Fonts, `display=swap`, Latin subset): **Fraunces** (display/headings 300–600) + **Inter** (body/UI 400/500/600).
- Scale: H1 clamp(42px→88px) line-height 1.02; H2 clamp(34→56); body 17px/1.65; eyebrow 12px uppercase tracking .14em weight 600 in `--accent-2`.
- Radius: 2px on images; 999px **only on the few primary/ghost CTA buttons** (not on chips/filters/tags — see gallery filters and service lists below). No shadows — use hairlines and tonal layers.
- Section padding 112px desktop / 72px mobile; container max 1280px; 16px mobile gutter.
- Hero overlay: `linear-gradient(rgba(91,48,0,.35), rgba(14,13,12,.9))` (legacy brand brown).
- Focus ring: 2px `--accent-2`, offset 3px.

# CONVERSION-FIRST (business site, not just a portfolio)
- **Primary conversion: WhatsApp enquiry.** Secondary: phone call, then email.
- Within ~5–10 seconds a visitor must understand: what Invent Fine Art does, what kinds of projects they execute, who they work with, and how to contact them.
- Keep the primary CTA easily discoverable without feeling aggressive or sales-heavy. Use contextual CTAs: **Start a project · Enquire about this service · Request a quote for this piece · Work with us**.
- Do **not** add popups, lead magnets or unrelated marketing UI. **Owner exception (2026-10-05):** the footer carries a *static* newsletter signup and social icons (below); no other newsletter or signup flows.
- Premium first, conversion-oriented second.

# CONTENT INTEGRITY (mandatory)
Never invent business information. Do **not** fabricate clients, projects, certifications, awards, statistics, testimonials, reviews, social accounts, addresses, phone numbers, email addresses, business claims or partnerships. Use only the facts in this prompt and the source data in `old data/`. If information is missing, **omit the feature** rather than inventing it. Social URLs stay empty until real ones exist (see Footer). Numeric stats must be derived from real data (e.g. the real gallery count), not hard-coded guesses. Any copy written by the agent (e.g. process-step lines) may only restate what the source copy already says.

# SITE STRUCTURE — MULTI-PAGE (decision D8)
Real routes with `react-router` (library mode, `BrowserRouter`), all in `src/routes.jsx`, pages lazy-loaded. **13 routes + 404:**

| Route | Page | Replaces |
|-------|------|----------|
| `/` | Home | index.html |
| `/about` | About | about-us.html |
| `/services` | Services | services.html |
| `/gallery` | Gallery hub (6 category covers + counts) | gallery.html |
| `/gallery/sculptures` · `/gallery/wall-murals` · `/gallery/water-fountains` · `/gallery/grc-products` · `/gallery/planters` · `/gallery/other` | Category pages (ONE `GalleryCategory` page driven by `data/categories.js`) | sculptures, wall_murals, water_fountains, grc-products, planter, other .html |
| `/clients` | Clients | our_client.html |
| `/faq` | FAQ (new) | — |
| `/contact` | Contact | contact-us.html |
| `*` | 404 | — |

**Shared layout (`layouts/RootLayout.jsx`):** Nav + `<Outlet/>` + Footer + FloatingWhatsApp. On every navigation: scroll to top, move focus to `<main>`, quiet ≤300ms fade (no sliding/zoom page transitions), and set head via `usePageMeta({title, description, path})` (unique title ≤60 chars, description ≤155, canonical, `og:url`).

**Prefill links (query params, not app state):** service "Enquire" → `/contact?service=<service-slug>`; lightbox "Request a quote" → `/contact?service=<slug>&ref=<category>-<nnn>`. `Contact` reads them with `useSearchParams`. Service slugs: `wall-murals, gate-grills, artificial-rockery, water-fountains, sculptures-art-installation, architectural-facades, planters`. Service → gallery category: wall-murals→wall-murals · water-fountains→water-fountains · sculptures→sculptures · facades→grc-products · gate-grills→grc-products · planters→planters · rockery→other.

**Content must not be duplicated across pages:** Home *teases* (service names, 6 showcase images, a two-row logo marquee); full versions live on their own pages. Each page must look different from the others (see composition per page below) — no hero+cards+CTA repeated everywhere.

**Per-page SEO / hosting:** sitemap lists all 13 URLs; `BreadcrumbList` JSON-LD on category pages; `LocalBusiness` on Home and Contact; host config provides SPA fallback and 301 redirects from the 12 legacy `.html` URLs (`/about-us.html→/about`, `/sculptures.html→/gallery/sculptures`, `/wall_murals.html→/gallery/wall-murals`, `/water_fountains.html→/gallery/water-fountains`, `/grc-products.html→/gallery/grc-products`, `/planter.html→/gallery/planters`, `/other.html→/gallery/other`, `/our_client.html→/clients`, `/contact-us.html→/contact`, `/gallery.html→/gallery`, `/services.html→/services`, `/index.html→/`).

# PAGES & BLOCKS (the former "sections", now assigned to routes)

## G1. Global — Nav (every page)
Sticky, 72px. Transparent over the Home hero (solid `rgba(14,13,12,.85)` from the start on inner pages) → `rgba(14,13,12,.85)` + backdrop blur after ~40px scroll. Logo (or wordmark "INVENT FINE ART" in Fraunces), links **About · Services · Gallery · Clients**, pill CTA **Contact**; on desktop (≥1024px) also a quiet text link **WhatsApp** (`wa.me`) beside it. Links are real routes (`NavLink`); active state by route, and Gallery stays active on `/gallery/*`. Mobile: hamburger → full-screen overlay menu, body scroll locked, closes on route change/Esc. No scroll-progress bar or scroll-spy.

## P1. Home `/` — Hero
Full-viewport (min 88vh). Crossfade slider (1.2s fade, 6s interval, pause on hover/focus, dots, swipe on mobile) of 4 slides — headline per slide:
1. Reinventing spaces through Innovations in Art
2. Facades Increase Aesthetic Value for Your Structure
3. Enhance the Beauty of Your Place
4. RAISE THE LIVELINESS (render as "Raise the liveliness.")
Images: `old data/media/slider/` → banner-1, banner-2, banner-5, banner-6. Eyebrow "ISO 9001 · Since 2008". Buttons: primary **Start a project** (→ `/contact`), ghost **View gallery →** (→ `/gallery`). Bottom stats strip, **static numbers (no count-up)**: **2008** Since · **<real gallery count from the manifest>** Works · **6** Art categories. Very subtle slow zoom on the active image (`scale-[1.04]` max over the slide duration, disabled under reduced motion); first slide preloaded and `fetchpriority="high"`. Use `srcset` so mobile loads the 960px variant. The artwork must dominate the frame: crop cinematically, keep text on a restrained overlay at the lower-left rather than centred over the subject.

## P1b. Home `/` — Intro and teasers
Eyebrow "INNOVATION AND PERFORMANCE SINCE 2008", title "For your premises". Oversized light-serif paragraph (verbatim): *"Invent Fine Art is a community of artists, committed to bring outstanding art to the commercial world. As a team of leading sculptors, painters and designers, we work in all areas of interior and architectural design at indoor as well as outdoor sites."* Below: three features separated by hairlines (no cards): **High Quality** (premium-grade raw materials, rigorous manufacturing norms) · **Beautifully Designed** (artistic inclination for architects, interior decorators and connoisseurs) · **Rust Proof** (weatherproof, corrosion-resistant outdoor treatments). Then a showcase of `media/homepage/1,2,3,4,5,7.jpg` as an **asymmetric editorial composition** (varied sizes/crops and offsets, not an equal-width row), **no parallax**. Then, still on Home: a **services teaser** (the 7 service names as a large editorial list, each linking to `/services`), a one-row **client marquee** (see Clients) and the shared **CtaBand**. Home must not repeat the full content of other pages.

## P3. Services `/services` — sticky split
Compact `PageHeader` first (breadcrumb, title, one line). Left: numbered list (01–07), sticky; right: large editorial-crop image + title + summary + "Applications" and "Materials/Features" as **plain hairline-separated text lists (not pill chips)** + two actions: **Enquire about this →** (`/contact?service=<slug>`) and **View related work →** (`/gallery/<category>` per the mapping above). Active item changes on scroll (IntersectionObserver) and on click. **Mobile: accordion** (tap to expand). Data (`src/data/services.js`):
1. **Wall Murals** (`services/19.jpg`) — "Great Material, great selection, great value. When it comes to selection, no one offers more murals and decorative wall treatments for decorating your residential and corporate workspaces." Apps: hotels, luxury residences, office lobbies, reception areas, restaurants. Materials: GRC, FRP/fiberglass, metal alloys, terracotta, ceramic, composite acrylic, wooden relief.
2. **Gate Grills** (`14.jpg`) — "Our product range is designed and fabricated using supreme quality material. The exotic designs, aesthetic patterns, and artistic looks of these grills make them ideal for architectural applications." Apps: entrance gates, balcony railings, perimeter fencing, boundary panels, pergolas. Materials: cast metal, forged iron, stainless steel, GRC tracery grills.
3. **Artificial Rockery** (`11.jpg`) — "Rockery Art satisfies people's desire to return to Nature by offering them stone fragments from Nature. Natural stones and artificial rockery work for gardens, water bodies, and landscapes." Apps: garden landscaping, courtyards, terrace gardens, resort pool accents, theme parks. Features: realistic rock texture, weather-resistant, lightweight fiberglass/ferro-cement core with natural stone finish.
4. **Water Fountains** (`7.jpg`) — "Totally unique, fountain technologies specialize in only fountains and dramatic water features. We plan, engineer, and build stunning indoor and outdoor water bodies and fountains." Apps: atriums, courtyards, corporate parks, residential gardens, hotel lobbies. Features: cascades, laminar jets, reflection pools, sculpture-integrated centerpieces, low-maintenance recirculating pumps.
5. **Sculptures Art Installation** (`5.jpg`) — "Indoor and Outdoor Sculpture for home and garden decoration. The presence of sculpture adds a touch of prestige, luxury, and artistic gravity to any architectural space." Apps: corporate HQs, public roundabouts, hotel lobbies, private estates, galleries. Materials: bronze, brass, stainless steel, stone, FRP, mixed media.
6. **Architectural Facades** (`2.jpg`) — "Invent Fine Art brings together all the elements to help you create stunning architectural wall and facade solutions that redefine structural elegance." Apps: exterior envelopes, feature walls, cladding, screen walls, sunshades. Materials: GRC, CNC metal panels, 3D modular tiles.
7. **Planters** (`ser.jpg`) — "Using indoor & outdoor planters is the perfect way to create beautiful container gardens for your front porch, patio, terrace, or corporate lobby." Apps: rooftop terraces, executive corridors, landscaped walkways, villas. Features: rust proof, UV-stabilised, high load capacity, contemporary and classical designs.
(Service images are in `old data/media/services/`.)

## P4. Gallery hub `/gallery` and category pages `/gallery/:category` — the centrepiece
**Hub `/gallery`:** PageHeader + the 6 category covers (`media/gallery/category_covers`, or the first image of each category) in an **asymmetric editorial grid** (one large cover, others varied sizes — not six equal cards), each with title and real count, linking to its route. **Category pages:** one `GalleryCategory` page for all six routes — PageHeader (breadcrumb Home / Gallery / <Category>, title, real count), a **category sub-nav of text links** to the other five (current = accent underline), the masonry below, the lightbox, and a prev/next-category strip before the CtaBand. Unknown category slug → 404.
- Data: scan `old data/media/gallery/*` → categories **All, Sculptures (77), Wall Murals (35), Water Fountains (18), GRC Products (15), Planters (4), Other (17)** (verify counts against real files; use the real counts and report mismatches). `category_covers/` images may be used for section previews.
- Counts come from the manifest (hub shows each category's real count and the real total). There is no combined "All" view and no URL-hash filtering: the category is the route.
- True **masonry** (CSS columns or JS shortest-column), 2 cols mobile / 3 tablet / 4 desktop, 12px gap. Tiles are images only; hover (pointer devices): very slight scale (≤1.02) and a small category label + number — nothing that distracts from the artwork. Preserve natural proportions (width/height from the manifest); never force a uniform aspect ratio.
- Show 24 initially (12 on phones <640px), **Load more** reveals the same batch size again. Masonry columns are distributed in JS (shortest column, using manifest width/height) so reading order is left-to-right and the first-row images can be loaded eagerly with high priority; the rest are `loading="lazy"`. `loading="lazy"`, `decoding="async"`, explicit `width/height` from manifest (no layout shift).
- **Lightbox**: full-screen, focus-trapped, image `object-fit:contain`, category + "12 / 77" counter, prev/next buttons, ← → Esc keys, swipe on touch, preload neighbours, thumbnail strip on desktop, body scroll lock, `aria-modal`. CTA **Request a quote for this piece** → navigates to `/contact?service=<slug>&ref=<category>-<nnn>` with the artwork reference prefilled ("Sculptures #12"). The open image is reflected in `?img=<n>` so a lightbox view can be deep-linked and the browser Back button closes it.
- No captions exist in the source; use alt `"<Category> artwork <n> by Invent Fine Art"`.

## P2. About `/about`
Compact-to-medium `PageHeader`, then the content below, ending with the shared CtaBand.
Left: `about/about_us.jpg` with an "ISO 9001:2008 Certified" badge; right: verbatim profile copy — *"Established in the year 2009, Invent Fine Art is amongst the well established companies affianced in the domain of trading, manufacturing, supplying and fixing a top class Quality Art Work of Indoor and outdoor decor Products… We are a team of Artisans and Product designers who create products with artistic inclination for Designers and architects for their respective projects. We provide start-to-end solutions from conceptualizations to the complete execution."* Use a portrait/editorial crop for the image. Then a **process strip** (horizontal scroll-snap on mobile): 01 Concept → 02 Design → 03 Fabricate → 04 Quality check → 05 Install (one short line each, which may only restate what the About copy already says — conceptualisation to complete execution, manufacturing under experienced professionals, stringent examination before delivery, premium packing, fixing/installation — no invented process details). Then **Our facility**: four units — Manufacturing Unit, Warehousing & Packaging Unit, Quality Control Unit, Research & Development Unit — as a hairline-divided row (text only, no icons-in-circles). Also list what they execute: Sculptures (bronze, fiber, metal, stone, mixed media), Murals, Acoustic wall panels, 3D wall facades, Rockery work, Planters, Customised GRC grills/railings/pergolas/gazebos.

## G3. Shared CtaBand (Home, About, Services, gallery pages, Clients)
Background `slider/banner3.jpg` as an atmospheric crop with overlay. Headline (fix source typo "impanation"): **"We can turn your ideas and imagination into reality."** Button **Work with us** → `/contact`.

## P5. Clients `/clients` (+ two-row marquee on Home)
**Clients page:** PageHeader + a short intro line + a **hairline-divided grid of all 30 logos** (`media/clients/*.jpg`, static, no marquee). **Home teaser:** a two-row infinite CSS marquee of the logos, rows scrolling in opposite directions (decision by owner, 2026-10-05), 60s linear, pause on hover/focus, duplicated track for seamless loop, linking to `/clients`. Each logo sits on a `--light-card` tile (they are white-background JPGs) with its actual proportions preserved (`object-fit: contain`), slightly desaturated → full colour on hover. Reduced motion: the Home teaser becomes a static wrapped row.

## P6. Contact `/contact`
Compact `PageHeader`, then two columns (stack on mobile, details first).
- **Form** (bottom-border inputs, floating labels): Name*, Phone* (tel, Indian format hint), Email, Service needed* (select: 7 services + Other), Project details* (min 10 chars), Artwork reference (from `?ref=`, shown as a removable line), honeypot; Service preselected from `?service=`. Inline validation with accent-red messages, accessible error text. On valid submit: open `https://wa.me/919323210327?text=<encoded: name, phone, email, service, artwork ref, message>`; show a success state with a **mailto:inventfineart.mum@gmail.com** fallback link. If `import.meta.env.VITE_FORM_ENDPOINT` is set, POST JSON there instead and show success/failure states. No page reload.
- **Details**: Head office, Factory, tap-to-call links for all three numbers, WhatsApp button, email link, lazy-loaded Google Map iframe (dark-tinted via CSS filter is acceptable) .
- Floating circular WhatsApp button on mobile (bottom-right), hidden while the lightbox/menu is open.

## P8. FAQ `/faq` (+ 6-question teaser on Home)
Content lives in `src/data/faqs.js` (3 groups: The studio · Services and products · Enquiries; 12 questions). **Every answer may only restate facts from the source copy** (ISO 9001:2008, locations, the 7 services, custom/start-to-end work, materials, weatherproof finish, supply and fixing, exporting, how to enquire) — no prices, lead times, guarantees or other invented claims. Use native `<details>/<summary>` (keyboard accessible, no JS animation), hairline-divided rows, a sticky group title at left and the list at right on desktop. `FAQPage` JSON-LD on `/faq` only (it must match visible content). Home shows 6 selected questions (`homeFaqs`) between the client marquee and the CtaBand, with an "All questions" link. Nav and footer include "FAQ".

## P7. 404 `*`
Display-type "404", one short line, links to Home / Gallery / Contact. Same layout, own composition.

## G2. Global — Footer (every page)
Three layers, hairline-divided, no boxes or shadows:
1. **Direct channels row:** WhatsApp ("Start a chat"), Call (primary number), Email — large display-type values, each a link (≥44px tall). Three columns from `lg`, stacked below.
2. **Main grid:** brand block (logo, ISO line, the footer about copy verbatim: "Invent Fine Art is a foremost company betrothed in manufacturing, trading, supplying and exporting a top class Quality Art Work of Indoor and outdoor decor Products.", tagline) · Explore links (Home, About, Services, Gallery, Clients, FAQ, Contact) · Portfolio (six categories with real counts) · Studio (head office, factory & studio with a "Get directions" link built from the factory coordinates, all three phone numbers).
   The brand block also holds a **static newsletter form** (`footer.newsletter` in `data/site.js`; label, one line of text, email input + Subscribe) and a **Follow** row of social icons (`footer.socialLinks`: Facebook, X/Twitter, Pinterest — the legacy site's networks; no Google+). While `newsletter.endpoint` is null the input and button are disabled with "Signup opens soon."; while a social `url` is null the icon renders as a dimmed, non-link placeholder (`aria-label="… (link coming soon)"`). Setting a real `url` turns an icon into a link; wiring the form to a service is a separate task. Never invent account URLs.
3. **Bottom bar:** © 2026 Invent Fine Art · ISO 9001:2008 certified, back-to-top.

# INTERACTION & MOTION
**Premium does not mean flashy.** Motion must feel slow, deliberate, quiet, architectural, editorial and purposeful.
- Reveal-on-scroll (IntersectionObserver): fade + small (≤24px) translate, 600ms `--ease`, stagger 60ms for groups.
- Route changes: scroll to top, focus `<main>`, ≤300ms opacity fade. (Anchor scrolling inside a page, if any, uses `scroll-margin-top` for the sticky nav.)
- Hero crossfade + very slow zoom; services image crossfade; clients marquee.
- **Avoid:** bouncing or spinning elements, flashy text animations, excessive or any decorative parallax, scroll-jacking, animated gradients, excessive hover effects, anything that distracts from the artwork. When in doubt about whether an animation is necessary, choose the simpler implementation (or none).
- Everything animated must be disabled or simplified under `prefers-reduced-motion` (mandatory).
- Keep JS animation libraries out; CSS + IntersectionObserver + small hooks (`useReveal`, `useLightbox`, `usePageMeta`).

# ASSET PIPELINE (do this first)
1. Write `scripts/optimize-images.mjs` (Node + `sharp`, devDependency) that reads `old data/media/**` **read-only** and writes WebP to `frontend/public/assets/**`:
   - gallery: thumb 600px wide (q75) + full 1600px wide (q80), keep aspect ratio; names `sculptures-001.webp`/`sculptures-001-thumb.webp` etc. (category folder names per skeleton: `sculptures, murals, fountains, grc, planters, other`; map source folders `wall_murals→murals`, `water_fountains→fountains`, `grc_products→grc`, `other_products→other`).
   - hero: 1920px + 960px variants; services/intro/about: 1400px; clients: 400px; logo: keep PNG + generate favicon-size.
   - Handle the one `.jpeg` file and non-contiguous numbering; skip nothing silently — print a summary table (found / written / failed) and log suspected duplicates or <600px-wide sources.
2. Write `scripts/build-manifest.mjs` that scans `public/assets/gallery` and emits `src/data/gallery.js` = `[{ id, category, n, thumb, full, w, h }]` (generated, do not hand-edit; header comment says so).
3. Add npm scripts: `"assets": "node scripts/optimize-images.mjs && node scripts/build-manifest.mjs"`.
4. Total initial page weight target < 1.2 MB (hero first slide + first 12 thumbs).

## PERFORMANCE TARGETS
- Route-level code splitting (`React.lazy`): Home must not ship gallery/lightbox code. Initial page weight < 1.2 MB; **LCP < 2.5s; CLS < 0.1; INP < 200ms** where measurable.
- Do **not** load all gallery images on initial render — only visible/required assets; lazy-load below-the-fold images; preload **only** the first hero image.
- Avoid unnecessary JavaScript, heavy animation libraries and unnecessary dependencies. Never trade performance for decorative animation.
- If a target cannot be measured, report `Not measured` rather than inventing a number.

# CODE REQUIREMENTS
- Structure per `src/docs/08-Folder-Structure.md`: `routes.jsx`, `layouts/RootLayout.jsx`, `pages/{Home,About,Services,GalleryHub,GalleryCategory,Clients,Contact,NotFound}.jsx`, shared `components/`; `App`/`main` only wire the router. Content in `src/data/{site,services,clients,categories,gallery}.js` — **no copy hard-coded in components or pages**. Dependencies add `react-router`.
- **Styling: Tailwind CSS v4.3** via `@tailwindcss/vite` (no `tailwind.config.js`, no PostCSS config). Files: `styles/tokens.css` (`@theme`), `styles/base.css` (base/reset, reduced-motion), `index.css` imports them. Use token-based utilities only (`bg-bg`, `text-text`, `text-accent`, `font-display` …); no default Tailwind palette colours, no arbitrary hex like `bg-[#25d366]`. No UI kit, no heavy deps. Allowed deps: react, react-dom, tailwindcss, @tailwindcss/vite; dev: sharp.
- **Banned utilities/patterns (enforced by the audit in `10-Design-Rules-and-Audit.md`, run it before declaring any phase done):** any `shadow-*` or `drop-shadow-*`; `rounded-full`/`rounded-3xl` etc. except on the primary/ghost CTA buttons, dots and the floating WhatsApp button; `hover:-translate-y-*`/lift effects; `scale-105` or larger hover/zoom (max `scale-[1.04]` for the hero zoom, `scale-[1.02]` on hover); `parallax`; count-up animation; gradient-text; `animate-bounce|spin|pulse|ping`; off-palette colours (including brand-green WhatsApp — use `--accent`/`--text` tokens); `console.*`; machine-specific absolute paths in any committed file.
- Remove all Vite template leftovers (`src/assets/react.svg`, `vite.svg`, `hero.png`, `public/icons.svg`, default `App.css`/`index.css` content, default favicon → generate from logo).
- `index.html` (defaults) + per-route head via `usePageMeta`: `lang="en-IN"`, proper `<title>` ("Invent Fine Art | Sculptures, Wall Murals, GRC Facades & Water Fountains – Mumbai"), meta description (≤155 chars), canonical, theme-color `#0e0d0c`, Open Graph + Twitter tags, preconnect to Google Fonts, JSON-LD `LocalBusiness` (name, address Kandivali East Mumbai, phones, email, geo of factory). Add `public/robots.txt`, `public/sitemap.xml` (all 13 URLs), `vercel.json` (Vercel: legacy redirects, SPA fallback, headers), `public/og-image.jpg` (1200×630 from a hero banner).
- Semantic HTML (header/nav/main/section/footer), one `<h1>`, correct heading order, landmarks, `aria-label`s, skip-to-content link, keyboard operable everything, 44px touch targets, WCAG AA contrast.
- Components small, readable, commented only where logic is non-obvious. No dead code, no TODO placeholders, no lorem ipsum, no console output.
- **Do not create components merely to increase component count.** Create one only when it represents a meaningful UI section, encapsulates reusable behaviour, isolates complex interaction logic, or clearly improves maintainability. Avoid dozens of tiny one-purpose components; `App.jsx` stays composition-focused. (The component list above is a guide, not a quota — merge where it reads better, e.g. `Process` inside `About`.)
- **Icon policy:** no emoji icons. Prefer inline SVG for the few simple interface icons (menu, close, arrows, WhatsApp, phone, mail); do not add an icon/UI library for a handful of icons; icons must match the editorial design and never be decorative filler.
- Do not commit; do not run git commands that change state unless asked.

# QUALITY BAR — verify before saying "done"
1. `npm install && npm run assets && npm run lint && npm run build` all succeed with zero errors/warnings that matter.
2. **Repeatable visual QA loop.** Run `npm run dev`, then **actually view** the page (the `run` skill or a headless browser/screenshots) at **1440, 1024, 768 and 360 px**. Identify visual problems → **fix them** (don't just report them) → re-inspect → repeat until visually stable. Having media queries does not make it "responsive". Explicitly check: typography, spacing, image crops, image loading, overflow, section transitions, sticky behaviour, fixed elements, navigation, lightbox, form, CTA visibility, animation timing, loading states, mobile menu, gallery behaviour and service interaction. Do a final full pass after all functionality is in place.
3. Test: **all 13 routes** load, link correctly and deep-link/refresh works (SPA fallback); unknown URL → 404; each page has a unique title/description/canonical; every category route shows its real count; prefill links (`?service=`, `?ref=`) populate the form; lightbox keyboard + swipe + focus trap + Back closes it; form validation + WhatsApp/mailto handoff, mobile menu, marquee pause, reduced-motion.
4. Lighthouse mobile ≥ 90 for Performance, Accessibility, Best Practices, SEO (report numbers; if you can't run it, say so rather than claiming). Also record LCP, CLS, INP and initial page weight where measurable.
5. Confirm `old data/` is byte-for-byte untouched (e.g. compare file count/size before and after).
6. Pass the **Anti-template quality gate** and the **Final art-direction review** below.

# FINAL ART-DIRECTION REVIEW (before declaring completion)
After all functionality works, review the complete page, on desktop **and** at 360px:
- **Brand:** feels like Invent Fine Art? artwork dominates? premium? bespoke?
- **Layout:** sections visually distinct? excessive repetition? enough negative space? composition intentional?
- **Typography:** strong hierarchy? headlines dramatic but readable? body comfortable?
- **Imagery:** well cropped? important artworks preserved? gallery feels curated?
- **Interaction:** animations subtle? transitions smooth? interactions help rather than distract?
- **Conversion:** business understood quickly? WhatsApp easy to reach? service enquiries easy? contact flow frictionless?
- **Mobile:** intentionally designed at 360px? anything cramped? horizontal overflow? CTAs usable one-handed?

If any major section fails, **redesign/fix it before declaring the project complete.**

# WORKING METHOD
- Work in phases and update the tracker in `frontend/src/docs/README.md` after each: **1** assets+manifest+cleanup+router+RootLayout+tokens → **2** Nav, Footer, Home → **3** Gallery hub + `GalleryCategory` + Lightbox → **4** About, Services, Clients, Contact, 404 → **5** per-page SEO (`usePageMeta`, sitemap, redirects/fallback config), a11y, performance → **6** responsive pass on every page, audit (doc 10 §3), final QA. Run the doc-10 audit at the end of every phase.
- Don't ask permission for decisions already made above; use these defaults. Only stop to ask if something is truly blocked.
- If something in this prompt conflicts with the real data, trust the real data, make the sensible call, and list it in your final report.

# FINAL REPORT (end of work)
Short and honest: what was built; commands run and their results; real vs documented gallery counts; deviations and why; open items for the client (founding year 2008 vs 2009, social URLs, WhatsApp number confirmation, logo transparency, captions, corrected CTA copy); how to run (`npm run dev`) and rebuild assets (`npm run assets`). Must also include:
- **Visual quality:** whether the anti-template/art-direction review passed, and which sections needed redesign during QA.
- **Responsive QA:** which of 360 / 768 / 1024 / 1440 px were *actually* inspected (never claim an inspection that didn't happen).
- **Performance:** Lighthouse scores, LCP, CLS, INP, initial page weight — each as a real number or `Not measured`.
- **Content integrity:** confirmation that no unsupported business claims, fake clients, testimonials, statistics or social URLs were introduced.
- **Old data:** confirmation `old data/` was not modified.

---

# DEFINITION OF DONE
A visitor on a phone lands on a dark, art-directed Home page, sees the brand's work immediately, moves through all 13 pages (including the six gallery category pages with lightbox) smoothly, understands services and credibility (ISO, clients), and can enquire via WhatsApp/call/email in two taps — and the whole thing builds, lints, scores 90+ on Lighthouse, and looks like a bespoke studio site, not a template. Additionally:
- The site passes the **anti-template visual quality gate**; no major section looks like a generic AI-generated layout.
- Desktop and mobile layouts both feel intentionally art-directed, and the artwork remains the dominant visual element.
- Conversion paths (WhatsApp first, then call and email) are clear and functional.
- Performance targets are measured where possible and reported honestly.
- No fabricated business information exists anywhere on the site.
- Final visual QA was performed **after** all functionality was implemented, on every one of the 13 pages.
- All 13 routes + 404 exist, each with its own composition, unique head metadata, entry in the sitemap, and a working legacy-URL redirect configuration.
- The doc-10 audit prints nothing (pill hits reviewed).
