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
    <div className="flex items-center gap-4 py-2 px-4 justify-center">
      {/* Prev */}
      <button
        onClick={goPrev}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        &lt;
      </button>

      {/* Pages */}
      <div className="flex gap-2 items-center">
        {getPages().map((page, idx) =>
          page === '...' ? (
            <span key={idx} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={`h-10 w-10 flex items-center justify-center border-b-2 transition-all duration-200
                ${
                  currentPage === page
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-400'
                }`}
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
        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
}

export default Pagination;
