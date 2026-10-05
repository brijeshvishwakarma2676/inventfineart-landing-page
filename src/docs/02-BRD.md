# 02 — Business Requirements Document (BRD)

**Version:** 0.1 · **Date:** 2026-10-05

## 1. Business Background
Invent Fine Art (est. 2008/09, ISO 9001:2008 certified) designs, manufactures and installs sculptures, wall murals, water fountains, GRC facades, planters, gate grills and artificial rockery for residential, hospitality and corporate projects. Head office: Kandivali East, Mumbai. Factory: near Jag Mata Mandir, Vasai/Virar.

The current site is dated, has a non-mobile-first layout, repetitive near-identical gallery pages, and obsolete social links (Google+). The rebuild keeps the 12-page structure (so existing links and search ranking carry over) but gives every page a distinct, modern composition.

## 2. Business Goals
| ID | Goal | Measure |
|----|------|---------|
| G1 | Generate more qualified project enquiries | Enquiries (form + WhatsApp + calls) per month |
| G2 | Present the portfolio as premium work | Gallery engagement, time on page |
| G3 | Build credibility | ISO badge, 30 client logos, years in business visible above the fold |
| G4 | Be found locally | Ranking for "sculpture / GRC / murals manufacturer Mumbai" |
| G5 | Work well on phones | Mobile Lighthouse ≥ 90 |

## 3. Target Audience
| Persona | Needs | Likely entry |
|---------|-------|--------------|
| Architects & interior designers | See range, materials, past projects; request custom work | Search, referral |
| Real-estate developers / builders | Facades, fountains, entrance art at scale; proof of delivery | Referral, client list |
| Hotels, restaurants, corporates | Lobby sculptures, murals, water features | Search, Instagram/WhatsApp |
| Homeowners / villa owners | Planters, fountains, rockery, murals | Search, social |

Primary device: mobile (WhatsApp/phone-first, India). Secondary: desktop for design professionals.

## 4. Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| F1 | Multi-page site (13 routes) with persistent header/footer and route-based navigation | Must |
| F2 | Hero with rotating banners and primary CTA | Must |
| F3 | Services section listing all 7 services with materials/applications | Must |
| F4 | Gallery hub + 6 category pages, lazy loading, load-more | Must |
| F5 | Lightbox on category pages with next/prev/keyboard/swipe and "Request a quote" (prefills contact) | Must |
| F6 | Clients page (all 30 logos) + marquee teaser on Home | Should |
| F7 | About/process section incl. ISO 9001 and 4 facility units | Must |
| F8 | Contact section: form, click-to-call, WhatsApp, email, both addresses, map | Must |
| F9 | Floating WhatsApp button on mobile | Should |
| F10 | Per-page SEO meta, Open Graph, structured data, sitemap, legacy URL redirects | Must |
| F11 | Respect `prefers-reduced-motion`; keyboard accessible | Must |

## 5. Contact Form Requirements
Fields (carried over from legacy, with improvements):

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | text | Yes | |
| Phone | tel | Yes | Indian format hint |
| Email | email | No | |
| Service needed | select | Yes | 7 services + "Other" |
| Message / project details | textarea | Yes | min 10 chars |
| Referenced artwork | hidden | — | Auto-filled when opened from lightbox |

Behaviour (default, decision D2): on submit, validate and open `wa.me/919323210327` with a pre-filled message; offer `mailto:inventfineart.mum@gmail.com` as fallback. Inline validation errors, success state, no page reload. Honeypot field for spam.
Alternative (if client prefers): POST to Formspree/Web3Forms endpoint and show confirmation.

## 6. Non-Functional Requirements
- Load: LCP < 2.5s on 4G mobile; images lazy-loaded and in WebP.
- Accessible: WCAG 2.1 AA contrast, alt text, focus states.
- Browser support: last 2 versions of Chrome, Safari, Edge, Firefox; iOS Safari 15+.
- Maintainable: gallery driven by a data manifest so adding artwork = add file + entry.

## 7. Constraints & Assumptions
- Static front-end only (no backend) unless D2 changes.
- Existing photography only; no captions exist in source data.
- Budget/timeline per SOW.

## 8. Risks
| Risk | Impact | Mitigation |
|------|--------|-----------|
| 47 MB of unoptimised images | Slow load | WebP conversion, thumbnails, lazy load |
| No captions/project names | Weak gallery storytelling | Category labels + numbering; client may add captions later |
| Legacy stats ("2008" vs "2009") inconsistent | Credibility | Client to confirm founding year |
| Client logos are JPG on white | Look off on dark theme | Place on light cards or grayscale-to-colour tiles |

## 9. Success Criteria
Site live, meets SOW acceptance criteria, and shows measurable enquiry channel traffic within 30 days of launch.
