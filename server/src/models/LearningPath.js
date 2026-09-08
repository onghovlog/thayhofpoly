const mongoose = require('mongoose');

const LearningPathSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên lộ trình'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Vui lòng nhập slug lộ trình'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả lộ trình'],
      trim: true,
    },
    thumbnail: {
      type: String,
      default: '/images/default-path.jpg',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all'],
      default: 'beginner',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
    steps: [
      {
        stepNumber: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: '',
        },
        estimatedTime: {
          type: String,
          default: '1-2 tuần',
        },
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        article: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Article',
        },
        resourceUrl: {
          type: String,
          default: '',
        },
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

module.exports = mongoose.model('LearningPath', LearningPathSchema);
