const Course = require('../models/Course');
const Article = require('../models/Article');
const { sendResponse, sendError } = require('../utils/helpers');

/**
 * @desc    Tìm kiếm toàn trang (Khóa học & Bài viết)
 * @route   GET /api/search
 * @access  Public
 */
const searchAll = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim() === '') {
      return sendResponse(
        res,
        200,
        {
          courses: [],
          articles: [],
          totalCourses: 0,
          totalArticles: 0,
        },
        'Vui lòng nhập từ khóa tìm kiếm'
      );
    }

    const queryStr = q.trim();
    const limitNum = parseInt(limit, 10) || 10;
    const regex = new RegExp(queryStr, 'i');

    // Tìm khóa học theo regex (title, shortDescription, tags)
    const courses = await Course.find({
      status: 'published',
      $or: [
        { title: { $regex: regex } },
        { shortDescription: { $regex: regex } },
        { tags: { $in: [regex] } },
      ],
    })
      .populate('category', 'name slug')
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const totalCourses = await Course.countDocuments({
      status: 'published',
      $or: [
        { title: { $regex: regex } },
        { shortDescription: { $regex: regex } },
        { tags: { $in: [regex] } },
      ],
    });

    // Tìm bài viết theo regex (title, excerpt, tags)
    const articles = await Article.find({
      status: 'published',
      $or: [
        { title: { $regex: regex } },
        { excerpt: { $regex: regex } },
        { tags: { $in: [regex] } },
      ],
    })
      .select('-content')
      .populate('category', 'name slug')
      .limit(limitNum)
      .sort({ publishedAt: -1 });

    const totalArticles = await Article.countDocuments({
      status: 'published',
      $or: [
        { title: { $regex: regex } },
        { excerpt: { $regex: regex } },
        { tags: { $in: [regex] } },
      ],
    });

    return sendResponse(
      res,
      200,
      {
        courses,
        articles,
        totalCourses,
        totalArticles,
        query: queryStr,
      },
      `Tìm thấy ${totalCourses} khóa học và ${totalArticles} bài viết phù hợp`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchAll,
};
