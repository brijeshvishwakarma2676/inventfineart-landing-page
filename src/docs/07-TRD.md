# 07 — Technical Requirements Document (TRD)

## 1. Stack
| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | React 19 + Vite 8 | already scaffolded in `frontend/` |
| Language | JavaScript (JSX) | matches scaffold |
| 3D (Gallery hub only) | `three` + `@react-three/fiber`, lazy chunk, started on demand; no `drei` | Owner request 2026-10-06 |
| Styling | **Tailwind CSS v4.3** via `@tailwindcss/vite` (no PostCSS config, no `tailwind.config.js`); design tokens defined once in `src/styles/tokens.css` using `@theme` | Decision D7. Utilities restricted by the design rules in `10-Design-Rules-and-Audit.md` |
| Routing | **`react-router` (library mode)**, 13 routes + 404, lazy-loaded pages, one `GalleryCategory` page for the 6 category routes | Decision D8 |
| Animation | CSS + IntersectionObserver; no heavy libs | |
| Lint | oxlint (configured) | `npm run lint` must pass |
| Image tooling | one-off Node script with `sharp` (dev only) | output to `public/assets` |
| Package manager | npm | |

## 2. Project structure (planned)
```
frontend/
  public/assets/{hero,gallery,services,clients,about,brand}/
  public/{favicon.svg, og-image.jpg, robots.txt, sitemap.xml}
  scripts/optimize-images.mjs, build-manifest.mjs
  src/
    components/ Nav Hero Intro Services Gallery Lightbox About Clients Contact Footer FloatingWhatsApp
    data/ gallery.js services.js clients.js site.js
    hooks/ useReveal useScrollSpy
    styles/ tokens.css base.css
    docs/  ← this documentation
    App.jsx main.jsx
```

## 3. Hosting & domain
| Item | Decision | Status |
|------|----------|--------|
| Hosting | **Vercel** (decided, D5). Framework preset: Vite. Deploy from the `frontend` git repo; `old data/` is never deployed. | ✅ |
| Build command | `npm run build` | |
| Output dir | `dist` | |
| Node version | 20 LTS+ | |
| Domain | inventfineart.com (existing). Add it in the Vercel project → Domains; set `www` ↔ apex redirect there; use the DNS records Vercel displays (A/CNAME) | ⬜ |
| Registrar access | Client to provide registrar login or add DNS records themselves | ⬜ |
| DNS | A/CNAME to host; keep any MX records untouched if business email uses the domain | ⬜ verify existing email setup before change |
| SSL | automatic (host-managed) | |
| Redirects | www ↔ apex; **SPA fallback** (all unknown paths → `index.html`, 200); 301s from the 12 legacy `.html` URLs to the new routes (table in `03-IA-Sitemap.md` §5) via **`vercel.json`** at the project root (`rewrites` for the SPA fallback, `redirects` with `permanent: true` for the 12 legacy URLs). Vercel serves real files (assets, sitemap, robots) before applying rewrites. | planned |

### 3b. `vercel.json` (planned contents)
- `redirects` (permanent): `/index.html→/`, `/about-us.html→/about`, `/services.html→/services`, `/gallery.html→/gallery`, `/sculptures.html→/gallery/sculptures`, `/wall_murals.html→/gallery/wall-murals`, `/water_fountains.html→/gallery/water-fountains`, `/grc-products.html→/gallery/grc-products`, `/planter.html→/gallery/planters`, `/other.html→/gallery/other`, `/our_client.html→/clients`, `/contact-us.html→/contact`.
- `rewrites`: `/(.*)` → `/index.html` (SPA fallback so deep links and refresh work; unknown routes render the React 404 page).
- `headers`: long-lived immutable cache for `/assets/*`, `/fonts/*` and hashed build files; `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`; basic CSP allowing Google Fonts and the Google Maps embed.
- Preview deployments (per branch/PR) are used for client review before the domain is switched. Vercel Analytics / Speed Insights are optional (decide with analytics choice below).

## 4. SEO
Page-level (every route):
- Every route sets its own head through `usePageMeta` (unique `<title>` ≤60 chars, description ≤155 chars, canonical, `og:url`). Home title: Invent Fine Art | Sculptures, Wall Murals, GRC Facades & Water Fountains – Mumbai. Others follow `<Page> | Invent Fine Art`.
- `<meta description>` (≤155 chars): "ISO 9001 certified manufacturer of sculptures, wall murals, GRC facades, water fountains and planters. Based in Mumbai. Request a quote."
- `<link rel=canonical>`, `lang="en-IN"`, theme-color.
- Open Graph + Twitter card (1200×630 `og-image.jpg` from a hero banner).
- JSON-LD `LocalBusiness`/`Organization`: name, address (Kandivali East, Mumbai), phones, email, geo (factory), `sameAs` (socials), opening hours (TBD).
- One `<h1>`; semantic landmarks; descriptive alt text.
- `robots.txt` + `sitemap.xml` listing all 13 URLs (no 404).
- JSON-LD: `LocalBusiness` on Home and Contact; `BreadcrumbList` on gallery category pages.
- Optional (D9): build-time prerender of all routes (e.g. `vite-react-ssg` or post-build script) for crawlers that don't run JS; if skipped, report as a known limitation.
- Google Search Console + Analytics (GA4 or privacy-friendly Plausible): property verification needs client access (⬜).

## 5. Performance budget
| Metric | Target |
|--------|--------|
| LCP (mobile 4G) | < 2.5 s |
| CLS | < 0.05 (explicit image width/height) |
| JS bundle (gz) | < 120 KB |
| Initial image payload | < 1.2 MB (hero + first 12 thumbs) |
| Gallery | `loading="lazy"`, `decoding="async"`, 24 initial tiles |

## 6. Accessibility & compatibility
WCAG 2.1 AA; keyboard operable; reduced-motion respected. Browsers: Chrome/Edge/Firefox/Safari last 2 versions, iOS Safari 15+, Android Chrome.

## 7. Contact form technical notes
- Client-side validation; honeypot field.
- Default: `https://wa.me/919323210327?text=<encoded message>` and `mailto:` fallback.
- Optional: Formspree/Web3Forms endpoint stored in `VITE_FORM_ENDPOINT` env var.
- No secrets in repo; `.env` ignored (already in `.gitignore`).

## 7b. Resilience on slow networks
Boot loader before JS, `SmartImage` (reserved box + shimmer + LQIP blur-up + fade-in + retry-on-error), progressive lightbox (thumbnail → full), route progress bar + `PageSkeleton`, and slow-connection adaptations (`isSlowConnection()`: skip intro, smaller gallery batches, no 3D auto-start). Details in `09-BUILD-PROMPT.md` → LOADING STATES & SLOW CONNECTIONS.

## 8. Security & privacy
- **Cookies/consent:** no analytics or ad cookies today. Google Maps is the only embed that may set cookies and is gated behind explicit consent (`useConsent`, `localStorage` key `ifa-consent-v1`). The footer "Cookie settings" link reopens the notice. If GA4/Plausible or other embeds are added (open question below), add a consent category and update the notice copy.
- HTTPS only; security headers via host config (`X-Content-Type-Options`, `Referrer-Policy`, basic CSP allowing the Maps embed (fonts are self-hosted, so no font CDN is needed)).
- Map iframe: `loading="lazy"`, `referrerpolicy="no-referrer-when-downgrade"`.
- If analytics added: cookie notice only if cookies are used.

## 9. QA checklist
- [ ] `npm run build` and `npm run lint` pass
- [ ] Lighthouse mobile ≥ 90 in all four categories
- [ ] All gallery categories + counts verified against files
- [ ] Lightbox: keyboard, swipe, focus trap
- [ ] Form validation + WhatsApp/email handoff on iOS & Android
- [ ] Call / WhatsApp / mailto links
- [ ] Legacy URL redirects work
- [ ] OG preview verified (WhatsApp/Facebook debugger)
- [ ] Tested at 360, 768, 1024, 1440 widths

## 10. Open technical questions
1. Does the client have business email on this domain (affects DNS)?
2. Who owns the existing hosting account and until when?
3. GA4 vs Plausible vs none?
4. Is a CMS needed within 6 months? (if yes, structure data now for easy migration)
