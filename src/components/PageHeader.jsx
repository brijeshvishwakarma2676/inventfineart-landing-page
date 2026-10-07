import { Link } from 'react-router';

// Compact header for inner pages: breadcrumb, display title, one dim line, optional meta (e.g. count).
export function PageHeader({ crumbs = [], title, intro, meta, children }) {
  return (
    <header className="border-b border-line pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)] pb-10 md:pb-14">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 font-body text-xs uppercase tracking-[0.12em] text-text-dim">
            <li><Link to="/" className="hover:text-text transition-colors">Home</Link></li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {c.to ? <Link to={c.to} className="hover:text-text transition-colors">{c.label}</Link> : <span className="text-text" aria-current="page">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-[760px]">
            <h1 className="header-rise font-display text-4xl sm:text-5xl md:text-7xl leading-[1.04] text-text">{title}</h1>
            {intro && <p className="header-rise-late font-body text-base md:text-lg text-text-dim mt-5 max-w-[620px]">{intro}</p>}
          </div>
          {meta && <p className="font-display text-2xl md:text-3xl text-accent-2 whitespace-nowrap">{meta}</p>}
        </div>
        {children}
      </div>
    </header>
  );
}

export default PageHeader;
