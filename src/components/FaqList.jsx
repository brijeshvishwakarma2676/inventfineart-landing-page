import { Link } from 'react-router';
import { ArrowIcon } from './Icons';

// Native <details>: keyboard accessible, works without JS, no animation library.
export function FaqList({ items }) {
  return (
    <div className="border-t border-line">
      {items.map((faq) => (
        <details key={faq.id} className="group border-b border-line">
          <summary className="flex items-start justify-between gap-6 py-5 md:py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden min-h-[56px]">
            <span className="font-display text-xl md:text-2xl text-text group-open:text-accent-light transition-colors">{faq.q}</span>
            <span aria-hidden="true" className="font-display text-3xl leading-none text-text-dim transition-transform duration-300 group-open:rotate-45">+</span>
          </summary>
          <div className="pb-6 md:pb-8 max-w-[680px]">
            <p className="font-body text-base text-text-dim leading-relaxed">{faq.a}</p>
            {faq.link && (
              <Link to={faq.link.to} className="inline-flex items-center gap-2 mt-4 font-body text-sm text-text hover:text-accent-2 transition-colors min-h-[44px]">
                {faq.link.label} <ArrowIcon />
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

export default FaqList;
