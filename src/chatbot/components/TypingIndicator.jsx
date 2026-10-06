import React from 'react';
import uiCopy from '../data/uiCopy';

/**
 * Three-dot gentle opacity wave while waiting for the first streamed token.
 */
export function TypingIndicator() {
  return (
    <div
      role="status"
      aria-label={uiCopy.messages.typingAnnouncement}
      className="inline-flex items-center gap-1.5 py-1 px-1"
    >
      <span className="sr-only">{uiCopy.messages.typingAnnouncement}</span>
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full bg-accent-2 chat-typing-dot"
        style={{ animationDelay: '0ms' }}
      />
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full bg-accent-2 chat-typing-dot"
        style={{ animationDelay: '200ms' }}
      />
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full bg-accent-2 chat-typing-dot"
        style={{ animationDelay: '400ms' }}
      />
    </div>
  );
}

export default React.memo(TypingIndicator);
