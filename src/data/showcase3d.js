// Hand-picked pieces for the immersive 3D view on /gallery (real archive thumbnails, mixed categories and
// proportions). Kept separate from the generated manifest so the hub never imports it.
const pick = (dir, slug, label, n) => ({
  src: `/assets/gallery/${dir}/${dir}-${String(n).padStart(3, '0')}-thumb.webp`,
  alt: `${label} artwork #${n} by Invent Fine Art`,
  to: `/gallery/${slug}?img=${n}`,
});

export const showcase3d = [
  pick('sculptures', 'sculptures', 'Sculptures', 1),
  pick('murals', 'wall-murals', 'Wall Murals', 4),
  pick('fountains', 'water-fountains', 'Water Fountains', 1),
  pick('grc', 'grc-products', 'GRC Products', 1),
  pick('sculptures', 'sculptures', 'Sculptures', 5),
  pick('planters', 'planters', 'Planters', 1),
  pick('murals', 'wall-murals', 'Wall Murals', 2),
  pick('other', 'other', 'Other Creations', 1),
  pick('fountains', 'water-fountains', 'Water Fountains', 3),
  pick('sculptures', 'sculptures', 'Sculptures', 10),
  pick('grc', 'grc-products', 'GRC Products', 3),
  pick('murals', 'wall-murals', 'Wall Murals', 10),
];
