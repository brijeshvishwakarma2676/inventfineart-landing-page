import React from 'react';
import MarkdownLite from '../utils/markdownLite';
import TypingIndicator from './TypingIndicator';
import HandoffActions from './HandoffActions';
import uiCopy from '../data/uiCopy';

/**
 * Single chat message bubble.
 * Memoized to ensure high token-rate streaming only re-renders the active message.
 */
export const MessageBubble = React.memo(function MessageBubble({
  message,
  isFirstInRun,
  isConsecutive,
  onRetry,
  onInternalLinkClick,
}) {
  const isAssistant = message.role === 'assistant';
  const isVisitor = !isAssistant;

  return (
    <div
      className={`chat-message-enter flex flex-col ${
        isVisitor ? 'items-end' : 'items-start'
      } ${isConsecutive ? 'mt-2' : 'mt-3.5'}`}
    >
      {/* Eyebrow label for first message in assistant run */}
      {isAssistant && isFirstInRun && (
        <span className="text-[10px] tracking-[0.14em] uppercase font-body text-accent-2 mb-1 ml-0.5 select-none">
          {uiCopy.messages.studioLabel}
        </span>
      )}

      {/* Bubble container */}
      <div
        className={`relative max-w-[88%] text-sm rounded-[2px] ${
          isVisitor
            ? 'bg-accent text-text px-3.5 py-2.5 rounded-br-none'
            : 'bg-bg-raised text-text border border-line px-3.5 py-2.5 rounded-bl-none'
        }`}
      >
        {isVisitor ? (
          <p className="whitespace-pre-wrap break-words leading-relaxed select-text">
            {message.content}
          </p>
        ) : (
          <div className="text-text select-text">
            {message.status === 'streaming' && !message.content ? (
              <TypingIndicator />
            ) : (
              <MarkdownLite
                content={message.content}
                onInternalLinkClick={onInternalLinkClick}
              />
            )}

            {/* Stopped status indicator */}
            {message.status === 'stopped' && (
              <span className="block mt-1.5 text-[10px] text-text-dim italic">
                {uiCopy.messages.stoppedLabel}
              </span>
            )}

            {/* Error state with Retry button */}
            {message.status === 'error' && (
              <div className="mt-2.5 pt-2 border-t border-line/50 flex items-center justify-end gap-3">
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="px-2.5 py-1 text-xs uppercase tracking-wider font-medium rounded-[2px] bg-accent hover:bg-accent-hover text-text transition-colors cursor-pointer min-h-[32px] focus-visible:outline-accent-2"
                  >
                    {uiCopy.messages.retryButton}
                  </button>
                )}
              </div>
            )}

            {/* Handoff contact options */}
            {(message.handoff || message.status === 'error') && (
              <HandoffActions onInternalLinkClick={onInternalLinkClick} />
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default MessageBubble;
