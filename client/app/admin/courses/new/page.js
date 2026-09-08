'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCourse } from '@/services/courseService';
import { getCategories } from '@/services/categoryService';
import { ArrowLeft, Save, Sparkles, Youtube } from 'lucide-react';

export default function NewCoursePage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    shortDescription: '',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    youtubePlaylistUrl: '',
    youtubePlaylistId: '',
    videoCount: 10,
    duration: '10 giờ học',
    level: 'beginner',
    tags: 'HTML, CSS, Web',
    objectives: 'Nắm vững kiến thức nền tảng\nThực hành xây dựng dự án thực tế\nTối ưu giao diện chuẩn Responsive',
    requirements: 'Máy tính có kết nối Internet\nCài đặt sẵn trình soạn thảo mã nguồn VS Code',
    targetAudience: 'Sinh viên CNTT và người mới bắt đầu',
    featured: true,
    status: 'published',
    seoTitle: '',
    seoDescription: '',
  });

  useEffect(() => {
    getCategories().then((res) => {
      if (res.success && res.data?.length > 0) {
        setCategories(res.data);
        setFormData((prev) => ({ ...prev, category: res.data[0]._id }));
      }
    });
  }, []);

  // Tự động phân tích Playlist ID khi dán URL
  const handlePlaylistUrlChange = (url) => {
    let playlistId = '';
    const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      playlistId = match[1];
    } else if (/^[a-zA-Z0-9_-]{10,60}$/.test(url.trim())) {
      playlistId = url.trim();
    }

    setFormData((prev) => ({
      ...prev,
      youtubePlaylistUrl: url,
      youtubePlaylistId: playlistId || prev.youtubePlaylistId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        objectives: formData.objectives.split('\n').map((t) => t.trim()).filter(Boolean),
        requirements: formData.requirements.split('\n').map((t) => t.trim()).filter(Boolean),
        targetAudience: formData.targetAudience.split('\n').map((t) => t.trim()).filter(Boolean),
        videoCount: Number(formData.videoCount) || 0,
      };

      const res = await createCourse(payload);
      if (res.success) {
        alert('Tạo khóa học thành công!');
        router.push('/admin/courses');
      } else {
        setError(res.message || 'Lỗi khi tạo khóa học');
      }
    } catch (err) {
      setError(err.message || 'Lỗi tạo khóa học');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Link href="/admin/courses" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} />
          <span>Quay lại</span>
        </Link>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--secondary)' }}>Thêm Khóa học mới</h1>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Basic Info */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '1.25rem' }}>Thông tin cơ bản</h3>

          <div className="form-group">
            <label className="form-label">Tên khóa học *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              placeholder="Ví dụ: HTML CSS từ cơ bản đến thực chiến"
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
                placeholder="html-css-thuc-chien"
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
            <label className="form-label">Mô tả ngắn (Hiển thị ngoài card) *</label>
            <textarea
              required
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="form-textarea"
              placeholder="Tóm tắt ngắn gọn nội dung khóa học..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả chi tiết khóa học *</label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
              placeholder="Giới thiệu toàn diện về khóa học..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ảnh Thumbnail (URL)</label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        {/* YouTube Integration */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Youtube size={22} color="#EF4444" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>Tích hợp YouTube Playlist</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Link YouTube Playlist URL *</label>
            <input
              type="text"
              required
              value={formData.youtubePlaylistUrl}
              onChange={(e) => handlePlaylistUrlChange(e.target.value)}
              className="form-input"
              placeholder="https://www.youtube.com/playlist?list=PL4cUxeGndAeCg48k9_..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">YouTube Playlist ID</label>
              <input
                type="text"
                required
                value={formData.youtubePlaylistId}
                onChange={(e) => setFormData({ ...formData, youtubePlaylistId: e.target.value })}
                className="form-input"
                placeholder="PL4cUxeGndAeC..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Số lượng video</label>
              <input
                type="number"
                value={formData.videoCount}
                onChange={(e) => setFormData({ ...formData, videoCount: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Thời lượng ước tính</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Level, Tags, Objectives */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '1.25rem' }}>Nội dung đào tạo & Cài đặt</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Cấp độ</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="form-select"
              >
                <option value="beginner">Cơ bản (Beginner)</option>
                <option value="intermediate">Trung cấp (Intermediate)</option>
                <option value="advanced">Nâng cao (Advanced)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Thẻ tags (phân cách bằng dấu phẩy)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="form-input"
                placeholder="HTML, CSS, Flexbox"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mục tiêu khóa học / Bạn sẽ học được gì (Mỗi mục 1 dòng)</label>
            <textarea
              rows={3}
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kiến thức cần chuẩn bị (Mỗi mục 1 dòng)</label>
            <textarea
              rows={2}
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Đối tượng phù hợp (Mỗi mục 1 dòng)</label>
            <textarea
              rows={2}
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <span>Đánh dấu là Khóa học Nổi bật (Featured)</span>
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
            <span>{loading ? 'Đang lưu khóa học...' : 'Lưu và Xuất bản Khóa học'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
