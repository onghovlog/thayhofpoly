'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG } from '@/utils/constants';
import { Youtube, Facebook, Linkedin, Github, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Ẩn Footer ở trang Admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer style={{ backgroundColor: 'var(--secondary)', color: '#94A3B8', borderTop: '1px solid #1E293B', paddingTop: '4.5rem', paddingBottom: '2.5rem' }}>
      <div className="container">
        {/* Main Footer Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Brand Info */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <img
                src={SITE_CONFIG.logo}
                alt={SITE_CONFIG.name}
                style={{
                  width: '2.4rem',
                  height: '2.4rem',
                  borderRadius: 'var(--radius)',
                  objectFit: 'contain',
                  backgroundColor: '#FFFFFF',
                  padding: '2px',
                }}
              />
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                THẦY HOTB
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {SITE_CONFIG.slogan}
            </p>
            <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Kho kiến thức thực chiến miễn phí dành cho sinh viên, người mới bắt đầu và người đi làm nâng cấp kỹ năng.
            </p>
          </div>

          {/* Nav Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Điều hướng
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link href="/" style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>Trang chủ</Link>
              </li>
              <li>
                <Link href="/khoa-hoc" style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>Khóa học miễn phí</Link>
              </li>
              <li>
                <Link href="/bai-viet" style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>Bài viết & Tutorial</Link>
              </li>
              <li>
                <Link href="/lo-trinh" style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>Lộ trình học tập</Link>
              </li>
              <li>
                <Link href="/gioi-thieu" style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>Về Thầy HOTB</Link>
              </li>
              <li>
                <Link href="/lien-he" style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>Liên hệ & Hợp tác</Link>
              </li>
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Chuyên ngành
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {SITE_CONFIG.footerCategories.map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Kết nối
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <a
                href={SITE_CONFIG.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: '#1E293B',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <Youtube size={18} />
              </a>
              <a
                href={SITE_CONFIG.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: '#1E293B',
                  color: '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Facebook size={18} />
              </a>
              <a
                href={SITE_CONFIG.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: '#1E293B',
                  color: '#0EA5E9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Linkedin size={18} />
              </a>
              <a
                href={SITE_CONFIG.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: '#1E293B',
                  color: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Github size={18} />
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8' }}>
                <Mail size={14} color="var(--primary)" />
                <span>{SITE_CONFIG.socialLinks.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8' }}>
                <MapPin size={14} color="var(--primary)" />
                <span>{SITE_CONFIG.socialLinks.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div
          style={{
            borderTop: '1px solid #1E293B',
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#64748B',
          }}
        >
          <div>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Tất cả các quyền được bảo lưu.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/admin/login" style={{ color: '#475569', fontSize: '0.8rem' }}>
              Quản trị viên (CMS)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
