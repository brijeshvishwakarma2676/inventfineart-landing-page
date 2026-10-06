import React from 'react';
import { Link } from 'react-router';
import siteData from '../../data/site';
import uiCopy from '../data/uiCopy';

/**
 * Handoff contact actions row rendered when assistant cannot answer or on error.
 * All contact info derived directly from siteData.contact.
 */
export function HandoffActions({ onInternalLinkClick }) {
  const { contact } = siteData;
  const primaryPhone = contact.primaryPhone || '+919323210327';
  const email = contact.email || 'inventfineart.mum@gmail.com';
  const whatsappUrl = contact.whatsappUrl || 'https://wa.me/919323210327';

  const buttonClass =
    'inline-flex items-center justify-center px-3 py-2 text-xs font-medium uppercase tracking-wider text-text-dim hover:text-text border border-line hover:border-accent-2 transition-colors min-h-[44px] rounded-[2px] text-center focus-visible:outline-accent-2';

  return (
    <div className="mt-3 pt-2.5 border-t border-line/70">
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Direct studio contact options">
        <Link
          to="/contact"
          onClick={onInternalLinkClick}
          className={buttonClass}
        >
          {uiCopy.handoff.actions.contactPage}
        </Link>

        <a
          href={`tel:${primaryPhone}`}
          className={buttonClass}
        >
          {uiCopy.handoff.actions.call}
        </a>

        <a
          href={`mailto:${email}`}
          className={buttonClass}
        >
          {uiCopy.handoff.actions.email}
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          {uiCopy.handoff.actions.whatsApp}
        </a>
      </div>
    </div>
  );
}

export default React.memo(HandoffActions);
