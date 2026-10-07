# Where the chatbot's facts come from

**Ground truth = the original website HTML:** `old data/raw_html/*.html` (read-only archive of https://www.inventfineart.com/). Every statement in `knowledge/*.md` must be traceable to one of those pages, or to a verified fact about the new website itself (gallery counts, page paths, the contact form behaviour).

**Do NOT use as a source:**
- `old data/pages/*.md` and `old data/site_data.json` (a summary produced during archiving; it adds materials, applications and phrasing that are not on the original pages)
- `src/data/services.js`, `src/data/faqs.js` and other new-site copy until it has been checked against the raw HTML (see "Known gaps" below)

| Knowledge file | Source pages |
|---|---|
| 00-identity | index.html, about-us.html |
| 01-services | services.html, index.html |
| 02-capabilities-and-process | about-us.html, index.html |
| 03-gallery-and-portfolio | gallery pages (counts from the archived images) |
| 04-contact-and-locations | contact-us.html and the footer of every page |
| 05-faq | restates the files above |
| 06-clients | our_client.html (30 logos, no names) |
| 07-boundaries-and-unknowns | what the pages do not say |

## Rule for adding a fact
Add it to the right file **with its source page**, keep the studio's own wording where possible, and run `npm run knowledge`. If you cannot point to a source page, it does not go in. Unknown is a valid answer; the assistant hands off to a person.

## Known gaps between the new website copy and the original (as of 2026-10-06)
The chatbot follows the original. These pieces of new-site copy are NOT supported by the original HTML and should be corrected or confirmed with the studio:
1. Service "applications" and "materials" lists in `src/data/services.js` (e.g. bronze, brass, stainless steel, terracotta, CNC panels, fiberglass, hotels/atrium lists, "recirculating pumps"). The original names only GRC and FRP.
2. "Rust proof / weatherproof / corrosion-resistant" claims (home page feature, FAQ). In the original, the "Rust proof" box talks about grills being available in numerous designs and customisations.
3. Factory location shown as "Near Jag Mata Mandir, Vasai/Virar". The original says "Opp. Jag Mata Mandir, Wagholi Road, Nalasopra West, Thane - 401203".
4. The FAQ answers about materials and outdoor suitability, and the About "process" step descriptions, which go beyond the original wording.
5. Founding year: confirmed as 2009 across the site (owner decision 2026-10-07).
