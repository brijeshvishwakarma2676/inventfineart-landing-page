// Placeholder shown while a page's code downloads (slow connections): same rhythm as an inner page header + grid.
export function PageSkeleton() {
  return (
    <div className="pt-[var(--header-h)] min-h-[80vh]" role="status" aria-busy="true">
      <span className="sr-only">Loading page…</span>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-12 md:pt-20 flex flex-col gap-5" aria-hidden="true">
        <div className="skeleton h-3 w-40 rounded-[2px]" />
        <div className="skeleton h-14 md:h-20 w-3/4 rounded-[2px]" />
        <div className="skeleton h-4 w-1/2 rounded-[2px]" />
      </div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mt-14 grid grid-cols-2 md:grid-cols-4 gap-3" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="skeleton aspect-[4/3] rounded-[2px]" />
        ))}
      </div>
    </div>
  );
}

export default PageSkeleton;
