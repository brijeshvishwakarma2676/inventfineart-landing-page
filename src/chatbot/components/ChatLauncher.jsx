import React, { useState, useEffect, useRef, useCallback } from 'react';
import { isSlowConnection } from '../../utils/network';
import uiCopy from '../data/uiCopy';
import { CloseIcon } from '../../components/Icons';

const NUDGE_KEY = 'ifa-chat-nudge-seen';

/**
 * Floating chat launcher button + 1-time session nudge tooltip.
 */
export function ChatLauncher({
  isOpen,
  onToggle,
  onPrefetch,
  isHidden,
}) {
  const [isReady, setIsReady] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const nudgeTimerRef = useRef(null);
  const autoHideNudgeTimerRef = useRef(null);

  // 1. Delayed appearance ~2s after load via requestIdleCallback (no LCP penalty)
  useEffect(() => {
    let idleId;
    let timeoutId;

    const activate = () => {
      setIsReady(true);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      timeoutId = setTimeout(() => {
        idleId = window.requestIdleCallback(activate, { timeout: 1000 });
      }, 2000);
    } else {
      timeoutId = setTimeout(activate, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
      if (idleId && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  // 2. Nudge tooltip (once per tab session, 8s after appearing, auto-hides after 8s)
  useEffect(() => {
    if (!isReady || isHidden) return;

    let hasSeenNudge = false;
    try {
      hasSeenNudge = Boolean(window.sessionStorage.getItem(NUDGE_KEY));
    } catch {
      // Storage unavailable
    }

    if (!hasSeenNudge) {
      nudgeTimerRef.current = setTimeout(() => {
        setShowNudge(true);
        try {
          window.sessionStorage.setItem(NUDGE_KEY, '1');
        } catch {}

        autoHideNudgeTimerRef.current = setTimeout(() => {
          setShowNudge(false);
        }, 8000);
      }, 8000);
    }

    return () => {
      if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
      if (autoHideNudgeTimerRef.current) clearTimeout(autoHideNudgeTimerRef.current);
    };
  }, [isReady, isHidden]);

  const handleDismissNudge = (e) => {
    e.stopPropagation();
    setShowNudge(false);
    try {
      window.sessionStorage.setItem(NUDGE_KEY, '1');
    } catch {}
  };

  const handleToggleClick = () => {
    if (showNudge) {
      setShowNudge(false);
      try {
        window.sessionStorage.setItem(NUDGE_KEY, '1');
      } catch {}
    }
    onToggle();
  };

  // Prefetch chunk on hover/focus/touchstart if connection is good
  const handleInteractionPrefetch = useCallback(() => {
    if (!isSlowConnection() && onPrefetch) {
      onPrefetch();
    }
  }, [onPrefetch]);

  if (!isReady || isHidden || isOpen) return null;

  return (
    <aside aria-label="Studio chat assistant" className="fixed z-[60] bottom-0 right-0 pointer-events-none">
      <div className="relative pointer-events-auto">
        {/* Nudge Tooltip */}
        {showNudge && !isOpen && (
          <div
            role="status"
            className="chat-message-enter fixed bottom-[152px] sm:bottom-[80px] right-4 sm:right-6 max-w-[min(260px,calc(100vw-2rem))] bg-bg-raised border border-line p-2.5 rounded-[2px] text-xs text-text flex items-center gap-2 select-none"
          >
            <span>{uiCopy.launcher.nudgeText}</span>
            <button
              type="button"
              onClick={handleDismissNudge}
              aria-label={uiCopy.launcher.nudgeDismissAriaLabel}
              className="text-text-dim hover:text-text p-1 transition-colors cursor-pointer rounded-[2px]"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Launcher Trigger Button */}
        {/* Desktop: labelled pill (>=640px) */}
        <button
          data-chat-launcher
          type="button"
          onClick={handleToggleClick}
          onMouseEnter={handleInteractionPrefetch}
          onFocus={handleInteractionPrefetch}
          onTouchStart={handleInteractionPrefetch}
          aria-label={uiCopy.launcher.ariaLabel}
          aria-expanded={isOpen}
          aria-controls="chat-window-dialog"
          className="hidden sm:inline-flex fixed right-6 bottom-6 chat-launcher-enter items-center gap-2.5 px-5 min-h-[48px] rounded-full bg-bg-raised hover:bg-bg border border-line hover:border-accent-2 text-text transition-colors cursor-pointer group focus-visible:outline-accent-2"
        >
          <img
            src="/assets/bot/bot-animated.webp"
            alt=""
            aria-hidden="true"
            width="28"
            height="28"
            className="w-7 h-7 object-contain shrink-0 transition-opacity"
          />
          <span className="font-display text-sm tracking-wide font-medium">
            {uiCopy.launcher.desktopLabel}
          </span>
        </button>

        {/* Mobile: 56px round icon button placed above WhatsApp (<640px) */}
        <button
          data-chat-launcher
          type="button"
          onClick={handleToggleClick}
          onMouseEnter={handleInteractionPrefetch}
          onFocus={handleInteractionPrefetch}
          onTouchStart={handleInteractionPrefetch}
          aria-label={uiCopy.launcher.ariaLabel}
          aria-expanded={isOpen}
          aria-controls="chat-window-dialog"
          className="sm:hidden fixed right-4 bottom-[88px] chat-launcher-enter w-14 h-14 rounded-full bg-bg-raised hover:bg-bg border border-line hover:border-accent-2 text-accent-2 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-accent-2"
        >
          <img
            src="/assets/bot/bot-animated.webp"
            alt=""
            aria-hidden="true"
            width="36"
            height="36"
            className="w-9 h-9 object-contain"
          />
        </button>
      </div>
    </aside>
  );
}

export default React.memo(ChatLauncher);
