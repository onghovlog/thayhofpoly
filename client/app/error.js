'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('[Application Error]', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          padding: '2.5rem 2rem',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <AlertTriangle size={28} />
        </div>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
          Đã có lỗi xảy ra!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          {error?.message || 'Hệ thống gặp sự cố trong quá trình tải dữ liệu. Vui lòng thử lại.'}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => reset()} className="btn btn-primary">
            <RefreshCw size={16} />
            <span>Thử tải lại trang</span>
          </button>
          <Link href="/" className="btn btn-outline">
            <Home size={16} />
            <span>Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
