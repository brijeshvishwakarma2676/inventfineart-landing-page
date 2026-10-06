import { categoryCounts, totalWorksCount } from './gallery-meta';

// One entry per /gallery/:slug route. `key` links to the generated gallery manifest.
export const galleryCategories = [
  {
    slug: 'sculptures',
    key: 'sculptures',
    label: 'Sculptures',
    intro: 'Indoor and outdoor sculpture for home, garden and corporate spaces.',
    cover: '/assets/gallery/covers/sculptures_cover.webp',
    serviceSlug: 'sculptures-art-installation',
  },
  {
    slug: 'wall-murals',
    key: 'murals',
    label: 'Wall Murals',
    intro: 'Murals and decorative wall treatments for residential and corporate workspaces.',
    cover: '/assets/gallery/covers/wall_murals_cover.webp',
    serviceSlug: 'wall-murals',
  },
  {
    slug: 'water-fountains',
    key: 'fountains',
    label: 'Water Fountains',
    intro: 'Indoor and outdoor water bodies and fountains.',
    cover: '/assets/gallery/covers/water_fountains_cover.webp',
    serviceSlug: 'water-fountains',
  },
  {
    slug: 'grc-products',
    key: 'grc',
    label: 'GRC Products',
    intro: 'GRC products, grills and architectural screens.',
    cover: '/assets/gallery/covers/grc_products_cover.webp',
    serviceSlug: 'architectural-facades',
  },
  {
    slug: 'planters',
    key: 'planters',
    label: 'Planters',
    intro: 'Designer planters for indoor and outdoor spaces.',
    cover: '/assets/gallery/covers/planters_cover.webp',
    serviceSlug: 'planters',
  },
  {
    slug: 'other',
    key: 'other',
    label: 'Other Creations',
    intro: 'Artistic and rockery creations.',
    cover: '/assets/gallery/covers/other_products_cover.webp',
    serviceSlug: 'artificial-rockery',
  },
].map((c) => ({ ...c, count: categoryCounts[c.key] || 0 }));

// "Quick browse" sentence on /gallery: category names open a cover preview (see HoverPreviewText).
export const galleryLeadParts = [
  'Start with our ',
  { key: 'sculptures', text: 'sculptures' },
  ', ',
  { key: 'wall-murals', text: 'wall murals' },
  ' or ',
  { key: 'water-fountains', text: 'water fountains' },
  ', then explore ',
  { key: 'grc-products', text: 'GRC products' },
  ', ',
  { key: 'planters', text: 'planters' },
  ' and our artistic and ',
  { key: 'other', text: 'rockery creations' },
  '.',
];
export const galleryLeadPreviews = Object.fromEntries(
  galleryCategories.map((c) => [
    c.slug,
    { image: c.cover, title: c.label, subtitle: `${c.count} works`, to: `/gallery/${c.slug}`, linkLabel: `View ${c.label}` },
  ]),
);

export const getCategory = (slug) => galleryCategories.find((c) => c.slug === slug);

export { totalWorksCount };
