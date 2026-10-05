import { useState } from 'react';
import services from '../data/services';
import PageHeader from '../components/PageHeader';
import ServiceDetail from '../components/ServiceDetail';
import CtaBand from '../components/CtaBand';
import usePageMeta from '../hooks/usePageMeta';
import { pageMeta } from '../data/seo';

export function Services() {
  usePageMeta(pageMeta.services);
  const [activeIdx, setActiveIdx] = useState(0);
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Services' }]}
        title="Architectural & artistic disciplines"
        intro="Seven services, from concept to complete execution."
      />

      <section className="bg-bg border-b border-line" aria-label="Services">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-24">
          {/* Desktop: sticky split */}
          <div className="hidden md:grid grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] gap-12 lg:gap-16 items-start">
            <div className="sticky top-28 flex flex-col">
              {services.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  className={`flex items-baseline gap-4 py-4 border-b text-left transition-colors cursor-pointer ${
                    idx === activeIdx ? 'border-accent text-text' : 'border-line text-text-dim hover:text-text'
                  }`}
                  onClick={() => setActiveIdx(idx)}
                  aria-current={idx === activeIdx}
                >
                  <span className={`font-body text-xs font-semibold tracking-wider ${idx === activeIdx ? 'text-accent-light' : 'text-text-dim'}`}>{item.num}</span>
                  <span className="font-display text-xl lg:text-2xl">{item.title}</span>
                </button>
              ))}
            </div>
            <ServiceDetail key={services[activeIdx].id} service={services[activeIdx]} />
          </div>

          {/* Mobile: accordion */}
          <div className="md:hidden flex flex-col divide-y divide-line border-y border-line">
            {services.map((item, idx) => {
              const open = openIdx === idx;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between py-5 text-left cursor-pointer min-h-[56px]"
                    onClick={() => setOpenIdx(open ? -1 : idx)}
                    aria-expanded={open}
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-body text-xs font-semibold tracking-wider text-accent-2">{item.num}</span>
                      <span className="font-display text-2xl text-text">{item.title}</span>
                    </span>
                    <span className={`font-display text-3xl leading-none transition-transform duration-300 ${open ? 'rotate-45 text-accent-light' : 'text-text-dim'}`} aria-hidden="true">+</span>
                  </button>
                  {open && (
                    <div className="pb-8">
                      <ServiceDetail service={item} imageClass="aspect-[4/3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export default Services;
