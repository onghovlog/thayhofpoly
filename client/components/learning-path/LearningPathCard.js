import Link from 'next/link';
import { Milestone, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { formatLevel } from '@/utils/formatters';

export default function LearningPathCard({ path }) {
  if (!path) return null;

  return (
    <div className="card" style={{ padding: '1.75rem', height: '100%', justifyContent: 'space-between' }}>
      <div>
        {/* Header Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span className="badge badge-primary">
            {path.steps?.length || 0} Giai đoạn
          </span>
          <span className={`badge badge-${path.level || 'beginner'}`}>
            {formatLevel(path.level)}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '0.6rem', lineHeight: 1.35 }}>
          <Link href={`/lo-trinh/${path.slug}`} style={{ color: 'inherit' }} className="path-title">
            {path.title}
          </Link>
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {path.description}
        </p>

        {/* Steps Preview */}
        {path.steps && path.steps.length > 0 && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {path.steps.slice(0, 3).map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.85rem',
                  color: 'var(--secondary)',
                }}
              >
                <div
                  style={{
                    width: '1.3rem',
                    height: '1.3rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {step.title}
                </span>
              </div>
            ))}
            {path.steps.length > 3 && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingLeft: '1.9rem' }}>
                + thêm {path.steps.length - 3} bước chuyên sâu khác...
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <Link href={`/lo-trinh/${path.slug}`} className="btn btn-outline-primary" style={{ width: '100%' }}>
          <span>Xem chi tiết lộ trình</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
