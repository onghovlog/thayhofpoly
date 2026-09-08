const mongoose = require('mongoose');

const InstructorProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên giảng viên'],
      default: 'Thầy HOTB',
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Vui lòng nhập danh xưng / chức vụ'],
      default: 'Giảng viên Thiết kế đồ họa & Công nghệ thông tin',
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    cover: {
      type: String,
      default: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    },
    bio: {
      type: String,
      default:
        'Hơn 10 năm kinh nghiệm giảng dạy và thực chiến tại các trường cao đẳng, đại học. Chuyên gia đào tạo theo định hướng: Học → Làm → Tạo sản phẩm thực tế.',
      trim: true,
    },
    philosophy: {
      type: String,
      default:
        'Kiến thức không có giá trị nếu không được đưa vào thực hành. Tôi tin rằng mọi sinh viên đều có thể thành thạo nghề nếu được học bằng dự án thực chiến và người dẫn dắt tận tâm.',
      trim: true,
    },
    highlights: {
      type: [String],
      default: [
        'Thực chiến 100% qua dự án',
        'Dễ hiểu cho người mới',
        'Hoàn toàn miễn phí',
      ],
    },
    stats: [
      {
        label: { type: String, default: 'Năm giảng dạy' },
        value: { type: String, default: '10+' },
      },
      {
        label: { type: String, default: 'Học viên đã hướng dẫn' },
        value: { type: String, default: '5,000+' },
      },
      {
        label: { type: String, default: 'Video bài giảng' },
        value: { type: String, default: '200+' },
      },
      {
        label: { type: String, default: 'Dự án thực tế' },
        value: { type: String, default: '100+' },
      },
    ],
    socialLinks: {
      youtube: { type: String, default: 'https://www.youtube.com/@thayhotb' },
      facebook: { type: String, default: 'https://www.facebook.com/thayhotb' },
      linkedin: { type: String, default: 'https://www.linkedin.com/in/thayhotb' },
      github: { type: String, default: 'https://github.com/thayhotb' },
      email: { type: String, default: 'hotb@fpoly.edu.vn' },
      phone: { type: String, default: '0988 123 456' },
      zalo: { type: String, default: '0988 123 456' },
      address: { type: String, default: 'Cao đẳng FPT Polytechnic' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('InstructorProfile', InstructorProfileSchema);
