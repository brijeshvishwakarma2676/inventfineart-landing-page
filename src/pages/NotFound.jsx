import { Link } from 'react-router';
import usePageMeta from '../hooks/usePageMeta';
import { pageMeta } from '../data/seo';

export function NotFound() {
  usePageMeta(pageMeta.notFound);

  return (
    <section className="min-h-[80vh] flex items-end bg-bg pt-[72px]" aria-label="Page not found">
      <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 pb-20 md:pb-28">
        <p className="font-display text-[28vw] md:text-[18vw] leading-[0.85] text-line">404</p>
        <h1 className="font-display text-3xl md:text-5xl text-text mt-6 mb-4">This page isn&rsquo;t here.</h1>
        <p className="font-body text-text-dim mb-8 max-w-[480px]">The link may be old or mistyped. Try one of these instead.</p>
        <div className="flex flex-wrap gap-x-8 gap-y-3 font-body text-sm uppercase tracking-wider">
          <Link to="/" className="text-text hover:text-accent-2 transition-colors py-2">Home</Link>
          <Link to="/gallery" className="text-text hover:text-accent-2 transition-colors py-2">Gallery</Link>
          <Link to="/contact" className="text-text hover:text-accent-2 transition-colors py-2">Contact</Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
