import Breadcrumb from '@/components/common/Breadcrumb';
import LearningPathCard from '@/components/learning-path/LearningPathCard';
import EmptyState from '@/components/common/EmptyState';
import { getLearningPaths } from '@/services/learningPathService';

export const metadata = {
  title: 'Lộ trình học tập thực chiến',
  description: 'Các lộ trình học tập bài bản được thiết kế từng bước cho Front-end, UI/UX Design và AI Creator.',
};

export default async function LearningPathsPage() {
  let paths = [];

  try {
    const res = await getLearningPaths();
    if (res.success) {
      paths = res.data || [];
    }
  } catch (error) {
    console.error('Lỗi tải lộ trình:', error);
  }

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'Lộ trình học tập' }]} />

        {/* Page Header */}
        <div style={{ marginBottom: '3rem' }}>
          <span className="section-tag">Career Roadmap</span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
            Lộ trình học tập từ cơ bản đến nâng cao
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '720px' }}>
            Được cấu trúc theo quy trình chuẩn của doanh nghiệp, giúp bạn tiết kiệm thời gian và nắm vững kiến thức trọng tâm.
          </p>
        </div>

        {paths.length === 0 ? (
          <EmptyState
            title="Chưa có lộ trình nào"
            description="Lộ trình học tập đang được hoàn thiện."
          />
        ) : (
          <div className="grid-3">
            {paths.map((path) => (
              <LearningPathCard key={path._id || path.slug} path={path} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
