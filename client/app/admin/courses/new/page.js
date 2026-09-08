'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCourse, getYoutubeVideoInfo, getYoutubePlaylistInfo } from '@/services/courseService';
import { getCategories } from '@/services/categoryService';
import { slugify, calculateTotalDuration } from '@/utils/formatters';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Youtube,
  RefreshCw,
  Sparkles,
  FileText,
  Clock,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function NewCoursePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingVideo, setFetchingVideo] = useState(false);
  const [fetchingPlaylist, setFetchingPlaylist] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Quick inputs for YouTube
  const [singleVideoUrl, setSingleVideoUrl] = useState('');
  const [playlistInputUrl, setPlaylistInputUrl] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    level: 'beginner',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    description: '',
    duration: 'Tự học theo tiến độ',
    featured: true,
    status: 'published',
    youtubePlaylistUrl: '',
    lessons: [
      {
        order: 1,
        title: 'Bài 1: Giới thiệu & Cài đặt môi trường',
        youtubeUrl: 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
        videoId: 'kUMe1FH4CHE',
        thumbnail: 'https://i.ytimg.com/vi/kUMe1FH4CHE/hqdefault.jpg',
        duration: '15:00',
        fileName: '',
        fileUrl: '',
      },
    ],
  });

  useEffect(() => {
    getCategories({ active: 'true' }).then((res) => {
      if (res.success && res.data?.length > 0) {
        setCategories(res.data);
        setFormData((prev) => ({ ...prev, category: res.data[0]._id }));
      }
    });
  }, []);

  // Tự động tính tổng thời lượng khi danh sách bài học thay đổi
  useEffect(() => {
    if (formData.lessons && formData.lessons.length > 0) {
      const autoDur = calculateTotalDuration(formData.lessons);
      setFormData((prev) => ({ ...prev, duration: autoDur }));
    }
  }, [formData.lessons]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugify(val),
    }));
  };

  // Upload ảnh từ máy tính cá nhân
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setFormData((prev) => ({ ...prev, thumbnail: dataUrl }));
      setSuccessMsg('Đã tải ảnh đại diện từ máy tính thành công!');
      setTimeout(() => setSuccessMsg(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // 1. Thêm 1 video YouTube đơn lẻ
  const handleAddSingleVideo = async () => {
    if (!singleVideoUrl.trim()) return;
    setFetchingVideo(true);
    setError(null);

    try {
      const res = await getYoutubeVideoInfo(singleVideoUrl.trim());
      if (res.success && res.data) {
        const info = res.data;
        const newLesson = {
          order: formData.lessons.length + 1,
          title: info.title || `Bài học ${formData.lessons.length + 1}`,
          youtubeUrl: info.youtubeUrl || singleVideoUrl.trim(),
          videoId: info.videoId || '',
          thumbnail: info.thumbnail || `https://i.ytimg.com/vi/${info.videoId}/hqdefault.jpg`,
          duration: info.duration || '15:00',
          fileName: '',
          fileUrl: '',
        };

        setFormData((prev) => ({
          ...prev,
          lessons: [...prev.lessons, newLesson],
        }));
        setSingleVideoUrl('');
        setSuccessMsg(`Đã thêm bài học: "${newLesson.title}"`);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setError(res.message || 'Không thể lấy thông tin video');
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi lấy thông tin video');
    } finally {
      setFetchingVideo(false);
    }
  };

  // 2. Nạp toàn bộ bài học từ Playlist YouTube
  const handleLoadFromPlaylist = async () => {
    if (!playlistInputUrl.trim()) return;
    setFetchingPlaylist(true);
    setError(null);

    try {
      const res = await getYoutubePlaylistInfo(playlistInputUrl.trim());
      if (res.success && res.data?.items?.length > 0) {
        const loadedLessons = res.data.items.map((item, index) => ({
          order: index + 1,
          title: item.title,
          youtubeUrl: item.youtubeUrl,
          videoId: item.videoId,
          thumbnail: item.thumbnail,
          duration: item.duration || '15:00',
          fileName: '',
          fileUrl: '',
        }));

        setFormData((prev) => ({
          ...prev,
          youtubePlaylistUrl: playlistInputUrl.trim(),
          thumbnail: prev.thumbnail || res.data.thumbnail,
          lessons: loadedLessons,
        }));
        setSuccessMsg(`Đã nạp tự động thành công ${loadedLessons.length} bài học từ Playlist!`);
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setError('Không tìm thấy video trong playlist hoặc playlist ở chế độ riêng tư.');
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tải playlist YouTube');
    } finally {
      setFetchingPlaylist(false);
    }
  };

  // Lesson Management
  const handleAddManualLesson = () => {
    const nextOrder = formData.lessons.length + 1;
    const newLesson = {
      order: nextOrder,
      title: `Bài ${nextOrder}: `,
      youtubeUrl: '',
      videoId: '',
      thumbnail: '',
      duration: '15:00',
      fileName: '',
      fileUrl: '',
    };
    setFormData((prev) => ({
      ...prev,
      lessons: [...prev.lessons, newLesson],
    }));
  };

  const handleLessonChange = (index, field, value) => {
    const updated = [...formData.lessons];
    updated[index][field] = value;

    // Nếu người dùng dán link youtube vào ô bài học, tự động trích xuất videoId
    if (field === 'youtubeUrl') {
      const vidMatch = value.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (vidMatch && vidMatch[1]) {
        updated[index].videoId = vidMatch[1];
        if (!updated[index].thumbnail) {
          updated[index].thumbnail = `https://i.ytimg.com/vi/${vidMatch[1]}/hqdefault.jpg`;
        }
      }
    }

    setFormData((prev) => ({ ...prev, lessons: updated }));
  };

  const handleRemoveLesson = (index) => {
    if (formData.lessons.length <= 1) {
      alert('Khóa học cần có ít nhất 1 bài học.');
      return;
    }
    const updated = formData.lessons
      .filter((_, idx) => idx !== index)
      .map((lesson, idx) => ({ ...lesson, order: idx + 1 }));
    setFormData((prev) => ({ ...prev, lessons: updated }));
  };

  const handleMoveLesson = (index, direction) => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= formData.lessons.length) return;

    const updated = [...formData.lessons];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;

    const reordered = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    setFormData((prev) => ({ ...prev, lessons: reordered }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category) {
      setError('Vui lòng nhập Tên khóa học và Chọn chủ đề.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Đảm bảo các bài học đều có videoId
    for (let i = 0; i < formData.lessons.length; i++) {
      const l = formData.lessons[i];
      if (!l.videoId && l.youtubeUrl) {
        const m = l.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (m) l.videoId = m[1];
      }
      if (!l.videoId) {
        setError(`Bài học số ${i + 1} (${l.title || 'Chưa đặt tên'}) chưa có Video ID hoặc Link YouTube hợp lệ.`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const shortDesc =
        formData.description.length > 280
          ? formData.description.substring(0, 275) + '...'
          : formData.description || `Khóa học thực chiến ${formData.title}`;

      const payload = {
        ...formData,
        shortDescription: shortDesc,
        description: formData.description || shortDesc,
        videoCount: formData.lessons.length,
      };

      const res = await createCourse(payload);
      if (res.success) {
        setSuccessMsg('Tạo khóa học thành công!');
        setTimeout(() => {
          router.push('/admin/courses');
        }, 1200);
      } else {
        setError(res.message || 'Không thể tạo khóa học.');
      }
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra khi lưu khóa học.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <Link
          href="/admin/courses"
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
          <span>Quay lại danh sách khóa học</span>
        </Link>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--secondary)' }}>
          Thêm Khóa Học Mới
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
        {/* PHẦN 1: THÔNG TIN KHÓA HỌC */}
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
            <Layers size={20} color="var(--primary)" />
            <span>1. Thông tin khóa học</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
            {/* Tên khóa học */}
            <div className="form-group">
              <label className="form-label">Tên khóa học *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Lập trình Web Full-stack với Next.js và AI"
                className="form-input"
                value={formData.title}
                onChange={handleTitleChange}
              />
            </div>

            {/* Chủ đề & Cấp độ & Tổng thời lượng */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Chuyên mục / Chủ đề *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cấp độ học viên</label>
                <select
                  className="form-select"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option value="beginner">Cơ bản (Người mới bắt đầu)</option>
                  <option value="intermediate">Trung cấp</option>
                  <option value="advanced">Nâng cao</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Tổng thời lượng (Tự động tính)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.3rem', backgroundColor: '#F8FAFC' }}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    title="Hệ thống tự động cộng dồn thời lượng từ danh sách bài học bên dưới"
                  />
                  <Clock
                    size={16}
                    color="var(--primary)"
                    style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </div>
            </div>

            {/* Hình đại diện (Upload từ máy tính / Paste URL) */}
            <div className="form-group">
              <label className="form-label">Hình đại diện khóa học (Thumbnail)</label>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                {/* Thumbnail Preview */}
                <div
                  style={{
                    width: '140px',
                    height: '84px',
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {formData.thumbnail ? (
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <ImageIcon size={28} color="var(--text-light)" />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {/* Upload button */}
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-outline btn-sm"
                    >
                      <Upload size={15} />
                      <span>Chọn ảnh từ máy tính</span>
                    </button>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Hỗ trợ JPG, PNG, WebP (Tối đa 5MB)
                    </span>
                  </div>

                  {/* Or input URL */}
                  <input
                    type="text"
                    placeholder="Hoặc dán trực tiếp đường link ảnh (URL)..."
                    className="form-input"
                    style={{ fontSize: '0.86rem', padding: '0.45rem 0.75rem' }}
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Mô tả khóa học */}
            <div className="form-group">
              <label className="form-label">Mô tả khóa học *</label>
              <textarea
                rows={4}
                required
                placeholder="Giới thiệu mục tiêu, kiến thức và sản phẩm học viên sẽ hoàn thành sau khóa học..."
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Trạng thái & Nổi bật */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <label htmlFor="featured" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--secondary)', cursor: 'pointer' }}>
                  Khóa học Nổi bật (Hiển thị tại Trang chủ)
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--secondary)' }}>
                  Trạng thái:
                </label>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.88rem' }}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="published">Công khai ngay</option>
                  <option value="draft">Lưu bản nháp</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* PHẦN 2: DANH SÁCH BÀI HỌC & YOUTUBE */}
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
                <Youtube size={22} color="#DC2626" />
                <span>2. Danh sách bài học video ({formData.lessons.length} bài)</span>
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Tự động load Tên video, Thumbnail và Thời lượng từ YouTube.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddManualLesson}
              className="btn btn-outline btn-sm"
            >
              <Plus size={16} />
              <span>+ Thêm ô bài học</span>
            </button>
          </div>

          {/* Quick YouTube Tool Box */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 'var(--radius)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* 1. Nạp từ Playlist YouTube */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.4rem', display: 'block' }}>
                ⚡ Cách 1: Nạp hàng loạt từ Playlist YouTube
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Dán link Playlist (ví dụ: https://www.youtube.com/playlist?list=PL...)"
                  className="form-input"
                  style={{ flex: 1, minWidth: '260px', fontSize: '0.88rem' }}
                  value={playlistInputUrl}
                  onChange={(e) => setPlaylistInputUrl(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleLoadFromPlaylist}
                  disabled={fetchingPlaylist || !playlistInputUrl.trim()}
                  className="btn btn-primary btn-sm"
                  style={{ minWidth: '150px' }}
                >
                  {fetchingPlaylist ? (
                    <span>Đang nạp video...</span>
                  ) : (
                    <>
                      <RefreshCw size={15} />
                      <span>Nạp toàn bộ Playlist</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            {/* 2. Thêm từng video lẻ */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.4rem', display: 'block' }}>
                ➕ Cách 2: Thêm từng video đơn lẻ
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Dán link Video (ví dụ: https://www.youtube.com/watch?v=... hoặc https://youtu.be/...)"
                  className="form-input"
                  style={{ flex: 1, minWidth: '260px', fontSize: '0.88rem' }}
                  value={singleVideoUrl}
                  onChange={(e) => setSingleVideoUrl(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddSingleVideo}
                  disabled={fetchingVideo || !singleVideoUrl.trim()}
                  className="btn btn-outline-primary btn-sm"
                  style={{ minWidth: '140px' }}
                >
                  {fetchingVideo ? (
                    <span>Đang lấy info...</span>
                  ) : (
                    <>
                      <Plus size={15} />
                      <span>Thêm video này</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Lessons List Editor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {formData.lessons.map((lesson, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '1rem',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                {/* Lesson Thumbnail & Order */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-alt)',
                      border: '1px solid var(--border)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {lesson.order}
                  </span>

                  <div
                    style={{
                      width: '84px',
                      height: '52px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      backgroundColor: '#000',
                      flexShrink: 0,
                    }}
                  >
                    {lesson.thumbnail ? (
                      <img
                        src={lesson.thumbnail}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                        <Youtube size={20} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Lesson Details Form */}
                <div style={{ flex: 1, minWidth: '240px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Tên bài học..."
                      className="form-input"
                      style={{ fontSize: '0.88rem', padding: '0.45rem 0.65rem' }}
                      value={lesson.title}
                      onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Link YouTube..."
                      className="form-input"
                      style={{ fontSize: '0.88rem', padding: '0.45rem 0.65rem' }}
                      value={lesson.youtubeUrl}
                      onChange={(e) => handleLessonChange(index, 'youtubeUrl', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      Thời lượng:
                    </span>
                    <input
                      type="text"
                      placeholder="15:00"
                      className="form-input"
                      style={{ fontSize: '0.82rem', padding: '0.35rem 0.5rem', width: '90px' }}
                      value={lesson.duration}
                      onChange={(e) => handleLessonChange(index, 'duration', e.target.value)}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Tài liệu đính kèm (URL - tùy chọn)"
                      className="form-input"
                      style={{ fontSize: '0.82rem', padding: '0.35rem 0.5rem' }}
                      value={lesson.fileUrl}
                      onChange={(e) => handleLessonChange(index, 'fileUrl', e.target.value)}
                    />
                  </div>
                </div>

                {/* Actions: Move Up / Down / Remove */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: 'auto' }}>
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveLesson(index, 'up')}
                    className="btn btn-ghost btn-sm"
                    title="Lên"
                    style={{ opacity: index === 0 ? 0.3 : 1, padding: '0.3rem' }}
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={index === formData.lessons.length - 1}
                    onClick={() => handleMoveLesson(index, 'down')}
                    className="btn btn-ghost btn-sm"
                    title="Xuống"
                    style={{ opacity: index === formData.lessons.length - 1 ? 0.3 : 1, padding: '0.3rem' }}
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveLesson(index)}
                    className="btn btn-ghost btn-sm"
                    title="Xóa bài học"
                    style={{ color: 'var(--danger)', padding: '0.3rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleAddManualLesson}
              className="btn btn-outline btn-sm"
              style={{ width: '100%' }}
            >
              <Plus size={16} />
              <span>+ Thêm bài học tiếp theo</span>
            </button>
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
          <Link href="/admin/courses" className="btn btn-outline">
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
                <span>Lưu khóa học</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
