'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLearningPaths, deleteLearningPath } from '@/services/learningPathService';
import { formatLevel } from '@/utils/formatters';
import { Plus, Edit2, Trash2, ExternalLink, Milestone } from 'lucide-react';

export default function AdminLearningPathsPage() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPaths = async () => {
    setLoading(true);
    try {
      const res = await getLearningPaths({ allStatus: 'true' });
      if (res.success) {
        setPaths(res.data || []);
      }
    } catch (e) {
      console.error('Lỗi tải lộ trình:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaths();
  }, []);

  const handleDelete = async (id, title) => {
    if (confirm(`Bạn có chắc muốn xóa lộ trình "${title}"?`)) {
      try {
        const res = await deleteLearningPath(id);
        if (res.success) {
          alert('Xóa lộ trình thành công');
          fetchPaths();
        }
      } catch (err) {
        alert(err.message || 'Lỗi khi xóa lộ trình');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>
            Quản lý Lộ trình Học tập
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tổng cộng: {paths.length} lộ trình định hướng nghề nghiệp
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Tên lộ trình</th>
              <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Cấp độ</th>
              <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Số bước</th>
              <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Trạng thái</th>
              <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600, textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Đang tải danh sách lộ trình...
                </td>
              </tr>
            ) : paths.map((path) => (
              <tr key={path._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--secondary)' }}>
                  {path.title}
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>/lo-trinh/{path.slug}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge badge-${path.level || 'beginner'}`}>
                    {formatLevel(path.level)}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge">{path.steps?.length || 0} giai đoạn</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: path.status === 'published' ? 'var(--success-bg)' : '#F1F5F9',
                      color: path.status === 'published' ? 'var(--success)' : 'var(--text-muted)',
                    }}
                  >
                    {path.status === 'published' ? 'Công khai' : 'Bản nháp'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    <Link
                      href={`/lo-trinh/${path.slug}`}
                      target="_blank"
                      className="btn btn-ghost btn-sm"
                      title="Xem trên web"
                    >
                      <ExternalLink size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(path._id, path.title)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--danger)' }}
                      title="Xóa lộ trình"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
