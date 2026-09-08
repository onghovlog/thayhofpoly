import Link from 'next/link';
import { SearchX, FolderOpen, RefreshCw } from 'lucide-react';

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = 'Chưa có nội dung',
  description = 'Hiện tại chưa có dữ liệu trong mục này. Vui lòng quay lại sau!',
  actionLink,
  actionText = 'Về trang chủ',
}) {
  return (
    <div
      style={{
        padding: '4rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--bg-alt)',
        border: '1px dashed var(--border-dark)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '600px',
        margin: '2rem auto',
      }}
    >
      <div
        style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '420px', marginBottom: '1.5rem' }}>
        {description}
      </p>
      {actionLink && (
        <Link href={actionLink} className="btn btn-outline">
          {actionText}
        </Link>
      )}
    </div>
  );
}
