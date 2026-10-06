import { categoryCounts, totalWorksCount } from './gallery-meta';

export const siteData = {
  brand: {
    name: 'Invent Fine Art',
    tagline: 'Reinventing spaces through Innovations in Art',
    certification: 'ISO 9001:2008 Certified',
    sinceHomepage: 'Since 2008',
    sinceAbout: '2009',
    logo: '/assets/brand/logo.png',
  },

  contact: {
    headOffice: 'Kandivali East, Mumbai, Maharashtra, India',
    factory: 'Near Jag Mata Mandir, Vasai/Virar, Maharashtra',
    factoryCoords: {
      lat: 19.4196725,
      lng: 72.7856904,
    },
    phones: [
      { display: '+91 93232 10327', raw: '+919323210327' },
      { display: '+91 96196 60089', raw: '+919619660089' },
      { display: '+91 89767 77123', raw: '+918976777123' },
    ],
    primaryPhone: '+919323210327',
    email: 'inventfineart.mum@gmail.com',
    whatsappUrl: 'https://wa.me/919323210327',
    googleMapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19811.64538266773!2d72.7856903769042!3d19.419672530730246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7abef7331b6cb%3A0xfd4325d4724074cf!2sJag+mata+mandir!5e0!3m2!1sen!2sin!4v1510743982267',
  },

  nav: [
    { label: 'About', to: '/about' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Our Clients', to: '/clients' },
    { label: 'Services', to: '/services' },
    { label: 'FAQ', to: '/faq' },
  ],

  hero: {
    eyebrow: 'ISO 9001 · Since 2008',
    slides: [
      {
        headline: 'Reinventing spaces through Innovations in Art',
        image: '/assets/hero/banner-1.webp',
        image960: '/assets/hero/banner-1-960.webp',
        alt: 'Invent Fine Art grand sculpture and architectural installation',
      },
      {
        headline: 'Facades Increase Aesthetic Value for Your Structure',
        image: '/assets/hero/banner-2.webp',
        image960: '/assets/hero/banner-2-960.webp',
        alt: 'Bespoke GRC architectural facades and screen walls',
      },
      {
        headline: 'Enhance the Beauty of Your Place',
        image: '/assets/hero/banner-5.webp',
        image960: '/assets/hero/banner-5-960.webp',
        alt: 'Intricate relief wall mural craftsmanship',
      },
      {
        headline: 'Raise the liveliness.',
        image: '/assets/hero/banner-6.webp',
        image960: '/assets/hero/banner-6-960.webp',
        alt: 'Outdoor water features and fine art installations',
      },
    ],
    stats: [
      { value: '2008', label: 'Since' },
      { value: String(totalWorksCount), label: 'Works' },
      { value: '6', label: 'Art categories' },
    ],
  },

  intro: {
    eyebrow: 'INNOVATION AND PERFORMANCE SINCE 2008',
    title: 'For your premises',
    quote:
      'Invent Fine Art is a community of artists, committed to bring outstanding art to the commercial world. As a team of leading sculptors, painters and designers, we work in all areas of interior and architectural design at indoor as well as outdoor sites.',
    // The quote above, split so key phrases can open an image preview (hover on desktop, tap on touch devices).
    // Joined, the parts must read exactly like `quote`.
    quoteParts: [
      'Invent Fine Art is a community of ',
      { key: 'studio', text: 'artists' },
      ', committed to bring outstanding art to the commercial world. As a team of leading ',
      { key: 'sculptures', text: 'sculptors, painters and designers' },
      ', we work in all areas of ',
      { key: 'facades', text: 'interior and architectural design' },
      ' at ',
      { key: 'fountains', text: 'indoor as well as outdoor sites' },
      '.',
    ],
    previews: {
      studio: {
        image: '/assets/about/about_us.webp',
        title: 'The studio',
        subtitle: 'ISO 9001:2008 certified',
        to: '/about',
        linkLabel: 'About the studio',
      },
      sculptures: {
        image: '/assets/gallery/sculptures/sculptures-005-thumb.webp',
        title: 'Sculptures',
        subtitle: `${categoryCounts.sculptures} works`,
        to: '/gallery/sculptures',
        linkLabel: 'View sculptures',
      },
      facades: {
        image: '/assets/gallery/grc/grc-003-thumb.webp',
        title: 'Architectural facades',
        subtitle: 'GRC, CNC metal panels, 3D modular tiles',
        to: '/services',
        linkLabel: 'See our services',
      },
      fountains: {
        image: '/assets/gallery/fountains/fountains-003-thumb.webp',
        title: 'Water fountains',
        subtitle: `${categoryCounts.fountains} works`,
        to: '/gallery/water-fountains',
        linkLabel: 'View fountains',
      },
    },
    features: [
      {
        title: 'High Quality',
        desc: 'Premium-grade raw materials and rigorous manufacturing norms ensure unmatched structural and artistic durability.',
      },
      {
        title: 'Beautifully Designed',
        desc: 'Artistic inclination for architects, interior decorators, and connoisseurs seeking timeless spatial distinction.',
      },
      {
        title: 'Rust Proof',
        desc: 'Weatherproof, corrosion-resistant outdoor treatments engineered to endure severe tropical and coastal climates.',
      },
    ],
    showcase: [
      { src: '/assets/intro/1.webp', alt: 'Fine art installation showcase 1' },
      { src: '/assets/intro/2.webp', alt: 'Fine art installation showcase 2' },
      { src: '/assets/intro/3.webp', alt: 'Fine art installation showcase 3' },
      { src: '/assets/intro/4.webp', alt: 'Fine art installation showcase 4' },
      { src: '/assets/intro/5.webp', alt: 'Fine art installation showcase 5' },
      { src: '/assets/intro/7.webp', alt: 'Fine art installation showcase 6' },
    ],
  },

  about: {
    eyebrow: 'PROFILE & PHILOSOPHY',
    title: 'Master Craftsmen & Art Installers',
    profile:
      'Established in the year 2009, Invent Fine Art is amongst the well established companies affianced in the domain of trading, manufacturing, supplying and fixing a top class Quality Art Work of Indoor and outdoor decor Products… We are a team of Artisans and Product designers who create products with artistic inclination for Designers and architects for their respective projects. We provide start-to-end solutions from conceptualizations to the complete execution.',
    image: '/assets/about/about_us.webp',
    badge: 'ISO 9001:2008 Certified',
    processSteps: [
      {
        num: '01',
        title: 'Concept',
        desc: 'Start-to-end conceptualisation for indoor and outdoor decor installations.',
      },
      {
        num: '02',
        title: 'Design',
        desc: 'Custom blueprints by artisans and product designers with artistic inclination.',
      },
      {
        num: '03',
        title: 'Fabricate',
        desc: 'Precision manufacturing in-house using top-class quality raw materials.',
      },
      {
        num: '04',
        title: 'Quality Check',
        desc: 'Stringent examination and secure packaging before site transit.',
      },
      {
        num: '05',
        title: 'Install',
        desc: 'Supplying, structural fixing, and complete execution across India.',
      },
    ],
    facilityUnits: [
      'Manufacturing Unit',
      'Warehousing & Packaging Unit',
      'Quality Control Unit',
      'Research & Development Unit',
    ],
    disciplines: [
      'Sculptures (Bronze, Fiber, Metal, Stone & Mixed Media)',
      'Wall Murals (Relief, Metal & Composite)',
      'Acoustic Wall Panels & Cladding',
      '3D Architectural Facades',
      'Artificial Rockery & Water Bodies',
      'Architectural Planters',
      'Customised GRC Grills, Railings, Pergolas & Gazebos',
    ],
  },

  // Session intro: what the studio makes (captions use real gallery counts), then the brand. Plays once per tab session.
  preloader: {
    steps: [
      { word: 'Sculptures.', caption: `${categoryCounts.sculptures} works` },
      { word: 'Murals.', caption: `${categoryCounts.murals} works` },
      { word: 'Fountains.', caption: `${categoryCounts.fountains} works` },
      { word: 'Facades.', caption: 'GRC, CNC metal, 3D tiles' },
      { word: 'Invent Fine Art', caption: 'Since 2008 · ISO 9001:2008', hold: 560 },
    ],
    tagline: 'Reinventing spaces through Innovations in Art',
    corners: ['Studio & Installations', 'Mumbai · India'],
  },

  ctaBand: {
    tagline: 'Collaborate with us',
    headline: 'We can turn your ideas and imagination into reality.',
    subline: 'Partner with our studio for bespoke art installations, facades, and sculptural landmarks.',
    buttonText: 'Work with us',
    buttonHref: '/contact',
    // Real work from the archive, mixed across categories, for the animated marquee.
    marquee: [
      '/assets/intro/1.webp',
      '/assets/gallery/sculptures/sculptures-002-thumb.webp',
      '/assets/gallery/murals/murals-002-thumb.webp',
      '/assets/intro/3.webp',
      '/assets/gallery/fountains/fountains-001-thumb.webp',
      '/assets/gallery/grc/grc-001-thumb.webp',
      '/assets/intro/5.webp',
      '/assets/gallery/planters/planters-001-thumb.webp',
      '/assets/gallery/sculptures/sculptures-010-thumb.webp',
      '/assets/intro/2.webp',
      '/assets/gallery/other/other-001-thumb.webp',
      '/assets/gallery/murals/murals-010-thumb.webp',
    ],
  },


  footer: {
    about:
      'Invent Fine Art is a foremost company betrothed in manufacturing, trading, supplying and exporting a top class Quality Art Work of Indoor and outdoor decor Products.',
    copyright: '© 2026 Invent Fine Art · ISO 9001:2008 certified',
    // Developer credit shown in the footer bottom bar.
    credit: {
      label: 'Crafted by',
      name: 'Brijesh Vishwakarma',
      url: 'https://brijesh-dev-portfolio.vercel.app/',
    },
    // Real URLs go in `url`. While `url` is null the icon renders as a disabled placeholder, not a link.
    // Do not invent accounts (the legacy site listed Facebook, Twitter and Pinterest; Google+ is retired).
    socialLinks: [
      { id: 'facebook', label: 'Facebook', url: null },
      { id: 'x', label: 'X (Twitter)', url: null },
      { id: 'pinterest', label: 'Pinterest', url: null },
    ],
    // Newsletter is static for now: set `endpoint` to a real form-service URL to enable it.
    newsletter: {
      heading: 'Newsletter',
      text: 'Get updates on new work from the studio.',
      endpoint: null,
    },
  },
};

export default siteData;
