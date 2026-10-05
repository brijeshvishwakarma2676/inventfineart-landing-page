import { useId } from 'react';

// Static placeholder: controls are disabled until siteData.footer.newsletter.endpoint is configured.
export function NewsletterForm({ newsletter }) {
  const id = useId();
  const live = Boolean(newsletter.endpoint);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3 max-w-[420px]" aria-describedby={`${id}-note`}>
      <label htmlFor={`${id}-email`} className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2">
        {newsletter.heading}
      </label>
      <p className="font-body text-sm text-text-dim">{newsletter.text}</p>
      <div className="flex">
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          placeholder="Your email address"
          autoComplete="email"
          disabled={!live}
          className="flex-1 min-w-0 bg-transparent border border-line border-r-0 text-text placeholder:text-text-dim/60 px-4 min-h-[48px] text-sm outline-none focus:border-accent-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-[2px]"
        />
        <button
          type="submit"
          disabled={!live}
          className="px-5 min-h-[48px] bg-accent text-text text-xs uppercase font-semibold tracking-wider transition-colors hover:bg-accent-hover disabled:bg-line disabled:text-text-dim disabled:cursor-not-allowed rounded-r-[2px]"
        >
          Subscribe
        </button>
      </div>
      {!live && (
        <p id={`${id}-note`} className="font-body text-xs text-text-dim">
          Signup opens soon.
        </p>
      )}
    </form>
  );
}

export default NewsletterForm;
