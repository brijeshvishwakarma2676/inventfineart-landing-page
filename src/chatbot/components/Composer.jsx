import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import uiCopy from '../data/uiCopy';
import { SendIcon, StopIcon } from '../../components/Icons';

/**
 * Message input composer:
 * - Auto-growing textarea (1 to 5 lines)
 * - Enter sends, Shift+Enter new line, IME-safe
 * - 500 character limit with 400+ threshold counter
 * - Stop button replaces Send during active generation
 * - Disclaimer line with router link
 */
export function Composer({
  onSend,
  onStop,
  status,
  inputRef,
  onInternalLinkClick,
}) {
  const [input, setInput] = useState('');
  const isGenerating = status === 'waiting' || status === 'streaming';
  const internalRef = useRef(null);
  const textareaRef = inputRef || internalRef;

  const { charLimit, charWarningThreshold, placeholder, sendAriaLabel, stopAriaLabel } =
    uiCopy.composer;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const nextHeight = Math.min(el.scrollHeight, 120);
    el.style.height = `${Math.max(nextHeight, 44)}px`;
  }, [input, textareaRef]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isGenerating) return;
    const trimmed = input.trim();
    if (!trimmed || trimmed.length > charLimit) return;
    onSend(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
    }
  };

  const handleKeyDown = (e) => {
    // IME composition check
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length <= charLimit) {
      setInput(val);
    } else {
      // Trim on excess or paste
      setInput(val.slice(0, charLimit));
    }
  };

  const isOverThreshold = input.length >= charWarningThreshold;
  const isAtLimit = input.length >= charLimit;
  const canSend = input.trim().length > 0 && !isGenerating;

  return (
    <div className="border-t border-line bg-bg p-3 sm:p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="relative flex items-end gap-2.5 bg-bg-raised border border-line rounded-[2px] focus-within:border-accent-2 transition-colors duration-200 px-3.5 py-1.5">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            readOnly={isGenerating}
            aria-busy={isGenerating}
            placeholder={placeholder}
            aria-label={placeholder}
            aria-describedby="chat-disclaimer chat-char-counter"
            maxLength={charLimit}
            className="chat-composer-input w-full bg-transparent text-text placeholder:text-text-dim/60 text-sm leading-relaxed resize-none border-0 p-0 py-2 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none caret-accent-2 min-h-[40px] max-h-[120px]"
          />

          <div className="flex items-center gap-1.5 shrink-0 pb-1">
            {isGenerating ? (
              <button
                type="button"
                onClick={onStop}
                aria-label={stopAriaLabel}
                className="w-9 h-9 rounded-full bg-accent hover:bg-accent-hover text-text flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-accent-2"
              >
                <StopIcon className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canSend}
                aria-label={sendAriaLabel}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  canSend
                    ? 'bg-accent hover:bg-accent-hover text-text cursor-pointer focus-visible:outline-accent-2'
                    : 'bg-bg text-text-dim/40 cursor-not-allowed border border-line/50'
                }`}
              >
                <SendIcon className="w-4 h-4 ml-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* Character counter (shown from 400+) */}
        <div id="chat-char-counter" className="flex items-center justify-between text-[11px] text-text-dim px-0.5">
          <span className="flex-1" />
          {isOverThreshold && (
            <span className={`tabular-nums font-mono ${isAtLimit ? 'text-accent-2 font-semibold' : ''}`}>
              {input.length} / {charLimit}
            </span>
          )}
        </div>

        {/* Disclaimer */}
        <p
          id="chat-disclaimer"
          className="text-[11px] leading-normal text-text-dim/80 text-center px-1"
        >
          {uiCopy.disclaimer.prefix}
          <Link
            to={uiCopy.disclaimer.linkTo}
            onClick={onInternalLinkClick}
            className="text-accent-light underline underline-offset-2 hover:text-text transition-colors"
          >
            {uiCopy.disclaimer.linkText}
          </Link>
          {uiCopy.disclaimer.suffix}
        </p>
      </form>
    </div>
  );
}

export default React.memo(Composer);
