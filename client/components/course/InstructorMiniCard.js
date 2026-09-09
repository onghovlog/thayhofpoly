'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { SITE_CONFIG } from '@/utils/constants';

const DEFAULT_AVATAR =
  SITE_CONFIG.instructor?.avatar ||
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

export default function InstructorMiniCard({ instructor, youtubePlaylistUrl }) {
  const [imgSrc, setImgSrc] = useState(() => {
    if (instructor?.avatar && !instructor.avatar.includes('instructor-avatar.jpg')) {
      return instructor.avatar;
    }
    return DEFAULT_AVATAR;
  });

  const name = instructor?.name || SITE_CONFIG.instructor?.name || 'Thầy HOTB';
  const title = instructor?.title || SITE_CONFIG.instructor?.title || 'Giảng viên Thiết kế & CNTT';
  const bio =
    instructor?.bio ||
    SITE_CONFIG.instructor?.bio ||
    'Đào tạo thực chiến theo định hướng Học → Làm → Tạo sản phẩm.';

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        backgroundColor: '#FFFFFF',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <h4
        style={{
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontWeight: 700,
          color: 'var(--text-muted)',
          marginBottom: '1rem',
        }}
      >
        Giảng viên hướng dẫn
      </h4>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
        <img
          src={imgSrc}
          alt={name}
          onError={() => setImgSrc(DEFAULT_AVATAR)}
          style={{
            width: '3.4rem',
            height: '3.4rem',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--primary-light)',
            flexShrink: 0,
          }}
        />
        <div>
          <h5 style={{ fontSize: '1.08rem', color: 'var(--secondary)', marginBottom: '0.2rem' }}>
            {name}
          </h5>
          <p style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
            {title}
          </p>
        </div>
      </div>

      <p
        style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          marginBottom: '1.25rem',
        }}
      >
        {bio}
      </p>

      {youtubePlaylistUrl && (
        <a
          href={youtubePlaylistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <span>Xem playlist YouTube</span>
          <ExternalLink size={15} />
        </a>
      )}
    </div>
  );
}
