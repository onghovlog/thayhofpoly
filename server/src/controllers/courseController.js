const Course = require('../models/Course');
const Category = require('../models/Category');
const { slugifyText, parseYoutubePlaylistId, parseYoutubeVideoId, sendResponse, sendError } = require('../utils/helpers');

/**
 * Chuẩn hóa mảng bài học
 */
const sanitizeLessons = (lessons = []) => {
  if (!Array.isArray(lessons)) return [];
  return lessons
    .filter((l) => l && (l.title || l.youtubeUrl || l.videoId))
    .map((l, index) => {
      const vid = l.videoId || parseYoutubeVideoId(l.youtubeUrl);
      const yUrl = l.youtubeUrl || (vid ? `https://www.youtube.com/watch?v=${vid}` : '');
      const thumb = l.thumbnail || (vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : '');
      return {
        _id: l._id || undefined,
        title: l.title ? l.title.trim() : `Bài học ${index + 1}`,
        youtubeUrl: yUrl,
        videoId: vid,
        thumbnail: thumb,
        duration: l.duration ? l.duration.trim() : '15:00',
        fileName: l.fileName ? l.fileName.trim() : '',
        fileUrl: l.fileUrl ? l.fileUrl.trim() : '',
        order: Number(l.order) || index + 1,
      };
    });
};

/**
 * @desc    Lấy danh sách khóa học có phân trang, lọc và tìm kiếm
 * @route   GET /api/courses
 * @access  Public
 */
const getCourses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      level,
      featured,
      search,
      status,
      sort = 'newest',
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    // Mặc định chỉ lấy bài đã published nếu không chỉ định status (cho frontend)
    if (status) {
      query.status = status;
    } else if (!req.query.allStatus) {
      query.status = 'published';
    }

    // Lọc theo Category slug hoặc ID
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

    // Lọc theo level
    if (level && level !== 'all') {
      query.level = level;
    }

    // Lọc theo featured
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Tìm kiếm text
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { shortDescription: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } },
      ];
    }

    // Sắp xếp
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'a-z') sortOptions = { title: 1 };
    if (sort === 'z-a') sortOptions = { title: -1 };
    if (sort === 'popular') sortOptions = { videoCount: -1, createdAt: -1 };

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    return sendResponse(
      res,
      200,
      courses,
      'Lấy danh sách khóa học thành công',
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
 * @desc    Lấy chi tiết khóa học theo slug kèm danh sách bài học & khóa học liên quan
 * @route   GET /api/courses/:slug
 * @access  Public
 */
const getCourseBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ slug })
      .populate('category', 'name slug description')
      .populate({
        path: 'relatedArticles',
        select: 'title slug excerpt coverImage readingTime publishedAt category',
        populate: { path: 'category', select: 'name slug' },
      });

    if (!course) {
      return sendError(res, 404, 'Không tìm thấy khóa học');
    }

    // Sắp xếp các bài học theo thứ tự tăng dần
    if (course.lessons && course.lessons.length > 0) {
      course.lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    // Tìm các khóa học liên quan trong cùng chủ đề
    const relatedCourses = await Course.find({
      category: course.category?._id,
      _id: { $ne: course._id },
      status: 'published',
    })
      .populate('category', 'name slug')
      .limit(3)
      .sort({ createdAt: -1 });

    return sendResponse(
      res,
      200,
      {
        course,
        relatedCourses,
      },
      'Lấy chi tiết khóa học thành công'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy khóa học theo ID (cho trang Admin Edit)
 * @route   GET /api/courses/id/:id
 * @access  Private (Admin)
 */
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate('category', 'name slug');

    if (!course) {
      return sendError(res, 404, 'Không tìm thấy khóa học');
    }

    if (course.lessons && course.lessons.length > 0) {
      course.lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    return sendResponse(res, 200, course, 'Lấy khóa học thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo khóa học mới kèm danh sách bài học
 * @route   POST /api/courses
 * @access  Private (Admin)
 */
const createCourse = async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.title || !data.title.trim()) {
      return sendError(res, 400, 'Tên khóa học không được để trống');
    }
    if (!data.category) {
      return sendError(res, 400, 'Chủ đề khóa học không được để trống');
    }

    // Chuẩn hóa danh sách bài học nếu có
    const formattedLessons = sanitizeLessons(data.lessons || []);

    // Tự động phân tích Playlist ID nếu có playlistUrl
    let playlistId = data.youtubePlaylistId || '';
    if (data.youtubePlaylistUrl) {
      playlistId = parseYoutubePlaylistId(data.youtubePlaylistUrl) || playlistId;
    }

    const finalSlug = data.slug ? slugifyText(data.slug) : slugifyText(data.title);

    const existing = await Course.findOne({ slug: finalSlug });
    if (existing) {
      return sendError(res, 400, 'Slug khóa học này đã tồn tại, vui lòng chọn slug khác');
    }

    const course = await Course.create({
      ...data,
      slug: finalSlug,
      lessons: formattedLessons,
      videoCount: formattedLessons.length || Number(data.videoCount) || 0,
      youtubePlaylistId: playlistId,
    });

    return sendResponse(res, 201, course, 'Tạo khóa học thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật khóa học
 * @route   PUT /api/courses/id/:id (hoặc /api/courses/:id)
 * @access  Private (Admin)
 */
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return sendError(res, 404, 'Không tìm thấy khóa học');
    }

    if (data.slug) {
      data.slug = slugifyText(data.slug);
    }

    if (data.youtubePlaylistUrl && !data.youtubePlaylistId) {
      data.youtubePlaylistId = parseYoutubePlaylistId(data.youtubePlaylistUrl);
    }

    if (data.lessons) {
      data.lessons = sanitizeLessons(data.lessons);
      data.videoCount = data.lessons.length;
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    return sendResponse(res, 200, updatedCourse, 'Cập nhật khóa học thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa khóa học
 * @route   DELETE /api/courses/id/:id
 * @access  Private (Admin)
 */
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return sendError(res, 404, 'Không tìm thấy khóa học');
    }

    await Course.findByIdAndDelete(id);

    return sendResponse(res, 200, null, 'Xóa khóa học thành công');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseBySlug,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
