import { useLayoutEffect, useRef } from 'react';

// Quiet fade-in as an element first enters the viewport. No-op under reduced motion.
export function useReveal() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    el.classList.add('reveal');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-revealed');
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export default useReveal;
