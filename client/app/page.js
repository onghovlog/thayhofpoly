import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import LearningPathsSection from '@/components/home/LearningPathsSection';
import CategoryCoursesSection from '@/components/home/CategoryCoursesSection';
import LatestArticles from '@/components/home/LatestArticles';
import InstructorSection from '@/components/home/InstructorSection';
import NewsletterSection from '@/components/home/NewsletterSection';

import { getCategories } from '@/services/categoryService';
import { getCourses } from '@/services/courseService';
import { getArticles } from '@/services/articleService';
import { getLearningPaths } from '@/services/learningPathService';

// SSR / ISR with revalidation
export const revalidate = 60;

export default async function HomePage() {
  let categories = [];
  let featuredCourses = [];
  let webCourses = [];
  let designCourses = [];
  let marketingCourses = [];
  let aiCourses = [];
  let latestArticles = [];
  let learningPaths = [];

  try {
    const [
      catsRes,
      featuredRes,
      webRes,
      designRes,
      marketingRes,
      aiRes,
      articlesRes,
      pathsRes,
    ] = await Promise.all([
      getCategories({ active: 'true' }).catch(() => ({ data: [] })),
      getCourses({ featured: 'true', sort: 'newest', limit: 6 }).catch(() => ({ data: [] })),
      getCourses({ category: 'frontend-development', limit: 3 }).catch(() => ({ data: [] })),
      getCourses({ category: 'ui-ux-design', limit: 3 }).catch(() => ({ data: [] })),
      getCourses({ category: 'digital-marketing', limit: 3 }).catch(() => ({ data: [] })),
      getCourses({ category: 'ai-ung-dung', limit: 3 }).catch(() => ({ data: [] })),
      getArticles({ limit: 6 }).catch(() => ({ data: [] })),
      getLearningPaths({ featured: 'true' }).catch(() => ({ data: [] })),
    ]);

    categories = catsRes.data || [];
    featuredCourses = featuredRes.data || [];
    webCourses = webRes.data || [];
    designCourses = designRes.data || [];
    marketingCourses = marketingRes.data || [];
    aiCourses = aiRes.data || [];
    latestArticles = articlesRes.data || [];
    learningPaths = pathsRes.data || [];
  } catch (error) {
    console.error('[Homepage Data Error]', error);
  }

  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Chủ đề nổi bật */}
      <FeaturedCategories categories={categories} />

      {/* 3. Khóa học nổi bật */}
      <FeaturedCourses courses={featuredCourses} />

      {/* 4. Lộ trình học tập */}
      <LearningPathsSection paths={learningPaths} />

      {/* 5. Khóa học Web Development */}
      {webCourses.length > 0 && (
        <CategoryCoursesSection
          tag="Chuyên ngành Web"
          title="Khóa học Web Development thực chiến"
          categorySlug="frontend-development"
          courses={webCourses}
        />
      )}

      {/* 6. Khóa học Design */}
      {designCourses.length > 0 && (
        <CategoryCoursesSection
          tag="Chuyên ngành Thiết kế"
          title="Khóa học UI/UX & Graphic Design"
          categorySlug="ui-ux-design"
          courses={designCourses}
          isAltBg={true}
        />
      )}

      {/* 7. Khóa học Marketing */}
      {marketingCourses.length > 0 && (
        <CategoryCoursesSection
          tag="Chuyên ngành Marketing"
          title="Khóa học Digital & Content Marketing"
          categorySlug="digital-marketing"
          courses={marketingCourses}
        />
      )}

      {/* 8. Khóa học AI */}
      {aiCourses.length > 0 && (
        <CategoryCoursesSection
          tag="Kỷ nguyên AI"
          title="Khóa học AI ứng dụng cho Designer & Developer"
          categorySlug="ai-ung-dung"
          courses={aiCourses}
          isAltBg={true}
        />
      )}

      {/* 9. Bài viết mới */}
      <LatestArticles articles={latestArticles} />

      {/* 10. Học cùng Thầy HOTB */}
      <InstructorSection />

      {/* 11. YouTube & Newsletter */}
      <NewsletterSection />
    </>
  );
}
