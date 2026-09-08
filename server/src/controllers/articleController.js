const Article = require('../models/Article');
const Category = require('../models/Category');
const { slugifyText, calculateReadingTime, sendResponse, sendError } = require('../utils/helpers');

/**
 * @desc    Lấy danh sách bài viết có phân trang, lọc và tìm kiếm
 * @route   GET /api/articles
 * @access  Public
 */
const getArticles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      featured,
      search,
      status,
      tag,
      sort = 'newest',
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (status) {
      query.status = status;
    } else if (!req.query.allStatus) {
      query.status = 'published';
    }

    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ slug: category });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          return sendResponse(res, 200, [], 'Không tìm thấy kết quả', {
            total: 0,
            page: pageNum,
            totalPages: 0,
            limit: limitNum,
          });
        }
      }
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { excerpt: { $regex: search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } },
      ];
    }

    let sortOptions = { publishedAt: -1, createdAt: -1 };
    if (sort === 'oldest') sortOptions = { publishedAt: 1, createdAt: 1 };
    if (sort === 'popular') sortOptions = { views: -1, publishedAt: -1 };
    if (sort === 'a-z') sortOptions = { title: 1 };

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .select('-content') // Tối ưu không lấy content dài khi chỉ xem danh sách
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    return sendResponse(
      res,
      200,
      articles,
      'Lấy danh sách bài viết thành công',
      {
        total,
        page: pageNum,
        totalPages,
        limit: limitNum,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy chi tiết bài viết theo slug kèm khóa học liên quan & bài viết liên quan
 * @route   GET /api/articles/:slug
 * @access  Public
 */
const getArticleBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Tăng lượt view tự động
    const article = await Article.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('category', 'name slug description')
      .populate({
        path: 'relatedCourses',
        select: 'title slug shortDescription thumbnail level videoCount category instructor',
        populate: { path: 'category', select: 'name slug' },
      })
      .populate({
        path: 'relatedArticles',
        select: 'title slug excerpt coverImage readingTime publishedAt category',
        populate: { path: 'category', select: 'name slug' },
      });

    if (!article) {
      return sendError(res, 404, 'Không tìm thấy bài viết');
    }

    // Lấy bài viết liên quan trong cùng category nếu chưa được chọn thủ công
    let moreArticles = [];
    if (!article.relatedArticles || article.relatedArticles.length === 0) {
      moreArticles = await Article.find({
        category: article.category?._id,
        _id: { $ne: article._id },
        status: 'published',
      })
        .select('title slug excerpt coverImage readingTime publishedAt category')
        .populate('category', 'name slug')
        .limit(4)
        .sort({ publishedAt: -1 });
    }

    return sendResponse(
      res,
      200,
      {
        article,
        moreArticles: article.relatedArticles?.length > 0 ? article.relatedArticles : moreArticles,
      },
      'Lấy chi tiết bài viết thành công'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy bài viết theo ID (cho Admin Edit)
 * @route   GET /api/articles/id/:id
 * @access  Private (Admin)
 */
const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id).populate('category', 'name slug');

    if (!article) {
      return sendError(res, 404, 'Không tìm thấy bài viết');
    }

    return sendResponse(res, 200, article, 'Lấy bài viết thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo bài viết mới
 * @route   POST /api/articles
 * @access  Private (Admin)
 */
const createArticle = async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.title) {
      return sendError(res, 400, 'Tiêu đề bài viết không được để trống');
    }
    if (!data.category) {
      return sendError(res, 400, 'Chủ đề bài viết không được để trống');
    }
    if (!data.content) {
      return sendError(res, 400, 'Nội dung bài viết không được để trống');
    }

    const finalSlug = data.slug ? slugifyText(data.slug) : slugifyText(data.title);

    const existing = await Article.findOne({ slug: finalSlug });
    if (existing) {
      return sendError(res, 400, 'Slug bài viết này đã tồn tại');
    }

    const readingTime = calculateReadingTime(data.content);

    const article = await Article.create({
      ...data,
      slug: finalSlug,
      readingTime: data.readingTime || readingTime,
      author: data.author || {
        name: req.user?.name || 'Thầy HOTB',
        title: 'Giảng viên Thiết kế & CNTT',
        avatar: req.user?.avatar || '/images/instructor-avatar.jpg',
      },
    });

    return sendResponse(res, 201, article, 'Tạo bài viết mới thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật bài viết
 * @route   PUT /api/articles/:id
 * @access  Private (Admin)
 */
const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const article = await Article.findById(id);
    if (!article) {
      return sendError(res, 404, 'Không tìm thấy bài viết');
    }

    if (data.slug) {
      data.slug = slugifyText(data.slug);
    }

    if (data.content && !data.readingTime) {
      data.readingTime = calculateReadingTime(data.content);
    }

    const updatedArticle = await Article.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    return sendResponse(res, 200, updatedArticle, 'Cập nhật bài viết thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa bài viết
 * @route   DELETE /api/articles/:id
 * @access  Private (Admin)
 */
const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
      return sendError(res, 404, 'Không tìm thấy bài viết');
    }

    await Article.findByIdAndDelete(id);

    return sendResponse(res, 200, null, 'Xóa bài viết thành công');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticles,
  getArticleBySlug,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
