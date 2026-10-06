import { useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useParams, useSearchParams } from 'react-router';
import { galleryManifest } from '../data/gallery';
import { galleryCategories, getCategory } from '../data/categories';
import { categoryMeta, breadcrumbSchema } from '../data/seo';
import PageHeader from '../components/PageHeader';
import MasonryGrid from '../components/MasonryGrid';
import Lightbox from '../components/Lightbox';
import CtaBand from '../components/CtaBand';
import usePageMeta from '../hooks/usePageMeta';
import { isSlowConnection } from '../utils/network';
import NotFound from './NotFound';
import { ArrowIcon } from '../components/Icons';


function CategoryPage({ category }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const openedByPush = useRef(false);
  // Smaller batches on phones keep the first load light (2 columns show ~6 tiles per screen).
  const [batch] = useState(() => (window.innerWidth < 640 || isSlowConnection() ? 12 : 24));
  const [visible, setVisible] = useState(batch);

  const items = useMemo(() => galleryManifest.filter((i) => i.category === category.key), [category.key]);

  const meta = categoryMeta(category);
  usePageMeta({
    ...meta,
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Gallery', path: '/gallery' },
      { name: category.label, path: meta.path },
    ]),
  });

  // The open image lives in ?img=<n>, so a view can be deep-linked and Back closes the lightbox.
  const imgParam = Number(searchParams.get('img'));
  const lightboxIndex = imgParam ? items.findIndex((i) => i.n === imgParam) : -1;
  // Make sure a deep-linked image is rendered behind the lightbox too.
  const shown = Math.max(visible, lightboxIndex + 1);

  const open = (index) => {
    openedByPush.current = true;
    setSearchParams({ img: String(items[index].n) });
  };
  const navigateTo = (index) => setSearchParams({ img: String(items[index].n) }, { replace: true });
  const close = () => {
    if (openedByPush.current) {
      openedByPush.current = false;
      navigate(-1);
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const idx = galleryCategories.findIndex((c) => c.slug === category.slug);
  const prev = galleryCategories[(idx - 1 + galleryCategories.length) % galleryCategories.length];
  const next = galleryCategories[(idx + 1) % galleryCategories.length];

  const currentItem = lightboxIndex >= 0 ? items[lightboxIndex] : null;
  const quoteHref = currentItem
    ? `/contact?service=${category.serviceSlug}&ref=${category.key}-${String(currentItem.n).padStart(3, '0')}`
    : '/contact';

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Gallery', to: '/gallery' }, { label: category.label }]}
        title={category.label}
        intro={category.intro}
        meta={`${category.count} works`}
      >
        <nav aria-label="Gallery categories" className="mt-10 flex gap-6 md:gap-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {galleryCategories.map((c) => (
            <NavLink
              key={c.slug}
              to={`/gallery/${c.slug}`}
              className={({ isActive }) =>
                `whitespace-nowrap py-2 font-body text-sm border-b-2 transition-colors ${
                  isActive ? 'text-text border-accent' : 'text-text-dim border-transparent hover:text-text'
                }`
              }
            >
              {c.label}
            </NavLink>
          ))}
        </nav>
      </PageHeader>

      <section className="bg-bg border-b border-line" aria-label={`${category.label} works`}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <MasonryGrid items={items.slice(0, shown)} onOpen={open} />
          <div className="flex justify-center mt-12">
            {shown < items.length ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-text/40 hover:border-text text-text text-xs md:text-sm font-medium tracking-wide transition-colors cursor-pointer min-h-[48px]"
                onClick={() => setVisible((v) => v + batch)}
              >
                Load more ({items.length - shown} remaining)
              </button>
            ) : (
              <span className="font-body text-xs uppercase tracking-wider text-text-dim">All {items.length} works shown</span>
            )}
          </div>
        </div>
      </section>

      <section className="bg-bg border-b border-line" aria-label="Browse other collections">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid grid-cols-2 divide-x divide-line">
          <Link to={`/gallery/${prev.slug}`} className="py-8 md:py-10 pr-4 group">
            <span className="font-body text-xs uppercase tracking-wider text-text-dim block mb-2">Previous</span>
            <span className="font-display text-xl md:text-3xl text-text group-hover:text-accent-2 transition-colors">{prev.label}</span>
          </Link>
          <Link to={`/gallery/${next.slug}`} className="py-8 md:py-10 pl-4 md:pl-8 text-right group">
            <span className="font-body text-xs uppercase tracking-wider text-text-dim block mb-2">Next</span>
            <span className="font-display text-xl md:text-3xl text-text group-hover:text-accent-2 transition-colors inline-flex items-center gap-2">
              {next.label} <ArrowIcon className="w-5 h-5 hidden md:block" />
            </span>
          </Link>
        </div>
      </section>

      <CtaBand />

      {lightboxIndex >= 0 && (
        <Lightbox
          items={items}
          currentIndex={lightboxIndex}
          categoryLabel={category.label}
          quoteHref={quoteHref}
          onClose={close}
          onNavigate={navigateTo}
        />
      )}
    </>
  );
}

export function GalleryCategory() {
  const { category: slug } = useParams();
  const category = getCategory(slug);
  if (!category) return <NotFound />;
  return <CategoryPage key={category.slug} category={category} />;
}

export default GalleryCategory;
