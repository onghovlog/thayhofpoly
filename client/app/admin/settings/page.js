'use client';

import { useState, useEffect } from 'react';
import { getAdminSettings, updateSettings } from '@/services/settingService';
import {
  Settings,
  Mail,
  Save,
  Globe,
  Phone,
  MapPin,
  Youtube,
  Facebook,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Server,
  AlertCircle,
  Eye,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    adminEmail: 'tranbaho@gmail.com',
    siteName: 'THẦY HOTB',
    siteTitle: 'Thầy HOTB Learning Hub - Kho kiến thức thực chiến',
    slogan: 'Học thực chiến. Làm được việc.',
    contactEmail: 'tranbaho@gmail.com',
    hotline: '0988 123 456',
    address: 'Cao đẳng FPT Polytechnic',
    facebook: 'https://www.facebook.com/thayhotb',
    youtube: 'https://www.youtube.com/@thayhotb',
    zalo: '0988 123 456',
    smtp: {
      enabled: false,
      host: 'smtp.gmail.com',
      port: 587,
      user: '',
      pass: '',
      fromName: 'Thầy HOTB Learning Hub',
      fromEmail: '',
    },
  });

  const loadSettings = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await getAdminSettings();
      if (res.success && res.data) {
        const d = res.data;
        setFormData({
          adminEmail: d.adminEmail || 'tranbaho@gmail.com',
          siteName: d.siteName || 'THẦY HOTB',
          siteTitle: d.siteTitle || 'Thầy HOTB Learning Hub - Kho kiến thức thực chiến',
          slogan: d.slogan || 'Học thực chiến. Làm được việc.',
          contactEmail: d.contactEmail || 'tranbaho@gmail.com',
          hotline: d.hotline || '0988 123 456',
          address: d.address || 'Cao đẳng FPT Polytechnic',
          facebook: d.facebook || 'https://www.facebook.com/thayhotb',
          youtube: d.youtube || 'https://www.youtube.com/@thayhotb',
          zalo: d.zalo || '0988 123 456',
          smtp: {
            enabled: d.smtp?.enabled || false,
            host: d.smtp?.host || 'smtp.gmail.com',
            port: d.smtp?.port || 587,
            user: d.smtp?.user || '',
            pass: d.smtp?.pass || '',
            fromName: d.smtp?.fromName || 'Thầy HOTB Learning Hub',
            fromEmail: d.smtp?.fromEmail || '',
          },
        });
      }
    } catch (err) {
      console.error('Lỗi khi tải cài đặt:', err);
      setErrorMsg('Không thể tải cài đặt hệ thống. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg('');

    try {
      const res = await updateSettings(formData);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMsg(res.message || 'Lỗi khi lưu cài đặt');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra khi lưu cài đặt hệ thống');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
        <p>Đang tải cấu hình hệ thống...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
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
              Cài đặt Hệ thống & Website
            </h1>
            <span className="badge" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', fontWeight: 600 }}>
              Cấu hình cơ bản
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Quản lý email nhận thông báo biểu mẫu, thông tin thương hiệu, hotline liên hệ và cấu hình email.
          </p>
        </div>

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
              <span>Lưu cấu hình</span>
            </>
          )}
        </button>
      </div>

      {/* Success Alert */}
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
          <span>Cấu hình hệ thống đã được cập nhật thành công!</span>
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Card 1: Email Admin nhận thông báo */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid var(--primary-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius)',
                backgroundColor: '#FFF7ED',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Mail size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>
              Email Admin nhận thông báo Form
            </h3>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            Mọi biểu mẫu từ trang <strong>Liên hệ (/lien-he)</strong> và form <strong>Đăng ký tư vấn 1 kèm 1</strong> trên trang chủ sẽ tự động gửi thông tin tới địa chỉ email quản trị này.
          </p>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontWeight: 700, color: 'var(--secondary)' }}>
              Địa chỉ Email Quản trị (Admin Email) *
            </label>
            <div style={{ position: 'relative', maxWidth: '500px' }}>
              <input
                type="email"
                required
                value={formData.adminEmail}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                className="form-input"
                placeholder="tranbaho@gmail.com"
                style={{ paddingLeft: '2.5rem', fontWeight: 600, fontSize: '1rem', color: 'var(--primary)' }}
              />
              <Mail
                size={18}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}
              />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
              Mặc định: <strong>tranbaho@gmail.com</strong>
            </span>
          </div>
        </div>

        {/* Card 2: Thông tin website & Liên hệ công khai */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius)',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Globe size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>
              Thông tin Website & Liên hệ công khai
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Tên Website / Thương hiệu *</label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="form-input"
                placeholder="THẦY HOTB"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Slogan thương hiệu</label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="form-input"
                placeholder="Học thực chiến. Làm được việc."
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Tiêu đề Website (SEO Title)</label>
            <input
              type="text"
              value={formData.siteTitle}
              onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
              className="form-input"
              placeholder="Thầy HOTB Learning Hub - Kho kiến thức thực chiến"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Email hỗ trợ hiển thị trên website</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="form-input"
                placeholder="tranbaho@gmail.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hotline / Số điện thoại</label>
              <input
                type="text"
                value={formData.hotline}
                onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                className="form-input"
                placeholder="0988 123 456"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Số Zalo tư vấn</label>
              <input
                type="text"
                value={formData.zalo}
                onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                className="form-input"
                placeholder="0988 123 456"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Địa chỉ / Nơi công tác</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="form-input"
                placeholder="Cao đẳng FPT Polytechnic"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Kênh Mạng Xã Hội */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius)',
                backgroundColor: '#FEE2E2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Youtube size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>
              Kênh Mạng Xã Hội
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Youtube size={16} color="#EF4444" />
                <span>Kênh YouTube</span>
              </label>
              <input
                type="url"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                className="form-input"
                placeholder="https://www.youtube.com/@thayhotb"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Facebook size={16} color="#2563EB" />
                <span>Trang Facebook</span>
              </label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="form-input"
                placeholder="https://www.facebook.com/thayhotb"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Cấu hình Gửi Email SMTP (Tùy chọn) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius)',
                  backgroundColor: '#F3E8FF',
                  color: '#9333EA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Server size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>
                  Cấu hình Máy chủ Gửi Mail SMTP (Tùy chọn)
                </h3>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={formData.smtp.enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    smtp: { ...formData.smtp, enabled: e.target.checked },
                  })
                }
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <span>Bật gửi qua SMTP</span>
            </label>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Khi bật SMTP, hệ thống sẽ gửi email thật qua tài khoản Gmail hoặc máy chủ SMTP tùy chỉnh. Khi tắt, các tin nhắn vẫn được lưu trữ trong cơ sở dữ liệu và ghi log thông báo an toàn.
          </p>

          {formData.smtp.enabled && (
            <div style={{ backgroundColor: 'var(--bg-alt)', padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">SMTP Host</label>
                  <input
                    type="text"
                    value={formData.smtp.host}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        smtp: { ...formData.smtp, host: e.target.value },
                      })
                    }
                    className="form-input"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SMTP Port</label>
                  <input
                    type="number"
                    value={formData.smtp.port}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        smtp: { ...formData.smtp, port: Number(e.target.value) },
                      })
                    }
                    className="form-input"
                    placeholder="587"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tài khoản Email (User)</label>
                  <input
                    type="email"
                    value={formData.smtp.user}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        smtp: { ...formData.smtp, user: e.target.value },
                      })
                    }
                    className="form-input"
                    placeholder="email-gui-mail@gmail.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mật khẩu ứng dụng (App Password)</label>
                  <input
                    type="password"
                    value={formData.smtp.pass}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        smtp: { ...formData.smtp, pass: e.target.value },
                      })
                    }
                    className="form-input"
                    placeholder="Mật khẩu ứng dụng 16 ký tự"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tên người gửi (From Name)</label>
                  <input
                    type="text"
                    value={formData.smtp.fromName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        smtp: { ...formData.smtp, fromName: e.target.value },
                      })
                    }
                    className="form-input"
                    placeholder="Thầy HOTB Learning Hub"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email người gửi (From Email)</label>
                  <input
                    type="email"
                    value={formData.smtp.fromEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        smtp: { ...formData.smtp, fromEmail: e.target.value },
                      })
                    }
                    className="form-input"
                    placeholder="noreply@thayhotb.vn (hoặc để trống)"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="button"
            onClick={loadSettings}
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
                <span>Lưu toàn bộ cài đặt</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
