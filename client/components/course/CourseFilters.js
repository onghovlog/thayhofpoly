'use client';

import { useRef } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CourseFilters({
  categories = [],
  selectedCategory = 'all',
  selectedLevel = 'all',
  selectedSort = 'newest',
  searchQuery = '',
  onCategoryChange,
  onLevelChange,
  onSortChange,
  onSearchChange,
  onSearchSubmit,
}) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Search & Top Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Search Bar */}
        <form
          onSubmit={onSearchSubmit}
          style={{
            position: 'relative',
            flex: '1 1 320px',
            maxWidth: '500px',
          }}
        >
          <input
            type="text"
            placeholder="Tìm kiếm khóa học theo tên hoặc từ khóa..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search
            size={17}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
          />
        </form>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* Level Filter */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={selectedLevel}
              onChange={(e) => onLevelChange(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.88rem', padding: '0.55rem 0.8rem' }}
            >
              <option value="all">Mọi cấp độ</option>
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Trung cấp</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.88rem', padding: '0.55rem 0.8rem' }}
            >
              <option value="newest">Mới nhất</option>
              <option value="popular">Nhiều bài học nhất</option>
              <option value="a-z">Tên A-Z</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Horizontal Pills with Left / Right Scroll Arrows */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="pills-nav-arrow"
          title="Cuộn sang trái"
          aria-label="Cuộn sang trái"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Scrollable Pills Container */}
        <div
          ref={scrollRef}
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
            onClick={() => onCategoryChange('all')}
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
            Tất cả chủ đề
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat._id || cat.slug}
                type="button"
                onClick={() => onCategoryChange(cat.slug)}
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

        {/* Right Arrow Button */}
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
  );
}
