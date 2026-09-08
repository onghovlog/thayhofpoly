'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCourseById, updateCourse } from '@/services/courseService';
import { getCategories } from '@/services/categoryService';
import { ArrowLeft, Save, Youtube } from 'lucide-react';

export default function EditCoursePage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    shortDescription: '',
    description: '',
    thumbnail: '',
    youtubePlaylistUrl: '',
    youtubePlaylistId: '',
    videoCount: 0,
    duration: '',
    level: 'beginner',
    tags: '',
    objectives: '',
    requirements: '',
    targetAudience: '',
    featured: false,
    status: 'published',
  });

  useEffect(() => {
    Promise.all([getCategories(), getCourseById(id)])
      .then(([catsRes, courseRes]) => {
        if (catsRes.success) setCategories(catsRes.data);
        if (courseRes.success && courseRes.data) {
          const c = courseRes.data;
          setFormData({
            title: c.title || '',
            slug: c.slug || '',
            category: c.category?._id || c.category || '',
            shortDescription: c.shortDescription || '',
            description: c.description || '',
            thumbnail: c.thumbnail || '',
            youtubePlaylistUrl: c.youtubePlaylistUrl || '',
            youtubePlaylistId: c.youtubePlaylistId || '',
            videoCount: c.videoCount || 0,
            duration: c.duration || '',
            level: c.level || 'beginner',
            tags: (c.tags || []).join(', '),
            objectives: (c.objectives || []).join('\n'),
            requirements: (c.requirements || []).join('\n'),
            targetAudience: (c.targetAudience || []).join('\n'),
            featured: !!c.featured,
            status: c.status || 'published',
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

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
    setSaving(true);
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

      const res = await updateCourse(id, payload);
      if (res.success) {
        alert('Cập nhật khóa học thành công!');
        router.push('/admin/courses');
      } else {
        setError(res.message || 'Lỗi khi cập nhật khóa học');
      }
    } catch (err) {
      setError(err.message || 'Lỗi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Đang tải thông tin khóa học...</div>;
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Link href="/admin/courses" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} />
          <span>Quay lại</span>
        </Link>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--secondary)' }}>Chỉnh sửa Khóa học</h1>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            <label className="form-label">Mô tả ngắn *</label>
            <textarea
              required
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="form-textarea"
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
              <label className="form-label">Thời lượng</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            <Save size={18} />
            <span>{saving ? 'Đang lưu thay đổi...' : 'Cập nhật Khóa học'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
