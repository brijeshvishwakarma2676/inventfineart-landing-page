import { useState } from 'react';
import { Link } from 'react-router';
import clients from '../data/clients';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';
import usePageMeta from '../hooks/usePageMeta';
import { useReveal } from '../hooks/useReveal';
import { pageMeta } from '../data/seo';
import { ArrowIcon } from '../components/Icons';

const SECTORS = [
  {
    num: '01',
    title: 'Hospitality & Resorts',
    desc: 'Grand entrance water bodies, statement wall murals, and monumental lobby sculptures for five-star hotels and luxury resorts.',
    disciplines: 'Fountains · Wall Murals · Sculptures',
  },
  {
    num: '02',
    title: 'Corporate & Commercial',
    desc: 'Architectural facade claddings, atrium centerpieces, and corporate reception feature walls that reflect institutional stature.',
    disciplines: 'GRC Facades · Jali Grills · Relief Murals',
  },
  {
    num: '03',
    title: 'Luxury Residential',
    desc: 'Custom private commissions for luxury villas and penthouses — from courtyard rockeries to bespoke bronze sculptures.',
    disciplines: 'Artificial Rockery · Planters · Bespoke Art',
  },
  {
    num: '04',
    title: 'Civic & Public Landmarks',
    desc: 'Urban roundabouts, institutional entrance gates, and public installations engineered to weather all Indian climates.',
    disciplines: 'Monumental Sculptures · Cast Metal Gates',
  },
];

const PILLARS = [
  {
    num: '01',
    title: 'Turnkey In-House Fabrication',
    desc: 'From initial CAD drawings and scale clay maquettes to final casting, all production is managed in our Ahmedabad and Mumbai workshops.',
  },
  {
    num: '02',
    title: 'Architectural Grade Materials',
    desc: 'Glass Reinforced Concrete (GRC), marine-grade cast bronze, UV-stable FRP, and natural stone engineered for decades of structural life.',
  },
  {
    num: '03',
    title: 'Precision On-Site Erection',
    desc: 'Dedicated engineering crews handle site preparation, structural anchoring, plumbing integration, and turnkey handover across India.',
  },
];

const METRICS = [
  { value: '15+ Years', label: 'Continuous commissions since 2009' },
  { value: '30+ Partners', label: 'Hospitality, corporate & developer brands' },
  { value: '166+ Works', label: 'Documented installations across India' },
  { value: 'ISO 9001', label: 'Certified fabrication & quality systems' },
];

const rowA = clients.slice(0, 10);
const rowB = clients.slice(10, 20);
const rowC = clients.slice(20, 30);

function MarqueeRow({ logos, direction }) {
  const track = [...logos, ...logos];
  return (
    <div className="overflow-hidden w-full">
      <div
        className={`${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        } gap-4 md:gap-5`}
      >
        {track.map((c, i) => (
          <div
            key={`${c.id}-${i}`}
            className={`w-40 h-20 sm:w-48 sm:h-24 md:w-52 md:h-26 p-4 sm:p-5 rounded-[2px] bg-white flex items-center justify-center flex-shrink-0 border border-line/50 transition-colors select-none ${
              i >= logos.length ? 'marquee-dup' : ''
            }`}
          >
            <img
              src={c.src}
              alt={c.alt || 'Client partner'}
              className="max-h-9 sm:max-h-11 max-w-[115px] sm:max-w-[135px] w-auto h-auto object-contain grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Clients() {
  usePageMeta(pageMeta.clients);
  const [viewMode, setViewMode] = useState('marquee');
  const revealRef = useReveal();
  const metricsRef = useReveal({ stagger: true });

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Clients' }]}
        title="Trusted by industry leaders"
        intro="Architects, interior designers, and corporate developers who partner with Invent Fine Art for architectural decor and monumental installations."
        meta={`${clients.length} Client Partners`}
      />

      {/* Credibility & Scale Metrics Strip */}
      <section className="bg-bg border-b border-line" aria-label="Key milestones">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 md:py-14">
          <div ref={metricsRef} className="grid grid-cols-2 md:grid-cols-4 border-y border-line divide-y md:divide-y-0 md:divide-x divide-line">
            {METRICS.map((m) => (
              <div key={m.value} className="py-6 md:py-8 px-4 sm:px-6 flex flex-col gap-1.5">
                <span className="font-display text-2xl sm:text-3xl lg:text-4xl text-text font-normal">
                  {m.value}
                </span>
                <span className="font-body text-xs sm:text-sm text-text-dim">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Dynamic Client Showcase */}
      <section className="bg-bg border-b border-line overflow-hidden" aria-label="Client brands showcase">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-8" ref={revealRef}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-3">
                Client Showcase
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text font-normal">
                Enterprise & institutional commissions
              </h2>
            </div>
            
            {/* View Mode Switcher */}
            <div className="flex items-center gap-2 border border-line p-1 rounded-[2px] bg-bg-raised self-start md:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('marquee')}
                className={`px-4 py-2 text-xs font-body uppercase tracking-wider font-semibold rounded-[2px] transition-colors cursor-pointer ${
                  viewMode === 'marquee'
                    ? 'bg-accent text-text'
                    : 'text-text-dim hover:text-text'
                }`}
              >
                Moving Stream
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 text-xs font-body uppercase tracking-wider font-semibold rounded-[2px] transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-accent text-text'
                    : 'text-text-dim hover:text-text'
                }`}
              >
                All 30 Grid
              </button>
            </div>
          </div>
        </div>

        {/* Moving Marquee Stream Mode */}
        {viewMode === 'marquee' ? (
          <div className="relative pb-16 md:pb-24">
            {/* Edge fade gradients */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-bg to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-bg to-transparent z-10" />

            <div className="flex flex-col gap-4 md:gap-5" aria-label="Moving client tracks">
              <MarqueeRow logos={rowA} direction="left" />
              <MarqueeRow logos={rowB} direction="right" />
              <MarqueeRow logos={rowC} direction="left" />
            </div>

            <p className="text-center font-body text-xs text-text-dim mt-8">
              Hover or touch any logo to inspect · Pauses automatically
            </p>
          </div>
        ) : (
          /* Symmetrically Aligned Grid Mode */
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16 md:pb-24">
            <div className="border border-line rounded-[2px] overflow-hidden bg-line">
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-px">
                {clients.map((c, idx) => (
                  <li
                    key={c.id}
                    className="bg-white aspect-[7/4] sm:aspect-[16/10] p-4 sm:p-6 flex items-center justify-center transition-colors group cursor-default select-none relative"
                  >
                    <img
                      src={c.src}
                      alt={c.alt}
                      className="max-h-10 sm:max-h-11 max-w-[115px] sm:max-w-[130px] w-auto h-auto object-contain grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute bottom-1.5 right-2 font-body text-[10px] text-text-dim/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Sectors of Commission */}
      <section className="bg-bg border-b border-line" aria-label="Sectors of commission">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="max-w-[800px] mb-12 md:mb-16">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-3">
              Where our work lives
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text font-normal mb-4">
              Commissions across four distinct sectors
            </h2>
            <p className="font-body text-base text-text-dim leading-relaxed max-w-[640px]">
              Every sector demands distinct structural specifications, climate resistance, and artistic gravitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-y border-line divide-y md:divide-y-0 md:divide-x divide-line">
            {SECTORS.map((sec) => (
              <div
                key={sec.num}
                className="py-8 md:py-10 px-0 md:px-6 lg:px-8 flex flex-col justify-between gap-6"
              >
                <div className="flex flex-col gap-3">
                  <span className="font-body text-xs font-semibold tracking-wider text-accent-2">
                    {sec.num}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl text-text font-medium">
                    {sec.title}
                  </h3>
                  <p className="font-body text-sm text-text-dim leading-relaxed">
                    {sec.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-line/60">
                  <span className="font-body text-xs font-medium text-accent-2 block">
                    {sec.disciplines}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Standard: Why Architects & Developers Choose Us */}
      <section className="bg-bg border-b border-line" aria-label="How we collaborate">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-3">
                Architectural Partnerships
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text font-normal">
                The commission standard
              </h2>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-body text-sm font-semibold text-accent-light hover:text-text transition-colors"
            >
              Initiate a consultation <ArrowIcon />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-y border-line divide-y md:divide-y-0 md:divide-x divide-line">
            {PILLARS.map((p) => (
              <div
                key={p.num}
                className="py-8 md:py-10 px-0 md:px-6 lg:px-8 flex flex-col gap-3"
              >
                <span className="font-body text-xs font-semibold text-accent-2 tracking-widest">
                  {p.num}
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-text font-medium">
                  {p.title}
                </h3>
                <p className="font-body text-sm text-text-dim leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export default Clients;
