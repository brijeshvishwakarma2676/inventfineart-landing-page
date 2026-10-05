import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import siteData from '../data/site';
import { ArrowIcon } from './Icons';

export function Hero() {
  const { slides, stats, eyebrow } = siteData.hero;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-advance slides every 6 seconds unless paused
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

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
      className="relative min-h-[88vh] flex flex-col justify-end overflow-hidden pt-[72px] bg-bg select-none"
      aria-label="Hero Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      <div className="absolute inset-0 z-0" aria-live="polite">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isFirst = index === 0;
          return (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out overflow-hidden ${
                isActive ? 'opacity-100 visible z-10' : 'opacity-0 invisible z-0'
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.image}
                srcSet={`${slide.image960} 960w, ${slide.image} 1920w`}
                sizes="100vw"
                alt={slide.alt}
                className={`w-full h-full object-cover object-[center_35%] transition-transform duration-[6000ms] ease-linear ${
                  isActive ? 'scale-[1.04]' : 'scale-100'
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

            {/* Slider Dots & Counter */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2" role="tablist" aria-label="Hero slide dots">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.image}
                    type="button"
                    role="tab"
                    aria-selected={idx === currentSlide}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-[3px] transition-all duration-300 cursor-pointer ${
                      idx === currentSlide
                        ? 'w-10 bg-accent'
                        : 'w-6 bg-text/25 hover:bg-text/50'
                    }`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>
              <span className="font-body text-xs font-medium text-text-dim tracking-wider">
                0{currentSlide + 1} / 0{slides.length}
              </span>
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
