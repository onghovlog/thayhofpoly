'use client';

import { AlertTriangle, RotateCw } from 'lucide-react';

export default function ErrorState({
  title = 'Không thể tải dữ liệu',
  message = 'Đã có lỗi xảy ra trong quá trình kết nối máy chủ. Vui lòng thử lại.',
  onRetry,
}) {
  return (
    <div
      style={{
        padding: '3rem 1.5rem',
        textAlign: 'center',
        backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '550px',
        margin: '2rem auto',
      }}
    >
      <div
        style={{
          width: '3.2rem',
          height: '3.2rem',
          borderRadius: '50%',
          backgroundColor: '#FEE2E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--danger)',
          marginBottom: '1rem',
        }}
      >
        <AlertTriangle size={26} />
      </div>
      <h3 style={{ fontSize: '1.2rem', color: '#991B1B', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: '#B91C1C', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-sm"
          style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
        >
          <RotateCw size={15} />
          <span>Thử lại</span>
        </button>
      )}
    </div>
  );
}
