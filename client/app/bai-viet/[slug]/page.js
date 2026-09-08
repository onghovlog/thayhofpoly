import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import MarkdownViewer from '@/components/article/MarkdownViewer';
import TableOfContents from '@/components/article/TableOfContents';
import ArticleCard from '@/components/article/ArticleCard';
import CourseCard from '@/components/course/CourseCard';
import { getArticleBySlug } from '@/services/articleService';
import { formatDate, formatViews } from '@/utils/formatters';
import { SITE_CONFIG } from '@/utils/constants';
import { Clock, Calendar, Eye, User, ArrowRight, Video, Share2 } from 'lucide-react';

// Dynamic SEO Metadata
export async function generateMetadata({ params }) {
  try {
    const res = await getArticleBySlug(params.slug);
    const article = res.data?.article;

    if (!article) {
      return { title: 'Không tìm thấy bài viết' };
    }

    return {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      openGraph: {
        title: article.seoTitle || article.title,
        description: article.seoDescription || article.excerpt,
        type: 'article',
        publishedTime: article.publishedAt,
        authors: [article.author?.name || 'Thầy HOTB'],
        images: [{ url: article.coverImage || `${SITE_CONFIG.siteUrl}/images/default-article.jpg` }],
      },
    };
  } catch (e) {
    return { title: 'Chi tiết bài viết' };
  }
}

export default async function ArticleDetailPage({ params }) {
  let articleData = null;

  try {
    const res = await getArticleBySlug(params.slug);
    if (res.success && res.data?.article) {
      articleData = res.data;
    }
  } catch (error) {
    console.error('Lỗi tải chi tiết bài viết:', error);
  }

  if (!articleData || !articleData.article) {
    notFound();
  }

  const { article, moreArticles = [] } = articleData;

  // Schema.org Article Structured Data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: [article.coverImage || `${SITE_CONFIG.siteUrl}/images/default-article.jpg`],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Thầy HOTB',
      url: SITE_CONFIG.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.siteUrl}/images/logo.png`,
      },
    },
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Bài viết', href: '/bai-viet' },
            { label: article.title },
          ]}
        />

        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '0.85rem' }}>
            <Link
              href={`/chu-de/${article.category?.slug || 'web'}`}
              className="badge badge-primary"
              style={{ fontSize: '0.82rem' }}
            >
              {article.category?.name || 'Chuyên mục'}
            </Link>
          </div>

          <h1
            style={{
              fontSize: '2.4rem',
              color: 'var(--secondary)',
              lineHeight: 1.3,
              marginBottom: '1.25rem',
              fontWeight: 800,
            }}
          >
            {article.title}
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {article.excerpt}
          </p>

          {/* Author & Meta Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={article.author?.avatar || '/images/instructor-avatar.jpg'}
                alt={article.author?.name || 'Thầy HOTB'}
                style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--secondary)' }}>
                  {article.author?.name || 'Thầy HOTB'}
                </div>
                <div style={{ fontSize: '0.8rem' }}>{article.author?.title || 'Giảng viên Thiết kế & CNTT'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} />
                {formatDate(article.publishedAt)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} />
                {article.readingTime || 3} phút đọc
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Eye size={15} />
                {formatViews(article.views)} lượt xem
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '50%',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: '2.5rem',
              border: '1px solid var(--border)',
            }}
          >
            <img
              src={article.coverImage}
              alt={article.title}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Table of Contents */}
        <TableOfContents content={article.content} />

        {/* Markdown Content */}
        <div style={{ marginBottom: '3.5rem' }}>
          <MarkdownViewer content={article.content} />
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div
            style={{
              paddingTop: '1.5rem',
              paddingBottom: '1.5rem',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '3rem',
            }}
          >
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--secondary)' }}>Thẻ bài viết:</span>
            {article.tags.map((tag, idx) => (
              <Link key={idx} href={`/bai-viet?search=${encodeURIComponent(tag)}`} className="badge">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Linked Related Courses */}
        {article.relatedCourses && article.relatedCourses.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--bg-alt)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              marginBottom: '3.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Video size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.3rem', color: 'var(--secondary)' }}>
                Khóa học video thực hành liên quan
              </h3>
            </div>
            <div className="grid-2">
              {article.relatedCourses.map((course) => (
                <CourseCard key={course._id || course.slug} course={course} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div
          style={{
            padding: '2.5rem',
            backgroundColor: 'var(--secondary)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            marginBottom: '4rem',
          }}
        >
          <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '0.6rem' }}>
            Nâng cấp kỹ năng với các khóa học miễn phí
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '1rem', marginBottom: '1.5rem', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
            Hàng chục khóa học chất lượng cao trên YouTube đang chờ đón bạn.
          </p>
          <Link href="/khoa-hoc" className="btn btn-primary btn-lg">
            <span>Khám phá các khóa học</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* More Related Articles */}
        {moreArticles && moreArticles.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--secondary)', marginBottom: '1.5rem' }}>
              Bài viết cùng chuyên mục
            </h2>
            <div className="grid-2">
              {moreArticles.map((relArticle) => (
                <ArticleCard key={relArticle._id || relArticle.slug} article={relArticle} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
