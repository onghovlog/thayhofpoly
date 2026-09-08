import CourseCard from './CourseCard';

export default function CourseGrid({ courses = [], columns = 3 }) {
  if (!courses || courses.length === 0) return null;

  const gridClass = columns === 4 ? 'grid-4' : columns === 2 ? 'grid-2' : 'grid-3';

  return (
    <div className={gridClass}>
      {courses.map((course) => (
        <CourseCard key={course._id || course.slug} course={course} />
      ))}
    </div>
  );
}
