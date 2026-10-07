import { Link } from 'react-router';
import siteData from '../data/site';
import PageHeader from '../components/PageHeader';
import AboutStatsStrip from '../components/AboutStatsStrip';
import AboutSubNav from '../components/AboutSubNav';
import AwardsSection from '../components/AwardsSection';
import ClientMarquee from '../components/ClientMarquee';
import AboutVisitBlock from '../components/AboutVisitBlock';
import CtaBand from '../components/CtaBand';
import SmartImage from '../components/SmartImage';
import { ArrowIcon } from '../components/Icons';
import usePageMeta from '../hooks/usePageMeta';
import { useReveal } from '../hooks/useReveal';
import { pageMeta, aboutPageSchema } from '../data/seo';

export function About() {
  usePageMeta({ ...pageMeta.about, jsonLd: aboutPageSchema });
  const {
    image,
    badge,
    pullStatement,
    storyParagraphs,
    craftStrip,
    processSteps,
    facilityUnits,
    facilityNote,
    disciplines,
  } = siteData.about;

  const revealRef = useReveal();

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'About' }]}
        title="Master craftsmen & art installers"
        intro="An ISO 9001:2008 certified team of artisans and product designers."
      />

      <AboutStatsStrip />

      <AboutSubNav />

      {/* Studio Story (G2) */}
      <section
        id="story"
        aria-label="Studio story and profile"
        className="scroll-mt-[120px] bg-bg border-b border-line"
      >
        <div
          className="max-w-[1280px] mx-auto px-4 md:px-8 py-20 md:py-28 grid lg:grid-cols-12 gap-12 lg:gap-16"
          ref={revealRef}
        >
          <figure className="lg:col-span-5 relative self-start">
            <div className="aspect-[3/4] rounded-[2px] overflow-hidden">
              <SmartImage
                src={image}
                alt="Invent Fine Art studio artisans and production facility"
              />
            </div>
            <figcaption className="mt-4 font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2">
              {badge}
            </figcaption>
          </figure>

          <div className="lg:col-span-7 flex flex-col gap-8 lg:pt-4">
            <blockquote className="border-l-2 border-accent-2 pl-6 py-1">
              <p className="font-display text-2xl sm:text-3xl font-normal leading-snug text-text">
                “{pullStatement}”
              </p>
            </blockquote>

            <div className="flex flex-col gap-5 text-text-dim font-body text-base leading-relaxed">
              {storyParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="border-t border-line pt-8 mt-2">
              <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-4">
                Disciplines executed
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 border-y border-line py-5">
                {disciplines.map((d) => (
                  <li
                    key={d}
                    className="font-body text-sm text-text-dim flex items-center gap-2"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-accent-2 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Craft & Materials Strip (G5) */}
      <section
        id="craft"
        aria-label="Craft and material categories"
        className="scroll-mt-[120px] bg-bg border-b border-line py-16 md:py-24"
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-2">
                Portfolio Focus
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-text">
                Craft & material mediums
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-accent-light hover:text-text transition-colors"
            >
              <span>Explore all galleries</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {craftStrip.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="group block bg-bg-raised border border-line rounded-[2px] overflow-hidden transition-colors hover:border-accent-2/60"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <SmartImage
                    src={item.src}
                    alt={item.title}
                    imgClassName="transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-3 text-center border-t border-line">
                  <span className="font-body text-xs font-medium text-text group-hover:text-accent-2 transition-colors">
                    {item.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process (G10) */}
      <section
        id="process"
        aria-label="Methodology and execution process"
        className="scroll-mt-[120px] bg-bg border-b border-line py-20 md:py-28"
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-3">
            Methodology
          </span>
          <h2 className="font-display text-3xl md:text-5xl text-text mb-12">
            From conception to complete execution
          </h2>
          <ol className="flex md:grid md:grid-cols-5 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-t border-line">
            {processSteps.map((step) => (
              <li
                key={step.num}
                className="min-w-[260px] md:min-w-0 snap-start py-8 pr-6 md:pr-8 md:border-r md:border-line md:pl-6 first:md:pl-0 last:md:border-r-0 flex flex-col gap-4"
              >
                <span className="font-display text-4xl sm:text-5xl text-accent-2 leading-none">
                  {step.num}
                </span>
                <h3 className="font-display text-xl text-text">{step.title}</h3>
                <p className="font-body text-sm text-text-dim leading-relaxed">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Facility (G6) */}
      <section
        id="facility"
        aria-label="Studio infrastructure and units"
        className="scroll-mt-[120px] bg-bg border-b border-line py-20 md:py-28"
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="max-w-2xl mb-12">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-3">
              Our infrastructure
            </span>
            <h2 className="font-display text-3xl md:text-5xl text-text">
              Four specialized divisions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-y border-line divide-y md:divide-y-0 md:divide-x divide-line">
            {facilityUnits.map((unit) => (
              <div
                key={unit.id}
                className="py-8 px-0 md:px-6 first:md:pl-0 last:md:pr-0 flex flex-col gap-3"
              >
                <span className="font-body text-[11px] font-semibold text-accent-2 tracking-wider">
                  UNIT {unit.num}
                </span>
                <h3 className="font-display text-xl text-text">{unit.title}</h3>
                <p className="font-body text-sm text-text-dim leading-relaxed">
                  {unit.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-line/60 flex items-start gap-3">
            <span className="font-mono text-accent-2 text-xs select-none">
              ✦
            </span>
            <p className="font-body text-xs text-text-dim leading-relaxed max-w-3xl">
              {facilityNote}
            </p>
          </div>
        </div>
      </section>

      {/* Certifications & Awards (G4) */}
      <AwardsSection />

      {/* Client Trust Strip (G7) */}
      <ClientMarquee />

      {/* Visit / Contact Block (G8) */}
      <AboutVisitBlock />

      {/* CtaBand */}
      <CtaBand />
    </>
  );
}

export default About;
