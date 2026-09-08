import Breadcrumb from '@/components/common/Breadcrumb';
import { SITE_CONFIG } from '@/utils/constants';
import { Youtube, Facebook, Linkedin, Github, CheckCircle2, Award, BookOpen, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Giới thiệu Thầy HOTB - Giảng viên Thiết kế & CNTT',
  description: 'Tìm hiểu về Thầy HOTB, triết lý đào tạo thực chiến và hành trình chia sẻ tri thức miễn phí cho cộng đồng sinh viên.',
};

export default function AboutPage() {
  const { instructor, socialLinks } = SITE_CONFIG;

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
              src={instructor.avatar}
              alt={instructor.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <span className="section-tag">{instructor.title}</span>
          <h1 style={{ fontSize: '2.6rem', color: 'var(--secondary)', marginBottom: '0.6rem', lineHeight: 1.2 }}>
            {instructor.name}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
            {SITE_CONFIG.slogan}
          </p>

          {/* Social Icons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ color: '#EF4444' }}
            >
              <Youtube size={17} />
              <span>YouTube</span>
            </a>
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ color: '#2563EB' }}
            >
              <Facebook size={17} />
              <span>Facebook</span>
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ color: '#0284C7' }}
            >
              <Linkedin size={17} />
              <span>LinkedIn</span>
            </a>
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              <Github size={17} />
              <span>GitHub</span>
            </a>
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
            Triết lý đào tạo: Học → Làm → Tạo sản phẩm
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            Trong suốt hơn 10 năm đứng trên bục giảng tại các trường cao đẳng và đại học, tôi nhận thấy rào cản lớn nhất của sinh viên không phải là thiếu tài liệu, mà là <strong>học quá nhiều lý thuyết mà không biết cách bắt đầu một sản phẩm thực tế</strong>.
          </p>
          <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.8 }}>
            <strong>Thầy HOTB Learning Hub</strong> được xây dựng với mục tiêu đơn giản nhưng quyết liệt: cung cấp những bài giảng video cô đọng, dễ hiểu nhất, đi kèm tài liệu thực hành từng bước, giúp mọi người học xong là có thể tự tay làm ra website, bản thiết kế UI/UX hay chiến dịch marketing hoàn chỉnh.
          </p>
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
          {instructor.stats.map((stat, idx) => (
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
