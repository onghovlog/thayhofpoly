const InstructorProfile = require('../models/InstructorProfile');
const { sendResponse, sendError } = require('../utils/helpers');

/**
 * @desc    Lấy thông tin giảng viên
 * @route   GET /api/instructor
 * @access  Public
 */
const getInstructorProfile = async (req, res, next) => {
  try {
    let profile = await InstructorProfile.findOne();

    // Nếu chưa có hồ sơ nào trong DB, tự động tạo hồ sơ mặc định
    if (!profile) {
      profile = await InstructorProfile.create({
        name: 'Thầy HOTB',
        title: 'Giảng viên Thiết kế đồ họa & Công nghệ thông tin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        cover: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
        bio: 'Hơn 10 năm kinh nghiệm giảng dạy và thực chiến tại các trường cao đẳng, đại học. Chuyên gia đào tạo theo định hướng: Học → Làm → Tạo sản phẩm thực tế.',
        philosophy: 'Kiến thức không có giá trị nếu không được đưa vào thực hành. Tôi tin rằng mọi sinh viên đều có thể thành thạo nghề nếu được học bằng dự án thực chiến và người dẫn dắt tận tâm.',
        highlights: [
          'Thực chiến 100% qua dự án',
          'Dễ hiểu cho người mới',
          'Hoàn toàn miễn phí',
        ],
        stats: [
          { label: 'Năm giảng dạy', value: '10+' },
          { label: 'Học viên đã hướng dẫn', value: '5,000+' },
          { label: 'Video bài giảng', value: '200+' },
          { label: 'Dự án thực tế', value: '100+' },
        ],
        socialLinks: {
          youtube: 'https://www.youtube.com/@thayhotb',
          facebook: 'https://www.facebook.com/thayhotb',
          linkedin: 'https://www.linkedin.com/in/thayhotb',
          github: 'https://github.com/thayhotb',
          email: 'hotb@fpoly.edu.vn',
          phone: '0988 123 456',
          zalo: '0988 123 456',
          address: 'Cao đẳng FPT Polytechnic',
        },
      });
    }

    return sendResponse(res, 200, profile, 'Lấy thông tin giảng viên thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật thông tin giảng viên
 * @route   PUT /api/instructor
 * @access  Private (Admin)
 */
const updateInstructorProfile = async (req, res, next) => {
  try {
    const data = req.body;

    let profile = await InstructorProfile.findOne();

    if (!profile) {
      profile = await InstructorProfile.create(data);
    } else {
      profile = await InstructorProfile.findByIdAndUpdate(profile._id, data, {
        new: true,
        runValidators: true,
      });
    }

    return sendResponse(res, 200, profile, 'Cập nhật thông tin giảng viên thành công');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInstructorProfile,
  updateInstructorProfile,
};
