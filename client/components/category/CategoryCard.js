import Link from 'next/link';
import {
  Palette,
  Layout,
  Globe,
  Code2,
  Server,
  Sparkles,
  TrendingUp,
  PenSquare,
  Video,
  Briefcase,
  Layers,
} from 'lucide-react';

// Ánh xạ slug sang icon chuyên môn phù hợp
const getCategoryIcon = (slug) => {
  switch (slug) {
    case 'thiet-ke-do-hoa':
      return <Palette size={22} />;
    case 'ui-ux-design':
      return <Layout size={22} />;
    case 'lap-trinh-web':
      return <Globe size={22} />;
    case 'frontend-development':
      return <Code2 size={22} />;
    case 'backend-development':
      return <Server size={22} />;
    case 'ai-ung-dung':
      return <Sparkles size={22} />;
    case 'digital-marketing':
      return <TrendingUp size={22} />;
    case 'content-marketing':
      return <PenSquare size={22} />;
    case 'video-editing':
      return <Video size={22} />;
    case 'ky-nang-nghe-nghiep':
      return <Briefcase size={22} />;
    default:
      return <Layers size={22} />;
  }
};

export default function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      href={`/chu-de/${category.slug}`}
      className="category-box"
      title={category.name}
    >
      <div className="category-box-icon">
        {getCategoryIcon(category.slug)}
      </div>

      <h3 className="category-box-title">
        {category.name}
      </h3>

      <div className="category-box-count">
        {category.courseCount || 0} khóa học
      </div>
    </Link>
  );
}
