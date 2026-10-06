# 04 — Wireframes (low fidelity, multi-page)

## Page compositions (which blocks go on which route)
Blocks below (§0–§9) are a **library**. Each page uses a *different* composition so the site does not read as one template repeated.

| Route | Composition (top → bottom) |
|-------|----------------------------|
| `/` Home | Hero slider → Intro (oversized type + 3 hairline features) → Services name-list teaser (editorial, links to `/services`) → Featured works (6 images, asymmetric) → Clients marquee (2 rows) → FAQ teaser (6 questions) → CtaBand |
| `/about` | PageHeader (`about_us.jpg`, portrait crop) → Profile copy + ISO badge → "What we execute" list → Process strip → Facility (4 units) → CTA to `/contact` |
| `/services` | PageHeader (short) → sticky-split services (§3) with per-service "View related work" + "Enquire" |
| `/gallery` | PageHeader → **Category hub**: 6 covers in an asymmetric editorial grid with counts (wireframe H1) → CTA |
| `/gallery/:category` | PageHeader (category title + count) → category sub-nav (links to the other 5) → masonry + load more (§4) → Lightbox → prev/next category strip → CTA |
| `/clients` | PageHeader → intro line → hairline-divided logo grid of all 30 (light tiles) → CTA |
| `/contact` | PageHeader (compact) → form + details + map (§7) |
| `/faq` | PageHeader → 3 groups, each: sticky group title (left) + hairline accordion of questions (right, native `<details>`) → CtaBand |
| `*` 404 | Large "404" in display type, short line, links to Home / Gallery / Contact |

Notes for the blocks below:
- **§0 Nav:** links are real routes (not anchors); active state by route; no scroll progress bar needed.
- **§4 Gallery:** the "filter tabs" row becomes a **category sub-nav of links** between `/gallery/*` routes; there is no "All" view and no URL-hash filter.
- Home must stay lean: it teases, it does not repeat the full content of other pages.

### H1. Gallery hub (`/gallery`)
```
┌──────────────────────────────────────────────────────────────────────┐
│ THE PORTFOLIO                                              166 works │
│ ┌────────────────────────────┐ ┌────────────────┐                    │
│ │                            │ │  Wall Murals   │                    │
│ │      SCULPTURES            │ │   [cover] 35   │  asymmetric:        │
│ │      [cover]  77           │ ├────────────────┤  1 large, others    │
│ │                            │ │ Water Fountains│  varied sizes,      │
│ └────────────────────────────┘ │   [cover] 18   │  text overlays      │
│ ┌──────────────┐ ┌───────────┐ └────────────────┘  kept minimal       │
│ │ GRC Products │ │ Planters 4│ ┌────────────────┐                    │
│ │   [cover] 15 │ └───────────┘ │ Other [cover]17│                    │
│ └──────────────┘               └────────────────┘                    │
└──────────────────────────────────────────────────────────────────────┘
 Mobile: single column, each cover a full-width crop with title + count.
```

### H2. PageHeader (all inner pages)
```
┌──────────────────────────────────────────────────────────────────────┐
│ HOME / GALLERY / SCULPTURES            (breadcrumb, small)           │
│ Sculptures                                                           │
│ one-line intro in dim text                         77 works          │
└──────────────────────────────────────────────────────────────────────┘
```


Legend: `[img]` image · `[ BTN ]` button · `▓` full-bleed image · `░` text block · `⟳` auto-animating

Grid: 12-col desktop, max width 1280px, 24px gutters; mobile 16px side gutter.

---

## 0. Navigation (same structure as the original site; no dropdowns)
```
 desktop ≥1024 (fixed; transparent over Home hero, solid elsewhere)
┌──────────────────────────────────────────────────────────────────────────────┐
│ f  X  P │ Kandivali East, Mumbai, Maharashtra      ☎ +91 93232 10327 / +91 96196 60089   ◌ WhatsApp │  ← info bar 36px (collapses on scroll)
├──────────────────────────────────────────────────────────────────────────────┤
│ [logo] INVENT FINE ART            HOME  ABOUT  GALLERY  OUR CLIENTS  SERVICES  FAQ  (CONTACT) │  ← main row 72px
│        STUDIO & INSTALLATIONS                                                │
└──────────────────────────────────────────────────────────────────────────────┘
 < lg: [logo]                                                                 [☰] → full-screen menu
 After scroll: info bar collapses; main row stays.
```

## 1. Hero block (`/`)

```
┌──────────────────────────────────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ banner image ⟳ crossfade ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓                                                                  ▓▓│
│▓▓   ISO 9001 · SINCE 2008                                          ▓▓│
│▓▓   Reinventing spaces                                             ▓▓│
│▓▓   through innovations in art.   ← rotating headline (4)          ▓▓│
│▓▓                                                                  ▓▓│
│▓▓   [ START A PROJECT ]  [ VIEW GALLERY → ]                        ▓▓│
│▓▓                                                                  ▓▓│
│▓▓   ─────────────  ─────────────  ─────────────                    ▓▓│
│▓▓   2008           <real>         6                    ● ○ ○ ○     ▓▓│
│▓▓   Since          Works          Art categories       slide dots  ▓▓│
└──────────────────────────────────────────────────────────────────────┘
 Mobile: same stack, headline 40px, stats in a row of 3, buttons stacked.
```

## 2. Intro block (`/`)

```
┌──────────────────────────────────────────────────────────────────────┐
│  INNOVATION AND PERFORMANCE SINCE 2008                               │
│                                                                      │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ (large display text)      │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                            │
│                                                                      │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐                    │
│  │ ◆ High      │   │ ◆ Beautifully│  │ ◆ Rust Proof│                   │
│  │   Quality   │   │   Designed   │  │             │                   │
│  │ ░░░░░░░░    │   │ ░░░░░░░░     │  │ ░░░░░░░░    │                   │
│  └────────────┘   └────────────┘   └────────────┘                    │
└──────────────────────────────────────────────────────────────────────┘
 Mobile: features stack vertically.
```

## 3. Services block (`/services`, sticky split)

```
┌──────────────────────────────────────────────────────────────────────┐
│  WHAT WE MAKE                                                        │
│ ┌───────────────────────┐ ┌────────────────────────────────────────┐ │
│ │ 01  Wall Murals    ◄──│ │ ┌────────────────────────────────────┐ │ │
│ │ 02  Gate Grills       │ │ │            [ service image ]       │ │ │
│ │ 03  Artificial Rockery│ │ └────────────────────────────────────┘ │ │
│ │ 04  Water Fountains   │ │  Wall Murals                           │ │
│ │ 05  Sculpture Install.│ │  ░░░ summary ░░░░░░░░░░░░░░░░░░░░░░░░  │ │
│ │ 06  Arch. Facades     │ │  APPLICATIONS: text · text · text      │ │
│ │ 07  Planters          │ │  MATERIALS:    text · text · text      │ │
│ │ (sticky, left)        │ │  [ ENQUIRE ABOUT THIS → ]              │ │
│ └───────────────────────┘ └────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
 Mobile: accordion — tap a service to expand image + details.
```

## 4. Gallery block (`/gallery/:category`)

```
┌──────────────────────────────────────────────────────────────────────┐
│  THE PORTFOLIO                                           166 works   │
│  All  Sculptures  Murals  Fountains  GRC  Planters  Other   (text tabs, active = accent underline)    │
│ ┌──────┐┌──────────┐┌──────┐┌──────────┐                            │
│ │ [img]││  [img]   ││[img] ││  [img]   │   masonry, 4 cols desktop   │
│ │      ││          ││      ││          │   3 tablet, 2 mobile        │
│ └──────┘│          │└──────┘└──────────┘                            │
│ ┌──────┐└──────────┘┌──────────┐┌──────┐                            │
│ │ [img]│ ┌──────┐   │  [img]   ││[img] │   hover: zoom + category tag │
│ └──────┘ │[img] │   └──────────┘└──────┘                            │
│          └──────┘                                                    │
│                     [ LOAD MORE (24 of 166) ]                        │
└──────────────────────────────────────────────────────────────────────┘
```

### 4b. Lightbox

```
┌──────────────────────────────────────────────────────────────────────┐
│ SCULPTURES · 12 / 77                                          [ ✕ ]  │
│                                                                      │
│  [ ‹ ]              [  large image, contain  ]              [ › ]    │
│                                                                      │
│                [ REQUEST A QUOTE FOR THIS PIECE ]                    │
│  ▫▫▫▫▫▫▫▫▫ thumbnail strip (desktop) ▫▫▫▫▫▫▫▫▫                       │
└──────────────────────────────────────────────────────────────────────┘
 Keys: ← → Esc · Mobile: swipe left/right, tap ✕.
```

## 5. About / Process block (`/about`)

```
┌──────────────────────────────────────────────────────────────────────┐
│  WHO WE ARE          ┌─────────────────┐                             │
│  ░░░░░░░░░░░░░░░░░░  │   [about img]   │   ISO 9001:2008 badge       │
│  ░░░░░░░░░░░░░░░░░░  └─────────────────┘                             │
│                                                                      │
│  CONCEPT ──► DESIGN ──► FABRICATE ──► QUALITY CHECK ──► INSTALL      │
│  (horizontal scroll process strip, step number + 1-line text)        │
│                                                                      │
│  OUR FACILITY                                                        │
│  ┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐    │
│  │ Manufacturing││ Warehousing &││ Quality      ││ R&D          │    │
│  │ Unit         ││ Packaging    ││ Control      ││              │    │
│  └──────────────┘└──────────────┘└──────────────┘└──────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

## 6. Clients block (`/clients` grid, `/` two-row marquee)

```
 /clients  (static grid, hairline dividers, light tiles)       / (Home teaser)
┌─────────────────────────────────────────────────────┐   ┌─────────────────────────────────────┐
│ TRUSTED BY                                          │   │ TRUSTED BY                  all →   │
│ ┌────┬────┬────┬────┬────┬────┐                      │   │ ⟳ [logo][logo][logo][logo][logo]…  │
│ │logo│logo│logo│logo│logo│logo│  6 cols desktop      │   │   two rows, opposite directions, pause on hover           │
│ ├────┼────┼────┼────┼────┼────┤  3 cols tablet       │   │   static row when reduced-motion    │
│ │ …  │ …  │ …  │ …  │ …  │ …  │  2 cols mobile (30)  │   └─────────────────────────────────────┘
│ └────┴────┴────┴────┴────┴────┘                      │
└─────────────────────────────────────────────────────┘
```

## 7. Contact block (`/contact`)

```
┌──────────────────────────────────────────────────────────────────────┐
│  LET'S BUILD SOMETHING                                               │
│ ┌──────────────────────────────┐ ┌─────────────────────────────────┐ │
│ │ Name *            [        ] │ │ HEAD OFFICE                     │ │
│ │ Phone *           [        ] │ │ Kandivali East, Mumbai          │ │
│ │ Email             [        ] │ │ FACTORY                         │ │
│ │ Service *         [ ▾      ] │ │ Near Jag Mata Mandir, Vasai     │ │
│ │ Project details * [        ] │ │ CALL   +91 93232 10327          │ │
│ │                   [        ] │ │ WHATSAPP  [ Chat now ]          │ │
│ │ [ SEND ENQUIRY ]             │ │ EMAIL  inventfineart.mum@gmail  │ │
│ └──────────────────────────────┘ │ ┌─────────────────────────────┐ │ │
│                                  │ │      [ Google Map embed ]   │ │ │
│                                  │ └─────────────────────────────┘ │ │
│                                  └─────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
 Mobile: info block above form; map last; sticky call/WhatsApp bar.
```

## 8. Footer
```
┌──────────────────────────────────────────────────────────────────────┐
│ ◌ WHATSAPP            │ CALL                  │ EMAIL                │
│ Start a chat        → │ +91 93232 10327     → │ inventfineart.mum@… →│
├──────────────────────────────────────────────────────────────────────┤
│ [logo] INVENT FINE ART │ EXPLORE   │ PORTFOLIO        │ HEAD OFFICE  │
│ ISO 9001:2008 CERT.    │ Home      │ Sculptures    77 │ Kandivali…   │
│ about copy (verbatim)  │ About     │ Wall Murals   35 │ FACTORY      │
│ tagline (italic)       │ Services  │ Fountains     18 │ Near Jag…    │
│ NEWSLETTER [email][Sub]│           │                  │              │
│ FOLLOW  [f] [X] [P]    │           │                  │              │
│                        │ Gallery   │ GRC           15 │ Get directions→
│                        │ Clients   │ Planters       4 │ PHONE ×3     │
│                        │ FAQ       │ Other         17 │              │
│                        │ Contact   │                  │              │
├──────────────────────────────────────────────────────────────────────┤
│ © 2026 Invent Fine Art · ISO 9001:2008 certified      BACK TO TOP ↑  │
└──────────────────────────────────────────────────────────────────────┘
 < lg: channel row stacks; main grid becomes brand (full width) + 3 columns (md) / 2 columns (phone).
```

## 8b. Cookie notice (all pages, first visit and via footer "Cookie settings")
```
 desktop: bottom-right, 440px            phone: bottom sheet, full width
┌────────────────────────────────────┐  ──── (bronze rule draws in)
│ COOKIES & PRIVACY      Invent Fine Art│
│ A quiet note on cookies              │
│ We use no advertising or analytics   │
│ cookies. The studio map … loads only │
│ if you allow it.                     │
│ [ACCEPT ALL] [ESSENTIAL ONLY] Customise
│ ── Essential ........... Required ── │   (Customise view)
│ ── Embedded map ........ [switch] ── │
│ [SAVE CHOICES]                       │
└────────────────────────────────────┘
 Contact page map without consent: hairline panel + [LOAD MAP] + "Open in Google Maps →"
```

## 9. Floating elements
- Mobile: bottom-right circular WhatsApp button; hides while lightbox is open.
- Top: thin scroll-progress bar in accent colour.

## 10. Breakpoints
| Name | Width | Gallery cols | Notes |
|------|-------|--------------|-------|
| sm | < 640 | 2 | single column layouts, accordion services |
| md | 640–1023 | 3 | |
| lg | 1024–1439 | 4 | sticky services split |
| xl | ≥ 1440 | 4–5 | max container 1280 |
