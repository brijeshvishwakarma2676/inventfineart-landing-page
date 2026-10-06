import ChatWidget from '../chatbot';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router';
import PageSkeleton from '../components/PageSkeleton';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import CookieBanner from '../components/CookieBanner';
import IntroReveal from '../components/IntroReveal';
import { useConsent } from '../hooks/useConsent';
import { useIntro } from '../hooks/useIntro';
import siteData from '../data/site';

export function RootLayout() {
  const { pathname } = useLocation();
  const navigation = useNavigation();
  const isNavigating = navigation.state !== 'idle'; // a page's code is downloading
  const { open: isConsentOpen } = useConsent();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { playing: introActive, ready: introReady } = useIntro();
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
    <>
      {introActive && (
        <IntroReveal {...siteData.preloader} />
      )}
      {/* inert while the intro plays: no focus or screen-reader access to content hidden under it */}
      <div inert={introActive} className="relative min-h-screen bg-bg text-text font-body selection:bg-accent selection:text-text">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10002] focus:px-6 focus:py-3 focus:bg-accent focus:text-text focus:font-semibold"
      >
        Skip to main content
      </a>
      {isNavigating && (
        <div className="route-bar fixed top-0 left-0 right-0 z-[90] h-[2px] overflow-hidden pointer-events-none" role="progressbar" aria-label="Loading page">
          <span className="block h-full w-1/3 bg-accent" />
        </div>
      )}
      <Nav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main id="main-content" tabIndex={-1} ref={mainRef}>
        <div key={pathname} className="page-fade">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp isHidden={isMenuOpen || isConsentOpen} />
      <ChatWidget />
      {introReady && <CookieBanner />}
    </div>
    </>
  );
}

export default RootLayout;
