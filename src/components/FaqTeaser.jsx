import { Link } from 'react-router';
import { homeFaqs } from '../data/faqs';
import FaqList from './FaqList';
import { useReveal } from '../hooks/useReveal';
import { ArrowIcon } from './Icons';

export function FaqTeaser() {
  const revealRef = useReveal();

  return (
    <section className="bg-bg border-b border-line" aria-label="Frequently asked questions">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-20 md:py-28 grid md:grid-cols-12 gap-10 md:gap-16" ref={revealRef}>
        <div className="md:col-span-4">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-3">FAQ</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text mb-6">Questions, answered</h2>
          <Link to="/faq" className="inline-flex items-center gap-2 font-body text-sm text-text-dim hover:text-text transition-colors min-h-[44px]">
            All questions <ArrowIcon />
          </Link>
        </div>
        <div className="md:col-span-8">
          <FaqList items={homeFaqs} />
        </div>
      </div>
    </section>
  );
}

export default FaqTeaser;
