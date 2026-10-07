import { useReveal } from '../hooks/useReveal';
import SmartImage from './SmartImage';
import { SHOW_MOCK_AWARDS, awards, certifications } from '../data/awards';

export function AwardsSection() {
  const headRef = useReveal();
  const certRef = useReveal({ stagger: true });
  const awardsRef = useReveal({ stagger: true });
  const visibleAwards = SHOW_MOCK_AWARDS ? awards : [];

  return (
    <section
      id="recognition"
      aria-label="Awards and recognition"
      className="scroll-mt-[120px] bg-bg border-b border-line py-20 md:py-28"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        {/* Section Header with Total Awards Proof Counter */}
        <div ref={headRef} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 md:mb-18 pb-8 border-b border-line">
          <div className="max-w-2xl">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-3">
              Recognition & Excellence
            </span>
            <h2 className="font-display text-3xl md:text-5xl text-text">
              Certifications & industry awards
            </h2>
          </div>

          {/* Quick Proof Pills */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0">
            <div className="bg-bg-raised border border-line px-5 py-3 rounded-[2px] flex items-center gap-3">
              <span className="font-display text-3xl sm:text-4xl text-accent-2 leading-none">
                0{visibleAwards.length}
              </span>
              <div className="text-left">
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-text block">
                  Awards
                </span>
                <span className="font-body text-[11px] text-text-dim block">
                  Industry honours
                </span>
              </div>
            </div>

            <div className="bg-bg-raised border border-line px-5 py-3 rounded-[2px] flex items-center gap-3">
              <span className="font-mono text-sm text-accent-light tracking-wider font-semibold block">
                ISO
              </span>
              <div className="text-left">
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-text block">
                  9001:2008
                </span>
                <span className="font-body text-[11px] text-text-dim block">
                  Certified standard
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications Group */}
        <div className="mb-14 md:mb-18">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block">
              Quality certification
            </h3>
            <span className="font-mono text-[11px] text-text-dim">
              Verified standard
            </span>
          </div>

          <div ref={certRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-bg-raised border border-line p-6 md:p-8 flex flex-col justify-between gap-6 transition-colors hover:border-accent-2/60"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="inline-block px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-bg border border-line text-accent-light rounded-[2px]">
                      {cert.status}
                    </span>
                    <span className="font-mono text-[11px] text-accent-2 tracking-wider">
                      ISO STANDARDS
                    </span>
                  </div>
                  <h4 className="font-display text-2xl text-text mb-1">
                    {cert.title}
                  </h4>
                  <p className="font-body text-xs font-semibold uppercase tracking-wider text-accent-2 mb-4">
                    {cert.subtitle}
                  </p>
                  <p className="font-body text-sm text-text-dim leading-relaxed">
                    {cert.description}
                  </p>
                </div>
                {cert.image && (
                  <div className="pt-4 border-t border-line">
                    <a
                      href={cert.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-xs uppercase tracking-wider text-accent-light underline underline-offset-4 hover:text-text transition-colors"
                    >
                      View certificate image
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conferred Awards Group with Real Award Imagery */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block">
              Conferred honours ({visibleAwards.length})
            </h3>
            {visibleAwards.length > 0 && (
              <span className="font-body text-[11px] text-text-dim">
                Architectural & fine art distinctions
              </span>
            )}
          </div>

          {visibleAwards.length > 0 ? (
            <div ref={awardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleAwards.map((award) => (
                <article
                  key={award.id}
                  className="group bg-bg-raised border border-line rounded-[2px] overflow-hidden flex flex-col justify-between transition-colors hover:border-accent-2/60"
                >
                  <div>
                    {/* Award Trophy / Plaque Image */}
                    {award.image && (
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg border-b border-line">
                        <SmartImage
                          src={award.image}
                          alt={award.title}
                          width={800}
                          height={600}
                          className="w-full h-full"
                          imgClassName="transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        <div className="absolute top-3 left-3 bg-bg/90 backdrop-blur-sm border border-line px-2.5 py-1 rounded-[2px]">
                          <span className="font-display text-sm font-semibold text-accent-2 leading-none">
                            {award.year}
                          </span>
                        </div>
                        {award.mock && (
                          <div className="absolute top-3 right-3 bg-bg/90 backdrop-blur-sm border border-line px-2 py-0.5 rounded-[2px]">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-text-dim">
                              Sample
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Award Details */}
                    <div className="p-5 sm:p-6 flex flex-col gap-3">
                      <div>
                        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-light block mb-1">
                          {award.issuer}
                        </span>
                        <h4 className="font-display text-lg text-text leading-snug group-hover:text-accent-2 transition-colors">
                          {award.title}
                        </h4>
                      </div>

                      {award.category && (
                        <div className="pt-1">
                          <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium bg-bg border border-line text-accent-2 rounded-[2px]">
                            {award.category}
                          </span>
                        </div>
                      )}

                      {award.description && (
                        <p className="font-body text-xs text-text-dim leading-relaxed pt-1">
                          {award.description}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-bg-raised border border-line p-8 md:p-10 max-w-2xl">
              <p className="font-body text-sm md:text-base text-text-dim leading-relaxed">
                Our credentials today: ISO 9001:2008 certification. Awards will be listed here as they are confirmed.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AwardsSection;
