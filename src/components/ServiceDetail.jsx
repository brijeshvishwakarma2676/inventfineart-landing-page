import { Link } from 'react-router';
import { ArrowIcon } from './Icons';

const listItem = "py-2.5 text-sm text-text-dim flex items-start gap-2 before:content-['—'] before:text-accent-2";

function TextList({ title, items }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2">{title}</span>
      <ul className="flex flex-col divide-y divide-line">
        {items.map((it) => (
          <li key={it} className={listItem}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export function ServiceDetail({ service, imageClass = 'aspect-[16/10]' }) {
  return (
    <div className="flex flex-col gap-8">
      <div className={`w-full ${imageClass} rounded-[2px] overflow-hidden bg-bg-raised`}>
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex items-baseline gap-3">
          <span className="font-body text-xs font-semibold tracking-widest text-accent-2">{service.num}</span>
          <h2 className="font-display text-3xl lg:text-4xl text-text">{service.title}</h2>
        </div>
        <p className="font-body text-base lg:text-lg text-text leading-relaxed max-w-[780px]">{service.summary}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-line">
          <TextList title="Applications" items={service.applications} />
          <TextList title="Materials & engineering" items={service.materials} />
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
          <Link
            to={`/contact?service=${service.slug}`}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-accent hover:bg-accent-hover text-text text-xs uppercase font-semibold tracking-wider transition-colors min-h-[48px]"
          >
            Enquire about this <ArrowIcon />
          </Link>
          <Link
            to={`/gallery/${service.category}`}
            className="inline-flex items-center gap-2 font-body text-sm text-text-dim hover:text-text transition-colors min-h-[44px]"
          >
            View related work <ArrowIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;
