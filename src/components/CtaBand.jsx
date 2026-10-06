import { Suspense, lazy } from 'react';
import siteData from '../data/site';

// framer-motion lives in its own chunk so it never weighs on the entry bundle.
const AnimatedMarqueeHero = lazy(() => import('./AnimatedMarqueeHero'));

export function CtaBand() {
  const { tagline, headline, subline, buttonText, buttonHref, marquee } = siteData.ctaBand;

  return (
    <Suspense fallback={<div className="min-h-[760px] md:min-h-[860px] bg-bg border-b border-line" aria-hidden="true" />}>
      <AnimatedMarqueeHero
        tagline={tagline}
        title={headline}
        description={subline}
        ctaText={buttonText}
        ctaTo={buttonHref}
        images={marquee}
      />
    </Suspense>
  );
}

export default CtaBand;
