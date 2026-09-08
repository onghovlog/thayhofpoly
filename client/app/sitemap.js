import { getCourses } from '@/services/courseService';
import { getArticles } from '@/services/articleService';
import { getCategories } from '@/services/categoryService';
import { getLearningPaths } from '@/services/learningPathService';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Static routes
  const staticRoutes = [
    '',
    '/khoa-hoc',
    '/bai-viet',
    '/lo-trinh',
    '/gioi-thieu',
    '/lien-he',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const [coursesRes, articlesRes, categoriesRes, pathsRes] = await Promise.all([
      getCourses({ limit: 100 }).catch(() => ({ data: [] })),
      getArticles({ limit: 100 }).catch(() => ({ data: [] })),
      getCategories().catch(() => ({ data: [] })),
      getLearningPaths().catch(() => ({ data: [] })),
    ]);

    const courseRoutes = (coursesRes.data || []).map((c) => ({
      url: `${baseUrl}/khoa-hoc/${c.slug}`,
      lastModified: c.updatedAt || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    const articleRoutes = (articlesRes.data || []).map((a) => ({
      url: `${baseUrl}/bai-viet/${a.slug}`,
      lastModified: a.updatedAt || a.publishedAt || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const categoryRoutes = (categoriesRes.data || []).map((cat) => ({
      url: `${baseUrl}/chu-de/${cat.slug}`,
      lastModified: cat.updatedAt || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const pathRoutes = (pathsRes.data || []).map((p) => ({
      url: `${baseUrl}/lo-trinh/${p.slug}`,
      lastModified: p.updatedAt || new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...courseRoutes, ...articleRoutes, ...categoryRoutes, ...pathRoutes];
  } catch (error) {
    console.error('Lỗi khi sinh sitemap:', error);
    return staticRoutes;
  }
}
