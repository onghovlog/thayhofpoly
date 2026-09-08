import Link from 'next/link';
import { CheckCircle, Clock, Video, FileText, ArrowRight } from 'lucide-react';

export default function RoadmapTimeline({ steps = [] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem', paddingLeft: '1.5rem' }}>
      {/* Vertical Spine Line */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          bottom: '1rem',
          left: '0.65rem',
          width: '2px',
          backgroundColor: 'var(--border-dark)',
          zIndex: 1,
        }}
      />

      {steps.map((step, index) => {
        const stepNum = step.stepNumber || index + 1;
        return (
          <div key={index} style={{ position: 'relative', zIndex: 2, paddingLeft: '1.25rem' }}>
            {/* Step Number Dot */}
            <div
              style={{
                position: 'absolute',
                left: '-1.5rem',
                top: '0',
                width: '1.8rem',
                height: '1.8rem',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 4px #FFFFFF',
              }}
            >
              {stepNum}
            </div>

            {/* Step Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Bước {stepNum}
                </span>

                {step.estimatedTime && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Clock size={13} />
                    <span>Thời gian ước tính: {step.estimatedTime}</span>
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '0.6rem' }}>
                {step.title}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {step.description}
              </p>

              {/* Linked Course or Article Resources */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
                {step.course && (
                  <Link
                    href={`/khoa-hoc/${step.course.slug || step.course}`}
                    className="btn btn-outline-primary btn-sm"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <Video size={14} />
                    <span>Học khóa: {step.course.title || 'Xem khóa học'}</span>
                  </Link>
                )}

                {step.article && (
                  <Link
                    href={`/bai-viet/${step.article.slug || step.article}`}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <FileText size={14} />
                    <span>Đọc bài giảng liên quan</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
