import React from 'react';
import uiCopy from '../data/uiCopy';

/**
 * 4 full-width hairline-bordered question buttons for zero-state onboarding.
 *
 * @param {Object} props
 * @param {Function} props.onSelectQuestion - Callback with question text
 */
export function SuggestedQuestions({ onSelectQuestion }) {
  const { suggestedQuestions } = uiCopy.welcome;

  return (
    <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-line/60" role="group" aria-label="Suggested initial questions">
      {suggestedQuestions.map((question, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelectQuestion(question)}
          className="w-full text-left px-3.5 py-2.5 min-h-[44px] rounded-[2px] bg-bg-raised/60 hover:bg-bg-raised border border-line hover:border-accent-2 text-text-dim hover:text-text text-xs tracking-wide transition-colors focus-visible:outline-accent-2 flex items-center justify-between group cursor-pointer"
        >
          <span>{question}</span>
          <span className="text-accent-2 transition-transform duration-200 group-hover:translate-x-0.5 ml-2 text-sm font-mono" aria-hidden="true">
            →
          </span>
        </button>
      ))}
    </div>
  );
}

export default React.memo(SuggestedQuestions);
