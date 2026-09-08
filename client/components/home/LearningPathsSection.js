import SectionTitle from '@/components/common/SectionTitle';
import LearningPathCard from '@/components/learning-path/LearningPathCard';

export default function LearningPathsSection({ paths = [] }) {
  if (!paths || paths.length === 0) return null;

  return (
    <section className="section section-alt">
      <div className="container">
        <SectionTitle
          tag="Định hướng nghề nghiệp"
          title="Lộ trình học tập từng bước"
          description=""
          actionLink="/lo-trinh"
          actionText="Khám phá các lộ trình"
        />

        <div className="grid-3">
          {paths.map((path) => (
            <LearningPathCard key={path._id || path.slug} path={path} />
          ))}
        </div>
      </div>
    </section>
  );
}
