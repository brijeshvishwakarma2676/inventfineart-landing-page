import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { showcase3d } from '../data/showcase3d';
import { ArrowIcon, CloseIcon } from './Icons';
import { isSlowConnection } from '../utils/network';

// three.js + react-three-fiber live in their own chunk and are only requested when the 3D view is started.
const ThreeDGallery = lazy(() => import('./ThreeDGallery'));

const AUTO_SPEED = 0.3;
const FINE_DESKTOP = '(hover: hover) and (pointer: fine)';
const REDUCED = '(prefers-reduced-motion: reduce)';

const webglAvailable = () => {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

// If the 3D chunk or the GL context fails, fall back to the static grid instead of breaking the page.
class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function StaticGrid({ note }) {
  return (
    <div>
      {note && <p className="font-body text-sm text-text-dim mb-6 max-w-[560px]">{note}</p>}
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {showcase3d.slice(0, 8).map((img) => (
          <li key={img.src}>
            <Link to={img.to} className="group block overflow-hidden rounded-[2px] bg-bg-raised aspect-[4/3]">
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const ctlBtn =
  'w-11 h-11 rounded-[2px] border border-line text-text flex items-center justify-center hover:border-text-dim transition-colors cursor-pointer';

export function ImmersiveGallery() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const controls = useRef({ velocity: 0, last: 0, paused: false, dragging: false });
  const [mode, setMode] = useState('poster'); // 'poster' | 'live' | 'static'
  const [note, setNote] = useState('');
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [visibleCount] = useState(() => (window.innerWidth < 640 ? 8 : 12));
  const autoTried = useRef(false);
  const [touchOnly] = useState(() => !window.matchMedia(FINE_DESKTOP).matches);

  const start = useCallback(() => {
    if (window.matchMedia(REDUCED).matches) {
      setNote('Motion is reduced on your device, so here is a still selection instead. Select any piece to open it.');
      return setMode('static');
    }
    if (!webglAvailable()) {
      setNote('3D view is not available on this device, so here is a still selection instead.');
      return setMode('static');
    }
    setMode('live');
  }, []);

  // Track whether the section is on screen (rendering pauses off-screen) and auto-start only on capable desktops.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        const capable = window.matchMedia(FINE_DESKTOP).matches && window.innerWidth >= 1024 && !isSlowConnection();
        if (entry.isIntersecting && capable && !autoTried.current) {
          autoTried.current = true;
          start();
        }
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [start]);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const nudge = useCallback((amount) => {
    controls.current.velocity += amount;
    controls.current.last = performance.now();
  }, []);

  const togglePause = () => {
    controls.current.paused = !controls.current.paused;
    setPaused(controls.current.paused);
  };

  // Drag (mouse or touch, horizontal) and arrow keys. The wheel is deliberately not captured so the page keeps scrolling.
  const onPointerDown = (e) => {
    if (e.target.closest('button')) return; // let the control buttons receive their own clicks
    controls.current.dragging = true;
    controls.current.last = performance.now();
  };
  const onPointerMove = (e) => {
    if (!controls.current.dragging) return;
    controls.current.velocity -= e.movementX * 0.05;
    controls.current.last = performance.now();
  };
  const endDrag = () => {
    controls.current.dragging = false;
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nudge(2);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nudge(-2);
    }
  };

  // Called every frame by the 3D scene: auto-drift after 3s idle, damping, clamp. Returns the current velocity.
  const step = useCallback((delta) => {
    const c = controls.current;
    if (!c.paused && !c.dragging && performance.now() - c.last > 3000) c.velocity += AUTO_SPEED * delta;
    c.velocity *= Math.pow(0.95, delta * 60);
    c.velocity = Math.max(-8, Math.min(8, c.velocity));
    return c.velocity;
  }, []);

  const onSelect = useCallback((i) => navigate(showcase3d[i].to), [navigate]);
  const staticFallback = <StaticGrid note="3D view could not start, so here is a still selection instead." />;

  return (
    <section ref={rootRef} className="bg-bg border-b border-line" aria-label="Immersive 3D view">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-3">Immersive view</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text">Walk through the work</h2>
          </div>
          <p className="font-body text-sm md:text-base text-text-dim max-w-[420px]">
            Drag sideways, swipe or use the arrow keys to drift through a selection of pieces. Select one to open it in its collection.
          </p>
        </div>

        {mode === 'static' && <StaticGrid note={note} />}

        {mode === 'poster' && (
          <div className="relative overflow-hidden rounded-[2px] border border-line bg-bg-raised h-[360px] md:h-[480px]">
            <ul className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 gap-px opacity-60" aria-hidden="true">
              {showcase3d.slice(0, 4).map((img, i) => (
                <li key={img.src} className={i === 3 ? 'hidden md:block' : ''}>
                  <img src={img.src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </li>
              ))}
            </ul>
            <div className="absolute inset-0 bg-bg/55" />
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <button
                type="button"
                onClick={start}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent hover:bg-accent-hover text-text text-xs md:text-sm font-semibold uppercase tracking-wider transition-colors min-h-[48px] cursor-pointer"
              >
                Enter 3D view <ArrowIcon />
              </button>
            </div>
          </div>
        )}

        {mode === 'live' && (
          <Boundary fallback={staticFallback}>
            <div
              ref={stageRef}
              role="group"
              aria-label="3D gallery. Drag or use the arrow keys to move; select an artwork to open it."
              tabIndex={0}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={endDrag}
              onKeyDown={onKeyDown}
              style={{ touchAction: 'pan-y' }}
              className="relative overflow-hidden rounded-[2px] border border-line bg-bg-raised h-[58vh] min-h-[360px] max-h-[680px] cursor-grab active:cursor-grabbing focus-visible:outline-offset-2"
            >
              <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center font-body text-sm text-text-dim">Loading 3D view…</div>}>
                <ThreeDGallery images={showcase3d} step={step} active={inView && tabVisible} visibleCount={visibleCount} onSelect={onSelect} />
              </Suspense>
            </div>

            {/* Controls sit below the stage so nothing overlaps the artwork or the floating WhatsApp button */}
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="font-body text-[11px] uppercase tracking-[0.12em] text-text-dim">{touchOnly ? 'Swipe sideways · tap a piece' : 'Drag · arrow keys · click a piece'}</p>
              <div className="flex gap-2">
                <button type="button" className={ctlBtn} onClick={() => nudge(-2)} aria-label="Move backward">
                  <ArrowIcon className="w-5 h-5 rotate-180" />
                </button>
                <button type="button" className={ctlBtn} onClick={togglePause} aria-label={paused ? 'Resume automatic movement' : 'Pause automatic movement'}>
                  <span className="font-body text-xs font-semibold" aria-hidden="true">{paused ? '▶' : '❚❚'}</span>
                </button>
                <button type="button" className={ctlBtn} onClick={() => nudge(2)} aria-label="Move forward">
                  <ArrowIcon className="w-5 h-5" />
                </button>
                <button type="button" className={ctlBtn} onClick={() => setMode('poster')} aria-label="Close 3D view">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Boundary>
        )}
      </div>
    </section>
  );
}

export default ImmersiveGallery;
