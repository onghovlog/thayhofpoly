'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import CourseGrid from '@/components/course/CourseGrid';
import ArticleGrid from '@/components/article/ArticleGrid';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { searchAll } from '@/services/searchService';
import { Search, Video, FileText } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'articles'

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({
    courses: [],
    articles: [],
    totalCourses: 0,
    totalArticles: 0,
  });

  const performSearch = async (keyword) => {
    if (!keyword || !keyword.trim()) {
      setResults({ courses: [], articles: [], totalCourses: 0, totalArticles: 0 });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await searchAll(keyword.trim(), 20);
      if (res.success && res.data) {
        setResults(res.data);
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tìm kiếm dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) {
      setSearchTerm(queryParam);
      performSearch(queryParam);
    }
  }, [queryParam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchTerm.trim())}`);
      performSearch(searchTerm.trim());
    }
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'Tìm kiếm' }]} />

        {/* Search Bar */}
        <div style={{ maxWidth: '650px', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--secondary)', marginBottom: '1rem' }}>
            Tìm kiếm nội dung
          </h1>
          <form onSubmit={handleSubmit} style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm (ví dụ: HTML, React, Figma, AI...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.6rem', paddingRight: '1rem', fontSize: '1rem' }}
                autoFocus
              />
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Results Header / Tabs */}
        {queryParam && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Kết quả tìm kiếm cho: <strong style={{ color: 'var(--secondary)' }}>&ldquo;{queryParam}&rdquo;</strong>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <button
                onClick={() => setActiveTab('courses')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  backgroundColor: activeTab === 'courses' ? 'var(--primary)' : 'var(--bg-alt)',
                  color: activeTab === 'courses' ? '#FFFFFF' : 'var(--secondary)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Video size={16} />
                <span>Khóa học ({results.totalCourses})</span>
              </button>

              <button
                onClick={() => setActiveTab('articles')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  backgroundColor: activeTab === 'articles' ? 'var(--primary)' : 'var(--bg-alt)',
                  color: activeTab === 'articles' ? '#FFFFFF' : 'var(--secondary)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <FileText size={16} />
                <span>Bài viết ({results.totalArticles})</span>
              </button>
            </div>
          </div>
        )}

        {/* Content View */}
        {loading ? (
          <LoadingState count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => performSearch(queryParam)} />
        ) : !queryParam ? (
          <EmptyState
            title="Nhập từ khóa để bắt đầu tìm kiếm"
            description="Tìm nhanh các khóa học và bài viết phù hợp với bạn."
          />
        ) : activeTab === 'courses' ? (
          results.courses.length === 0 ? (
            <EmptyState
              title="Không tìm thấy khóa học nào"
              description={`Không có khóa học nào khớp với từ khóa "${queryParam}". Bạn có thể thử chuyển sang tab Bài viết.`}
            />
          ) : (
            <CourseGrid courses={results.courses} columns={3} />
          )
        ) : (
          results.articles.length === 0 ? (
            <EmptyState
              title="Không tìm thấy bài viết nào"
              description={`Không có bài viết nào khớp với từ khóa "${queryParam}". Bạn có thể thử chuyển sang tab Khóa học.`}
            />
          ) : (
            <ArticleGrid articles={results.articles} columns={3} />
          )
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 1.25rem' }}><LoadingState count={4} /></div>}>
      <SearchContent />
    </Suspense>
  );
}
