import siteData from '../data/site';
import { useReveal } from '../hooks/useReveal';
import HoverPreviewText from './HoverPreviewText';

export function Intro() {
  const { eyebrow, title, quoteParts, previews, features } = siteData.intro;
  const revealRef = useReveal();

  return (
    <section className="relative bg-bg border-b border-line" aria-label="Introduction">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-20 md:py-28" ref={revealRef}>
        {/* Editorial Oversized Text Block */}
        <div className="max-w-[1040px] mb-16 md:mb-20">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-3">
            {eyebrow}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text font-normal mb-6">
            {title}
          </h2>
          <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl text-text-dim font-light leading-snug md:leading-relaxed text-pretty">
            &ldquo;<HoverPreviewText parts={quoteParts} previews={previews} />&rdquo;
          </blockquote>
        </div>

        {/* Three Distinct Architectural Features - Hairline Divided (No cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-y border-line divide-y md:divide-y-0 md:divide-x divide-line mt-16 md:mt-24">
          {features.map((feat, idx) => (
            <div
              key={feat.title}
              className="py-8 md:py-10 md:px-8 first:md:pl-0 last:md:pr-0 flex flex-col gap-3"
            >
              <span className="font-body text-xs font-semibold text-accent-2 tracking-widest">
                0{idx + 1}
              </span>
              <h3 className="font-display text-xl md:text-2xl text-text font-medium">
                {feat.title}
              </h3>
              <p className="font-body text-sm md:text-base text-text-dim leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Intro;
