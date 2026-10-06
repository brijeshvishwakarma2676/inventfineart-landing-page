import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { Link } from 'react-router';
import siteData from '../data/site';
import { ArrowIcon } from './Icons';
import { lqip } from '../data/lqip';
import { useIntro } from '../hooks/useIntro';

const SLIDE_MS = 6000;
const REDUCED = '(prefers-reduced-motion: reduce)';
const subscribeMotion = (cb) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

export function Hero() {
  const { slides, stats, eyebrow } = siteData.hero;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userPaused, setUserPaused] = useState(false); // explicit Pause button
  const [focusPaused, setFocusPaused] = useState(false); // keyboard focus on the slide controls
  const [tabVisible, setTabVisible] = useState(() => document.visibilityState === 'visible');
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(REDUCED).matches, () => false);
  const { playing: introPlaying } = useIntro();
  const preloaded = useRef({});
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // The slideshow runs unless the visitor paused it, a keyboard user is on its controls, the tab is hidden, the
  // session intro is still covering the page, or the visitor prefers reduced motion. Hovering or tapping the hero
  // never pauses it (the hero fills the screen, so that made it look stuck).
  const autoplay = !userPaused && !focusPaused && tabVisible && !introPlaying && !reducedMotion;

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Resolves when a slide's image is cached (or after a timeout, so one slow image can never freeze the show).
  const preload = useCallback(
    (i) => {
      if (!preloaded.current[i]) {
        const slide = slides[i];
        preloaded.current[i] = new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.srcset = `${slide.image960} 960w, ${slide.image} 1920w`;
          img.sizes = '100vw';
          img.src = slide.image;
          window.setTimeout(resolve, 4000);
        });
      }
      return preloaded.current[i];
    },
    [slides],
  );

  // One timer per slide: any change of slide (auto, dot, swipe) restarts the countdown. The next image is fetched
  // shortly after the slide appears (not competing with the first paint) and awaited before advancing.
  useEffect(() => {
    if (!autoplay) return undefined;
    let cancelled = false;
    const next = (currentSlide + 1) % slides.length;
    const warm = window.setTimeout(() => preload(next), 1500);
    const advance = window.setTimeout(async () => {
      await preload(next);
      if (!cancelled) setCurrentSlide(next);
    }, SLIDE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(warm);
      window.clearTimeout(advance);
    };
  }, [autoplay, currentSlide, slides.length, preload]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[88vh] flex flex-col justify-end overflow-hidden pt-[var(--header-h)] bg-bg select-none"
      aria-label="Hero Showcase"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      <div className="absolute inset-0 z-0" aria-live={autoplay ? 'off' : 'polite'}>
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isFirst = index === 0;
          return (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out overflow-hidden ${
                isActive ? 'opacity-100 visible z-10' : 'opacity-0 invisible z-0'
              }`}
              style={lqip[slide.image] ? { backgroundImage: `url(${lqip[slide.image]})`, backgroundSize: 'cover', backgroundPosition: 'center 35%' } : undefined}
              aria-hidden={!isActive}
            >
              <img
                src={slide.image}
                srcSet={`${slide.image960} 960w, ${slide.image} 1920w`}
                sizes="100vw"
                alt={slide.alt}
                className={`w-full h-full object-cover object-[center_35%] transition-transform ease-linear ${
                  isActive ? 'scale-[1.04] duration-[6000ms]' : 'scale-100 duration-0'
                }`}
                loading={isFirst ? 'eager' : 'lazy'}
                fetchPriority={isFirst ? 'high' : 'auto'}
                decoding={isFirst ? 'sync' : 'async'}
              />
            </div>
          );
        })}
      </div>

      {/* Cinematic Editorial Overlays */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[rgba(91,48,0,0.35)] mix-blend-multiply z-20 pointer-events-none" />

      {/* Hero Content (Restrained lower-left position) */}
      <div className="relative z-30 pb-10 md:pb-14 w-full">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="max-w-[840px]">
            <span className="inline-flex items-center gap-2.5 font-body text-xs md:text-sm font-semibold uppercase tracking-[0.14em] text-accent-2 mb-4 before:content-[''] before:inline-block before:w-5 before:h-[1px] before:bg-accent-2">
              {eyebrow}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-[76px] leading-[1.04] text-text font-normal mb-8 text-balance min-h-[2.1em] ">
              {slides[currentSlide].headline}
            </h1>

            <div className="flex items-center flex-wrap gap-4 mb-8">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-text text-xs md:text-sm font-semibold uppercase tracking-wider transition-colors min-h-[48px]"
              >
                Start a project
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-text/40 hover:border-text text-text text-xs md:text-sm font-medium tracking-wide transition-colors min-h-[48px]"
              >
                <span>View gallery</span>
                <ArrowIcon />
              </Link>
            </div>

            {/* Slider dots, counter and pause control */}
            <div
              className="flex items-center gap-4"
              onFocus={(e) => e.target.matches(':focus-visible') && setFocusPaused(true)}
              onBlur={() => setFocusPaused(false)}
            >
              <div className="flex items-center" role="tablist" aria-label="Hero slides">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.image}
                    type="button"
                    role="tab"
                    aria-selected={idx === currentSlide}
                    aria-label={`Go to slide ${idx + 1}`}
                    className="group py-4 px-1 cursor-pointer"
                    onClick={() => setCurrentSlide(idx)}
                  >
                    <span
                      className={`block h-[3px] transition-all duration-300 ${
                        idx === currentSlide ? 'w-10 bg-accent' : 'w-6 bg-text/25 group-hover:bg-text/50'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="font-body text-xs font-medium text-text-dim tracking-wider">
                0{currentSlide + 1} / 0{slides.length}
              </span>
              {!reducedMotion && (
                <button
                  type="button"
                  onClick={() => setUserPaused((p) => !p)}
                  aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
                  className="w-11 h-11 -ml-2 flex items-center justify-center text-text-dim hover:text-text transition-colors cursor-pointer"
                >
                  <span className="font-body text-[10px]" aria-hidden="true">
                    {userPaused ? '▶' : '❚❚'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Static Numbers Strip */}
      <div className="relative z-30 w-full border-t border-line bg-bg/85 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-3 py-4 md:py-6 divide-x divide-line">
            {stats.map((st, i) => (
              <div
                key={st.label}
                className={`flex flex-col gap-0.5 ${i === 0 ? 'pr-4' : 'px-4 md:px-8'}`}
              >
                <span className="font-display text-2xl sm:text-3xl md:text-4xl text-text font-normal leading-none">
                  {st.value}
                </span>
                <span className="font-body text-[11px] md:text-xs font-medium uppercase tracking-wider text-text-dim">
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
