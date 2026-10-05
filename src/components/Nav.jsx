import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import siteData from '../data/site';
import { WhatsAppIcon, CloseIcon } from './Icons';

const linkClass = ({ isActive }) =>
  `relative py-1 font-body text-xs uppercase tracking-[0.1em] font-medium transition-colors ${
    isActive
      ? 'text-text after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[1.5px] after:bg-accent'
      : 'text-text-dim hover:text-text'
  }`;

export function Nav({ isMenuOpen, setIsMenuOpen }) {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === '/';
  const solid = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    const onKey = (e) => {
      if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  const close = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 h-[72px] z-50 transition-colors duration-300 border-b ${
          solid ? 'bg-bg/90 backdrop-blur-md border-line' : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto h-full px-4 md:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 z-50" onClick={close}>
            <img
              src={siteData.brand.logo}
              alt="Invent Fine Art logo"
              className="w-9 h-9 object-contain rounded-[2px]"
              width="36"
              height="36"
            />
            <span>
              <span className="font-display text-lg md:text-xl font-medium tracking-wide text-text block">
                INVENT FINE ART
              </span>
              <span className="font-body text-[10px] tracking-[0.14em] uppercase text-accent-2 block -mt-0.5">
                Studio &amp; Installations
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            <ul className="flex items-center gap-7">
              {siteData.nav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={linkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-5 pl-4 border-l border-line">
              <a
                href={siteData.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-text-dim hover:text-text transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-accent hover:bg-accent-hover text-text text-xs uppercase font-semibold tracking-wider transition-colors min-h-[40px]"
              >
                Contact
              </Link>
            </div>
          </nav>

          <button
            type="button"
            className="lg:hidden flex flex-col justify-center items-center gap-1.5 w-11 h-11 z-[60] cursor-pointer"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
          >
            <span className={`block w-6 h-[2px] bg-text transition-transform duration-300 ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block w-6 h-[2px] bg-text transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[2px] bg-text transition-transform duration-300 ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      {/* Rendered outside <header> so backdrop-filter on the header cannot trap this fixed layer */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-bg z-[55] lg:hidden flex flex-col justify-between pt-24 pb-8 px-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {[{ label: 'Home', to: '/' }, ...siteData.nav, { label: 'Contact', to: '/contact' }].map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={close}
                  className={({ isActive }) =>
                    `block py-4 font-display text-3xl transition-colors ${isActive ? 'text-accent-light' : 'text-text'}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-5 pt-8">
            <Link
              to="/contact"
              onClick={close}
              className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full bg-accent hover:bg-accent-hover text-text font-semibold uppercase tracking-wider text-sm transition-colors min-h-[48px]"
            >
              Start a project
            </Link>
            <div className="flex flex-col gap-1 text-sm text-text-dim">
              <a href={siteData.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="py-2 hover:text-text">
                WhatsApp: {siteData.contact.phones[0].display}
              </a>
              <a href={`tel:${siteData.contact.primaryPhone}`} className="py-2 hover:text-text">
                Call: {siteData.contact.phones[0].display}
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="absolute top-5 right-4 w-11 h-11 flex items-center justify-center text-text cursor-pointer"
            aria-label="Close navigation"
          >
            <CloseIcon />
          </button>
        </div>
      )}
    </>
  );
}

export default Nav;
