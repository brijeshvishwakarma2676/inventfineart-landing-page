import clients from '../data/clients';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';
import usePageMeta from '../hooks/usePageMeta';
import { useReveal } from '../hooks/useReveal';
import { pageMeta } from '../data/seo';

export function Clients() {
  usePageMeta(pageMeta.clients);
  const revealRef = useReveal();

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Clients' }]}
        title="Trusted by"
        intro="Organisations we have worked with on art installations and architectural decor."
        meta={`${clients.length} logos`}
      />

      <section className="bg-bg border-b border-line" aria-label="Client logos">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-24" ref={revealRef}>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-line border border-line">
            {clients.map((c) => (
              <li key={c.id} className="bg-light-card aspect-[3/2] p-5 md:p-6 flex items-center justify-center">
                <img src={c.src} alt={c.alt} className="max-w-full max-h-full object-contain" loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export default Clients;
