// PLACEHOLDER DATA — replace with real awards before launch.
// Owner decision 2026-10-07: ship flagged MOCK awards for layout review.
// See Decision D12 in src/docs/README.md and documentation in 13-ABOUT-PAGE-PROMPT.md.

export const SHOW_MOCK_AWARDS = true;

export const certifications = [
  {
    id: 'iso-9001-2008',
    title: 'ISO 9001:2008',
    subtitle: 'Quality Management System',
    status: 'Certified company',
    description:
      'Certified for trading, manufacturing, supplying and fixing a top-class quality artwork of indoor and outdoor decor products in line with industry quality norms.',
    image: null,
  },
];

export const awards = [
  {
    id: 'award-sample-1',
    year: '2024',
    title: 'Global Architectural Art Award (sample)',
    issuer: 'Council of Architectural Arts',
    category: 'Commercial Installations',
    image: '/assets/awards/award-1.webp',
    description:
      'Excellence in large-scale architectural bronze and crystal spatial installations for prime commercial developments.',
    mock: true,
  },
  {
    id: 'award-sample-2',
    year: '2022',
    title: 'Architectural Facade Design Award (sample)',
    issuer: 'National Design & Facade Forum',
    category: 'Facade Innovation',
    image: '/assets/awards/award-2.webp',
    description:
      'Honoured for bespoke GRC screen systems, geometric relief wall cladding, and engineering precision across hospitality landmarks.',
    mock: true,
  },
  {
    id: 'award-sample-3',
    year: '2020',
    title: 'Artisanal Achievement Award (sample)',
    issuer: 'Guild of Fine Art Craftsmen',
    category: 'Sculpture & Relief Craft',
    image: '/assets/awards/award-3.webp',
    description:
      'Recognizing mastery in cast bronze sculpture, handcrafted relief murals, and turnkey site installation across India.',
    mock: true,
  },
  {
    id: 'award-sample-4',
    year: '2018',
    title: 'Architectural Water Feature Award (sample)',
    issuer: 'Spatial Design & Landscape Association',
    category: 'Water Architecture',
    image: '/assets/awards/award-4.webp',
    description:
      'Distinction in outdoor monumental water fountains, kinetic sculpture integration, and bespoke landscape water bodies.',
    mock: true,
  },
];

export default awards;
