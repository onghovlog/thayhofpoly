'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/services/authService';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@thayhotb.vn');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        router.push('/admin/dashboard');
      } else {
        setError(res.message || 'Email hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setError(err.message || 'Lỗi đăng nhập. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-alt)',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Brand Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/images/logo.png"
            alt="Thầy HOTB"
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: 'var(--radius)',
              objectFit: 'contain',
              margin: '0 auto 0.75rem',
            }}
          />
          <h1 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '0.3rem' }}>
            Đăng nhập Quản trị
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Hệ thống quản lý nội dung Thầy HOTB Learning Hub
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius)',
              fontSize: '0.88rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email quản trị</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="admin@thayhotb.vn"
              />
              <Mail
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
              />
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem' }}
          >
            <span>{loading ? 'Đang xác thực...' : 'Đăng nhập vào CMS'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Tài khoản demo: <strong>admin@thayhotb.vn</strong> / <strong>Admin@123456</strong>
        </div>
      </div>
    </div>
  );
}
