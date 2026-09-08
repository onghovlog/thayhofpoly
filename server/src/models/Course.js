const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên bài học'],
      trim: true,
    },
    youtubeUrl: {
      type: String,
      required: [true, 'Vui lòng nhập link YouTube bài học'],
      trim: true,
    },
    videoId: {
      type: String,
      required: [true, 'Vui lòng có Video ID bài học'],
      trim: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '15:00',
    },
    fileName: {
      type: String,
      default: '',
      trim: true,
    },
    fileUrl: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  { _id: true, timestamps: false }
);

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên khóa học'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Vui lòng nhập slug khóa học'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả ngắn'],
      trim: true,
      maxlength: [300, 'Mô tả ngắn tối đa 300 ký tự'],
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả chung chi tiết'],
      trim: true,
    },
    thumbnail: {
      type: String,
      default: '/images/default-course.jpg',
    },
    duration: {
      type: String,
      default: 'Tự học theo tiến độ',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Vui lòng chọn chủ đề'],
    },
    lessons: [LessonSchema],
    videoCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    language: {
      type: String,
      default: 'Tiếng Việt',
    },
    youtubePlaylistUrl: {
      type: String,
      default: '',
      trim: true,
    },
    youtubePlaylistId: {
      type: String,
      default: '',
      trim: true,
    },
    instructor: {
      name: {
        type: String,
        default: 'Thầy HOTB',
      },
      title: {
        type: String,
        default: 'Giảng viên Thiết kế & CNTT',
      },
      avatar: {
        type: String,
        default: '/images/instructor-avatar.jpg',
      },
      bio: {
        type: String,
        default: 'Hơn 10 năm kinh nghiệm giảng dạy và thực chiến trong ngành Thiết kế đồ họa, Web & Marketing.',
      },
    },
    objectives: [
      {
        type: String,
        trim: true,
      },
    ],
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    targetAudience: [
      {
        type: String,
        trim: true,
      },
    ],
    relatedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB Text Search Index
CourseSchema.index(
  {
    title: 'text',
    shortDescription: 'text',
    description: 'text',
    tags: 'text',
  },
  {
    default_language: 'none',
    language_override: 'none',
  }
);

module.exports = mongoose.model('Course', CourseSchema);
