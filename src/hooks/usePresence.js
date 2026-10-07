import { useCallback, useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Parent-controlled overlays (e.g. the mobile menu): stay mounted while the exit animation plays.
// Returns { mounted, closing }. Under reduced motion the overlay unmounts immediately.
export function usePresence(open, exitMs = 200) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open || !mounted) return undefined;
    const timer = setTimeout(() => setMounted(false), prefersReducedMotion() ? 0 : exitMs);
    return () => clearTimeout(timer);
  }, [open, mounted, exitMs]);

  return { mounted, closing: mounted && !open };
}

// Self-closing overlays (lightbox, chat window): play the exit animation, then call the parent's onClose.
export function useExitClose(onClose, exitMs = 200) {
  const [closing, setClosing] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const requestClose = useCallback(() => {
    if (timerRef.current) return;
    if (prefersReducedMotion()) {
      onClose();
      return;
    }
    setClosing(true);
    timerRef.current = setTimeout(onClose, exitMs);
  }, [onClose, exitMs]);

  return { closing, requestClose };
}

export default usePresence;
