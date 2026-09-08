'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLearningPaths, deleteLearningPath } from '@/services/learningPathService';
import { formatLevel, formatDate } from '@/utils/formatters';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Milestone,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function AdminLearningPathsPage() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchPaths = async () => {
    setLoading(true);
    try {
      const res = await getLearningPaths({ allStatus: 'true' });
      if (res.success) {
        setPaths(res.data || []);
      }
    } catch (e) {
      console.error('Lỗi tải danh sách lộ trình:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaths();
  }, []);

  const handleDelete = async (id, title) => {
    if (confirm(`Bạn có chắc muốn xóa lộ trình "${title}"?\nThao tác này không thể hoàn tác.`)) {
      try {
        const res = await deleteLearningPath(id);
        if (res.success) {
          alert('Đã xóa lộ trình thành công');
          fetchPaths();
        }
      } catch (err) {
        alert(err.message || 'Lỗi khi xóa lộ trình');
      }
    }
  };

  const filteredPaths = paths.filter((path) => {
    const matchSearch =
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel = levelFilter === 'all' || path.level === levelFilter;
    const matchStatus = statusFilter === 'all' || path.status === statusFilter;
    return matchSearch && matchLevel && matchStatus;
  });

  const publishedCount = paths.filter((p) => p.status === 'published').length;
  const featuredCount = paths.filter((p) => p.featured).length;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>
            Quản lý Lộ trình Học tập
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Xây dựng các lộ trình nghề nghiệp từng bước cho người học từ Zero đến Hero.
          </p>
        </div>

        <Link href="/admin/learning-paths/new" className="btn btn-primary">
          <Plus size={18} />
          <span>Tạo lộ trình mới</span>
        </Link>
      </div>

      {/* Quick Stats Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Milestone size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>
              {paths.length}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tổng lộ trình</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>
              {publishedCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Đang công khai</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--warning-bg)',
              color: 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>
              {featuredCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Lộ trình nổi bật</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc slug lộ trình..."
            className="form-input"
            style={{ paddingLeft: '2.5rem', fontSize: '0.88rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            size={16}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem', minWidth: '130px' }}
          >
            <option value="all">Mọi cấp độ</option>
            <option value="beginner">Cơ bản</option>
            <option value="intermediate">Trung cấp</option>
            <option value="advanced">Nâng cao</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem', minWidth: '130px' }}
          >
            <option value="all">Mọi trạng thái</option>
            <option value="published">Công khai</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Tên lộ trình</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Cấp độ</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Số giai đoạn</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Nổi bật</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Trạng thái</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600, textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Đang tải danh sách lộ trình...
                  </td>
                </tr>
              ) : filteredPaths.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {searchQuery || levelFilter !== 'all' || statusFilter !== 'all'
                      ? 'Không tìm thấy lộ trình phù hợp với bộ lọc.'
                      : 'Chưa có lộ trình nào. Hãy bấm "Tạo lộ trình mới" để bắt đầu!'}
                  </td>
                </tr>
              ) : (
                filteredPaths.map((path) => (
                  <tr key={path._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {path.thumbnail && (
                          <img
                            src={path.thumbnail}
                            alt=""
                            style={{
                              width: '44px',
                              height: '32px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              border: '1px solid var(--border)',
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div>
                          <div>{path.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                            /lo-trinh/{path.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge badge-${path.level || 'beginner'}`}>
                        {formatLevel(path.level)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge" style={{ backgroundColor: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
                        {path.steps?.length || 0} giai đoạn
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {path.featured ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--warning)',
                            backgroundColor: 'var(--warning-bg)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          <Sparkles size={12} />
                          <span>Nổi bật</span>
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-light)', fontSize: '0.82rem' }}>—</span>
                      )}
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
                        <Link
                          href={`/admin/learning-paths/edit/${path._id}`}
                          className="btn btn-ghost btn-sm"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={15} />
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
