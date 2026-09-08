'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import ArticleGrid from '@/components/article/ArticleGrid';
import Pagination from '@/components/common/Pagination';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { getArticles } from '@/services/articleService';
import { getCategories } from '@/services/categoryService';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

function ArticlesContent() {
  const searchParams = useSearchParams();
  const pillsRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page'), 10) || 1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });

  const handleScroll = (direction) => {
    if (pillsRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      pillsRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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

  const fetchArticleData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 9,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined,
      };

      const res = await getArticles(params);
      if (res.success) {
        setArticles(res.data || []);
        setPagination(res.pagination || { total: 0, totalPages: 1, page: 1 });
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticleData();
  }, [selectedCategory, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchArticleData();
  };

  const handleCategoryChange = (catSlug) => {
    setSelectedCategory(catSlug);
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
        <Breadcrumb items={[{ label: 'Bài viết & Tutorial' }]} />

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="section-tag">Thư viện kiến thức</span>
          <h1 style={{ fontSize: '2.25rem', color: 'var(--secondary)', marginBottom: '0.6rem' }}>
            Bài viết & Tutorial chuyên sâu
          </h1>

        </div>

        {/* Search & Category Filter Pills */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', maxWidth: '500px' }}>
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề hoặc nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={17}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="pills-nav-arrow"
              title="Cuộn sang trái"
              aria-label="Cuộn sang trái"
            >
              <ChevronLeft size={16} />
            </button>

            <div
              ref={pillsRef}
              className="category-pills-container"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                padding: '0.25rem 0',
                flex: 1,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: selectedCategory === 'all' ? 700 : 500,
                  border: selectedCategory === 'all' ? '1px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: selectedCategory === 'all' ? 'var(--primary)' : '#FFFFFF',
                  color: selectedCategory === 'all' ? '#FFFFFF' : 'var(--secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
              >
                Tất cả bài viết
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat._id || cat.slug}
                    type="button"
                    onClick={() => handleCategoryChange(cat.slug)}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: '9999px',
                      fontSize: '0.88rem',
                      fontWeight: isSelected ? 700 : 500,
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: isSelected ? 'var(--primary)' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : 'var(--secondary)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="pills-nav-arrow"
              title="Cuộn sang phải"
              aria-label="Cuộn sang phải"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          <LoadingState count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchArticleData} />
        ) : articles.length === 0 ? (
          <EmptyState
            title="Không tìm thấy bài viết"
            description="Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang chủ đề khác."
          />
        ) : (
          <>
            <ArticleGrid articles={articles} columns={3} />
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

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 1.25rem' }}><LoadingState count={6} /></div>}>
      <ArticlesContent />
    </Suspense>
  );
}
