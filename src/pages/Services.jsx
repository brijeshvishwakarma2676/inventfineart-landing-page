import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import services from '../data/services';
import PageHeader from '../components/PageHeader';
import ServiceDetail from '../components/ServiceDetail';
import CtaBand from '../components/CtaBand';
import usePageMeta from '../hooks/usePageMeta';
import { pageMeta } from '../data/seo';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Fixed header (+ the sticky service index on phones) must not cover the heading we scroll to.
function scrollToService(slug) {
  const el = document.getElementById(slug);
  if (!el) return;
  const offset = window.matchMedia('(min-width: 768px)').matches ? 112 : 140;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

export function Services() {
  usePageMeta(pageMeta.services);
  const { hash } = useLocation();
  const target = services.find((s) => `#${s.slug}` === hash);
  const [activeId, setActiveId] = useState(target?.id || services[0].id);
  const sectionRefs = useRef({});
  const chipTrackRef = useRef(null);
  const chipRefs = useRef({});

  // Every service is laid out one after another; the one crossing the reading line (upper-middle of the screen) is active.
  // Nothing expands or collapses while scrolling, so there is no layout shift; each service eases in as it arrives.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.dataset.serviceId);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Keep the active chip of the phone index in view.
  useEffect(() => {
    const track = chipTrackRef.current;
    const chip = chipRefs.current[activeId];
    if (!track || !chip) return;
    track.scrollTo({ left: chip.offsetLeft - (track.clientWidth - chip.offsetWidth) / 2, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [activeId]);

  // Deep link (/services#water-fountains): jump to that service.
  useEffect(() => {
    if (!target) return undefined;
    const timer = setTimeout(() => scrollToService(target.slug), 250);
    return () => clearTimeout(timer);
  }, [target]);

  const go = (e, item) => {
    e.preventDefault();
    setActiveId(item.id);
    scrollToService(item.slug);
    window.history.replaceState(null, '', `#${item.slug}`);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Services' }]}
        title="Architectural & artistic disciplines"
        intro="Seven services, from concept to complete execution."
      />

      {/* Phones: sticky index of all services (tap to jump, follows the scroll) */}
      <nav aria-label="Services index" className="md:hidden sticky top-[72px] z-30 bg-bg/95 backdrop-blur-md border-b border-line">
        <div ref={chipTrackRef} className="flex gap-6 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {services.map((item) => {
            const active = item.id === activeId;
            return (
              <a
                key={item.id}
                ref={(el) => {
                  chipRefs.current[item.id] = el;
                }}
                href={`#${item.slug}`}
                onClick={(e) => go(e, item)}
                aria-current={active ? 'true' : undefined}
                className={`shrink-0 py-3.5 min-h-[48px] border-b-2 font-body text-xs uppercase tracking-[0.12em] font-semibold whitespace-nowrap transition-colors ${
                  active ? 'border-accent text-text' : 'border-transparent text-text-dim'
                }`}
              >
                {item.num} {item.title}
              </a>
            );
          })}
        </div>
      </nav>

      <section className="bg-bg border-b border-line" aria-label="Services">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 md:py-24 md:grid md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] md:gap-12 lg:gap-16 md:items-start">
          {/* Desktop: sticky list that follows the scroll */}
          <nav aria-label="Services" className="hidden md:flex sticky top-28 flex-col">
            {services.map((item) => {
              const active = item.id === activeId;
              return (
                <a
                  key={item.id}
                  href={`#${item.slug}`}
                  onClick={(e) => go(e, item)}
                  aria-current={active ? 'true' : undefined}
                  className={`flex items-baseline gap-4 py-4 border-b text-left transition-colors ${
                    active ? 'border-accent text-text' : 'border-line text-text-dim hover:text-text'
                  }`}
                >
                  <span className={`font-body text-xs font-semibold tracking-wider ${active ? 'text-accent-light' : 'text-text-dim'}`}>{item.num}</span>
                  <span className="font-display text-xl lg:text-2xl">{item.title}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex flex-col gap-14 md:gap-20 lg:gap-24">
            {services.map((item) => (
              <section
                key={item.id}
                id={item.slug}
                data-service-id={item.id}
                ref={(el) => {
                  sectionRefs.current[item.id] = el;
                }}
                aria-label={item.title}
                className="scroll-mt-36 md:scroll-mt-28 pb-14 md:pb-20 lg:pb-24 border-b border-line last:border-b-0 last:pb-0"
              >
                <ServiceDetail service={item} imageClass="aspect-[4/3] md:aspect-[16/10]" />
              </section>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export default Services;
