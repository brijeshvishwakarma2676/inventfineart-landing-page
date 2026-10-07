import { foundedYear } from '../data/site';
import { totalWorksCount } from '../data/gallery-meta';
import { clients } from '../data/clients';

export function AboutStatsStrip() {
  const stats = [
    { label: 'Established', value: String(foundedYear), note: 'Turnkey art studio' },
    { label: 'Quality standard', value: 'ISO 9001:2008', note: 'Certified company' },
    { label: 'Gallery archive', value: `${totalWorksCount}`, note: 'Works in gallery' },
    { label: 'Disciplines', value: '6', note: 'Art categories' },
    { label: 'Client partners', value: `${clients.length}`, note: 'Clients listed' },
  ];

  return (
    <section aria-label="Studio at a glance" className="bg-bg border-b border-line">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 border-x border-line divide-y divide-line lg:divide-y-0 lg:divide-x">
          {stats.map((s, idx) => (
            <div
              key={s.label}
              className={`p-6 md:p-8 flex flex-col justify-between gap-3 ${
                idx === stats.length - 1 ? 'col-span-2 lg:col-span-1 border-t lg:border-t-0' : ''
              }`}
            >
              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-2">
                {s.label}
              </span>
              <div>
                <span className="font-display text-2xl sm:text-3xl md:text-4xl text-text block leading-none">
                  {s.value}
                </span>
                <span className="font-body text-xs text-text-dim mt-2 block">
                  {s.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutStatsStrip;
