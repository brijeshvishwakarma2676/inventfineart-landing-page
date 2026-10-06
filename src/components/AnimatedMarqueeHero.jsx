import { Link } from 'react-router';
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';

// Adapted from the supplied "hero-3" AnimatedMarqueeHero (React + framer-motion):
// tagline pill, word-by-word title, description, CTA, and a tilted image marquee along the bottom.
const FADE = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

export function AnimatedMarqueeHero({ tagline, title, description, ctaText, ctaTo, images }) {
  const reduce = useReducedMotion();
  const track = [...images, ...images]; // duplicated for a seamless loop
  const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.35 } };

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        className="relative w-full overflow-hidden bg-bg border-b border-line flex flex-col items-center justify-center text-center px-4 pt-24 pb-[270px] md:pt-28 md:pb-[340px] min-h-[760px] md:min-h-[860px]"
        aria-label="Start a project"
      >
        <div className="relative z-10 flex flex-col items-center">
          <m.div
            {...inView}
            variants={reduce ? undefined : FADE}
            className="mb-5 inline-block rounded-full border border-line bg-bg-raised/60 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 backdrop-blur-sm"
          >
            {tagline}
          </m.div>

          <m.h2
            {...inView}
            variants={reduce ? undefined : { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1.05] text-text max-w-[920px] text-balance"
          >
            {title.split(' ').map((word, i) => (
              <m.span key={`${word}-${i}`} variants={reduce ? undefined : FADE} className="inline-block">
                {word}&nbsp;
              </m.span>
            ))}
          </m.h2>

          <m.p
            {...inView}
            variants={reduce ? undefined : FADE}
            transition={{ delay: 0.45 }}
            className="mt-6 max-w-xl font-body text-base md:text-lg text-text-dim"
          >
            {description}
          </m.p>

          <m.div {...inView} variants={reduce ? undefined : FADE} transition={{ delay: 0.55 }} className="mt-8">
            <m.div whileHover={reduce ? undefined : { scale: 1.02 }} whileTap={reduce ? undefined : { scale: 0.98 }}>
              <Link
                to={ctaTo}
                className="inline-flex items-center justify-center px-9 py-4 rounded-full bg-accent hover:bg-accent-hover text-text text-xs md:text-sm font-semibold uppercase tracking-wider transition-colors min-h-[48px]"
              >
                {ctaText}
              </Link>
            </m.div>
          </m.div>
        </div>

        {/* Tilted image marquee (decorative) */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full h-[250px] md:h-[320px] [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]"
        >
          <m.div
            className="flex gap-4 w-max pt-6"
            animate={reduce ? undefined : { x: ['0%', '-50%'] }}
            transition={{ ease: 'linear', duration: 60, repeat: Infinity }}
          >
            {track.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative aspect-[3/4] h-44 md:h-60 flex-shrink-0"
                style={{ rotate: `${index % 2 === 0 ? -2 : 4}deg` }}
              >
                <img src={src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[2px]" />
              </div>
            ))}
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}

export default AnimatedMarqueeHero;
