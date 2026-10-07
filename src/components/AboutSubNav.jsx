import { useEffect, useRef, useState } from 'react';

const SECTIONS = [
  { id: 'story', label: 'Story' },
  { id: 'craft', label: 'Craft & Materials' },
  { id: 'process', label: 'Process' },
  { id: 'facility', label: 'Facility' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'visit', label: 'Visit Us' },
];

export function AboutSubNav() {
  const [activeId, setActiveId] = useState('story');
  const navTrackRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // 72px fixed header + ~48px subnav + 20px threshold margin
      const offsetThreshold = 140;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offsetThreshold) {
            setActiveId(SECTIONS[i].id);
            return;
          }
        }
      }
      setActiveId(SECTIONS[0].id);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      // 72px main header + 48px sticky sub-nav
      const headerOffset = 120;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <nav
      aria-label="About section navigation"
      className="sticky z-40 bg-bg/95 backdrop-blur-md border-b border-line shadow-none"
      style={{ top: '72px' }}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div
          ref={navTrackRef}
          className="flex items-center gap-6 md:gap-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-3"
        >
          {SECTIONS.map(({ id, label }) => {
            const isActive = activeId === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className={`text-xs uppercase tracking-[0.14em] font-semibold transition-colors whitespace-nowrap py-1 relative ${
                  isActive ? 'text-accent-2' : 'text-text-dim hover:text-text'
                }`}
                aria-current={isActive ? 'location' : undefined}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute -bottom-3 left-0 right-0 h-[2px] bg-accent-2"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default AboutSubNav;
