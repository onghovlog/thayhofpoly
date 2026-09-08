'use client';

import { useState } from 'react';
import { Youtube, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '@/utils/constants';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Sẵn sàng kết nối API sau này
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="section" style={{ backgroundColor: 'var(--secondary)', color: '#FFFFFF' }}>
      <div className="container">
        <div
          style={{
            maxWidth: '750px',
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              backgroundColor: '#1E293B',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <Youtube size={28} />
          </div>

          <h2 style={{ fontSize: '2rem', color: '#FFFFFF', marginBottom: '0.75rem', lineHeight: 1.25 }}>
            Không bỏ lỡ bài học mới
          </h2>

          <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '560px' }}>
            Đăng ký theo dõi kênh YouTube của Thầy HOTB và nhận thông báo ngay khi có bài giảng video hoặc tutorial mới.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', width: '100%', maxWidth: '520px', marginBottom: '1.5rem' }}>
            <a
              href={SITE_CONFIG.socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
              style={{ flex: '1 1 200px' }}
            >
              <Youtube size={20} />
              <span>Theo dõi kênh YouTube</span>
            </a>
          </div>

          {/* Email Subscription Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              width: '100%',
              maxWidth: '480px',
            }}
          >
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: '1 1 260px',
                padding: '0.7rem 1rem',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: 'var(--radius)',
                color: '#FFFFFF',
                outline: 'none',
                fontSize: '0.92rem',
              }}
            />
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: '#FFFFFF',
                color: 'var(--secondary)',
                fontWeight: 700,
                padding: '0.7rem 1.25rem',
              }}
            >
              <span>Đăng ký nhận tin</span>
            </button>
          </form>

          {submitted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ADE80', fontSize: '0.88rem', marginTop: '1rem' }}>
              <CheckCircle2 size={16} />
              <span>Cảm ơn bạn! Hệ thống đã ghi nhận email đăng ký nhận bài học.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
