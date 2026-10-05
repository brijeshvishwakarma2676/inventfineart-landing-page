import { FacebookIcon, XIcon, PinterestIcon } from './Icons';

const ICONS = { facebook: FacebookIcon, x: XIcon, pinterest: PinterestIcon };
const box = 'w-11 h-11 rounded-[2px] border border-line flex items-center justify-center';

// Real links when `url` is set; otherwise a visibly disabled placeholder (never a dead link).
export function SocialLinks({ links }) {
  return (
    <ul className="flex gap-3" aria-label="Social media">
      {links.map((s) => {
        const Icon = ICONS[s.id];
        if (!Icon) return null;
        return (
          <li key={s.id}>
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={`${box} text-text-dim hover:text-text hover:border-text-dim transition-colors`}
              >
                <Icon />
              </a>
            ) : (
              <span role="img" aria-label={`${s.label} (link coming soon)`} title="Coming soon" className={`${box} text-text-dim/40 cursor-not-allowed`}>
                <Icon />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default SocialLinks;
