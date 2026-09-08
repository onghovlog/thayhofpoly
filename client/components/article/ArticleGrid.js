import ArticleCard from './ArticleCard';

export default function ArticleGrid({ articles = [], columns = 3 }) {
  if (!articles || articles.length === 0) return null;

  const gridClass = columns === 2 ? 'grid-2' : 'grid-3';

  return (
    <div className={gridClass}>
      {articles.map((article) => (
        <ArticleCard key={article._id || article.slug} article={article} />
      ))}
    </div>
  );
}
