import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import YoutubePlayer from '@/components/course/YoutubePlayer';
import CourseCard from '@/components/course/CourseCard';
import ArticleCard from '@/components/article/ArticleCard';
import { getCourseBySlug } from '@/services/courseService';
import { formatLevel } from '@/utils/formatters';
import { SITE_CONFIG } from '@/utils/constants';
import {
  CheckCircle2,
  Clock,
  Video,
  User,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileText,
} from 'lucide-react';

// Dynamic SEO Metadata
export async function generateMetadata({ params }) {
  try {
    const res = await getCourseBySlug(params.slug);
    const course = res.data?.course;

    if (!course) {
      return { title: 'Không tìm thấy khóa học' };
    }

    return {
      title: course.seoTitle || course.title,
      description: course.seoDescription || course.shortDescription,
      openGraph: {
        title: course.seoTitle || course.title,
        description: course.seoDescription || course.shortDescription,
        images: [{ url: course.thumbnail || `${SITE_CONFIG.siteUrl}/images/default-course.jpg` }],
      },
    };
  } catch (e) {
    return { title: 'Chi tiết khóa học' };
  }
}

export default async function CourseDetailPage({ params }) {
  let courseData = null;

  try {
    const res = await getCourseBySlug(params.slug);
    if (res.success && res.data?.course) {
      courseData = res.data;
    }
  } catch (error) {
    console.error('Lỗi tải chi tiết khóa học:', error);
  }

  if (!courseData || !courseData.course) {
    notFound();
  }

  const { course, relatedCourses = [] } = courseData;

  // Schema.org Course Structured Data
  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.shortDescription,
    provider: {
      '@type': 'Person',
      name: course.instructor?.name || 'Thầy HOTB',
      sameAs: SITE_CONFIG.siteUrl,
    },
    educationalLevel: formatLevel(course.level),
    inLanguage: 'vi',
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />

      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Khóa học', href: '/khoa-hoc' },
            { label: course.title },
          ]}
        />

        {/* Course Header Banner */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <Link
              href={`/chu-de/${course.category?.slug || 'web'}`}
              className="badge badge-primary"
              style={{ fontSize: '0.82rem' }}
            >
              {course.category?.name || 'Khóa học'}
            </Link>
            <span className={`badge badge-${course.level || 'beginner'}`}>
              Cấp độ: {formatLevel(course.level)}
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', color: 'var(--secondary)', lineHeight: 1.25, marginBottom: '1rem' }}>
            {course.title}
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '850px' }}>
            {course.shortDescription}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.5rem',
              marginTop: '1.25rem',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} color="var(--primary)" />
              <span>Giảng viên: <strong style={{ color: 'var(--secondary)' }}>{course.instructor?.name || 'Thầy HOTB'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Video size={16} color="var(--primary)" />
              <span>{course.lessons?.length || course.videoCount || 0} bài giảng</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="var(--primary)" />
              <span>{course.duration || 'Tự học theo tiến độ'}</span>
            </div>
          </div>
        </div>

        {/* Video Player Section */}
        <div style={{ marginBottom: '3.5rem' }}>
          <YoutubePlayer
            lessons={course.lessons}
            playlistId={course.youtubePlaylistId}
            playlistUrl={course.youtubePlaylistUrl}
            title={course.title}
          />
        </div>

        {/* 2-Column Detail Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
          }}
          className="course-detail-layout"
        >
          {/* Main Left Content */}
          <div>
            {/* 1. Giới thiệu khóa học */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>
                Giới thiệu khóa học
              </h2>
              <div
                style={{
                  fontSize: '1.02rem',
                  color: '#334155',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line',
                }}
              >
                {course.description}
              </div>
            </div>

            {/* 2. Mục tiêu khóa học ("Bạn sẽ học được gì?") */}
            {course.objectives && course.objectives.length > 0 && (
              <div
                style={{
                  backgroundColor: 'var(--bg-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  marginBottom: '3rem',
                }}
              >
                <h3 style={{ fontSize: '1.3rem', color: 'var(--secondary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} color="var(--primary)" />
                  <span>Bạn sẽ học được gì sau khóa học?</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {course.objectives.map((obj, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                      <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                      <span style={{ fontSize: '0.95rem', color: 'var(--secondary)', lineHeight: 1.5 }}>
                        {obj}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Đối tượng phù hợp & Yêu cầu */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {/* Đối tượng */}
              {course.targetAudience && course.targetAudience.length > 0 && (
                <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--secondary)', marginBottom: '0.85rem' }}>
                    Khóa học này dành cho ai?
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                    {course.targetAudience.map((aud, idx) => (
                      <li key={idx}>{aud}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Yêu cầu chuẩn bị */}
              {course.requirements && course.requirements.length > 0 && (
                <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--secondary)', marginBottom: '0.85rem' }}>
                    Kiến thức cần chuẩn bị
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                    {course.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 4. Bài viết nên đọc (Related Articles) */}
            {course.relatedArticles && course.relatedArticles.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--secondary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} color="var(--primary)" />
                  <span>Bài viết nên đọc bổ trợ cho khóa học</span>
                </h3>

                <div className="grid-2">
                  {course.relatedArticles.map((article) => (
                    <ArticleCard key={article._id || article.slug} article={article} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Info */}
          <div>
            <div
              style={{
                position: 'sticky',
                top: '5.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {/* Instructor Mini Card */}
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Giảng viên hướng dẫn
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                  <img
                    src={course.instructor?.avatar || '/images/instructor-avatar.jpg'}
                    alt={course.instructor?.name || 'Thầy HOTB'}
                    style={{ width: '3.2rem', height: '3.2rem', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 style={{ fontSize: '1.1rem', color: 'var(--secondary)', marginBottom: '0.2rem' }}>
                      {course.instructor?.name || 'Thầy HOTB'}
                    </h5>
                    <p style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                      {course.instructor?.title || 'Giảng viên Thiết kế & CNTT'}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {course.instructor?.bio || 'Đào tạo thực chiến theo định hướng Học → Làm → Tạo sản phẩm.'}
                </p>

                <a
                  href={course.youtubePlaylistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <span>Xem playlist YouTube</span>
                  <ExternalLink size={15} />
                </a>
              </div>

              {/* Tags */}
              {course.tags && course.tags.length > 0 && (
                <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.75rem' }}>
                    Từ khóa liên quan
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {course.tags.map((tag, idx) => (
                      <span key={idx} className="badge">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Courses Section */}
        {relatedCourses && relatedCourses.length > 0 && (
          <div style={{ marginTop: '4.5rem', paddingTop: '3.5rem', borderTop: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--secondary)', marginBottom: '1.5rem' }}>
              Khóa học cùng chủ đề
            </h2>
            <div className="grid-3">
              {relatedCourses.map((relCourse) => (
                <CourseCard key={relCourse._id || relCourse.slug} course={relCourse} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
