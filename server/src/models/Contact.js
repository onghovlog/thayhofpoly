const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập họ tên'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập địa chỉ email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      default: 'Liên hệ từ website',
    },
    message: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung tin nhắn'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['contact', 'consultation', 'registration'],
      default: 'contact',
    },
    course: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Contact', ContactSchema);
