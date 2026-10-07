import { siteData } from './site';
import { galleryCategories } from './categories';

export const SITE_URL = 'https://www.inventfineart.com';

const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const pageMeta = {
  home: {
    path: '/',
    title: 'Invent Fine Art | Sculptures, Wall Murals, GRC Facades & Water Fountains – Mumbai',
    description:
      'ISO 9001:2008 certified maker & installer of sculptures, murals, GRC facades, fountains & architectural art in Mumbai since 2009.',
  },
  about: {
    path: '/about',
    title: 'About | Invent Fine Art',
    description:
      'ISO 9001:2008 certified art studio in Kandivali East, Mumbai. Master craftsmen executing sculptures, murals, facades & fountains since 2009.',
  },
  services: {
    path: '/services',
    title: 'Services | Invent Fine Art',
    description:
      'Wall murals, gate grills, artificial rockery, water fountains, sculpture installation, architectural facades and planters.',
  },
  gallery: {
    path: '/gallery',
    title: 'Gallery | Invent Fine Art',
    description: `Browse ${galleryCategories.reduce((n, c) => n + c.count, 0)} works across sculptures, wall murals, water fountains, GRC products, planters and more.`,
  },
  clients: {
    path: '/clients',
    title: 'Our Clients | Invent Fine Art',
    description: 'The clients Invent Fine Art has worked with on art installations and architectural decor.',
  },
  contact: {
    path: '/contact',
    title: 'Contact | Invent Fine Art',
    description:
      'Request a quote or start a project. WhatsApp, call or email Invent Fine Art, Kandivali East, Mumbai.',
  },
  faq: {
    path: '/faq',
    title: 'FAQ | Invent Fine Art',
    description:
      'Answers about Invent Fine Art: services, custom work, installation, materials, location and how to request a quote.',
  },
  notFound: {
    path: '/404',
    title: 'Page not found | Invent Fine Art',
    description: 'This page could not be found.',
  },
};

export const categoryMeta = (cat) => ({
  path: `/gallery/${cat.slug}`,
  title: `${cat.label} Gallery | Invent Fine Art`,
  description: `${cat.intro} ${cat.count} works by Invent Fine Art, Mumbai.`,
});

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: siteData.brand.name,
  image: OG_IMAGE,
  url: `${SITE_URL}/`,
  telephone: siteData.contact.phones.map((p) => p.raw),
  email: siteData.contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kandivali East',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: siteData.contact.factoryCoords.lat,
    longitude: siteData.contact.factoryCoords.lng,
  },
  description:
    'ISO 9001:2008 certified maker and installer of sculptures, wall murals, water fountains, GRC facades, planters, gate grills, and artificial rockery.',
  foundingDate: '2009',
};

export const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About | Invent Fine Art',
  url: `${SITE_URL}/about`,
  description:
    'ISO 9001:2008 certified art studio in Kandivali East, Mumbai. Master craftsmen executing sculptures, murals, facades & fountains since 2009.',
  mainEntity: {
    '@type': 'Organization',
    name: siteData.brand.name,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}${siteData.brand.logo}`,
    foundingDate: '2009',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No. 14, Jay Bharat Zip Sangh, Vadar Pada, Kandivali East',
      addressLocality: 'Mumbai',
      postalCode: '400101',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'ISO 9001:2008 Quality Management System',
        recognizedBy: {
          '@type': 'Organization',
          name: 'ISO',
        },
      },
    ],
  },
};

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
});

export { OG_IMAGE };
