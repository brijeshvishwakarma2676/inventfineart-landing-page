import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

export function RootLayout() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mainRef = useRef(null);
  const firstRender = useRef(true);

  // New route: reset scroll, close the mobile menu, move focus to <main> for keyboard/screen-reader users.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsMenuOpen(false);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-bg text-text font-body selection:bg-accent selection:text-text">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10002] focus:px-6 focus:py-3 focus:bg-accent focus:text-text focus:font-semibold"
      >
        Skip to main content
      </a>
      <Nav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main id="main-content" tabIndex={-1} ref={mainRef}>
        <div key={pathname} className="page-fade">
          <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp isHidden={isMenuOpen} />
    </div>
  );
}

export default RootLayout;
