'use client';

import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '@/utils/constants';
import { getInstructorProfile } from '@/services/instructorService';
import { Youtube, Facebook, Linkedin, Github, CheckCircle2 } from 'lucide-react';

export default function InstructorSection() {
  const [profile, setProfile] = useState({
    name: SITE_CONFIG.instructor.name,
    title: SITE_CONFIG.instructor.title,
    avatar: SITE_CONFIG.instructor.avatar,
    bio: SITE_CONFIG.instructor.bio,
    philosophy: SITE_CONFIG.instructor.philosophy,
    highlights: [
      'Thực chiến 100% qua dự án',
      'Dễ hiểu cho người mới',
      'Hoàn toàn miễn phí',
    ],
    stats: SITE_CONFIG.instructor.stats,
    socialLinks: SITE_CONFIG.socialLinks,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getInstructorProfile();
        if (res.success && res.data) {
          const d = res.data;
          setProfile({
            name: d.name || SITE_CONFIG.instructor.name,
            title: d.title || SITE_CONFIG.instructor.title,
            avatar: d.avatar || SITE_CONFIG.instructor.avatar,
            bio: d.bio || SITE_CONFIG.instructor.bio,
            philosophy: d.philosophy || SITE_CONFIG.instructor.philosophy,
            highlights: d.highlights?.length ? d.highlights : [
              'Thực chiến 100% qua dự án',
              'Dễ hiểu cho người mới',
              'Hoàn toàn miễn phí',
            ],
            stats: d.stats?.length ? d.stats : SITE_CONFIG.instructor.stats,
            socialLinks: {
              youtube: d.socialLinks?.youtube || SITE_CONFIG.socialLinks.youtube,
              facebook: d.socialLinks?.facebook || SITE_CONFIG.socialLinks.facebook,
              linkedin: d.socialLinks?.linkedin || SITE_CONFIG.socialLinks.linkedin,
              github: d.socialLinks?.github || SITE_CONFIG.socialLinks.github,
            },
          });
        }
      } catch (err) {
        // Fallback to default constants silently
      }
    };

    fetchProfile();
  }, []);

  return (
    <section className="section" id="giang-vien">
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
          className="instructor-card-container"
        >
          {/* Instructor Image & Socials */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                position: 'relative',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid var(--primary-light)',
                marginBottom: '1.25rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--secondary)', marginBottom: '0.3rem' }}>
              {profile.name}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1.25rem' }}>
              {profile.title}
            </p>

            {/* Social Buttons */}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {profile.socialLinks.youtube && (
                <a
                  href={profile.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Channel"
                  style={{
                    width: '2.4rem',
                    height: '2.4rem',
                    borderRadius: 'var(--radius)',
                    backgroundColor: '#FEE2E2',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Youtube size={17} />
                </a>
              )}
              {profile.socialLinks.facebook && (
                <a
                  href={profile.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Profile"
                  style={{
                    width: '2.4rem',
                    height: '2.4rem',
                    borderRadius: 'var(--radius)',
                    backgroundColor: '#DBEAFE',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Facebook size={17} />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  style={{
                    width: '2.4rem',
                    height: '2.4rem',
                    borderRadius: 'var(--radius)',
                    backgroundColor: '#E0F2FE',
                    color: '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Linkedin size={17} />
                </a>
              )}
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  style={{
                    width: '2.4rem',
                    height: '2.4rem',
                    borderRadius: 'var(--radius)',
                    backgroundColor: '#F1F5F9',
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Github size={17} />
                </a>
              )}
            </div>
          </div>

          {/* Philosophy & Details */}
          <div>
            <span className="section-tag">Giảng viên hướng dẫn</span>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--secondary)', marginBottom: '1rem', lineHeight: 1.3 }}>
              Học cùng {profile.name}
            </h2>

            <p style={{ fontSize: '1.02rem', color: '#475569', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              {profile.bio}
            </p>

            {profile.philosophy && (
              <blockquote
                style={{
                  borderLeft: '4px solid var(--primary)',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'var(--bg-alt)',
                  color: 'var(--secondary)',
                  borderRadius: '0 var(--radius) var(--radius) 0',
                  marginBottom: '1.75rem',
                  fontStyle: 'italic',
                  fontSize: '0.98rem',
                }}
              >
                &ldquo;{profile.philosophy}&rdquo;
              </blockquote>
            )}

            {/* Core Values */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {profile.highlights.map((h, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: 'var(--secondary)', fontWeight: 600 }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {/* Stats Counter */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '1rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              {profile.stats.map((stat, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
