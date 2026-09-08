const Category = require('../models/Category');
const Course = require('../models/Course');
const Article = require('../models/Article');
const { slugifyText, sendResponse, sendError } = require('../utils/helpers');

/**
 * @desc    Lấy danh sách tất cả chủ đề
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const { type, active } = req.query;
    const filter = {};

    if (type && type !== 'all') {
      filter.$or = [{ type }, { type: 'both' }];
    }

    if (active !== undefined) {
      filter.active = active === 'true';
    }

    const categories = await Category.find(filter)
      .sort({ order: 1, createdAt: 1 })
      .populate('courseCount')
      .populate('articleCount');

    return sendResponse(res, 200, categories, 'Lấy danh sách chủ đề thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy chi tiết chủ đề theo slug kèm danh sách khóa học và bài viết
 * @route   GET /api/categories/:slug
 * @access  Public
 */
const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug })
      .populate('courseCount')
      .populate('articleCount');

    if (!category) {
      return sendError(res, 404, 'Không tìm thấy chủ đề');
    }

    // Lấy các khóa học thuộc chủ đề này
    const courses = await Course.find({ category: category._id, status: 'published' })
      .sort({ createdAt: -1 })
      .populate('category', 'name slug');

    // Lấy các bài viết thuộc chủ đề này
    const articles = await Article.find({ category: category._id, status: 'published' })
      .sort({ publishedAt: -1 })
      .populate('category', 'name slug');

    return sendResponse(
      res,
      200,
      {
        category,
        courses,
        articles,
      },
      'Lấy chi tiết chủ đề thành công'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo chủ đề mới
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, thumbnail, type, order, active } = req.body;

    if (!name) {
      return sendError(res, 400, 'Tên chủ đề không được để trống');
    }

    const finalSlug = slug ? slugifyText(slug) : slugifyText(name);

    const existing = await Category.findOne({ slug: finalSlug });
    if (existing) {
      return sendError(res, 400, 'Slug hoặc tên chủ đề này đã tồn tại');
    }

    const category = await Category.create({
      name,
      slug: finalSlug,
      description: description || '',
      thumbnail: thumbnail || '',
      type: type || 'both',
      order: order !== undefined ? Number(order) : 0,
      active: active !== undefined ? active : true,
    });

    return sendResponse(res, 201, category, 'Tạo chủ đề mới thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật chủ đề
 * @route   PUT /api/categories/:id
 * @access  Private (Admin)
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, description, thumbnail, type, order, active } = req.body;

    let category = await Category.findById(id);
    if (!category) {
      return sendError(res, 404, 'Không tìm thấy chủ đề');
    }

    if (name) category.name = name;
    if (slug) category.slug = slugifyText(slug);
    if (description !== undefined) category.description = description;
    if (thumbnail !== undefined) category.thumbnail = thumbnail;
    if (type) category.type = type;
    if (order !== undefined) category.order = Number(order);
    if (active !== undefined) category.active = active;

    await category.save();

    return sendResponse(res, 200, category, 'Cập nhật chủ đề thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa chủ đề
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return sendError(res, 404, 'Không tìm thấy chủ đề');
    }

    // Kiểm tra xem có khóa học hoặc bài viết nào đang liên kết không
    const courseCount = await Course.countDocuments({ category: id });
    const articleCount = await Article.countDocuments({ category: id });

    if (courseCount > 0 || articleCount > 0) {
      return sendError(
        res,
        400,
        `Không thể xóa chủ đề đang có ${courseCount} khóa học và ${articleCount} bài viết.`
      );
    }

    await Category.findByIdAndDelete(id);

    return sendResponse(res, 200, null, 'Xóa chủ đề thành công');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
