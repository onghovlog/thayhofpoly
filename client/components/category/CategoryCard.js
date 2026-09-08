import Link from 'next/link';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

export default function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      href={`/chu-de/${category.slug}`}
      className="card"
      style={{
        padding: '1.5rem',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: 'var(--radius)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={22} />
          </div>

          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-alt)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
            }}
          >
            {category.courseCount || 0} khóa học
          </div>
        </div>

        <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {category.name}
        </h3>

        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {category.description || 'Khám phá các khóa học và bài viết chất lượng cao trong chuyên ngành này.'}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--primary)',
        }}
      >
        <span>Khám phá chủ đề</span>
        <ArrowRight size={15} />
      </div>
    </Link>
  );
}
