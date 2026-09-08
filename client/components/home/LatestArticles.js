import SectionTitle from '@/components/common/SectionTitle';
import ArticleGrid from '@/components/article/ArticleGrid';

export default function LatestArticles({ articles = [] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="section section-alt">
      <div className="container">
        <SectionTitle
          tag="Kiến thức mới"
          title="Bài viết & Tutorial chuyên sâu"
          description=""
          actionLink="/bai-viet"
          actionText="Xem tất cả bài viết →"
        />

        <ArticleGrid articles={articles.slice(0, 6)} columns={3} />
      </div>
    </section>
  );
}
