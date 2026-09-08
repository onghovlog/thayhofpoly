import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import CourseGrid from '@/components/course/CourseGrid';
import ArticleGrid from '@/components/article/ArticleGrid';
import EmptyState from '@/components/common/EmptyState';
import { getCategoryBySlug } from '@/services/categoryService';
import { BookOpen, Video, FileText } from 'lucide-react';

export async function generateMetadata({ params }) {
  try {
    const res = await getCategoryBySlug(params.slug);
    const category = res.data?.category;
    if (!category) return { title: 'Chủ đề' };
    return {
      title: `Chủ đề ${category.name}`,
      description: category.description || `Khám phá các khóa học và bài viết về ${category.name}`,
    };
  } catch (e) {
    return { title: 'Chủ đề' };
  }
}

export default async function CategoryDetailPage({ params }) {
  let categoryData = null;

  try {
    const res = await getCategoryBySlug(params.slug);
    if (res.success && res.data?.category) {
      categoryData = res.data;
    }
  } catch (e) {
    console.error('Lỗi tải chi tiết chủ đề:', e);
  }

  if (!categoryData || !categoryData.category) {
    notFound();
  }

  const { category, courses = [], articles = [] } = categoryData;

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container">
        <Breadcrumb
          items={[
            { label: 'Chủ đề', href: '/#chu-de' },
            { label: category.name },
          ]}
        />

        {/* Category Header */}
        <div
          style={{
            padding: '2.5rem',
            backgroundColor: 'var(--bg-alt)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '3.5rem',
          }}
        >
          <span className="section-tag">Chủ đề chuyên môn</span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
            {category.name}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '750px', lineHeight: 1.6 }}>
            {category.description || `Kho tổng hợp toàn bộ bài giảng video và tài liệu về ${category.name}.`}
          </p>
        </div>

        {/* Courses Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <Video size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.6rem', color: 'var(--secondary)' }}>
              Khóa học trong chủ đề ({courses.length})
            </h2>
          </div>

          {courses.length === 0 ? (
            <EmptyState
              title="Chưa có khóa học nào"
              description="Khóa học cho chủ đề này đang được biên soạn và sẽ sớm ra mắt."
            />
          ) : (
            <CourseGrid courses={courses} columns={3} />
          )}
        </div>

        {/* Articles Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <FileText size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.6rem', color: 'var(--secondary)' }}>
              Bài viết trong chủ đề ({articles.length})
            </h2>
          </div>

          {articles.length === 0 ? (
            <EmptyState
              title="Chưa có bài viết nào"
              description="Các bài viết hướng dẫn chuyên sâu sẽ được cập nhật trong thời gian tới."
            />
          ) : (
            <ArticleGrid articles={articles} columns={3} />
          )}
        </div>
      </div>
    </div>
  );
}
