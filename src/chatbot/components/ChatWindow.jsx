import React, { useRef, useEffect, useState, useCallback } from 'react';
import siteData from '../../data/site';
import uiCopy from '../data/uiCopy';
import { useChat } from '../hooks/useChat';
import { useFocusTrap } from '../hooks/useFocusTrap';
import MessageList from './MessageList';
import Composer from './Composer';
import { CloseIcon, RefreshIcon } from '../../components/Icons';

/**
 * Lazy-loaded Chat Window:
 * - Desktop: fixed floating panel (400px x min(640px, 100dvh-48px)), non-modal
 * - Mobile: full-screen modal sheet (100dvh), focus-trapped and body-scroll locked
 */
export function ChatWindow({ onClose }) {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [clearedNotice, setClearedNotice] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  const { messages, status, send, stop, retry, reset } = useChat();

  // Track viewport width for modal / non-modal distinction
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', checkWidth, { passive: true });
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Modal trap on mobile, Esc handling on both
  useFocusTrap({
    containerRef,
    isOpen: true,
    isMobileModal: isMobile,
    onClose,
  });

  // Focus composer input on initial open
  useEffect(() => {
    // Short timeout to let entry animation mount
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Handle New Chat / Reset
  const handleReset = useCallback(() => {
    reset();
    setClearedNotice(true);
    setTimeout(() => {
      setClearedNotice(false);
    }, 3000);
    inputRef.current?.focus();
  }, [reset]);

  // Handle internal link navigation
  const handleInternalLinkClick = useCallback(() => {
    if (isMobile) {
      // Close sheet so user can view destination page on mobile
      onClose();
    }
  }, [isMobile, onClose]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal={isMobile ? 'true' : 'false'}
      aria-labelledby="chat-window-title"
      aria-describedby="chat-disclaimer"
      id="chat-window-dialog"
      className={`fixed z-[65] bg-bg border border-line flex flex-col overflow-hidden ${
        isMobile
          ? 'inset-0 h-[100dvh] w-full chat-window-mobile'
          : 'right-6 bottom-6 w-[400px] h-[min(640px,calc(100dvh-48px))] rounded-[2px] chat-window-desktop'
      }`}
    >
      {/* Screen-reader announcement for chat cleared */}
      <div aria-live="polite" className="sr-only">
        {clearedNotice && uiCopy.header.chatClearedAnnouncement}
      </div>

      {/* Header (~64px) */}
      <header className="h-16 shrink-0 border-b border-line px-4 flex items-center justify-between bg-bg select-none">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={siteData.brand.logo}
            alt="Invent Fine Art mark"
            width="32"
            height="32"
            className="w-8 h-8 object-contain rounded-[2px] shrink-0"
          />
          <div className="min-w-0">
            <h2
              id="chat-window-title"
              className="font-display text-base font-medium text-text leading-tight truncate"
            >
              {uiCopy.header.title}
            </h2>
            <span className="font-body text-[10px] tracking-[0.14em] uppercase text-accent-2 block -mt-0.5">
              {uiCopy.header.subtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* New chat button */}
          <button
            type="button"
            onClick={handleReset}
            aria-label={uiCopy.header.newChatAriaLabel}
            title={uiCopy.header.newChatTooltip}
            className="w-11 h-11 flex items-center justify-center text-text-dim hover:text-text rounded-[2px] transition-colors cursor-pointer focus-visible:outline-accent-2"
          >
            <RefreshIcon className="w-4 h-4" />
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label={uiCopy.header.closeAriaLabel}
            className="w-11 h-11 flex items-center justify-center text-text-dim hover:text-text rounded-[2px] transition-colors cursor-pointer focus-visible:outline-accent-2"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Message List */}
      <MessageList
        messages={messages}
        status={status}
        onSendQuestion={send}
        onRetry={retry}
        onInternalLinkClick={handleInternalLinkClick}
      />

      {/* Composer Input */}
      <Composer
        inputRef={inputRef}
        status={status}
        onSend={send}
        onStop={stop}
        onInternalLinkClick={handleInternalLinkClick}
      />
    </div>
  );
}

export default ChatWindow;
