const LearningPath = require('../models/LearningPath');
const { slugifyText, sendResponse, sendError } = require('../utils/helpers');

/**
 * @desc    Lấy danh sách các lộ trình học tập
 * @route   GET /api/learning-paths
 * @access  Public
 */
const getLearningPaths = async (req, res, next) => {
  try {
    const { status, featured } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    } else if (!req.query.allStatus) {
      query.status = 'published';
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    const paths = await LearningPath.find(query)
      .populate('category', 'name slug')
      .populate('courses', 'title slug thumbnail level videoCount')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, paths, 'Lấy danh sách lộ trình thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy chi tiết lộ trình theo slug
 * @route   GET /api/learning-paths/:slug
 * @access  Public
 */
const getLearningPathBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const learningPath = await LearningPath.findOne({ slug })
      .populate('category', 'name slug description')
      .populate('courses', 'title slug thumbnail level videoCount shortDescription')
      .populate('articles', 'title slug excerpt coverImage readingTime')
      .populate({
        path: 'steps.course',
        select: 'title slug thumbnail level videoCount shortDescription youtubePlaylistUrl',
      })
      .populate({
        path: 'steps.article',
        select: 'title slug excerpt coverImage readingTime',
      });

    if (!learningPath) {
      return sendError(res, 404, 'Không tìm thấy lộ trình học tập');
    }

    return sendResponse(res, 200, learningPath, 'Lấy chi tiết lộ trình thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy lộ trình theo ID (cho Admin Edit)
 * @route   GET /api/learning-paths/id/:id
 * @access  Private (Admin)
 */
const getLearningPathById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const learningPath = await LearningPath.findById(id)
      .populate('category', 'name slug')
      .populate('courses')
      .populate('articles');

    if (!learningPath) {
      return sendError(res, 404, 'Không tìm thấy lộ trình học tập');
    }

    return sendResponse(res, 200, learningPath, 'Lấy lộ trình thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo lộ trình học tập mới
 * @route   POST /api/learning-paths
 * @access  Private (Admin)
 */
const createLearningPath = async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.title) {
      return sendError(res, 400, 'Tên lộ trình không được để trống');
    }
    if (!data.description) {
      return sendError(res, 400, 'Mô tả lộ trình không được để trống');
    }

    const finalSlug = data.slug ? slugifyText(data.slug) : slugifyText(data.title);

    const existing = await LearningPath.findOne({ slug: finalSlug });
    if (existing) {
      return sendError(res, 400, 'Slug lộ trình này đã tồn tại');
    }

    const learningPath = await LearningPath.create({
      ...data,
      slug: finalSlug,
    });

    return sendResponse(res, 201, learningPath, 'Tạo lộ trình học tập thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật lộ trình học tập
 * @route   PUT /api/learning-paths/:id
 * @access  Private (Admin)
 */
const updateLearningPath = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const learningPath = await LearningPath.findById(id);
    if (!learningPath) {
      return sendError(res, 404, 'Không tìm thấy lộ trình học tập');
    }

    if (data.slug) {
      data.slug = slugifyText(data.slug);
    }

    const updated = await LearningPath.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return sendResponse(res, 200, updated, 'Cập nhật lộ trình thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa lộ trình học tập
 * @route   DELETE /api/learning-paths/:id
 * @access  Private (Admin)
 */
const deleteLearningPath = async (req, res, next) => {
  try {
    const { id } = req.params;

    const learningPath = await LearningPath.findById(id);
    if (!learningPath) {
      return sendError(res, 404, 'Không tìm thấy lộ trình học tập');
    }

    await LearningPath.findByIdAndDelete(id);

    return sendResponse(res, 200, null, 'Xóa lộ trình thành công');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLearningPaths,
  getLearningPathBySlug,
  getLearningPathById,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
};
