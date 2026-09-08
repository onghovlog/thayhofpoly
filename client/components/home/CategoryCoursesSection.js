import SectionTitle from '@/components/common/SectionTitle';
import CourseGrid from '@/components/course/CourseGrid';

export default function CategoryCoursesSection({
  tag,
  title,
  description,
  categorySlug,
  courses = [],
  isAltBg = false,
}) {
  if (!courses || courses.length === 0) return null;

  return (
    <section className={`section ${isAltBg ? 'section-alt' : ''}`}>
      <div className="container">
        <SectionTitle
          tag={tag || 'Khóa học theo chuyên đề'}
          title={title}
          description={description}
          actionLink={`/chu-de/${categorySlug}`}
          actionText="Xem tất cả trong chủ đề"
        />

        <CourseGrid courses={courses.slice(0, 3)} columns={3} />
      </div>
    </section>
  );
}
