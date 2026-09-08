import Link from 'next/link';
import SectionTitle from '@/components/common/SectionTitle';
import CategoryCard from '@/components/category/CategoryCard';

export default function FeaturedCategories({ categories = [] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="section section-alt" id="chu-de">
      <div className="container">
        <SectionTitle
          tag="Lĩnh vực đào tạo"
          title="Chủ đề chuyên môn thực chiến"
          description="Chọn lộ trình bạn quan tâm để khám phá toàn bộ bài giảng video và tài liệu thực hành chuyên sâu."
          align="left"
        />

        <div className="grid-3">
          {categories.slice(0, 6).map((cat) => (
            <CategoryCard key={cat._id || cat.slug} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
