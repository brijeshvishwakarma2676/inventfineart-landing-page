// FAQ content. Every answer restates facts from the archived site (about/services/contact copy).
// Do not add pricing, lead times or other claims that are not in the source data.
export const faqGroups = [
  {
    id: 'studio',
    title: 'The studio',
    items: [
      {
        id: 'what-we-do',
        q: 'What does Invent Fine Art do?',
        a: 'Invent Fine Art is an ISO 9001 : 2008 certified company that trades in, manufactures, supplies and fixes top-class art work for indoor and outdoor decor, including sculptures, wall murals, water fountains, architectural facades and planters.',
      },
      {
        id: 'iso',
        q: 'Are you ISO certified?',
        a: 'Yes. Invent Fine Art is an ISO 9001 : 2008 certified company.',
      },
      {
        id: 'location',
        q: 'Where are you based?',
        a: 'Our head office is in Kandivali East, Mumbai, Maharashtra. Our factory is near Jag Mata Mandir in the Vasai/Virar region of Maharashtra.',
        link: { to: '/contact', label: 'Contact details and map' },
      },
      {
        id: 'who',
        q: 'Who do you work with?',
        a: 'We are a team of artisans and product designers who create products for designers and architects for their projects. Our work is used in residential, hotel and corporate spaces.',
        link: { to: '/clients', label: 'See our clients' },
      },
    ],
  },
  {
    id: 'services',
    title: 'Services and products',
    items: [
      {
        id: 'services',
        q: 'What services do you offer?',
        a: 'Wall murals, gate grills, artificial rockery, water fountains, sculpture art installation, architectural facades and planters.',
        link: { to: '/services', label: 'View all services' },
      },
      {
        id: 'custom',
        q: 'Can you make something to our own design?',
        a: 'Yes. We manufacture art products as per custom client design and architectural requirement, and we provide start-to-end solutions from conceptualisation to complete execution.',
      },
      {
        id: 'materials',
        q: 'What materials do you work with?',
        a: 'Depending on the product: GRC, FRP/fiberglass, metal alloys, bronze, brass, stainless steel, stone, terracotta, ceramic, composite acrylic and wooden relief.',
      },
      {
        id: 'outdoor',
        q: 'Are your products suitable for outdoors?',
        a: 'Our range includes outdoor decor, finished with weatherproof, corrosion-resistant (rust-proof) outdoor treatments.',
      },
      {
        id: 'install',
        q: 'Do you install the work as well?',
        a: 'Yes. We supply and fix the art work, and deliver it in premium quality packing. Fixing is part of our start-to-end service.',
      },
    ],
  },
  {
    id: 'enquiries',
    title: 'Enquiries',
    items: [
      {
        id: 'quote',
        q: 'How do I request a quote?',
        a: 'Use the form on the Contact page, or message us on WhatsApp, call or email. If you are looking at a specific piece in the gallery, use “Request a quote for this piece” so its reference is included.',
        link: { to: '/contact', label: 'Request a quote' },
      },
      {
        id: 'details',
        q: 'What details should I share?',
        a: 'The project location, approximate dimensions, whether it is for an indoor or outdoor placement, preferred materials and your timeline.',
      },
      {
        id: 'outside',
        q: 'Do you work outside Mumbai?',
        a: 'Yes. We are engaged in supplying and exporting art work and serve customers beyond Mumbai. Contact us with your location to discuss your project.',
      },
    ],
  },
];

export const allFaqs = faqGroups.flatMap((g) => g.items);

// Shown on the Home page (the full list lives on /faq).
const HOME_IDS = ['what-we-do', 'services', 'custom', 'install', 'quote', 'iso'];
export const homeFaqs = HOME_IDS.map((id) => allFaqs.find((f) => f.id === id));
