import React from 'react';
import { Link } from 'react-router';

/**
 * Whitelist of allowed internal paths for site navigation.
 */
const ALLOWED_INTERNAL_EXACT = new Set([
  '/',
  '/services',
  '/gallery',
  '/clients',
  '/faq',
  '/about',
  '/contact',
]);

/**
 * Validates if an internal path is allowed.
 * Allows exact routes and /gallery/<category> subpaths.
 * @param {string} path
 * @returns {boolean}
 */
function isAllowedInternalPath(path) {
  if (!path || typeof path !== 'string' || !path.startsWith('/')) return false;
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, '');
  if (ALLOWED_INTERNAL_EXACT.has(clean || '/')) return true;
  if (/^\/gallery\/[a-z0-9-]+$/i.test(clean)) return true;
  return false;
}

/**
 * Validates if a protocol URL is an allowed external studio link.
 * @param {string} url
 * @returns {boolean}
 */
function isAllowedExternalUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return true;
  if (/^https:\/\/wa\.me\/[0-9]+/i.test(url)) return true;
  return false;
}

/**
 * Parses inline text into React elements:
 * - Markdown links [text](url) -> Link or anchor if allowed, else plain text
 * - Bare paths (/services, /gallery/...) -> Link
 * - Allowed external links (tel:, mailto:, https://wa.me/...) -> anchor
 * - **bold** -> <strong>
 * - Plain text (React text nodes: completely XSS-safe)
 *
 * @param {string} text
 * @param {Object} options
 * @param {Function} [options.onInternalLinkClick]
 * @returns {React.ReactNode[]}
 */
function renderInline(text, { onInternalLinkClick } = {}) {
  if (!text) return [];

  const tokenRegex =
    /(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|((?:https:\/\/wa\.me\/[0-9]+|mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|tel:\+?[0-9\s-]+))|(\/(?:services|gallery(?:\/[a-z0-9-]+)?|clients|faq|about|contact)(?![a-zA-Z0-9]))/g;

  const elements = [];
  let lastIndex = 0;
  let key = 0;

  let match;
  while ((match = tokenRegex.exec(text)) !== null) {
    // Bare path glued to a word (e.g. "and/about") is plain text
    if (match[4] && match.index > 0 && /[a-zA-Z0-9]/.test(text[match.index - 1])) continue;
    if (match.index > lastIndex) {
      elements.push(
        <React.Fragment key={key++}>
          {text.slice(lastIndex, match.index)}
        </React.Fragment>
      );
    }

    const [fullMatch, mdLink, bold, protocolUrl, barePath] = match;

    if (mdLink) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(mdLink);
      if (linkMatch) {
        const [, label, targetUrl] = linkMatch;
        const trimmedUrl = targetUrl.trim();

        if (isAllowedInternalPath(trimmedUrl)) {
          elements.push(
            <Link
              key={key++}
              to={trimmedUrl}
              onClick={onInternalLinkClick}
              className="text-accent-light underline underline-offset-2 hover:text-text transition-colors"
            >
              {label}
            </Link>
          );
        } else if (isAllowedExternalUrl(trimmedUrl)) {
          const isExternalTab = trimmedUrl.startsWith('https://wa.me/');
          elements.push(
            <a
              key={key++}
              href={trimmedUrl}
              target={isExternalTab ? '_blank' : undefined}
              rel={isExternalTab ? 'noopener noreferrer' : undefined}
              className="text-accent-light underline underline-offset-2 hover:text-text transition-colors"
            >
              {label}
            </a>
          );
        } else {
          // Untrusted or arbitrary link: render harmless plain text
          elements.push(<React.Fragment key={key++}>{fullMatch}</React.Fragment>);
        }
      } else {
        elements.push(<React.Fragment key={key++}>{fullMatch}</React.Fragment>);
      }
    } else if (bold) {
      const boldText = bold.slice(2, -2);
      elements.push(
        <strong key={key++} className="font-semibold text-text">
          {boldText}
        </strong>
      );
    } else if (protocolUrl) {
      const cleanUrl = protocolUrl.replace(/[.,;:\s]+$/, '');
      const trailingPunct = protocolUrl.slice(cleanUrl.length);
      const isExternalTab = cleanUrl.startsWith('https://wa.me/');

      elements.push(
        <React.Fragment key={key++}>
          <a
            href={cleanUrl}
            target={isExternalTab ? '_blank' : undefined}
            rel={isExternalTab ? 'noopener noreferrer' : undefined}
            className="text-accent-light underline underline-offset-2 hover:text-text transition-colors"
          >
            {cleanUrl}
          </a>
          {trailingPunct}
        </React.Fragment>
      );
    } else if (barePath) {
      elements.push(
        <Link
          key={key++}
          to={barePath}
          onClick={onInternalLinkClick}
          className="text-accent-light underline underline-offset-2 hover:text-text transition-colors"
        >
          {barePath}
        </Link>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(
      <React.Fragment key={key++}>{text.slice(lastIndex)}</React.Fragment>
    );
  }

  return elements;
}

/**
 * Safe markdown-lite renderer.
 * Never uses dangerouslySetInnerHTML; parses text into React nodes.
 *
 * @param {Object} props
 * @param {string} props.content - Markdown text
 * @param {Function} [props.onInternalLinkClick] - Callback when an internal Link is tapped (e.g. to close mobile sheet)
 * @param {string} [props.className]
 */
export function MarkdownLite({ content, onInternalLinkClick, className = '' }) {
  if (!content || typeof content !== 'string') return null;

  const blocks = content.split(/\n\s*\n+/);

  return (
    <div className={`space-y-2 text-sm leading-relaxed break-words ${className}`}>
      {blocks.map((block, blockIndex) => {
        const trimmedBlock = block.trim();
        if (!trimmedBlock) return null;

        const lines = trimmedBlock.split('\n');

        const isBulletList =
          lines.length > 0 &&
          lines.every((line) => /^\s*[-*]\s+/.test(line.trim()));

        if (isBulletList) {
          return (
            <ul key={blockIndex} className="my-1.5 space-y-1 pl-4 list-disc marker:text-accent-2">
              {lines.map((line, lineIndex) => {
                const itemText = line.trim().replace(/^[-*]\s+/, '');
                return (
                  <li key={lineIndex} className="pl-1">
                    {renderInline(itemText, { onInternalLinkClick })}
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={blockIndex} className="my-1 first:mt-0 last:mb-0">
            {lines.map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {lineIndex > 0 && <br />}
                {renderInline(line, { onInternalLinkClick })}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default MarkdownLite;
