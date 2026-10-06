import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { ArrowIcon } from './Icons';

// Adapted from the supplied "hover-preview" component: key phrases in a paragraph reveal an image card.
//  - Hover + fine pointer (desktop): card follows the cursor; the phrase is a link. Keyboard focus also shows the card.
//  - Touch / no hover (phones, many tablets): phrases are tappable; the card opens anchored to the phrase with a link,
//    and closes on outside tap, Esc, scroll or resize.
const HOVER_QUERY = '(hover: hover) and (pointer: fine)';
const subscribe = (cb) => {
  const mq = window.matchMedia(HOVER_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getSnapshot = () => window.matchMedia(HOVER_QUERY).matches;

const CARD_W = 296; // 280px image + padding
const MARGIN = 16;
const FALLBACK_H = 280;

const phraseClass = (canHover) =>
  `cursor-pointer font-medium text-text rounded-[1px] bg-gradient-to-r from-accent-2 to-accent-2 bg-no-repeat [background-position:0_100%] box-decoration-clone transition-[background-size] duration-500 ease-custom focus-visible:outline-offset-4 ${
    canHover ? '[background-size:0%_2px] hover:[background-size:100%_2px] focus-visible:[background-size:100%_2px]' : '[background-size:100%_1px]'
  }`;

export function HoverPreviewText({ parts, previews }) {
  const canHover = useSyncExternalStore(subscribe, getSnapshot, () => true);
  const cardId = useId();
  const cardRef = useRef(null);
  const rootRef = useRef(null);
  const [current, setCurrent] = useState(null); // key of the last shown preview (kept for the fade-out)
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const preloaded = useRef(false);

  // Warm the images once the paragraph nears the viewport (not on page load).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !preloaded.current) {
          preloaded.current = true;
          Object.values(previews).forEach((p) => {
            new Image().src = p.image;
          });
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [previews]);

  const cardHeight = () => cardRef.current?.offsetHeight || FALLBACK_H;
  // Keep the card below the fixed header and inside the viewport.
  const clampY = (y, h) => {
    const top = (document.querySelector('header')?.getBoundingClientRect().bottom || 0) + 8;
    return Math.min(Math.max(y, top), window.innerHeight - h - MARGIN);
  };
  const clampX = (x) => Math.min(Math.max(x, MARGIN), window.innerWidth - CARD_W - MARGIN);

  // Card above the cursor, flipping below if there is no room.
  const placeAtCursor = useCallback((e) => {
    const h = cardHeight();
    const topLimit = (document.querySelector('header')?.getBoundingClientRect().bottom || 0) + 8;
    let y = e.clientY - h - 20;
    if (y < topLimit) y = e.clientY + 24;
    setPos({ x: clampX(e.clientX - CARD_W / 2), y: clampY(y, h) });
  }, []);

  // Card anchored to the phrase (touch + keyboard focus).
  const placeAtElement = useCallback((el) => {
    const r = el.getBoundingClientRect();
    const h = cardHeight();
    const topLimit = (document.querySelector('header')?.getBoundingClientRect().bottom || 0) + 8;
    let y = r.top - h - 12;
    if (y < topLimit) y = r.bottom + 12;
    setPos({ x: clampX(r.left + r.width / 2 - CARD_W / 2), y: clampY(y, h) });
  }, []);

  const show = (key) => {
    setCurrent(key);
    setVisible(true);
  };
  const hide = useCallback(() => setVisible(false), []);

  // Touch mode: dismiss on outside tap, Esc, scroll, resize.
  useEffect(() => {
    if (!visible || canHover) return undefined;
    const onDown = (e) => {
      if (cardRef.current?.contains(e.target) || e.target.closest?.('[data-hp-trigger]')) return;
      hide();
    };
    const onKey = (e) => e.key === 'Escape' && hide();
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('resize', hide);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', hide);
      window.removeEventListener('resize', hide);
    };
  }, [visible, canHover, hide]);

  const data = current ? previews[current] : null;

  const renderPhrase = (part, i) => {
    const common = { 'data-hp-trigger': '', 'aria-describedby': visible && current === part.key ? cardId : undefined };
    if (canHover) {
      return (
        <Link
          key={i}
          to={previews[part.key].to}
          className={phraseClass(true)}
          onMouseEnter={(e) => {
            show(part.key);
            placeAtCursor(e);
          }}
          onMouseMove={placeAtCursor}
          onMouseLeave={hide}
          onFocus={(e) => {
            show(part.key);
            placeAtElement(e.currentTarget);
          }}
          onBlur={hide}
          {...common}
        >
          {part.text}
        </Link>
      );
    }
    const open = visible && current === part.key;
    return (
      <span
        key={i}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        className={phraseClass(false)}
        onClick={(e) => {
          if (open) return hide();
          show(part.key);
          placeAtElement(e.currentTarget);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
        {...common}
      >
        {part.text}
      </span>
    );
  };

  return (
    <span ref={rootRef}>
      {parts.map((part, i) => (typeof part === 'string' ? part : renderPhrase(part, i)))}

      {data &&
        // Portal to <body>: the page-fade wrapper creates a stacking context that would put the card under the floating WhatsApp button.
        createPortal(
        <span
          ref={cardRef}
          id={cardId}
          role={canHover ? 'tooltip' : 'dialog'}
          aria-label={canHover ? undefined : data.title}
          aria-hidden={!visible}
          style={{ left: pos.x, top: pos.y, width: CARD_W }}
          className={`fixed z-[1000] block bg-bg-raised border border-line rounded-[2px] p-2 text-left transition-[opacity,transform] duration-300 ease-custom ${
            canHover ? 'pointer-events-none' : 'pointer-events-auto'
          } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
        >
          <img src={data.image} alt="" width="280" height="210" className="block w-full aspect-[4/3] object-cover rounded-[1px]" />
          <span className="block px-1.5 pt-3 font-display text-lg leading-tight font-normal text-text not-italic">{data.title}</span>
          <span className="block px-1.5 pb-1.5 pt-0.5 font-body text-xs leading-snug font-normal text-text-dim not-italic">{data.subtitle}</span>
          {!canHover && (
            <Link
              to={data.to}
              className="flex items-center justify-between gap-2 mt-1 px-1.5 border-t border-line font-body text-sm font-normal text-text hover:text-accent-2 transition-colors min-h-[44px] not-italic"
              tabIndex={visible ? 0 : -1}
            >
              {data.linkLabel} <ArrowIcon className="w-4 h-4" />
            </Link>
          )}
        </span>,
          document.body,
        )}
    </span>
  );
}

export default HoverPreviewText;
