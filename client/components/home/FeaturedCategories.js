'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryCard from '@/components/category/CategoryCard';

export default function FeaturedCategories({ categories = [] }) {
  const scrollRef = useRef(null);

  if (!categories || categories.length === 0) return null;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="section section-alt" id="chu-de">
      <div className="container">
        {/* Header with Title and Scroll Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <span className="section-tag">LĨNH VỰC ĐÀO TẠO</span>
            <h2 className="section-title" style={{ marginBottom: '0.35rem' }}>
              Chủ đề chuyên môn thực chiến
            </h2>
          </div>

          {/* Navigation Controls for Horizontal Scroll */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => handleScroll('left')}
              className="btn btn-secondary"
              style={{
                width: '2.5rem',
                height: '2.5rem',
                padding: 0,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Cuộn sang trái"
              aria-label="Cuộn sang trái"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="btn btn-secondary"
              style={{
                width: '2.5rem',
                height: '2.5rem',
                padding: 0,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Cuộn sang phải"
              aria-label="Cuộn sang phải"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Categories Container */}
        <div ref={scrollRef} className="category-scroll-container">
          {categories.map((cat) => (
            <CategoryCard key={cat._id || cat.slug} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

