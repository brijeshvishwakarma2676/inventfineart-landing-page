import { Link } from 'react-router';
import services from '../data/services';
import { useReveal } from '../hooks/useReveal';
import { ArrowIcon } from './Icons';

// Home teaser: the 7 service names as a large editorial list linking to /services.
export function ServicesTeaser() {
  const revealRef = useReveal();

  return (
    <section className="bg-bg border-b border-line" aria-label="What we make">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-20 md:py-28 grid md:grid-cols-12 gap-10" ref={revealRef}>
        <div className="md:col-span-4">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-3">What we make</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text mb-6">Seven disciplines, one studio</h2>
          <Link to="/services" className="inline-flex items-center gap-2 font-body text-sm text-text-dim hover:text-text transition-colors">
            All services <ArrowIcon />
          </Link>
        </div>
        <ul className="md:col-span-8 border-t border-line">
          {services.map((s) => (
            <li key={s.id} className="border-b border-line">
              <Link to="/services" className="group flex items-baseline gap-5 py-4 md:py-5">
                <span className="font-body text-xs font-semibold tracking-wider text-accent-2 w-6">{s.num}</span>
                <span className="font-display text-2xl md:text-4xl text-text-dim group-hover:text-text transition-colors">{s.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ServicesTeaser;
