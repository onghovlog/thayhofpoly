'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import CourseFilters from '@/components/course/CourseFilters';
import CourseGrid from '@/components/course/CourseGrid';
import Pagination from '@/components/common/Pagination';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { getCourses } from '@/services/courseService';
import { getCategories } from '@/services/categoryService';

function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'all');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page'), 10) || 1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });

  // Load Categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories({ active: 'true' });
        if (res.success) {
          setCategories(res.data);
        }
      } catch (e) {
        console.error('Lỗi tải danh mục:', e);
      }
    };
    fetchCats();
  }, []);

  // Fetch Courses when filters change
  const fetchCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 9,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        level: selectedLevel !== 'all' ? selectedLevel : undefined,
        sort: selectedSort,
        search: searchQuery.trim() || undefined,
      };

      const res = await getCourses(params);
      if (res.success) {
        setCourses(res.data || []);
        setPagination(res.pagination || { total: 0, totalPages: 1, page: 1 });
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [selectedCategory, selectedLevel, selectedSort, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCourseData();
  };

  const handleCategoryChange = (catSlug) => {
    setSelectedCategory(catSlug);
    setCurrentPage(1);
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Khóa học miễn phí' }]} />

        {/* Page Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <span className="section-tag">Kho bài giảng</span>
          <h1 style={{ fontSize: '2.25rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>
            Tất cả khóa học thực chiến
          </h1>
        </div>

        {/* Course Filters */}
        <CourseFilters
          categories={categories}
          selectedCategory={selectedCategory}
          selectedLevel={selectedLevel}
          selectedSort={selectedSort}
          searchQuery={searchQuery}
          onCategoryChange={handleCategoryChange}
          onLevelChange={handleLevelChange}
          onSortChange={handleSortChange}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* Content States */}
        {loading ? (
          <LoadingState count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchCourseData} />
        ) : courses.length === 0 ? (
          <EmptyState
            title="Không tìm thấy khóa học phù hợp"
            description="Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn chủ đề khác."
            actionText="Xem tất cả khóa học"
            actionLink="#"
          />
        ) : (
          <>
            <CourseGrid courses={courses} columns={3} />
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 1.25rem' }}><LoadingState count={6} /></div>}>
      <CoursesContent />
    </Suspense>
  );
}
