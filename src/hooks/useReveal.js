import { useLayoutEffect, useRef } from 'react';
import { isSlowConnection } from '../utils/network';

// One shared observer for every revealed element (threshold 12 %, 40px early exit margin).
let sharedObserver = null;
function getObserver() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            sharedObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
  }
  return sharedObserver;
}

// Entrance as an element first enters the viewport. No-op under reduced motion.
// { stagger: true } fades the container's direct children in one after another instead of the container itself.
// Never use on above-the-fold / LCP content.
export function useReveal({ stagger = false } = {}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const classes = [stagger ? 'reveal-stagger' : 'reveal'];
    if (isSlowConnection()) classes.push('reveal-lite');
    el.classList.add(...classes);
    const observer = getObserver();
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [stagger]);

  return ref;
}

export default useReveal;
