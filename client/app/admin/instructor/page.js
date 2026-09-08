'use client';

import { useState, useEffect, useRef } from 'react';
import { getInstructorProfile, updateInstructorProfile } from '@/services/instructorService';
import {
  User,
  Save,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Youtube,
  Facebook,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Award,
  RefreshCw,
  ExternalLink,
  Eye,
} from 'lucide-react';

export default function AdminInstructorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const avatarFileInputRef = useRef(null);
  const coverFileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    avatar: '',
    cover: '',
    bio: '',
    philosophy: '',
    highlights: ['', '', ''],
    stats: [
      { label: 'Năm giảng dạy', value: '10+' },
      { label: 'Học viên đã hướng dẫn', value: '5,000+' },
      { label: 'Video bài giảng', value: '200+' },
      { label: 'Dự án thực tế', value: '100+' },
    ],
    socialLinks: {
      youtube: '',
      facebook: '',
      linkedin: '',
      github: '',
      email: '',
      phone: '',
      zalo: '',
      address: '',
    },
  });

  const loadProfile = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await getInstructorProfile();
      if (res.success && res.data) {
        const d = res.data;
        setFormData({
          name: d.name || 'Thầy HOTB',
          title: d.title || 'Giảng viên Thiết kế đồ họa & Công nghệ thông tin',
          avatar: d.avatar || '',
          cover: d.cover || '',
          bio: d.bio || '',
          philosophy: d.philosophy || '',
          highlights: d.highlights?.length === 3 ? d.highlights : [
            d.highlights?.[0] || 'Thực chiến 100% qua dự án',
            d.highlights?.[1] || 'Dễ hiểu cho người mới',
            d.highlights?.[2] || 'Hoàn toàn miễn phí',
          ],
          stats: d.stats?.length === 4 ? d.stats : [
            { label: 'Năm giảng dạy', value: '10+' },
            { label: 'Học viên đã hướng dẫn', value: '5,000+' },
            { label: 'Video bài giảng', value: '200+' },
            { label: 'Dự án thực tế', value: '100+' },
          ],
          socialLinks: {
            youtube: d.socialLinks?.youtube || '',
            facebook: d.socialLinks?.facebook || '',
            linkedin: d.socialLinks?.linkedin || '',
            github: d.socialLinks?.github || '',
            email: d.socialLinks?.email || '',
            phone: d.socialLinks?.phone || '',
            zalo: d.socialLinks?.zalo || '',
            address: d.socialLinks?.address || '',
          },
        });
      }
    } catch (err) {
      console.error('Lỗi khi tải thông tin giảng viên:', err);
      setErrorMsg('Không thể tải thông tin giảng viên. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Xử lý upload avatar từ máy tính
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Vui lòng chọn ảnh có kích thước dưới 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, avatar: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý upload cover từ máy tính
  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Vui lòng chọn ảnh có kích thước dưới 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, cover: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setFormData({ ...formData, stats: newStats });
  };

  const handleSocialChange = (field, value) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg('');

    try {
      const res = await updateInstructorProfile(formData);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMsg(res.message || 'Lỗi khi lưu thông tin');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra khi lưu thông tin giảng viên');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
        <p>Đang tải thông tin giảng viên...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Page Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--secondary)' }}>
              Quản trị Thông tin Giảng viên
            </h1>
            <span className="badge" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', fontWeight: 600 }}>
              Hồ sơ cá nhân
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tùy chỉnh thông tin giảng viên, triết lý đào tạo, thành tích và kênh truyền thông hiển thị trên trang chủ & trang giới thiệu.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a
            href="/#giang-vien"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <Eye size={16} />
            <span>Xem trên Website</span>
          </a>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="btn btn-primary"
            style={{ minWidth: '150px' }}
          >
            {saving ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccess && (
        <div
          style={{
            backgroundColor: '#DCFCE7',
            border: '1px solid #86EFAC',
            color: '#15803D',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 600,
            fontSize: '0.95rem',
          }}
        >
          <CheckCircle2 size={20} color="#16A34A" />
          <span>Thông tin giảng viên đã được lưu thành công và cập nhật ngay trên toàn hệ thống!</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
            fontSize: '0.95rem',
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
          {/* Main Left Form Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Card 1: Thông tin cơ bản */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--secondary)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <User size={19} color="var(--primary)" />
                <span>Thông tin cá nhân & Danh xưng</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Họ và Tên Giảng viên *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Ví dụ: Thầy HOTB"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Danh xưng / Chức vụ hiển thị *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    placeholder="Ví dụ: Giảng viên Thiết kế đồ họa & CNTT"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Email liên hệ</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={formData.socialLinks.email}
                      onChange={(e) => handleSocialChange('email', e.target.value)}
                      className="form-input"
                      placeholder="hotb@fpoly.edu.vn"
                      style={{ paddingLeft: '2.4rem' }}
                    />
                    <Mail
                      size={16}
                      style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Số điện thoại / Hotline</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={formData.socialLinks.phone}
                      onChange={(e) => handleSocialChange('phone', e.target.value)}
                      className="form-input"
                      placeholder="0988 123 456"
                      style={{ paddingLeft: '2.4rem' }}
                    />
                    <Phone
                      size={16}
                      style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Số Zalo tư vấn</label>
                  <input
                    type="text"
                    value={formData.socialLinks.zalo}
                    onChange={(e) => handleSocialChange('zalo', e.target.value)}
                    className="form-input"
                    placeholder="0988 123 456"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nơi công tác / Trụ sở</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={formData.socialLinks.address}
                      onChange={(e) => handleSocialChange('address', e.target.value)}
                      className="form-input"
                      placeholder="Cao đẳng FPT Polytechnic"
                      style={{ paddingLeft: '2.4rem' }}
                    />
                    <MapPin
                      size={16}
                      style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Tiểu sử & Triết lý giảng dạy */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--secondary)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Sparkles size={19} color="var(--primary)" />
                <span>Tiểu sử & Triết lý đào tạo</span>
              </h3>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Tiểu sử ngắn (Giới thiệu chung)</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="form-textarea"
                  placeholder="Hơn 10 năm kinh nghiệm giảng dạy và thực chiến tại các trường cao đẳng, đại học..."
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
                  Đoạn giới thiệu xuất hiện đầu tiên trong khối giảng viên ở trang chủ và trang giới thiệu.
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Trích dẫn Triết lý giảng dạy (Quote)</label>
                <textarea
                  rows={3}
                  value={formData.philosophy}
                  onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
                  className="form-textarea"
                  placeholder="Kiến thức không có giá trị nếu không được đưa vào thực hành..."
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
                  Được hiển thị trong khung trích dẫn nổi bật viền cam.
                </span>
              </div>

              {/* 3 Điểm nổi bật / Giá trị cốt lõi */}
              <div className="form-group">
                <label className="form-label" style={{ marginBottom: '0.75rem' }}>
                  3 Điểm nổi bật / Giá trị cốt lõi
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {formData.highlights.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: '#FFF7ED',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleHighlightChange(idx, e.target.value)}
                        className="form-input"
                        placeholder={`Điểm nổi bật ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: 4 Chỉ số thành tích (Stats) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--secondary)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Award size={19} color="var(--primary)" />
                <span>4 Chỉ số thành tích & Số liệu nổi bật</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {formData.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1rem',
                      backgroundColor: 'var(--bg-alt)',
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Chỉ số #{idx + 1}
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.6rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Số lượng / Con số
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                        className="form-input"
                        placeholder="10+, 5,000+,..."
                        style={{ fontWeight: 700, color: 'var(--primary)' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Nhãn mô tả
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                        className="form-input"
                        placeholder="Năm giảng dạy,..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Kênh mạng xã hội */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--secondary)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Youtube size={19} color="#EF4444" />
                <span>Kênh mạng xã hội & Liên kết ngoài</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Youtube size={16} color="#EF4444" />
                    <span>YouTube Channel URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => handleSocialChange('youtube', e.target.value)}
                    className="form-input"
                    placeholder="https://www.youtube.com/@thayhotb"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Facebook size={16} color="#2563EB" />
                    <span>Facebook URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    className="form-input"
                    placeholder="https://www.facebook.com/thayhotb"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Linkedin size={16} color="#0284C7" />
                    <span>LinkedIn Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    className="form-input"
                    placeholder="https://www.linkedin.com/in/thayhotb"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Github size={16} color="#0F172A" />
                    <span>GitHub Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) => handleSocialChange('github', e.target.value)}
                    className="form-input"
                    placeholder="https://github.com/thayhotb"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Submit Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={loadProfile}
                className="btn btn-outline"
                disabled={saving}
              >
                Khôi phục ban đầu
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-lg"
                style={{ minWidth: '180px' }}
              >
                {saving ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Lưu tất cả thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Sidebar Column: Avatar, Cover & Live Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'sticky', top: '5.5rem' }}>
            {/* Card: Ảnh đại diện & Ảnh bìa */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--secondary)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <ImageIcon size={18} color="var(--primary)" />
                <span>Ảnh đại diện (Avatar)</span>
              </h3>

              {/* Avatar Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid var(--primary-light)',
                    boxShadow: 'var(--shadow-md)',
                    backgroundColor: '#F1F5F9',
                    marginBottom: '1rem',
                  }}
                >
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={formData.name || 'Avatar'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <User size={48} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Upload size={15} />
                    <span>Chọn từ máy</span>
                  </button>
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* Avatar URL Input */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>
                  Hoặc nhập URL ảnh Avatar:
                </label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="form-input"
                  placeholder="https://..."
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              {/* Cover Image Section */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
                  Ảnh bìa (Cover Banner)
                </h4>
                
                {formData.cover && (
                  <div
                    style={{
                      width: '100%',
                      height: '100px',
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden',
                      marginBottom: '0.75rem',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <img
                      src={formData.cover}
                      alt="Cover"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Upload size={15} />
                    <span>Tải ảnh bìa</span>
                  </button>
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    style={{ display: 'none' }}
                  />
                </div>

                <input
                  type="text"
                  value={formData.cover}
                  onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                  className="form-input"
                  placeholder="https://... URL ảnh bìa"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Card: Live Preview Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--secondary)', fontWeight: 700 }}>
                  Xem trước trực tiếp (Live Preview)
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, backgroundColor: '#FFF7ED', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  Home Section
                </span>
              </div>

              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-alt)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    margin: '0 auto 0.75rem',
                    border: '2px solid var(--primary)',
                  }}
                >
                  <img
                    src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)' }}>
                  {formData.name || 'Thầy HOTB'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
                  {formData.title || 'Giảng viên'}
                </div>

                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.75rem', textAlign: 'left' }}>
                  {formData.bio?.slice(0, 100) || 'Tiểu sử...'}...
                </p>

                {/* 4 Stats Preview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                  {formData.stats.map((s, idx) => (
                    <div key={idx} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
