'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { SITE_CONFIG } from '@/utils/constants';
import { getInstructorProfile } from '@/services/instructorService';
import { Youtube, Facebook, Linkedin, Github, CheckCircle2, Award, BookOpen, Users, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
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
    socialLinks: {
      ...SITE_CONFIG.socialLinks,
      phone: '0988 123 456',
      email: 'hotb@fpoly.edu.vn',
      address: 'Cao đẳng FPT Polytechnic',
    },
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
              email: d.socialLinks?.email || 'hotb@fpoly.edu.vn',
              phone: d.socialLinks?.phone || '0988 123 456',
              address: d.socialLinks?.address || 'Cao đẳng FPT Polytechnic',
            },
          });
        }
      } catch (err) {
        // Silently use defaults
      }
    };

    fetchProfile();
  }, []);

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <Breadcrumb items={[{ label: 'Giới thiệu' }]} />

        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              position: 'relative',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 1.5rem',
              border: '4px solid var(--primary-light)',
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

          <span className="section-tag">{profile.title}</span>
          <h1 style={{ fontSize: '2.6rem', color: 'var(--secondary)', marginBottom: '0.6rem', lineHeight: 1.2 }}>
            {profile.name}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
            {SITE_CONFIG.slogan}
          </p>

          {/* Social Icons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {profile.socialLinks.youtube && (
              <a
                href={profile.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ color: '#EF4444' }}
              >
                <Youtube size={17} />
                <span>YouTube</span>
              </a>
            )}
            {profile.socialLinks.facebook && (
              <a
                href={profile.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ color: '#2563EB' }}
              >
                <Facebook size={17} />
                <span>Facebook</span>
              </a>
            )}
            {profile.socialLinks.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ color: '#0284C7' }}
              >
                <Linkedin size={17} />
                <span>LinkedIn</span>
              </a>
            )}
            {profile.socialLinks.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                <Github size={17} />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>

        {/* Philosophy Block */}
        <div
          style={{
            backgroundColor: 'var(--bg-alt)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>
            Triết lý đào tạo & Sứ mệnh
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            {profile.bio}
          </p>
          {profile.philosophy && (
            <blockquote
              style={{
                borderLeft: '4px solid var(--primary)',
                padding: '1rem 1.25rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '0 var(--radius) var(--radius) 0',
                color: 'var(--secondary)',
                fontStyle: 'italic',
                fontSize: '1.02rem',
                lineHeight: 1.7,
              }}
            >
              &ldquo;{profile.philosophy}&rdquo;
            </blockquote>
          )}
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem',
            textAlign: 'center',
          }}
        >
          {profile.stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.3rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/khoa-hoc" className="btn btn-primary btn-lg">
            <span>Bắt đầu học ngay hôm nay</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
