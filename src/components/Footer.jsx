import { Link } from 'react-router';
import siteData from '../data/site';
import { galleryCategories } from '../data/categories';
import { ArrowIcon, WhatsAppIcon } from './Icons';
import NewsletterForm from './NewsletterForm';
import SocialLinks from './SocialLinks';
import { useSyncExternalStore } from 'react';
import { consent } from '../hooks/useConsent';
import { intro } from '../utils/intro';

const utilityBtn =
  'inline-flex items-center gap-1.5 min-h-[44px] font-body text-xs uppercase tracking-wider text-text-dim hover:text-text transition-colors cursor-pointer';
const linkCls = 'font-body text-sm text-text-dim hover:text-text transition-colors inline-block py-1';
const labelCls = 'font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-4';

const REDUCED = '(prefers-reduced-motion: reduce)';
const subscribeMotion = (cb) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

export function Footer() {
  // The intro is motion-based, so the replay link is hidden for visitors who prefer reduced motion.
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(REDUCED).matches, () => false);
  const { contact, footer, brand } = siteData;
  const directionsUrl = `https://www.google.com/maps?q=${contact.factoryCoords.lat},${contact.factoryCoords.lng}`;

  const channels = [
    { label: 'WhatsApp', value: 'Start a chat', href: contact.whatsappUrl, external: true, icon: <WhatsAppIcon className="w-5 h-5" /> },
    { label: 'Call', value: contact.phones[0].display, href: `tel:${contact.primaryPhone}` },
    { label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <footer className="bg-bg text-text" aria-label="Site footer">
      {/* Direct channels */}
      <div className="border-t border-line">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.5fr] divide-y lg:divide-y-0 lg:divide-x divide-line">
          {channels.map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={`group flex items-center justify-between gap-4 py-7 lg:py-10 min-h-[44px] ${i === 0 ? 'lg:pr-8' : 'lg:px-8'}`}
            >
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 mb-2">
                  {c.icon}
                  {c.label}
                </span>
                <span className="font-display text-xl md:text-2xl text-text group-hover:text-accent-light transition-colors break-all lg:break-normal">{c.value}</span>
              </span>
              <ArrowIcon className="w-5 h-5 text-text-dim group-hover:text-text transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="border-t border-line">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-14 md:py-20 grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-2 md:col-span-12 lg:col-span-4 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-3 self-start">
              <img src={brand.logo} alt="Invent Fine Art logo" className="w-10 h-10 object-contain rounded-[2px]" width="40" height="40" />
              <span>
                <span className="font-display text-xl font-medium tracking-wide block">INVENT FINE ART</span>
                <span className="font-body text-[10px] tracking-[0.14em] uppercase text-accent-2 block -mt-0.5">{brand.certification}</span>
              </span>
            </Link>
            <p className="font-body text-sm text-text-dim leading-relaxed max-w-[380px]">{footer.about}</p>
            <p className="font-display text-lg text-text italic">{brand.tagline}</p>
            <div className="pt-4 flex flex-col gap-6 border-t border-line">
              <NewsletterForm newsletter={footer.newsletter} />
              <div>
                <span className={labelCls}>Follow</span>
                <SocialLinks links={footer.socialLinks} />
              </div>
            </div>
          </div>

          <nav className="md:col-span-3 lg:col-span-2" aria-label="Footer navigation">
            <span className={labelCls}>Explore</span>
            <ul>
              {[{ label: 'Home', to: '/' }, ...siteData.nav, { label: 'Contact', to: '/contact' }].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkCls}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-4 lg:col-span-3" aria-label="Portfolio categories">
            <span className={labelCls}>Portfolio</span>
            <ul>
              {galleryCategories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/gallery/${c.slug}`} className="font-body text-sm text-text-dim hover:text-text transition-colors flex items-baseline justify-between gap-4 max-w-[220px] py-1">
                    <span>{c.label}</span>
                    <span className="text-xs text-text-dim tabular-nums">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-5 lg:col-span-3 flex flex-col gap-6">
            <div>
              <span className={labelCls}>Head office</span>
              <p className="font-body text-sm text-text-dim leading-relaxed">{contact.headOffice}</p>
            </div>
            <div>
              <span className={labelCls}>Factory &amp; studio</span>
              <p className="font-body text-sm text-text-dim leading-relaxed">{contact.factory}</p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 font-body text-sm text-text hover:text-accent-2 transition-colors min-h-[44px]"
              >
                Get directions <ArrowIcon className="w-4 h-4" />
              </a>
            </div>
            <div>
              <span className={labelCls}>Phone</span>
              <ul>
                {contact.phones.map((p) => (
                  <li key={p.raw}>
                    <a href={`tel:${p.raw}`} className={`${linkCls} tabular-nums`}>{p.display}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar: copyright + credit on the left, utility links grouped on the right */}
      <div className="border-t border-line">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-8">
          <div className="flex flex-col gap-1">
            <p className="font-body text-xs text-text-dim">{footer.copyright}</p>
            <p className="font-body text-xs text-text-dim">
              {footer.credit.label}{' '}
              <a
                href={footer.credit.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${footer.credit.label} ${footer.credit.name} (opens portfolio in a new tab)`}
                className="inline-flex items-center gap-1 text-text underline decoration-accent-2 underline-offset-4 hover:text-accent-2 transition-colors py-1"
              >
                {footer.credit.name} <ArrowIcon className="w-3 h-3 -rotate-45" />
              </a>
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 md:gap-x-0 md:divide-x md:divide-line">
            <li className="md:px-5 md:first:pl-0">
              <button type="button" onClick={() => consent.open()} className={utilityBtn}>
                Cookie settings
              </button>
            </li>
            {!reducedMotion && (
              <li className="md:px-5">
                <button type="button" onClick={() => intro.replay()} className={utilityBtn}>
                  Replay intro
                </button>
              </li>
            )}
            <li className="md:pl-5">
              <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={utilityBtn}>
                Back to top <span aria-hidden="true">&uarr;</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
