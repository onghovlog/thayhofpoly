import SectionTitle from '@/components/common/SectionTitle';
import CourseGrid from '@/components/course/CourseGrid';

export default function FeaturedCourses({ courses = [] }) {
  if (!courses || courses.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <SectionTitle
          tag="Video Playlist"
          title="Khóa học nổi bật"
          description="Các khóa học được thiết kế thực chiến, bám sát nhu cầu tuyển dụng thực tế của doanh nghiệp."
          actionLink="/khoa-hoc"
          actionText="Xem tất cả khóa học"
        />

        <CourseGrid courses={courses} columns={3} />
      </div>
    </section>
  );
}
