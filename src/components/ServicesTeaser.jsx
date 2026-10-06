import { useState } from 'react';
import { Link } from 'react-router';
import services from '../data/services';
import { useReveal } from '../hooks/useReveal';
import { ArrowIcon } from './Icons';

export function ServicesTeaser() {
  const [activeId, setActiveId] = useState(services[0]?.id || 'murals');
  const [mobileOpenId, setMobileOpenId] = useState(services[0]?.id || 'murals');
  const revealRef = useReveal();

  const activeService = services.find((s) => s.id === activeId) || services[0];

  return (
    <section className="bg-bg border-b border-line" aria-label="What we make">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-20 md:py-28" ref={revealRef}>
        {/* Section Header */}
        <div className="max-w-[900px] mb-12 md:mb-16">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-3">
            What we make
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text font-normal mb-4">
            Seven disciplines, one studio
          </h2>
          <p className="font-body text-base md:text-lg text-text-dim leading-relaxed max-w-[700px]">
            Every architectural element and sculpture is conceived, engineered, and hand-finished
            under one roof in our Ahmedabad workshop.
          </p>
        </div>

        {/* Desktop: Interactive Split Showcase (Hover Crossfade) */}
        <div className="hidden md:grid md:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Interactive Discipline List */}
          <div className="md:col-span-5 flex flex-col">
            <div className="border-t border-line divide-y divide-line">
              {services.map((s) => {
                const isActive = s.id === activeId;
                return (
                  <div
                    key={s.id}
                    onMouseEnter={() => setActiveId(s.id)}
                    onFocus={() => setActiveId(s.id)}
                    className="group"
                  >
                    <Link
                      to="/services"
                      className={`flex items-baseline justify-between py-4 lg:py-5 transition-colors cursor-pointer ${
                        isActive ? 'text-text' : 'text-text-dim hover:text-text'
                      }`}
                    >
                      <span className="flex items-baseline gap-4">
                        <span
                          className={`font-body text-xs font-semibold tracking-wider transition-colors ${
                            isActive ? 'text-accent-light' : 'text-accent-2'
                          }`}
                        >
                          {s.num}
                        </span>
                        <span
                          className={`font-display text-2xl lg:text-3xl transition-colors ${
                            isActive ? 'text-text' : 'text-text-dim group-hover:text-text'
                          }`}
                        >
                          {s.title}
                        </span>
                      </span>
                      <span
                        className={`transition-opacity duration-200 ${
                          isActive
                            ? 'opacity-100 text-accent-light'
                            : 'opacity-0 group-hover:opacity-60 text-text-dim'
                        }`}
                        aria-hidden="true"
                      >
                        <ArrowIcon className="w-4 h-4" />
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="pt-8 mt-4 border-t border-line">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 font-body text-sm font-medium text-text-dim hover:text-accent-light transition-colors"
              >
                Explore full specifications & applications <ArrowIcon />
              </Link>
            </div>
          </div>

          {/* Right Column: Dynamic Visual Stage (Sticky & Crossfading) */}
          <div className="md:col-span-7 sticky top-28">
            <div className="rounded-[2px] overflow-hidden bg-bg-raised border border-line flex flex-col">
              {/* Stacked Images for instantaneous cross-fade */}
              <div className="relative aspect-[16/10] w-full overflow-hidden skeleton">
                {services.map((s) => (
                  <img
                    key={s.id}
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
                      s.id === activeId ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  />
                ))}

                {/* Discipline Tag overlay */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-bg/85 backdrop-blur-sm border border-line px-3 py-1.5 rounded-[2px]">
                  <span className="font-body text-xs font-semibold text-accent-2">
                    {activeService.num}
                  </span>
                  <span className="font-body text-xs text-text-dim">
                    Discipline
                  </span>
                </div>
              </div>

              {/* Dynamic Information Panel */}
              <div className="p-6 lg:p-8 flex flex-col gap-5 border-t border-line">
                <div>
                  <h3 className="font-display text-2xl lg:text-3xl text-text mb-2">
                    {activeService.title}
                  </h3>
                  <p className="font-body text-sm lg:text-base text-text-dim leading-relaxed line-clamp-2">
                    {activeService.summary}
                  </p>
                </div>

                {/* Key materials excerpt */}
                {activeService.materials && activeService.materials.length > 0 && (
                  <div className="pt-4 border-t border-line flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="font-body text-xs uppercase tracking-wider text-accent-2 font-semibold">
                      Craft & Materials:
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-body text-text-dim">
                      {activeService.materials.slice(0, 3).map((mat, i) => (
                        <span key={mat} className="inline-flex items-center gap-2">
                          {i > 0 && <span className="text-line" aria-hidden="true">/</span>}
                          <span>{mat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Actions */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 font-body text-sm font-semibold text-accent-light hover:text-text transition-colors"
                  >
                    View in services catalog <ArrowIcon />
                  </Link>
                  <Link
                    to={`/gallery/${activeService.category}`}
                    className="inline-flex items-center gap-2 font-body text-sm text-text-dim hover:text-text transition-colors"
                  >
                    Browse portfolio gallery <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Interactive Accordion with Direct Visuals */}
        <div className="md:hidden flex flex-col divide-y divide-line border-y border-line">
          {services.map((s) => {
            const isOpen = mobileOpenId === s.id;
            return (
              <div key={s.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setMobileOpenId(isOpen ? null : s.id)}
                  className="w-full flex items-center justify-between py-5 text-left cursor-pointer min-h-[56px]"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-body text-xs font-semibold tracking-wider text-accent-2">
                      {s.num}
                    </span>
                    <span className="font-display text-2xl text-text">
                      {s.title}
                    </span>
                  </span>
                  <span
                    className={`font-display text-2xl leading-none transition-transform duration-300 ${
                      isOpen ? 'rotate-45 text-accent-light' : 'text-text-dim'
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-6 flex flex-col gap-4">
                    <div className="w-full aspect-[16/10] rounded-[2px] overflow-hidden skeleton border border-line">
                      <img
                        src={s.image}
                        alt={s.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-body text-sm text-text-dim leading-relaxed">
                      {s.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <Link
                        to="/services"
                        className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-accent-light hover:text-text transition-colors"
                      >
                        All details <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/gallery/${s.category}`}
                        className="inline-flex items-center gap-1.5 font-body text-xs text-text-dim hover:text-text transition-colors"
                      >
                        Related works <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Bottom Link */}
        <div className="md:hidden pt-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-accent-light hover:text-text transition-colors"
          >
            Explore all seven disciplines <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ServicesTeaser;
