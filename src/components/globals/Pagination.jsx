import { useMemo } from 'react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  const pages = useMemo(() => {
    const items = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      if (currentPage > 3) items.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) items.push(i);
      if (currentPage < totalPages - 2) items.push('...');
      items.push(totalPages);
    }
    return items;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const pageBtnBase = 'w-10 h-10 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed';
  const navBtnBase = 'px-4 h-10 rounded-xl text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${navBtnBase} text-text-muted hover:text-white hover:bg-white/5`}
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-text-gray text-sm">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${pageBtnBase} ${
              page === currentPage
                ? 'bg-lime text-dark-bg'
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${navBtnBase} text-text-muted hover:text-white hover:bg-white/5`}
        aria-label="Next page"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;
