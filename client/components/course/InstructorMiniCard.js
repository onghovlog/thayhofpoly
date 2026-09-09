'use client';

import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { SITE_CONFIG } from '@/utils/constants';
import { getInstructorProfile } from '@/services/instructorService';

const DEFAULT_AVATAR =
  SITE_CONFIG.instructor?.avatar ||
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

export default function InstructorMiniCard({ instructor, youtubePlaylistUrl }) {
  const [profile, setProfile] = useState({
    name: instructor?.name || SITE_CONFIG.instructor?.name || 'Thầy HOTB',
    title: instructor?.title || SITE_CONFIG.instructor?.title || 'Giảng viên Thiết kế & CNTT',
    avatar:
      instructor?.avatar && !instructor.avatar.includes('instructor-avatar.jpg')
        ? instructor.avatar
        : DEFAULT_AVATAR,
    bio:
      instructor?.bio ||
      SITE_CONFIG.instructor?.bio ||
      'Hơn 10 năm kinh nghiệm giảng dạy và thực chiến trong ngành Thiết kế đồ họa, Web & Marketing.',
  });

  // Tải dữ liệu giảng viên mới nhất từ Database (/api/instructor)
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const res = await getInstructorProfile();
        if (res.success && res.data) {
          const d = res.data;
          setProfile((prev) => ({
            name: d.name || prev.name,
            title: d.title || prev.title,
            avatar:
              d.avatar && !d.avatar.includes('instructor-avatar.jpg')
                ? d.avatar
                : prev.avatar || DEFAULT_AVATAR,
            bio: d.bio || prev.bio,
          }));
        }
      } catch (error) {
        // Giữ nguyên dữ liệu khởi tạo nếu có lỗi mạng
      }
    };

    fetchLatestProfile();
  }, [instructor]);

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
          src={profile.avatar}
          alt={profile.name}
          onError={(e) => {
            e.target.src = DEFAULT_AVATAR;
          }}
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
            {profile.name}
          </h5>
          <p style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
            {profile.title}
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
        {profile.bio}
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
