import { Link } from 'react-router';
import siteData from '../data/site';
import { useReveal } from '../hooks/useReveal';
import SmartImage from './SmartImage';
import { ArrowIcon } from './Icons';

// Asymmetric editorial arrangement: sizes and offsets deliberately differ.
const LAYOUT = [
  'col-span-2 md:col-span-5 aspect-[4/5]',
  'col-span-2 md:col-span-7 aspect-[16/10] md:mt-16',
  'col-span-1 md:col-span-4 aspect-square',
  'col-span-1 md:col-span-3 aspect-[3/4] md:mt-6',
  'col-span-2 md:col-span-5 aspect-[4/3] md:mt-8',
  'col-span-2 md:col-span-9 md:col-start-4 aspect-[16/9] md:aspect-[21/9]',
];

export function FeaturedWorks() {
  const { showcase } = siteData.intro;
  const revealRef = useReveal();

  return (
    <section className="bg-bg border-b border-line" aria-label="Featured works">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-20 md:py-28" ref={revealRef}>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10 md:mb-14">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text">Selected works</h2>
          <Link to="/gallery" className="inline-flex items-center gap-2 font-body text-sm text-text-dim hover:text-text transition-colors">
            Explore the full gallery <ArrowIcon />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-6 items-start">
          {showcase.map((item, idx) => (
            <figure key={item.src} className={`${LAYOUT[idx] || 'col-span-1 md:col-span-4'} overflow-hidden rounded-[2px]`}>
              <SmartImage src={item.src} alt={item.alt} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedWorks;
