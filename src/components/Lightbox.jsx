import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { ArrowIcon, CloseIcon } from './Icons';

const FOCUSABLE = 'button, a[href], [tabindex]:not([tabindex="-1"])';

export function Lightbox({ items, currentIndex, categoryLabel, quoteHref, onClose, onNavigate }) {
  const item = items[currentIndex];
  const total = items.length;
  const modalRef = useRef(null);
  const closeRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Progressive loading: show the (already cached) thumbnail instantly, swap to the full-size file once it has downloaded.
  const [fullState, setFullState] = useState({ id: null, failed: false });
  useEffect(() => {
    if (!item) return undefined;
    let alive = true;
    const img = new Image();
    img.onload = () => alive && setFullState({ id: item.id, failed: false });
    img.onerror = () => alive && setFullState({ id: item.id, failed: true });
    img.src = item.full;
    return () => {
      alive = false;
    };
  }, [item]);
  const fullReady = Boolean(item) && fullState.id === item.id && !fullState.failed;
  const fullFailed = Boolean(item) && fullState.id === item.id && fullState.failed;

  const go = (delta) => onNavigate((currentIndex + delta + total) % total);

  // Scroll lock + focus management (focus the close button, restore focus on unmount).
  useEffect(() => {
    const previous = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
    };
  }, []);

  // Keyboard: Esc / arrows, and a Tab focus trap.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab' && modalRef.current) {
        const nodes = [...modalRef.current.querySelectorAll(FOCUSABLE)];
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Preload neighbours.
  useEffect(() => {
    [-1, 1].forEach((d) => {
      const n = items[(currentIndex + d + total) % total];
      if (n) new Image().src = n.full;
    });
  }, [currentIndex, items, total]);

  if (!item) return null;

  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
  };

  const iconBtn =
    'w-11 h-11 rounded-[2px] border border-line bg-bg/80 text-text flex items-center justify-center hover:border-text-dim transition-colors cursor-pointer';

  // Portal to <body> so the fixed header and the page-fade wrapper's stacking context cannot cover it.
  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] bg-bg/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${categoryLabel} artwork ${item.n}`}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        touchEndX.current = e.touches[0].clientX;
      }}
      onTouchMove={(e) => {
        touchEndX.current = e.touches[0].clientX;
      }}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between">
        <p className="font-body text-xs md:text-sm uppercase tracking-wider">
          <span className="font-semibold text-accent-2">{categoryLabel}</span>
          <span className="text-text-dim ml-3">{currentIndex + 1} / {total}</span>
        </p>
        <button ref={closeRef} type="button" className={iconBtn} onClick={onClose} aria-label="Close (Esc)">
          <CloseIcon />
        </button>
      </div>

      <div className="relative flex-1 flex items-center justify-center my-4 min-h-0">
        {total > 1 && (
          <button type="button" className={`${iconBtn} absolute left-0 z-10`} onClick={() => go(-1)} aria-label="Previous artwork">
            <ArrowIcon className="w-5 h-5 rotate-180" />
          </button>
        )}
        <img
          key={item.id}
          src={fullReady ? item.full : item.thumb}
          alt={item.alt}
          width={item.w}
          height={item.h}
          className={`max-w-full max-h-full w-auto h-auto object-contain rounded-[2px] transition-[filter] duration-500 ${fullReady ? '' : 'blur-[2px]'}`}
        />
        {!fullReady && (
          <span role="status" className="pointer-events-none absolute top-1 left-1/2 -translate-x-1/2 skeleton border border-line px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.14em] text-text">
            {fullFailed ? 'Full size unavailable' : 'Loading full size…'}
          </span>
        )}
        {total > 1 && (
          <button type="button" className={`${iconBtn} absolute right-0 z-10`} onClick={() => go(1)} aria-label="Next artwork">
            <ArrowIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <Link
          to={quoteHref}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-accent hover:bg-accent-hover text-text text-xs uppercase font-semibold tracking-wider transition-colors min-h-[48px]"
        >
          Request a quote for this piece <ArrowIcon />
        </Link>
        {total > 1 && (
          <div className="hidden md:flex items-center gap-2 max-w-[70vw] overflow-x-auto py-1" aria-label="Artwork thumbnails">
            {items.map((it, idx) => (
              <button
                key={it.id}
                type="button"
                className={`w-12 h-12 flex-shrink-0 border rounded-[2px] overflow-hidden p-0 bg-transparent cursor-pointer transition-opacity ${
                  idx === currentIndex ? 'opacity-100 border-accent' : 'opacity-50 border-line hover:opacity-80'
                }`}
                onClick={() => onNavigate(idx)}
                aria-label={`View artwork ${idx + 1}`}
              >
                <img src={it.thumb} alt="" width="48" height="48" loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default Lightbox;
