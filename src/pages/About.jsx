import siteData from '../data/site';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';
import usePageMeta from '../hooks/usePageMeta';
import { useReveal } from '../hooks/useReveal';
import { pageMeta } from '../data/seo';

export function About() {
  usePageMeta(pageMeta.about);
  const { profile, image, badge, processSteps, facilityUnits, disciplines } = siteData.about;
  const revealRef = useReveal();

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'About' }]}
        title="Master craftsmen & art installers"
        intro="An ISO 9001:2008 certified team of artisans and product designers."
      />

      <section className="bg-bg border-b border-line" aria-label="Studio profile">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-20 md:py-28 grid lg:grid-cols-12 gap-12 lg:gap-16" ref={revealRef}>
          <figure className="lg:col-span-5 relative self-start">
            <div className="aspect-[3/4] rounded-[2px] overflow-hidden bg-bg-raised">
              <img src={image} alt="Invent Fine Art studio artisans and production facility" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
            <figcaption className="mt-4 font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2">{badge}</figcaption>
          </figure>

          <div className="lg:col-span-7 flex flex-col gap-10 lg:pt-16">
            <p className="font-display text-2xl md:text-3xl font-light leading-snug text-text">{profile}</p>
            <div className="border-t border-line pt-6">
              <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-4">Disciplines executed</span>
              <ul className="divide-y divide-line border-y border-line">
                {disciplines.map((d) => (
                  <li key={d} className="py-3 font-body text-sm md:text-base text-text-dim">{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg border-b border-line" aria-label="Process">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-20 md:py-28">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-3">Methodology</span>
          <h2 className="font-display text-3xl md:text-5xl text-text mb-12">From conception to execution</h2>
          <ol className="flex md:grid md:grid-cols-5 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-t border-line">
            {processSteps.map((step) => (
              <li key={step.num} className="min-w-[250px] md:min-w-0 snap-start py-6 pr-6 md:pr-8 md:border-r md:border-line md:pl-6 first:md:pl-0 last:md:border-r-0 flex flex-col gap-3">
                <span className="font-display text-5xl text-line">{step.num}</span>
                <h3 className="font-display text-xl text-text">{step.title}</h3>
                <p className="font-body text-sm text-text-dim">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-bg border-b border-line" aria-label="Facility">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-20">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-6">Our infrastructure</span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-line divide-y sm:divide-y-0 sm:divide-x divide-line">
            {facilityUnits.map((unit, i) => (
              <li key={unit} className={`py-6 ${i === 0 ? 'sm:pr-6' : 'sm:px-6'} flex flex-col gap-1`}>
                <span className="font-body text-[11px] font-semibold text-accent-2 tracking-wider">UNIT 0{i + 1}</span>
                <span className="font-display text-xl text-text">{unit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export default About;
