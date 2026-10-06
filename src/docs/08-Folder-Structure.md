# 08 — Frontend Folder Structure (multi-page)

Conventions for `frontend/`. Keep to this so the project stays easy to manage.

```
frontend/
├── index.html                 # entry HTML (default title/meta; per-route head set by usePageMeta)
├── package.json · vite.config.js · .oxlintrc.json · .gitignore · vercel.json
├── public/                    # served as-is at site root
│   ├── favicon.* · og-image.jpg · robots.txt · sitemap.xml (all 13 URLs)
│   └── assets/                # OPTIMISED images only (WebP), copied from `old data/media`
│       ├── brand/ hero/ intro/ services/ about/ clients/
│       └── gallery/{sculptures,murals,fountains,grc,planters,other}/
├── api/                       # Vercel serverless functions (server only; never bundled into the site)
│   ├── chat.js                # POST /api/chat (chatbot; Groq call is added in the backend phase)
│   └── _lib/knowledge.generated.js   # GENERATED from chatbot/ by scripts/build-knowledge.mjs
├── chatbot/                   # the chatbot's brain: facts, prompts, regression questions (not shipped to the browser)
│   ├── README.md · SOURCES.md
│   ├── knowledge/NN-*.md      # facts, one topic per file (front matter: id, title, tags, source)
│   ├── prompts/{system,handoff}.md
│   └── evals/questions.json
├── environments/.env          # local secrets (git-ignored)  ·  .env.example lists the variable names
├── scripts/                   # portable one-off Node tools (no machine-specific paths)
│   ├── optimize-images.mjs    # old data/media -> public/assets (WebP, thumb + full)
│   ├── build-manifest.mjs     # scans assets -> src/data/gallery.js
│   ├── build-knowledge.mjs    # chatbot/*.md -> api/_lib/knowledge.generated.js (runs before every build)
│   └── generate-sitemap.mjs   # routes -> public/sitemap.xml (optional)
└── src/
    ├── main.jsx               # bootstrap + <RouterProvider>/<BrowserRouter>
    ├── routes.jsx             # the single route table (lazy-loaded pages)
    ├── layouts/
    │   └── RootLayout.jsx     # Nav + <Outlet/> + Footer + FloatingWhatsApp + scroll/focus reset
    ├── pages/                 # one file per route — pages COMPOSE components, hold page copy via data/
    │   ├── Home.jsx · About.jsx · Services.jsx · GalleryHub.jsx
    │   ├── GalleryCategory.jsx      # serves all 6 /gallery/:category routes
    │   ├── Clients.jsx · Contact.jsx · NotFound.jsx
    ├── components/            # shared building blocks (only what is genuinely reused or complex)
    │   │                      #   Nav, Footer, FloatingWhatsApp, PageHeader, Hero, Lightbox,
    │   │                      #   MasonryGrid, ServiceList, ContactForm, ClientMarquee, CtaBand …
    ├── data/                  # content as data: site.js, services.js, clients.js, categories.js, gallery.js (generated)
    ├── hooks/                 # usePageMeta, useReveal, useLightbox (useScrollSpy no longer needed)
    ├── styles/                # tokens.css (Tailwind v4 `@theme` — the ONLY token source), base.css
    ├── chatbot/               # chat UI: components/ hooks/ services/ (mock + real adapters) data/ (UI copy)
    ├── utils/                 # whatsapp link builder, validators, slugs
    └── docs/                  # project documentation + tracker (this folder)
```

## Rules
1. **Never write to `old data/`.** It is the read-only archive; copy from it via scripts.
2. Originals are never served; only optimised files in `public/assets/`.
3. Content lives in `src/data/`, not hard-coded in components or pages.
4. Styling is **Tailwind CSS v4.3** (`@tailwindcss/vite`). Colours/fonts/spacing/radius/easing come only from the `@theme` tokens in `styles/tokens.css` — define each token once. Banned utilities/patterns: see `10-Design-Rules-and-Audit.md`.
5. **Routing:** `react-router` (library mode). All routes live in `routes.jsx`; pages are `React.lazy` chunks; one `GalleryCategory` page serves the six category routes from `data/categories.js`.
6. Every page sets its own head via `usePageMeta({ title, description, path })` (title, meta description, canonical, OG url).
7. Component names PascalCase; hooks `useX`; data/util files camelCase; asset files lowercase-kebab (`sculptures-001.webp`). Do not create components only to raise the count.
8. Generated files (`data/gallery.js`, `public/assets/**`, `sitemap.xml`) come from `scripts/`; re-run scripts rather than editing by hand.
9. Update `docs/README.md` tracker when a phase completes; when `09-BUILD-PROMPT.md` changes, sync 01–08 in the same change.
10. Dev-only scripts must be portable (no absolute paths); delete leftovers.
