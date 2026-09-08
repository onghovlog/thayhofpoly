import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Eye } from 'lucide-react';
import { formatDate, formatViews } from '@/utils/formatters';

export default function ArticleCard({ article, horizontal = false }) {
  if (!article) return null;

  return (
    <article
      className="card"
      style={{
        flexDirection: horizontal ? 'row' : 'column',
      }}
    >
      {/* Cover Image */}
      <Link
        href={`/bai-viet/${article.slug}`}
        style={{
          position: 'relative',
          width: horizontal ? '35%' : '100%',
          minWidth: horizontal ? '220px' : 'auto',
          paddingTop: horizontal ? '0' : '52%',
          minHeight: horizontal ? '180px' : 'auto',
          overflow: 'hidden',
          backgroundColor: '#F1F5F9',
        }}
      >
        <img
          src={article.coverImage || '/images/default-article.jpg'}
          alt={article.title}
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
          className="article-cover"
        />
      </Link>

      {/* Content Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Category & Date */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '0.5rem' }}>
          <Link
            href={`/chu-de/${article.category?.slug || 'web'}`}
            style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}
          >
            {article.category?.name || 'Bài viết'}
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={13} />
              {article.readingTime || 3} phút đọc
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.15rem', lineHeight: 1.4, marginBottom: '0.6rem' }}>
          <Link
            href={`/bai-viet/${article.slug}`}
            style={{ color: 'var(--secondary)' }}
            className="article-title-link"
          >
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            lineHeight: 1.55,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.excerpt}
        </p>

        {/* Footer Meta */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src={article.author?.avatar || '/images/instructor-avatar.jpg'}
              alt={article.author?.name || 'Thầy HOTB'}
              style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span>{article.author?.name || 'Thầy HOTB'}</span>
            <span>•</span>
            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
          </div>

          <Link
            href={`/bai-viet/${article.slug}`}
            style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
          >
            <span>Đọc</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
