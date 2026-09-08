'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createLearningPath } from '@/services/learningPathService';
import { getCategories } from '@/services/categoryService';
import { getCourses } from '@/services/courseService';
import { getArticles } from '@/services/articleService';
import { slugify } from '@/utils/formatters';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Milestone,
  Clock,
  Video,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function NewLearningPathPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    level: 'beginner',
    category: '',
    featured: false,
    status: 'published',
    seoTitle: '',
    seoDescription: '',
    steps: [
      {
        stepNumber: 1,
        title: 'Giai đoạn 1: Nền tảng tư duy cốt lõi',
        description: 'Làm quen với các khái niệm căn bản và thiết lập môi trường thực hành.',
        estimatedTime: '1-2 tuần',
        course: '',
        article: '',
        resourceUrl: '',
      },
      {
        stepNumber: 2,
        title: 'Giai đoạn 2: Kỹ năng thực chiến & Dự án mẫu',
        description: 'Áp dụng kiến thức xây dựng sản phẩm hoàn chỉnh theo quy chuẩn doanh nghiệp.',
        estimatedTime: '2-3 tuần',
        course: '',
        article: '',
        resourceUrl: '',
      },
    ],
  });

  useEffect(() => {
    // Load categories, courses and articles for linkage
    Promise.all([
      getCategories({ active: 'true' }).catch(() => ({ data: [] })),
      getCourses({ limit: 100 }).catch(() => ({ data: [] })),
      getArticles({ limit: 100 }).catch(() => ({ data: [] })),
    ]).then(([catRes, courseRes, artRes]) => {
      if (catRes.data && catRes.data.length > 0) {
        setCategories(catRes.data);
        setFormData((prev) => ({ ...prev, category: catRes.data[0]._id }));
      }
      if (courseRes.data) {
        setCourses(courseRes.data);
      }
      if (artRes.data) {
        setArticles(artRes.data);
      }
    });
  }, []);

  // Auto generate slug from title if user hasn't edited slug manually
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: slugify(newTitle),
    }));
  };

  // Step Management
  const handleAddStep = () => {
    const nextNumber = formData.steps.length + 1;
    const newStep = {
      stepNumber: nextNumber,
      title: `Giai đoạn ${nextNumber}: `,
      description: '',
      estimatedTime: '1-2 tuần',
      course: '',
      article: '',
      resourceUrl: '',
    };
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
  };

  const handleRemoveStep = (index) => {
    if (formData.steps.length <= 1) {
      alert('Lộ trình cần có ít nhất 1 giai đoạn.');
      return;
    }
    const updated = formData.steps
      .filter((_, idx) => idx !== index)
      .map((step, idx) => ({ ...step, stepNumber: idx + 1 }));
    setFormData((prev) => ({ ...prev, steps: updated }));
  };

  const handleMoveStep = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.steps.length) return;

    const updated = [...formData.steps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const renumbered = updated.map((step, idx) => ({ ...step, stepNumber: idx + 1 }));
    setFormData((prev) => ({ ...prev, steps: renumbered }));
  };

  const handleStepChange = (index, field, value) => {
    const updated = [...formData.steps];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, steps: updated }));
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !formData.description.trim()) {
      setError('Vui lòng điền đầy đủ Tên lộ trình, Slug và Mô tả.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Clean up empty ObjectId references in steps
      const cleanedSteps = formData.steps.map((s, idx) => ({
        stepNumber: idx + 1,
        title: s.title.trim(),
        description: s.description.trim(),
        estimatedTime: s.estimatedTime.trim() || '1-2 tuần',
        course: s.course && s.course.trim() ? s.course : undefined,
        article: s.article && s.article.trim() ? s.article : undefined,
        resourceUrl: s.resourceUrl ? s.resourceUrl.trim() : '',
      }));

      const payload = {
        ...formData,
        category: formData.category || undefined,
        steps: cleanedSteps,
      };

      const res = await createLearningPath(payload);
      if (res.success) {
        setSuccessMsg('Tạo lộ trình học tập thành công!');
        setTimeout(() => {
          router.push('/admin/learning-paths');
        }, 1200);
      } else {
        setError(res.message || 'Không thể tạo lộ trình.');
      }
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra khi lưu lộ trình.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Top Header & Breadcrumb */}
      <div style={{ marginBottom: '1.75rem' }}>
        <Link
          href="/admin/learning-paths"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Quay lại danh sách lộ trình</span>
        </Link>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--secondary)' }}>
          Tạo Lộ Trình Học Tập Mới
        </h1>
      </div>

      {/* Alerts */}
      {error && (
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
            fontSize: '0.92rem',
          }}
        >
          {error}
        </div>
      )}

      {successMsg && (
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* CARD 1: Basic Information */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            marginBottom: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Milestone size={20} color="var(--primary)" />
            <span>1. Thông tin chung của lộ trình</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Tên lộ trình học tập *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Lộ trình Front-end Developer thực chiến từ Zero đến Hero"
                className="form-input"
                value={formData.title}
                onChange={handleTitleChange}
              />
            </div>

            {/* Slug */}
            <div className="form-group">
              <label className="form-label">Đường dẫn tĩnh (Slug) *</label>
              <input
                type="text"
                required
                placeholder="lo-trinh-front-end-developer-thuc-chien"
                className="form-input"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Đường dẫn trên web: /lo-trinh/{formData.slug || 'slug-lo-trinh'}
              </span>
            </div>

            {/* Category & Level */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Danh mục chủ đề</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cấp độ phù hợp</label>
                <select
                  className="form-select"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option value="beginner">Cơ bản (Người mới bắt đầu)</option>
                  <option value="intermediate">Trung cấp (Đã có nền tảng)</option>
                  <option value="advanced">Nâng cao (Chuyên sâu)</option>
                  <option value="all">Mọi cấp độ</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Trạng thái công khai</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="published">Công khai (Hiển thị ngay)</option>
                  <option value="draft">Bản nháp (Ẩn khỏi học viên)</option>
                </select>
              </div>
            </div>

            {/* Thumbnail URL */}
            <div className="form-group">
              <label className="form-label">Ảnh Thumbnail (URL)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  className="form-input"
                  style={{ flex: 1 }}
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                />
                {formData.thumbnail && (
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    style={{
                      width: '70px',
                      height: '48px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)',
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Mô tả tổng quan lộ trình *</label>
              <textarea
                rows={4}
                required
                placeholder="Mô tả mục tiêu đầu ra, đối tượng phù hợp và những gì học viên sẽ đạt được sau khi hoàn thành..."
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Featured Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <label htmlFor="featured" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--secondary)', cursor: 'pointer' }}>
                Đánh dấu là Lộ trình Nổi bật (Hiển thị ưu tiên tại Trang chủ)
              </label>
            </div>
          </div>
        </div>

        {/* CARD 2: Steps Editor */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            marginBottom: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
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
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} color="var(--primary)" />
                <span>2. Các giai đoạn / Bước học tập ({formData.steps.length} bước)</span>
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Sắp xếp từng bước tuần tự từ cơ bản đến nâng cao.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddStep}
              className="btn btn-outline-primary btn-sm"
            >
              <Plus size={16} />
              <span>Thêm giai đoạn mới</span>
            </button>
          </div>

          {/* Steps List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {formData.steps.map((step, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-alt)',
                  position: 'relative',
                }}
              >
                {/* Step Card Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    paddingBottom: '0.6rem',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {step.stepNumber}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--secondary)' }}>
                      Giai đoạn {step.stepNumber}
                    </span>
                  </div>

                  {/* Reorder & Remove Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveStep(index, 'up')}
                      className="btn btn-ghost btn-sm"
                      title="Di chuyển lên"
                      style={{ opacity: index === 0 ? 0.3 : 1, padding: '0.3rem' }}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={index === formData.steps.length - 1}
                      onClick={() => handleMoveStep(index, 'down')}
                      className="btn btn-ghost btn-sm"
                      title="Di chuyển xuống"
                      style={{ opacity: index === formData.steps.length - 1 ? 0.3 : 1, padding: '0.3rem' }}
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                      className="btn btn-ghost btn-sm"
                      title="Xóa giai đoạn này"
                      style={{ color: 'var(--danger)', padding: '0.3rem' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Step Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.85rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.82rem' }}>Tên giai đoạn *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: HTML5 & CSS3 Ngữ nghĩa chuẩn SEO"
                        className="form-input"
                        style={{ fontSize: '0.88rem', padding: '0.5rem 0.75rem' }}
                        value={step.title}
                        onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.82rem' }}>Thời gian ước tính</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: 1-2 tuần"
                        className="form-input"
                        style={{ fontSize: '0.88rem', padding: '0.5rem 0.75rem' }}
                        value={step.estimatedTime}
                        onChange={(e) => handleStepChange(index, 'estimatedTime', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem' }}>Mô tả nội dung học tập</label>
                    <textarea
                      rows={2}
                      placeholder="Mô tả tóm tắt những bài học, bài tập hoặc đồ án cần hoàn thành..."
                      className="form-textarea"
                      style={{ fontSize: '0.88rem', padding: '0.5rem 0.75rem' }}
                      value={step.description}
                      onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                    />
                  </div>

                  {/* Resource linkages: Course or Article */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', paddingTop: '0.35rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.82rem' }}>Khóa học liên kết (Tùy chọn)</label>
                      <select
                        className="form-select"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                        value={step.course || ''}
                        onChange={(e) => handleStepChange(index, 'course', e.target.value)}
                      >
                        <option value="">-- Không liên kết khóa học --</option>
                        {courses.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.82rem' }}>Bài viết liên kết (Tùy chọn)</label>
                      <select
                        className="form-select"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                        value={step.article || ''}
                        onChange={(e) => handleStepChange(index, 'article', e.target.value)}
                      >
                        <option value="">-- Không liên kết bài viết --</option>
                        {articles.map((a) => (
                          <option key={a._id} value={a._id}>
                            {a.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleAddStep}
              className="btn btn-outline btn-sm"
              style={{ width: '100%' }}
            >
              <Plus size={16} />
              <span>+ Thêm giai đoạn tiếp theo</span>
            </button>
          </div>
        </div>

        {/* CARD 3: SEO Configuration */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '1.25rem' }}>
            3. Tối ưu hóa tìm kiếm (SEO)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">SEO Title</label>
              <input
                type="text"
                placeholder={formData.title || 'Tiêu đề hiển thị trên Google'}
                className="form-input"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">SEO Description</label>
              <textarea
                rows={2}
                placeholder="Mô tả tóm tắt chuẩn SEO (150-160 ký tự)..."
                className="form-textarea"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1rem',
          }}
        >
          <Link href="/admin/learning-paths" className="btn btn-outline">
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ minWidth: '160px' }}
          >
            {loading ? (
              <span>Đang lưu...</span>
            ) : (
              <>
                <Save size={18} />
                <span>Lưu lộ trình</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
