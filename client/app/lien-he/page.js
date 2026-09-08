'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { SITE_CONFIG } from '@/utils/constants';
import { getPublicSettings } from '@/services/settingService';
import { submitContact } from '@/services/contactService';
import { Mail, MapPin, Send, CheckCircle2, Phone, RefreshCw, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [siteSettings, setSiteSettings] = useState({
    contactEmail: 'tranbaho@gmail.com',
    hotline: '0988 123 456',
    address: 'Cao đẳng FPT Polytechnic',
    youtube: 'https://www.youtube.com/@thayhotb',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getPublicSettings();
        if (res.success && res.data) {
          setSiteSettings((prev) => ({
            ...prev,
            ...res.data,
          }));
        }
      } catch (e) {
        // Silently fallback to defaults
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await submitContact({
        ...formData,
        type: 'contact',
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.message || 'Lỗi khi gửi tin nhắn');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
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
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Cảm ơn bạn đã liên hệ. Thông tin của bạn đã được chuyển đến hòm thư Admin (<strong>{siteSettings.contactEmail}</strong>). Thầy HOTB sẽ phản hồi lại bạn sớm nhất có thể.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="btn btn-outline"
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {errorMsg && (
                  <div
                    style={{
                      backgroundColor: '#FEE2E2',
                      border: '1px solid #FCA5A5',
                      color: '#B91C1C',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius)',
                      marginBottom: '1.25rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
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

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Số điện thoại / Zalo</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="form-input"
                      placeholder="0912 345 678"
                    />
                  </div>
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

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', height: '3rem', fontSize: '1rem' }}
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Đang gửi tin nhắn...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Gửi tin nhắn ngay</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info Sidebar */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '1.25rem' }}>
                  Thông tin kết nối
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <Mail size={18} color="var(--primary)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>Email hỗ trợ</div>
                      <div style={{ color: 'var(--text-muted)' }}>
                        <a href={`mailto:${siteSettings.contactEmail}`} style={{ color: 'var(--primary)' }}>
                          {siteSettings.contactEmail}
                        </a>
                      </div>
                    </div>
                  </div>

                  {siteSettings.hotline && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <Phone size={18} color="var(--primary)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>Hotline / Zalo</div>
                        <div style={{ color: 'var(--text-muted)' }}>
                          <a href={`tel:${siteSettings.hotline}`} style={{ color: 'var(--secondary)' }}>
                            {siteSettings.hotline}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <MapPin size={18} color="var(--primary)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>Địa điểm</div>
                      <div style={{ color: 'var(--text-muted)' }}>{siteSettings.address}</div>
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
                  href={siteSettings.youtube || SITE_CONFIG.socialLinks.youtube}
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
