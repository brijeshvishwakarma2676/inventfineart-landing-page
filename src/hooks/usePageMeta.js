import { useEffect } from 'react';
import { SITE_URL, OG_IMAGE } from '../data/seo';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Per-route head: title, description, canonical, Open Graph / Twitter, optional JSON-LD.
export function usePageMeta({ title, description, path, jsonLd }) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const url = `${SITE_URL}${path === '/' ? '/' : path}`;
    document.title = title;
    setMeta('name', 'description', description);
    setCanonical(url);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', OG_IMAGE);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:url', url);

    document.head.querySelectorAll('script[data-page-jsonld]').forEach((n) => n.remove());
    if (ld) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-page-jsonld', '');
      script.textContent = ld;
      document.head.appendChild(script);
    }
    return () => {
      document.head.querySelectorAll('script[data-page-jsonld]').forEach((n) => n.remove());
    };
  }, [title, description, path, ld]);
}

export default usePageMeta;
