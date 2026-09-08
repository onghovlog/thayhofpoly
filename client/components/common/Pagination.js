'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // Show first, last, and pages around current page
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        marginTop: '3rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="btn btn-outline btn-sm"
        style={{
          padding: '0.4rem 0.6rem',
          opacity: currentPage <= 1 ? 0.4 : 1,
          cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
        }}
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Numbers */}
      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span
              key={idx}
              style={{
                padding: '0.4rem 0.6rem',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
              }}
            >
              ...
            </span>
          );
        }

        const isCurrent = p === currentPage;
        return (
          <button
            key={idx}
            onClick={() => onPageChange(p)}
            style={{
              minWidth: '2.2rem',
              height: '2.2rem',
              padding: '0 0.4rem',
              borderRadius: 'var(--radius)',
              border: isCurrent ? '1px solid var(--primary)' : '1px solid var(--border)',
              backgroundColor: isCurrent ? 'var(--primary)' : '#FFFFFF',
              color: isCurrent ? '#FFFFFF' : 'var(--secondary)',
              fontWeight: isCurrent ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {p}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="btn btn-outline btn-sm"
        style={{
          padding: '0.4rem 0.6rem',
          opacity: currentPage >= totalPages ? 0.4 : 1,
          cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
        }}
        aria-label="Trang sau"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
