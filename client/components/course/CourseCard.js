import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, Clock, Video, User } from 'lucide-react';
import { formatLevel } from '@/utils/formatters';

export default function CourseCard({ course }) {
  if (!course) return null;

  const levelClass = `badge-${course.level || 'beginner'}`;

  return (
    <div className="card">
      {/* Thumbnail Container */}
      <Link
        href={`/khoa-hoc/${course.slug}`}
        style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden', backgroundColor: '#F1F5F9' }}
      >
        <img
          src={course.thumbnail || '/images/default-course.jpg'}
          alt={course.title}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          className="course-thumbnail"
        />

        {/* Level Tag Overlay */}
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 2 }}>
          <span className={`badge ${levelClass}`}>
            {formatLevel(course.level)}
          </span>
        </div>

        {/* Video Count Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            color: '#FFFFFF',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Video size={13} />
          <span>{course.videoCount || 0} bài giảng</span>
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Category */}
        <div style={{ marginBottom: '0.4rem' }}>
          <Link
            href={`/chu-de/${course.category?.slug || 'web'}`}
            style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}
          >
            {course.category?.name || 'Khóa học'}
          </Link>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.1rem', lineHeight: 1.4, marginBottom: '0.6rem' }}>
          <Link
            href={`/khoa-hoc/${course.slug}`}
            style={{ color: 'var(--secondary)' }}
            className="course-title-link"
          >
            {course.title}
          </Link>
        </h3>

        {/* Short Description */}
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.shortDescription}
        </p>

        {/* Footer info & CTA */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <User size={14} color="var(--primary)" />
            <span>{course.instructor?.name || 'Thầy HOTB'}</span>
          </div>

          <Link href={`/khoa-hoc/${course.slug}`} className="btn btn-outline-primary btn-sm">
            <span>Học ngay</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
