import { useCallback, useState } from 'react';
import { lqip as staticLqip } from '../data/lqip';

// Image with loading states that stay calm on slow connections:
//  1. its box is reserved up front (aspect ratio or the parent's size) so nothing shifts,
//  2. a soft shimmer + a tiny blurred preview (LQIP) show while it downloads,
//  3. it fades in once loaded (already-cached images show instantly),
//  4. if it fails, a labelled tile with a Retry button replaces the broken icon.
export function SmartImage({
  src,
  alt,
  width,
  height,
  lqip,
  fit = 'cover',
  priority = false,
  loading,
  className = 'w-full h-full', // sizes the wrapper
  imgClassName = '',
  ...rest
}) {
  const [status, setStatus] = useState('loading'); // loading | loaded | error
  const [attempt, setAttempt] = useState(0);
  const preview = lqip || staticLqip[src];
  const url = attempt ? `${src}${src.includes('?') ? '&' : '?'}r=${attempt}` : src;
  const ratio = width && height ? { aspectRatio: `${width} / ${height}` } : undefined;
  const fitCls = fit === 'contain' ? 'object-contain' : 'object-cover';

  // Cached images may already be complete before React attaches onLoad.
  const imgRef = useCallback((node) => {
    if (node && node.complete) setStatus(node.naturalWidth > 0 ? 'loaded' : 'error');
  }, []);

  if (status === 'error') {
    return (
      <div role="img" aria-label={alt} style={ratio} className={`${className} bg-bg-raised border border-line flex flex-col items-center justify-center gap-2 p-3 text-center`}>
        <span className="font-body text-[11px] uppercase tracking-[0.12em] text-text-dim">Image unavailable</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setAttempt((a) => a + 1);
            setStatus('loading');
          }}
          className="min-h-[44px] px-4 font-body text-xs uppercase tracking-wider text-text underline underline-offset-4 hover:text-accent-2 transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const loaded = status === 'loaded';
  return (
    <div style={ratio} className={`${className} relative overflow-hidden ${loaded ? '' : 'skeleton'}`}>
      {preview && (
        <img
          src={preview}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full ${fitCls} scale-110 blur-md transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
      <img
        key={attempt}
        ref={imgRef}
        src={url}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading || 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`relative block w-full h-full ${fitCls} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        {...rest}
      />
    </div>
  );
}

export default SmartImage;
