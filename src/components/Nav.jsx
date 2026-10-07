import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import siteData from '../data/site';
import { CloseIcon, PhoneIcon, WhatsAppIcon } from './Icons';
import SocialLinks from './SocialLinks';
import { usePresence } from '../hooks/usePresence';

const linkClass = ({ isActive }) =>
  `relative py-2 font-body text-xs uppercase tracking-[0.12em] font-medium transition-colors after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[1.5px] after:bg-accent after:origin-left after:transition-transform after:duration-300 ${
    isActive ? 'text-text after:scale-x-100' : 'text-text-dim hover:text-text after:scale-x-0 hover:after:scale-x-100'
  }`;

// Same structure as the original site: a thin info bar (social + location, phone numbers), then logo + simple menu.
export function Nav({ isMenuOpen, setIsMenuOpen }) {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === '/';
  const solid = !isHome || scrolled;
  const { contact, footer } = siteData;
  const { mounted: menuMounted, closing: menuClosing } = usePresence(isMenuOpen, 200);

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
  const menu = [{ label: 'Home', to: '/' }, ...siteData.nav, { label: 'Contact', to: '/contact' }];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${
          solid ? 'bg-bg/95 backdrop-blur-md border-line' : 'bg-transparent border-transparent'
        }`}
      >
        {/* Info bar (desktop): collapses once the page is scrolled */}
        <div
          className={`hidden lg:block overflow-hidden border-b border-line/60 transition-[height,opacity] duration-300 ${
            scrolled ? 'h-0 opacity-0 border-transparent' : 'h-9 opacity-100'
          }`}
          aria-hidden={scrolled}
        >
          <div className="max-w-[1280px] mx-auto h-9 px-8 flex items-center justify-between font-body text-xs text-text-dim">
            <div className="flex items-center gap-4">
              <SocialLinks links={footer.socialLinks} size="sm" />
              <span className="w-px h-4 bg-line" aria-hidden="true" />
              <span>Kandivali East, Mumbai, Maharashtra</span>
            </div>
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-2 tabular-nums whitespace-nowrap">
                <PhoneIcon className="w-3.5 h-3.5" />
                <a href={`tel:${contact.phones[0].raw}`} className="hover:text-text transition-colors" tabIndex={scrolled ? -1 : 0}>{contact.phones[0].display}</a>
                <span aria-hidden="true">/</span>
                <a href={`tel:${contact.phones[1].raw}`} className="hover:text-text transition-colors" tabIndex={scrolled ? -1 : 0}>{contact.phones[1].display}</a>
              </span>
              <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-text transition-colors" tabIndex={scrolled ? -1 : 0}>
                <WhatsAppIcon className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Main row */}
        <div className="max-w-[1280px] mx-auto h-[72px] px-4 md:px-8 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 z-50" onClick={close}>
            <img src={siteData.brand.logo} alt="Invent Fine Art logo" className="w-12 h-12 object-contain rounded-[2px]" width="36" height="36" />
            <span>
              <span className="font-display text-lg md:text-xl font-medium tracking-wide text-text block leading-tight whitespace-nowrap">
                INVENT FINE ART
              </span>
              <span className="font-body text-[10px] tracking-[0.14em] uppercase text-accent-2 block -mt-0.5 whitespace-nowrap">
                Studio &amp; Installations
              </span>
            </span>
          </Link>

          <nav className="hidden lg:block" aria-label="Main navigation">
            <ul className="flex items-center gap-7">
              {menu.map((item) => (
                <li key={item.to}>
                  {item.to === '/contact' ? (
                    <Link
                      to={item.to}
                      className="inline-flex items-center justify-center px-5 rounded-full bg-accent hover:bg-accent-hover text-text text-xs uppercase font-semibold tracking-wider transition-colors min-h-[40px]"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <NavLink to={item.to} end={item.to === '/'} className={linkClass}>
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
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
      {menuMounted && (
        <div
          data-state={menuClosing ? 'closing' : 'open'}
          className={`fixed inset-0 bg-bg z-[55] lg:hidden flex flex-col justify-between pt-24 pb-8 px-6 overflow-y-auto ${menuClosing ? 'menu-exit' : 'menu-enter'}`}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {menu.map((item, i) => (
              <li key={item.to} className="menu-item-enter" style={{ animationDelay: `${i * 40}ms` }}>
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
              <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="py-2 hover:text-text">
                WhatsApp: {contact.phones[0].display}
              </a>
              <a href={`tel:${contact.primaryPhone}`} className="py-2 hover:text-text">
                Call: {contact.phones[0].display}
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
