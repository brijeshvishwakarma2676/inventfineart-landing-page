import React, { useRef, useEffect, useState, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import SuggestedQuestions from './SuggestedQuestions';
import uiCopy from '../data/uiCopy';

const NEAR_BOTTOM_THRESHOLD = 72; // px

/**
 * Scrollable message log region:
 * - Auto-scrolls only when user is near bottom
 * - "Jump to latest" button when user scrolls up
 * - Renders welcome greeting + suggested questions when empty
 * - Preserves scroll position across re-renders
 */
export function MessageList({
  messages,
  status,
  onSendQuestion,
  onRetry,
  onInternalLinkClick,
}) {
  const scrollRef = useRef(null);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const isNearBottomRef = useRef(true);

  // Check scroll position
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceToBottom <= NEAR_BOTTOM_THRESHOLD;
    isNearBottomRef.current = nearBottom;
    setShowJumpToBottom(!nearBottom && messages.length > 0);
  }, [messages.length]);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    });
    isNearBottomRef.current = true;
    setShowJumpToBottom(false);
  }, []);

  // When messages update or streaming continues
  useEffect(() => {
    if (isNearBottomRef.current) {
      scrollToBottom(false);
    }
  }, [messages, status, scrollToBottom]);

  // Window limit to last 50 messages for performance
  const displayMessages = messages.length > 50 ? messages.slice(-50) : messages;

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-busy={status === 'streaming'}
        tabIndex={0}
        aria-label="Conversation history"
        className="h-full overflow-y-auto px-4 py-4 space-y-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-2/50"
      >
        {/* Welcome state if no conversation yet */}
        {displayMessages.length === 0 && (
          <div className="chat-message-enter flex flex-col items-start mt-2">
            <span className="text-[10px] tracking-[0.14em] uppercase font-body text-accent-2 mb-1 ml-0.5 select-none">
              {uiCopy.messages.studioLabel}
            </span>
            <div className="bg-bg-raised text-text border border-line p-3.5 rounded-[2px] rounded-bl-none max-w-[92%]">
              <p className="text-sm font-display leading-relaxed text-text">
                {uiCopy.welcome.greeting}
              </p>
              <SuggestedQuestions onSelectQuestion={onSendQuestion} />
            </div>
          </div>
        )}

        {/* Conversation messages */}
        {displayMessages.map((msg, idx) => {
          const prevMsg = displayMessages[idx - 1];
          const isConsecutive = prevMsg && prevMsg.role === msg.role;
          const isFirstInRun = !isConsecutive;

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isFirstInRun={isFirstInRun}
              isConsecutive={isConsecutive}
              onRetry={onRetry}
              onInternalLinkClick={onInternalLinkClick}
            />
          );
        })}
      </div>

      {/* Jump to latest button */}
      {showJumpToBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-bg-raised hover:bg-bg text-text text-xs tracking-wider uppercase font-medium border border-line hover:border-accent-2 px-3.5 py-1.5 rounded-[2px] transition-colors cursor-pointer focus-visible:outline-accent-2"
        >
          {uiCopy.messages.jumpToLatest} ↓
        </button>
      )}
    </div>
  );
}

export default React.memo(MessageList);
