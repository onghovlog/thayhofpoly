'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarkdownViewer from '@/components/article/MarkdownViewer';
import { getArticleById, updateArticle } from '@/services/articleService';
import { getCategories } from '@/services/categoryService';
import { ArrowLeft, Save, Eye, Edit3 } from 'lucide-react';

export default function EditArticlePage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: '',
    featured: false,
    status: 'published',
  });

  useEffect(() => {
    Promise.all([getCategories(), getArticleById(id)])
      .then(([catsRes, artRes]) => {
        if (catsRes.success) setCategories(catsRes.data);
        if (artRes.success && artRes.data) {
          const a = artRes.data;
          setFormData({
            title: a.title || '',
            slug: a.slug || '',
            category: a.category?._id || a.category || '',
            excerpt: a.excerpt || '',
            content: a.content || '',
            coverImage: a.coverImage || '',
            tags: (a.tags || []).join(', '),
            featured: !!a.featured,
            status: a.status || 'published',
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      const res = await updateArticle(id, payload);
      if (res.success) {
        alert('Cập nhật bài viết thành công!');
        router.push('/admin/articles');
      } else {
        setError(res.message || 'Lỗi khi cập nhật bài viết');
      }
    } catch (err) {
      setError(err.message || 'Lỗi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Đang tải nội dung bài viết...</div>;
  }

  return (
    <div style={{ maxWidth: '960px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Link href="/admin/articles" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} />
          <span>Quay lại</span>
        </Link>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--secondary)' }}>Chỉnh sửa Bài viết</h1>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <div className="form-group">
            <label className="form-label">Tiêu đề bài viết *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Slug URL</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Chuyên mục / Chủ đề *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                <option value="">-- Chọn chủ đề --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tóm tắt ngắn (Excerpt) *</label>
            <textarea
              required
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ảnh Cover (URL)</label>
            <input
              type="text"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        {/* Markdown Content */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <label className="form-label" style={{ marginBottom: 0, fontSize: '1.1rem' }}>
              Nội dung bài viết (Markdown) *
            </label>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setPreviewMode(false)}
                className={`btn btn-sm ${!previewMode ? 'btn-primary' : 'btn-outline'}`}
              >
                <Edit3 size={14} />
                <span>Soạn thảo</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode(true)}
                className={`btn btn-sm ${previewMode ? 'btn-primary' : 'btn-outline'}`}
              >
                <Eye size={14} />
                <span>Xem trước (Preview)</span>
              </button>
            </div>
          </div>

          {previewMode ? (
            <div
              style={{
                minHeight: '400px',
                padding: '1.5rem',
                backgroundColor: 'var(--bg-alt)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <MarkdownViewer content={formData.content} />
            </div>
          ) : (
            <textarea
              required
              rows={18}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="form-textarea"
              style={{ fontFamily: 'monospace', fontSize: '0.92rem', lineHeight: 1.6 }}
            />
          )}
        </div>

        {/* Tags */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <div className="form-group">
            <label className="form-label">Thẻ tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <span>Bài viết Nổi bật</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.status === 'published'}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })}
              />
              <span>Công khai (Published)</span>
            </label>
          </div>
        </div>

        <div>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            <Save size={18} />
            <span>{saving ? 'Đang lưu...' : 'Lưu cập nhật'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
