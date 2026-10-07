import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { clientRow1, clientRow2 } from '../data/clients';
import { ArrowIcon } from './Icons';

function Row({ logos, direction }) {
  const track = [...logos, ...logos];
  return (
    <div className="overflow-hidden">
      <div className={`${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'} gap-4`}>
        {track.map((c, i) => (
          <div
            key={`${c.id}-${i}`}
            className={`w-36 h-20 md:w-44 md:h-24 p-4 rounded-[2px] bg-light-card flex items-center justify-center flex-shrink-0 ${i >= logos.length ? 'marquee-dup' : ''}`}
          >
            <img src={c.src} alt="" className="max-w-full max-h-full object-contain opacity-80" loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Two-row marquee (opposite directions) for Home; the full grid lives on /clients.
export function ClientMarquee() {
  const sectionRef = useRef(null);

  // Pause the loop while the marquee is off-screen (saves paint work on long pages)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      el.dataset.offscreen = entry.isIntersecting ? 'false' : 'true';
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bg border-b border-line overflow-hidden py-16 md:py-20" aria-label="Clients">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex items-end justify-between flex-wrap gap-4 mb-8">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-text">Trusted by</h2>
        <Link to="/clients" className="inline-flex items-center gap-2 font-body text-sm text-text-dim hover:text-text transition-colors">
          All clients <ArrowIcon />
        </Link>
      </div>
      <div className="flex flex-col gap-4" aria-hidden="true">
        <Row logos={clientRow1} direction="left" />
        <Row logos={clientRow2} direction="right" />
      </div>
    </section>
  );
}

export default ClientMarquee;
