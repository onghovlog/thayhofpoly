'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { SITE_CONFIG } from '@/utils/constants';
import { Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <Breadcrumb items={[{ label: 'Liên hệ' }]} />

        <div style={{ marginBottom: '3rem' }}>
          <span className="section-tag">Kết nối & Hợp tác</span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--secondary)', marginBottom: '0.6rem' }}>
            Liên hệ với Thầy HOTB
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '680px' }}>
            Bạn có câu hỏi về khóa học, muốn đóng góp ý kiến hoặc đề xuất hợp tác đào tạo? Hãy gửi tin nhắn qua biểu mẫu dưới đây.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
          }}
          className="contact-layout"
        >
          {/* Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {submitted ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--success-bg)',
                    color: 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <CheckCircle2 size={30} />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--secondary)', marginBottom: '0.6rem' }}>
                  Tin nhắn đã được gửi thành công!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Cảm ơn bạn đã liên hệ. Thầy HOTB sẽ phản hồi lại bạn qua email sớm nhất có thể.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="btn btn-outline"
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Họ và tên của bạn *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Địa chỉ Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Chủ đề liên hệ</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-input"
                    placeholder="Hỏi về khóa học / Góp ý / Hợp tác..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nội dung tin nhắn *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                    placeholder="Nhập nội dung chi tiết bạn muốn trao đổi..."
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Send size={16} />
                  <span>Gửi tin nhắn ngay</span>
                </button>
              </form>
            )}
          </div>

          {/* Info Sidebar */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '1.25rem' }}>
                  Thông tin kết nối
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <Mail size={18} color="var(--primary)" style={{ marginTop: '0.2rem' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>Email hỗ trợ</div>
                      <div style={{ color: 'var(--text-muted)' }}>{SITE_CONFIG.socialLinks.email}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <MapPin size={18} color="var(--primary)" style={{ marginTop: '0.2rem' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>Địa điểm</div>
                      <div style={{ color: 'var(--text-muted)' }}>{SITE_CONFIG.socialLinks.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                }}
              >
                <h4 style={{ fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                  Cộng đồng & Nhóm học tập
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Tham gia theo dõi kênh YouTube của Thầy HOTB để thảo luận trực tiếp dưới phần bình luận của từng bài giảng.
                </p>
                <a
                  href={SITE_CONFIG.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  Kênh YouTube Thầy HOTB
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
