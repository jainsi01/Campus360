import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50, 100]
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        padding: '1rem 0.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
        color: 'var(--text-secondary)',
        fontSize: '0.88rem'
      }}
    >
      {/* Range summary */}
      <div>
        Showing <strong style={{ color: 'var(--text-primary)' }}>{startItem}</strong> to{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{endItem}</strong> of{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{totalItems}</strong> entries
      </div>

      {/* Page Controls & Per-Page Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                background: '#0f172a',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.3rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          {/* First page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
              padding: '0.4rem',
              borderRadius: '6px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="First Page"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* Prev page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            <ChevronLeft size={16} /> Prev
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                background: p === currentPage ? 'var(--primary)' : 'transparent',
                borderColor: p === currentPage ? 'var(--primary)' : 'var(--border-color)',
                borderStyle: 'solid',
                borderWidth: '1px',
                color: p === currentPage ? '#fff' : 'var(--text-primary)',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: p === currentPage ? 700 : 500,
                fontSize: '0.85rem'
              }}
            >
              {p}
            </button>
          ))}

          {/* Next page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            Next <ChevronRight size={16} />
          </button>

          {/* Last page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
              padding: '0.4rem',
              borderRadius: '6px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Last Page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
