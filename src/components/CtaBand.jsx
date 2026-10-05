import { Link } from 'react-router';
import siteData from '../data/site';
import { ArrowIcon } from './Icons';

export function CtaBand() {
  const { headline, subline, buttonText, buttonHref, bgImage } = siteData.ctaBand;

  return (
    <section className="relative overflow-hidden bg-bg border-b border-line" aria-label="Start a project">
      <img
        src={bgImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-bg/85" />
      <div className="relative max-w-[1280px] mx-auto px-4 md:px-8 py-24 md:py-36 grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-4">
            Collaborate with us
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-text leading-[1.06]">{headline}</h2>
        </div>
        <div className="md:col-span-4 flex flex-col gap-6 md:items-end">
          <p className="font-body text-sm md:text-base text-text-dim md:text-right max-w-[360px]">{subline}</p>
          <Link
            to={buttonHref}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent hover:bg-accent-hover text-text text-xs md:text-sm font-semibold uppercase tracking-wider transition-colors min-h-[48px]"
          >
            {buttonText}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CtaBand;
