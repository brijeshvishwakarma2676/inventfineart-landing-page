# 06 — Content Inventory & Asset Sheet

Source of truth (read-only): `old data/` → `site_data.json`, `pages/*.md`, `media/`.
Rule: never edit `old data/`. Copy → optimise → use in `frontend/public/assets/`.

## 1. Business facts

| Field | Value | Status |
|-------|-------|--------|
| Brand | Invent Fine Art | ✅ |
| Tagline | Reinventing spaces through Innovations in Art | ✅ |
| Founded | 2008 (homepage) / 2009 (About page) | ⚠ client to confirm |
| Certification | ISO 9001 : 2008 Certified | ✅ (confirm still valid/renewed) |
| Head office | Kandivali East, Mumbai, Maharashtra | ✅ |
| Factory | Near Jag Mata Mandir, Vasai/Virar, Maharashtra (19.4196725, 72.7856904) | ✅ |
| Phones | +91-9323210327, +91-9619660089, +91-8976777123 | ✅ |
| Email | inventfineart.mum@gmail.com | ✅ |
| WhatsApp | https://wa.me/919323210327 (assumed primary number) | ⚠ confirm |
| Socials | Facebook, Twitter, Pinterest, Google+ (legacy; no URLs recorded) | ⚠ client to supply live links; drop Google+ |
| Map embed | `old data/media/embeds_and_maps/google_maps_location.md` | ✅ |

## 1b. Content → page map (multi-page)
| Content | Page |
|---------|------|
| Hero slides (4), intro, 3 features, 6 showcase images, services name list, client marquee, CTA band | `/` |
| Profile copy, executes-list, process, 4 facility units, `about_us.jpg` | `/about` |
| 7 services (summary, applications, materials, image) | `/services` |
| 6 category covers + counts | `/gallery` |
| Gallery images per category | `/gallery/<category>` |
| 30 client logos | `/clients` (grid) · `/` (two-row marquee) |
| Form, addresses, phones, email, map | `/contact` |
| FAQ — 12 questions restating source facts only (`src/data/faqs.js`) | `/faq` · 6 on `/` |

## 2. Copy by section

### Hero (4 headlines — from `pages/01_home.md`)
1. Reinventing spaces through Innovations in Art
2. Facades Increase Aesthetic Value for Your Structure
3. Enhance the Beauty of Your Place
4. RAISE THE LIVELINESS

### Intro
- Eyebrow: INNOVATION AND PERFORMANCE SINCE 2008 · Title: FOR YOUR PREMISES
- "Invent Fine Art is a community of artists, committed to bring outstanding art to the commercial world. As a team of leading sculptors, painters and designers, we work in all areas of interior and architectural design at indoor as well as outdoor sites."
- Features: High Quality · Beautifully Designed · Rust Proof

### Services (7) — `pages/03_services.md`
Wall Murals · Gate Grills · Artificial Rockery · Water Fountains · Sculptures Art Installation · Architectural Facades · Planters — each has summary, applications, materials/features (copy verbatim from the page; light edit for typos allowed after approval).

### About — `pages/02_about_us.md`
Company profile, design team & custom solutions list, QA statement, infrastructure units (Manufacturing, Warehousing & Packaging, Quality Control, R&D).

### CTA band
"We are capable to convert your ideas and impanation to actual !" → **typo in source** ("impanation"). Proposed: "We can turn your ideas and imagination into reality." (needs client OK.) Button: WORK WITH US.

### Contact
Form fields per BRD §5. Footer short-about text in `pages/00_sitemap_and_navigation.md`.

## 3. Image assets (`old data/media/`, ≈47 MB)

| Group | Folder | Files | Use |
|-------|--------|-------|-----|
| Logo | `branding/` | 1 (`logo.png`) | nav, footer, favicon source |
| Hero slides | `slider/` | 5 (banner-1, -2, -5, -6, banner3) | hero ×4, CTA band ×1 |
| Homepage showcase | `homepage/` | 6 (1–5, 7) | intro strip |
| Services | `services/` | 7 | service detail images |
| About | `about/` | 1 | about section |
| Clients | `clients/` | 30 (1–32, gaps) | marquee |
| Category covers | `gallery/category_covers/` | 6 | filter/section previews |
| Sculptures | `gallery/sculptures/` | 77 per docs (file numbering to 90; one `.jpeg`) | gallery |
| Wall murals | `gallery/wall_murals/` | 35 | gallery |
| Water fountains | `gallery/water_fountains/` | 18 | gallery |
| GRC products | `gallery/grc_products/` | 15 | gallery |
| Planters | `gallery/planters/` | 4 | gallery |
| Other products | `gallery/other_products/` | 17 | gallery |

Image processing spec:
- Output WebP: thumb 600px wide (q75), full 1600px wide (q80); keep original aspect ratio, record width/height in manifest (prevents layout shift).
- Hero: 1920px wide, also a 960px mobile variant.
- Filenames lowercased, category-prefixed: `sculptures-001.webp`.
- Flag low-res or duplicate images during processing; list them below.

## 4. Fonts
| Font | Use | Source | License |
|------|-----|--------|---------|
| Fraunces (variable, normal + italic 400) | headings | self-hosted `public/fonts/` (Latin subset, from Google Fonts) | OFL |
| Inter (variable 400–600) | body/UI | self-hosted `public/fonts/` (Latin subset) | OFL |
(Legacy fonts Montserrat/Open Sans retired.)

## 5. Gaps & client requests

| # | Gap | Owner | Status |
|---|-----|-------|--------|
| 1 | Confirm founding year (2008 vs 2009) | Client | ⬜ |
| 2 | Social media URLs | Client | ⬜ |
| 3 | Transparent/vector logo | Client | ⬜ |
| 4 | Captions / project names / locations for artworks (none in source) | Client (optional) | ⬜ |
| 5 | Client names for logos (alt text) | Client | ⬜ |
| 6 | Testimonials, if any | Client (optional) | ⬜ |
| 7 | Confirm WhatsApp number | Client | ⬜ |
| 8 | Approve copy typo fixes | Client | ⬜ |
| 9 | Real counts: reconcile doc counts vs files (script) | VernoraTech | ⬜ |

## 6. Generated data files (planned)
- `src/data/gallery.js` — `{ id, category, thumb, full, w, h }[]` generated from folders.
- `src/data/services.js`, `src/data/clients.js`, `src/data/site.js` (contact, nav, SEO).
