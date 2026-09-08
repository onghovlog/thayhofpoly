import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles, Youtube, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  const popularTags = [
    { label: 'UI/UX Design', href: '/chu-de/ui-ux-design' },
    { label: 'Web Development', href: '/chu-de/lap-trinh-web' },
    { label: 'Frontend', href: '/chu-de/frontend-development' },
    { label: 'Backend & API', href: '/chu-de/backend-development' },
    { label: 'AI ứng dụng', href: '/chu-de/ai-ung-dung' },
    { label: 'Digital Marketing', href: '/chu-de/digital-marketing' },
  ];

  return (
    <section
      style={{
        paddingTop: '3.5rem',
        paddingBottom: '3.5rem',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          {/* Top Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-hover)',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={14} />
            <span>Kho học liệu thực chiến 100% miễn phí</span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--secondary)',
              lineHeight: 1.2,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
            }}
            className="hero-headline"
          >
            Học kỹ năng thực chiến <br />
            cùng <span style={{ color: 'var(--primary)' }}>Thầy HOTB.</span>
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '680px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Khóa học miễn phí, playlist YouTube và bài viết chuyên sâu về Design, Web, Marketing và AI. Định hướng Học → Làm → Tạo ra sản phẩm thực tế.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2.25rem',
            }}
          >
            <Link href="/khoa-hoc" className="btn btn-primary btn-lg">
              <span>Khám phá khóa học</span>
              <ArrowRight size={18} />
            </Link>

            <Link href="/bai-viet" className="btn btn-outline btn-lg">
              <span>Đọc bài viết mới</span>
            </Link>
          </div>

          {/* Key Quick Tags */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600, marginRight: '0.25rem' }}>
              Chủ đề nổi bật:
            </span>
            {popularTags.map((tag) => (
              <Link
                key={tag.href}
                href={tag.href}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--secondary)',
                  backgroundColor: 'var(--bg-alt)',
                  border: '1px solid var(--border)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.15s ease',
                }}
                className="hero-tag"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
