import { useEffect, useMemo, useState } from 'react';
import SmartImage from './SmartImage';

const columnsFor = (width) => (width >= 1024 ? 4 : width >= 640 ? 3 : 2);

function useColumnCount() {
  const [count, setCount] = useState(() => columnsFor(window.innerWidth));
  useEffect(() => {
    const onResize = () => setCount(columnsFor(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return count;
}

// True masonry: each item goes to the currently shortest column, using its natural aspect ratio
// (width/height come from the manifest, so there is no layout shift). Reading order stays left-to-right.
export function MasonryGrid({ items, onOpen }) {
  const cols = useColumnCount();

  const columns = useMemo(() => {
    const out = Array.from({ length: cols }, () => ({ height: 0, entries: [] }));
    items.forEach((item, index) => {
      const target = out.reduce((min, c) => (c.height < min.height ? c : min), out[0]);
      target.entries.push({ item, index });
      target.height += item.h / item.w;
    });
    return out;
  }, [items, cols]);

  return (
    <div className="flex gap-3 w-full items-start">
      {columns.map((col, c) => (
        <div key={c} className="flex-1 min-w-0 flex flex-col gap-3">
          {col.entries.map(({ item, index }) => {
            // Only what is visible first is eager; the first row is high priority (LCP).
            const eager = index < cols * 2;
            return (
              <button
                key={item.id}
                type="button"
                className="group block w-full relative overflow-hidden rounded-[2px] cursor-pointer p-0 text-left"
                onClick={() => onOpen(index)}
                aria-label={`Open ${item.alt}`}
              >
                <div className="transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                  <SmartImage src={item.thumb} alt={item.alt} width={item.w} height={item.h} lqip={item.lqip} priority={eager} className="w-full" />
                </div>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-bg/85 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 font-body text-xs font-semibold uppercase tracking-wider text-text">
                  #{item.n}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default MasonryGrid;
