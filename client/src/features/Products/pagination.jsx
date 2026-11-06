function Pagination({ currentPage, numberOfPages, onPageChange }) {
  const goPrev = () => onPageChange(Math.max(currentPage - 1, 1));
  const goNext = () => onPageChange(Math.min(currentPage + 1, numberOfPages));

  const getPages = () => {
    const pages = [];
    const delta = 1;

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(numberOfPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) pages.push('...');

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < numberOfPages - 1) pages.push('...');

    if (numberOfPages > 1) pages.push(numberOfPages);

    return pages;
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 px-3 py-5 sm:gap-4 sm:px-4"
    >
      {/* Previous */}
      <button
        onClick={goPrev}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="
          flex h-9 w-9 shrink-0 items-center justify-center
          border border-border text-foreground
          transition-colors hover:bg-accent
          disabled:cursor-not-allowed disabled:opacity-30
        "
      >
        &lt;
      </button>

      {/* Pages */}
      <div className="flex min-w-0 items-center gap-1 sm:gap-2">
        {getPages().map((page, idx) =>
          page === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1 text-xs text-muted-foreground sm:px-2"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`
                flex h-9 w-9 shrink-0 items-center justify-center
                border-b-2 text-sm transition-colors
                ${
                  currentPage === page
                    ? 'border-primary font-semibold text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                }
              `}
            >
              {page}
            </button>
          ),
        )}
      </div>

      {/* Next */}
      <button
        onClick={goNext}
        disabled={currentPage === numberOfPages}
        aria-label="Next page"
        className="
          flex h-9 w-9 shrink-0 items-center justify-center
          border border-border text-foreground
          transition-colors hover:bg-accent
          disabled:cursor-not-allowed disabled:opacity-30
        "
      >
        &gt;
      </button>
    </nav>
  );
}

export default Pagination;
