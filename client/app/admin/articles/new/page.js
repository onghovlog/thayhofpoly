'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarkdownViewer from '@/components/article/MarkdownViewer';
import { createArticle } from '@/services/articleService';
import { getCategories } from '@/services/categoryService';
import { getCourses } from '@/services/courseService';
import { ArrowLeft, Save, Eye, Edit3 } from 'lucide-react';

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: `## 1. Giới thiệu

Nội dung phần mở đầu bài viết...

## 2. Các khái niệm cốt lõi

\`\`\`javascript
// Ví dụ mã nguồn
function helloWorld() {
  console.log("Xin chào!");
}
\`\`\`

## 3. Tổng kết và Lời khuyên

Đúc kết kinh nghiệm thực tế...`,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    tags: 'HTML, CSS, Web',
    relatedCourses: [],
    featured: true,
    status: 'published',
  });

  useEffect(() => {
    Promise.all([getCategories(), getCourses({ limit: 50 })]).then(([catsRes, coursesRes]) => {
      if (catsRes.success && catsRes.data?.length > 0) {
        setCategories(catsRes.data);
        setFormData((prev) => ({ ...prev, category: catsRes.data[0]._id }));
      }
      if (coursesRes.success) {
        setAllCourses(coursesRes.data || []);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      const res = await createArticle(payload);
      if (res.success) {
        alert('Tạo bài viết mới thành công!');
        router.push('/admin/articles');
      } else {
        setError(res.message || 'Lỗi khi tạo bài viết');
      }
    } catch (err) {
      setError(err.message || 'Lỗi tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Link href="/admin/articles" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} />
          <span>Quay lại</span>
        </Link>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--secondary)' }}>Viết Bài viết / Tutorial mới</h1>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Basic Info */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <div className="form-group">
            <label className="form-label">Tiêu đề bài viết *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              placeholder="Ví dụ: Hướng dẫn Flexbox CSS từ cơ bản đến thực chiến"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Slug URL (Tự tạo nếu để trống)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="form-input"
                placeholder="huong-dan-flexbox-css"
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
              placeholder="Tóm tắt nội dung chính trong 1-2 câu..."
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

        {/* Markdown Content Editor */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <label className="form-label" style={{ marginBottom: 0, fontSize: '1.1rem' }}>
              Nội dung bài viết (Định dạng Markdown) *
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
              rows={16}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="form-textarea"
              style={{ fontFamily: 'monospace', fontSize: '0.92rem', lineHeight: 1.6 }}
              placeholder="Nhập nội dung markdown tại đây..."
            />
          )}
        </div>

        {/* Tags & Settings */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <div className="form-group">
            <label className="form-label">Thẻ tags (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="form-input"
              placeholder="HTML, CSS, Web Development"
            />
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <span>Đánh dấu là Bài viết Nổi bật</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.status === 'published'}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })}
              />
              <span>Công khai ngay (Published)</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            <Save size={18} />
            <span>{loading ? 'Đang lưu bài viết...' : 'Xuất bản Bài viết'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
