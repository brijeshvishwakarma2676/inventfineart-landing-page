import { Link } from 'react-router';
import { galleryCategories, galleryLeadParts, galleryLeadPreviews, totalWorksCount } from '../data/categories';
import HoverPreviewText from '../components/HoverPreviewText';
import SmartImage from '../components/SmartImage';
import ImmersiveGallery from '../components/ImmersiveGallery';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';
import usePageMeta from '../hooks/usePageMeta';
import { useReveal } from '../hooks/useReveal';
import { pageMeta } from '../data/seo';

function Cover({ slug, className, objectPos = 'object-center' }) {
  const cat = galleryCategories.find((c) => c.slug === slug);
  return (
    <Link to={`/gallery/${cat.slug}`} className={`group relative block overflow-hidden rounded-[2px] ${className}`}>
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
        <SmartImage src={cat.cover} alt={`${cat.label} — cover`} imgClassName={objectPos} />
      </div>
      <span className="absolute inset-x-0 bottom-0 p-5 md:p-6 bg-gradient-to-t from-bg via-bg/70 to-transparent pt-16 flex flex-col items-start gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <span className="font-display text-2xl md:text-3xl text-text">{cat.label}</span>
        <span className="font-body text-xs uppercase tracking-wider text-text">{cat.count} works</span>
      </span>
    </Link>
  );
}

export function GalleryHub() {
  usePageMeta(pageMeta.gallery);
  const collectionsRef = useReveal({ stagger: true });

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Gallery' }]}
        title="The portfolio"
        intro="Six collections, one studio. Choose a category to browse every piece."
        meta={`${totalWorksCount} works`}
      />

      <section className="bg-bg border-b border-line" aria-label="Quick browse">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-4">Quick browse</span>
          <p className="max-w-[900px] font-display text-2xl sm:text-3xl md:text-4xl font-light leading-snug md:leading-relaxed text-text-dim text-pretty">
            <HoverPreviewText parts={galleryLeadParts} previews={galleryLeadPreviews} />
          </p>
        </div>
      </section>

      <section className="bg-bg border-b border-line" aria-label="Collections">
        <div ref={collectionsRef} className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-12 gap-4 md:gap-6 items-start">
          <div className="md:col-span-7 flex flex-col gap-4 md:gap-6">
            <Cover slug="sculptures" className="aspect-[4/3]" />
            <div className="grid grid-cols-2 gap-4 md:gap-6 items-start">
              <Cover slug="grc-products" className="aspect-[4/5]" />
              <Cover slug="planters" className="aspect-[4/5] mt-8 md:mt-14" />
            </div>
            <Cover slug="other" className="aspect-[16/9]" />
          </div>
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6 md:pt-24">
            <Cover slug="wall-murals" className="aspect-[4/5]" />
            <Cover slug="water-fountains" className="aspect-[4/5]" />
          </div>
        </div>
      </section>

      <ImmersiveGallery />

      <CtaBand />
    </>
  );
}

export default GalleryHub;
