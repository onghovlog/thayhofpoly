import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
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
      <div style={{ maxWidth: '480px' }}>
        <h1
          style={{
            fontSize: '5rem',
            fontWeight: 900,
            color: 'var(--primary)',
            lineHeight: 1,
            marginBottom: '1rem',
          }}
        >
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
          Không tìm thấy trang yêu cầu
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            <Home size={18} />
            <span>Về trang chủ</span>
          </Link>
          <Link href="/khoa-hoc" className="btn btn-outline">
            <span>Xem khóa học</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
