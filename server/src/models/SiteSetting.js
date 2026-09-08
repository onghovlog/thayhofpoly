const mongoose = require('mongoose');

const SiteSettingSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      required: [true, 'Vui lòng nhập email admin nhận thông báo'],
      default: 'tranbaho@gmail.com',
      trim: true,
      lowercase: true,
    },
    siteName: {
      type: String,
      default: 'THẦY HOTB',
      trim: true,
    },
    siteTitle: {
      type: String,
      default: 'Thầy HOTB Learning Hub - Kho kiến thức thực chiến',
      trim: true,
    },
    slogan: {
      type: String,
      default: 'Học thực chiến. Làm được việc.',
      trim: true,
    },
    contactEmail: {
      type: String,
      default: 'tranbaho@gmail.com',
      trim: true,
      lowercase: true,
    },
    hotline: {
      type: String,
      default: '0988 123 456',
      trim: true,
    },
    address: {
      type: String,
      default: 'Cao đẳng FPT Polytechnic',
      trim: true,
    },
    facebook: {
      type: String,
      default: 'https://www.facebook.com/thayhotb',
      trim: true,
    },
    youtube: {
      type: String,
      default: 'https://www.youtube.com/@thayhotb',
      trim: true,
    },
    zalo: {
      type: String,
      default: '0988 123 456',
      trim: true,
    },
    smtp: {
      enabled: { type: Boolean, default: false },
      host: { type: String, default: 'smtp.gmail.com' },
      port: { type: Number, default: 587 },
      user: { type: String, default: '' },
      pass: { type: String, default: '' },
      fromName: { type: String, default: 'Thầy HOTB Learning Hub' },
      fromEmail: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SiteSetting', SiteSettingSchema);
