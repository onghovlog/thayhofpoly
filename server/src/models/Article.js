const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tiêu đề bài viết'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Vui lòng nhập slug bài viết'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Vui lòng nhập tóm tắt ngắn'],
      trim: true,
      maxlength: [300, 'Tóm tắt bài viết tối đa 300 ký tự'],
    },
    content: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung bài viết (Markdown)'],
    },
    coverImage: {
      type: String,
      default: '/images/default-article.jpg',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Vui lòng chọn chủ đề bài viết'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
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
    },
    relatedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
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
    views: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number,
      default: 3,
    },
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB Text Search Index
ArticleSchema.index(
  {
    title: 'text',
    excerpt: 'text',
    content: 'text',
    tags: 'text',
  },
  {
    default_language: 'none',
    language_override: 'none',
  }
);

module.exports = mongoose.model('Article', ArticleSchema);
