# 01 — Statement of Work (SOW)

**Project:** Invent Fine Art website rebuild
**Client:** Invent Fine Art (Kandivali East, Mumbai)
**Vendor:** VernoraTech
**Version:** 0.1 (draft) · **Date:** 2026-10-05

## 1. Objective
Replace the legacy multi-page website (12 static HTML pages, 2017-era design) with a modern, fast, multi-page website (same 12-page structure, new design) that showcases the company's work, builds trust (ISO 9001, client list) and converts visitors into enquiries.

## 2. Scope of Work (In Scope)

### 2.1 Page list (multi-page, 13 routes + 404)
| # | Route | Page | Replaces legacy page |
|---|-------|------|----------------------|
| 1 | `/` | Home | index.html |
| 2 | `/about` | About | about-us.html |
| 3 | `/services` | Services | services.html |
| 4 | `/gallery` | Gallery hub | gallery.html |
| 5–10 | `/gallery/{sculptures, wall-murals, water-fountains, grc-products, planters, other}` | 6 category pages with lightbox | sculptures, wall_murals, water_fountains, grc-products, planter, other .html |
| 11 | `/clients` | Clients | our_client.html |
| 12 | `/contact` | Contact | contact-us.html |
| 13 | `/faq` | FAQ (new page; also a 6-question teaser on Home) | — (new) |
| — | `*` | 404 | — |

Shared on every page: header/nav, footer, floating WhatsApp (mobile). Full detail in `03-IA-Sitemap.md`.

### 2.2 Deliverables
1. Responsive multi-page website (mobile, tablet, desktop) built with React + Vite + Tailwind CSS 4.3 + React Router.
2. Gallery hub plus 6 category pages covering all ~166 artworks, each with lightbox and "request a quote" action.
3. Optimised image set (WebP, thumbnails + full size) generated from the archived media.
4. Contact page: form (pre-filled WhatsApp/email), click-to-call, map embed.
5. SEO per page: unique titles/descriptions/canonicals, Open Graph, LocalBusiness + breadcrumb structured data, sitemap.xml (13 URLs), robots.txt, 301 redirects from the 12 legacy `.html` URLs.
6. Deployment to the agreed hosting platform and domain hook-up.
7. This documentation set.

## 3. Out of Scope
- CMS / admin panel (content is edited in code; can be quoted separately).
- E-commerce, payments, user accounts.
- Multi-language versions.
- Blog, copywriting of new content, new photography.
- Backend form storage / CRM integration (unless decision D2 changes).
- Ongoing SEO campaigns, ads, social media management.
- Domain purchase and email hosting.

## 4. Assumptions
- All content and images come from the archived data (`old data/`); client approves reuse.
- Client supplies any new captions, project names, social links and a testimonial/stat updates.
- Client provides hosting/domain access (see TRD).
- One consolidated feedback round per milestone.

## 5. Timeline (proposed — confirm)

| Milestone | Duration | Output |
|-----------|----------|--------|
| M0 Docs & approvals | 2 days | This doc set signed off |
| M1 Setup, assets, tokens, router, layout, Home | 4 days | Nav/footer + Home live in preview |
| M2 Gallery hub, 6 category pages, lightbox | 5 days | Core showcase working |
| M3 About, Services, Clients, Contact, 404 | 5 days | All 13 pages content-complete |
| M4 QA, per-page SEO, redirects, a11y, performance | 3 days | Release candidate |
| M5 Deploy & handover | 1 day | Live site |
| **Total** | **~20 working days** | |

## 6. Budget
| Item | Amount |
|------|--------|
| Total fixed price | **TBD — to be filled by VernoraTech/client (D4)** |
| Payment schedule | TBD (suggest 40% start / 30% M2 / 30% launch) |
| Change requests | Quoted separately in writing |

## 7. Acceptance Criteria
- All 13 pages in 2.1 present, linked correctly and matching approved mockups.
- Lighthouse (mobile) ≥ 90 Performance/Accessibility/Best-Practices/SEO on the deployed URL.
- All 6 gallery category pages show correct counts and open in the lightbox; each page has a unique title/description.
- Contact actions (call, WhatsApp, email, map) work on mobile and desktop.
- No console errors; `npm run build` and `npm run lint` pass.

## 8. Change Control
Any addition outside section 2 requires a written change request with estimated effort and timeline impact before work starts.

## 9. Sign-off
| Role | Name | Date | Signature |
|------|------|------|-----------|
| Client | | | |
| VernoraTech | | | |
