import { FacebookIcon, XIcon, PinterestIcon } from './Icons';

const ICONS = { facebook: FacebookIcon, x: XIcon, pinterest: PinterestIcon };
const boxes = {
  md: 'w-11 h-11 rounded-[2px] border border-line flex items-center justify-center',
  sm: 'w-8 h-8 flex items-center justify-center',
};

// Real links when `url` is set; otherwise a visibly disabled placeholder (never a dead link).
export function SocialLinks({ links, size = 'md' }) {
  const box = boxes[size];
  const iconCls = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
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
                <Icon className={iconCls} />
              </a>
            ) : (
              <span role="img" aria-label={`${s.label} (link coming soon)`} title="Coming soon" className={`${box} text-text-dim/40 cursor-not-allowed`}>
                <Icon className={iconCls} />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default SocialLinks;
