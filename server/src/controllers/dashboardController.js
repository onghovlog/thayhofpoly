const Course = require('../models/Course');
const Article = require('../models/Article');
const Category = require('../models/Category');
const LearningPath = require('../models/LearningPath');
const User = require('../models/User');
const { sendResponse } = require('../utils/helpers');

/**
 * @desc    Lấy số liệu thống kê tổng quan cho Admin Dashboard
 * @route   GET /api/dashboard/stats
 * @access  Private (Admin)
 */
const getStats = async (req, res, next) => {
  try {
    const [
      totalCourses,
      publishedCourses,
      totalArticles,
      publishedArticles,
      totalCategories,
      totalLearningPaths,
      recentCourses,
      recentArticles,
    ] = await Promise.all([
      Course.countDocuments(),
      Course.countDocuments({ status: 'published' }),
      Article.countDocuments(),
      Article.countDocuments({ status: 'published' }),
      Category.countDocuments(),
      LearningPath.countDocuments(),
      Course.find()
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      Article.find()
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    return sendResponse(
      res,
      200,
      {
        counts: {
          totalCourses,
          publishedCourses,
          totalArticles,
          publishedArticles,
          totalCategories,
          totalLearningPaths,
        },
        recentCourses,
        recentArticles,
      },
      'Lấy thống kê dashboard thành công'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
};
