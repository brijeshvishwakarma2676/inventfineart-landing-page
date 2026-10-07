import React from 'react';
import uiCopy from '../data/uiCopy';

/**
 * Three-dot gentle opacity wave with mini animated bot avatar while waiting for tokens.
 */
export function TypingIndicator() {
  return (
    <div
      role="status"
      aria-label={uiCopy.messages.typingAnnouncement}
      className="inline-flex items-center gap-2 py-1 px-1"
    >
      <img
        src="/assets/bot/bot-animated.webp"
        alt=""
        aria-hidden="true"
        width="20"
        height="20"
        className="w-5 h-5 object-contain shrink-0 opacity-90"
      />
      <span className="sr-only">{uiCopy.messages.typingAnnouncement}</span>
      <div className="flex items-center gap-1.5">
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
    </div>
  );
}

export default React.memo(TypingIndicator);
