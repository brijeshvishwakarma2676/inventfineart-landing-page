import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import ChatLauncher from './components/ChatLauncher';
import chatUiStore from './chatUiStore';
import { useConsent } from '../hooks/useConsent';
import { useIntro } from '../hooks/useIntro';
import { CloseIcon } from '../components/Icons';

// Lazy chunk for the heavy ChatWindow
const loadChatWindow = () => import('./components/ChatWindow');
const createLazyWindow = () => React.lazy(loadChatWindow);

// Error boundary for chunk loading failure (network disconnection during code split download)
class ChatChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed z-[65] right-6 bottom-6 w-[400px] max-w-full p-6 bg-bg border border-line rounded-[2px] text-center flex flex-col items-center gap-3">
          <p className="text-sm text-text">Unable to load the chat assistant.</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={this.props.onRetry}
              className="px-4 py-2 text-xs uppercase tracking-wider rounded-[2px] bg-accent hover:bg-accent-hover text-text transition-colors"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={this.props.onClose}
              className="px-4 py-2 text-xs uppercase tracking-wider rounded-[2px] border border-line text-text-dim hover:text-text transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Root Chat Widget:
 * - Launcher + lazy window wrapper
 * - Communicates with chatUiStore
 * - Hides when mobile menu, cookie banner, or session intro is open
 */
export function ChatWidget() {
  const [wantOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ChatWindowLazy, setChatWindowLazy] = useState(createLazyWindow);
  const [attempt, setAttempt] = useState(0);
  const wasOpenRef = useRef(false);

  const { open: isConsentOpen } = useConsent();
  // The cookie notice sits in the same corner, so the chat steps aside while it is open
  const isOpen = wantOpen && !isConsentOpen;
  const { playing: isIntroPlaying } = useIntro();

  // Watch for mobile nav menu overlay mounting/unmounting
  useEffect(() => {
    let frame = 0;
    const checkNav = () => {
      frame = 0;
      const navDialog = document.querySelector('[aria-label="Site navigation"]:not([data-state="closing"])');
      setIsMenuOpen(Boolean(navDialog));
    };

    checkNav();
    const observer = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(checkNav);
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-state'] });

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Update shared store
  useEffect(() => {
    chatUiStore.setOpen(isOpen);
  }, [isOpen]);

  // The launcher unmounts while the window is open: restore focus to it after closing
  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      const frame = requestAnimationFrame(() => {
        const launchers = document.querySelectorAll('[data-chat-launcher]');
        const visible = Array.from(launchers).find((el) => el.getClientRects().length > 0);
        if (visible && document.activeElement === document.body) visible.focus();
      });
      wasOpenRef.current = isOpen;
      return () => cancelAnimationFrame(frame);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  const handleRetryLoad = useCallback(() => {
    setChatWindowLazy(createLazyWindow);
    setAttempt((n) => n + 1);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handlePrefetch = useCallback(() => {
    loadChatWindow().catch(() => {});
  }, []);

  const isHidden = isMenuOpen || isConsentOpen || isIntroPlaying;

  return (
    <>
      <ChatLauncher
        isOpen={isOpen}
        isHidden={isHidden}
        onToggle={handleToggle}
        onPrefetch={handlePrefetch}
      />

      {isOpen && (
        <ChatChunkErrorBoundary key={attempt} onClose={handleClose} onRetry={handleRetryLoad}>
          <Suspense
            fallback={
              <div
                role="dialog"
                aria-label="Loading chat"
                className="fixed z-[65] inset-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[400px] sm:h-[400px] bg-bg border border-line rounded-[2px] flex flex-col items-center justify-center p-6 text-center select-none"
              >
                <div className="skeleton w-12 h-12 rounded-full mb-3" />
                <p className="text-sm font-display text-text">Loading chat…</p>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close"
                  className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-text-dim hover:text-text cursor-pointer"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            }
          >
            <ChatWindowLazy onClose={handleClose} />
          </Suspense>
        </ChatChunkErrorBoundary>
      )}
    </>
  );
}

export default ChatWidget;
