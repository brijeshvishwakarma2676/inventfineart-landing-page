# Invent Fine Art — website

Multi-page site (13 routes + 404): React 19, Vite 8, Tailwind CSS 4.3, React Router. Deployed on Vercel.

## Commands
- `npm run dev` — dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the build locally (SPA fallback included)
- `npm run lint` — oxlint
- `npm run assets` — regenerate optimised images (`public/assets`) from `../old data/media` (read-only) and the gallery data files (`src/data/gallery*.js`)

## Routes
`/`, `/about`, `/services`, `/gallery`, `/gallery/{sculptures,wall-murals,water-fountains,grc-products,planters,other}`, `/clients`, `/faq`, `/contact`. Legacy `.html` URLs redirect via `vercel.json`.

## Docs
Planning, design rules, build prompts and the progress tracker live in `src/docs/` (start with `src/docs/README.md`; design rules and audit commands in `10-Design-Rules-and-Audit.md`).

## Env (optional)
`VITE_FORM_ENDPOINT` — if set, the contact form POSTs JSON there instead of handing off to WhatsApp.
