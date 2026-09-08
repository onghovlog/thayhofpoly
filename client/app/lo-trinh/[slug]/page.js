import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import RoadmapTimeline from '@/components/learning-path/RoadmapTimeline';
import CourseCard from '@/components/course/CourseCard';
import ArticleCard from '@/components/article/ArticleCard';
import { getLearningPathBySlug } from '@/services/learningPathService';
import { formatLevel } from '@/utils/formatters';
import { Milestone, BookOpen, Video, FileText, ArrowRight } from 'lucide-react';

export async function generateMetadata({ params }) {
  try {
    const res = await getLearningPathBySlug(params.slug);
    const path = res.data;
    if (!path) return { title: 'Lộ trình học tập' };
    return {
      title: path.title,
      description: path.description,
    };
  } catch (e) {
    return { title: 'Chi tiết lộ trình' };
  }
}

export default async function LearningPathDetailPage({ params }) {
  let path = null;

  try {
    const res = await getLearningPathBySlug(params.slug);
    if (res.success && res.data) {
      path = res.data;
    }
  } catch (error) {
    console.error('Lỗi tải lộ trình:', error);
  }

  if (!path) {
    notFound();
  }

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <Breadcrumb
          items={[
            { label: 'Lộ trình học tập', href: '/lo-trinh' },
            { label: path.title },
          ]}
        />

        {/* Roadmap Banner */}
        <div
          style={{
            padding: '2.5rem',
            backgroundColor: 'var(--bg-alt)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '3.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-primary">
              {path.steps?.length || 0} Giai đoạn học tập
            </span>
            <span className={`badge badge-${path.level || 'beginner'}`}>
              Cấp độ: {formatLevel(path.level)}
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', color: 'var(--secondary)', marginBottom: '1rem', lineHeight: 1.25 }}>
            {path.title}
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '800px' }}>
            {path.description}
          </p>
        </div>

        {/* Interactive Roadmap Timeline */}
        <div style={{ marginBottom: '4.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--secondary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Milestone size={24} color="var(--primary)" />
            <span>Các bước thực hiện theo lộ trình</span>
          </h2>

          <RoadmapTimeline steps={path.steps} />
        </div>

        {/* Linked Courses */}
        {path.courses && path.courses.length > 0 && (
          <div style={{ marginBottom: '3.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--secondary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Video size={20} color="var(--primary)" />
              <span>Khóa học video trong lộ trình này</span>
            </h3>
            <div className="grid-2">
              {path.courses.map((course) => (
                <CourseCard key={course._id || course.slug} course={course} />
              ))}
            </div>
          </div>
        )}

        {/* Linked Articles */}
        {path.articles && path.articles.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--secondary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--primary)" />
              <span>Tài liệu & Bài đọc bổ trợ</span>
            </h3>
            <div className="grid-2">
              {path.articles.map((article) => (
                <ArticleCard key={article._id || article.slug} article={article} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
