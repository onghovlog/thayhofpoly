const SiteSetting = require('../models/SiteSetting');
const { sendResponse, sendError } = require('../utils/helpers');

/**
 * @desc    Lấy cấu hình trang web (Công khai)
 * @route   GET /api/settings
 * @access  Public
 */
const getPublicSettings = async (req, res, next) => {
  try {
    let setting = await SiteSetting.findOne();
    if (!setting) {
      setting = await SiteSetting.create({
        adminEmail: 'tranbaho@gmail.com',
        siteName: 'THẦY HOTB',
        siteTitle: 'Thầy HOTB Learning Hub - Kho kiến thức thực chiến',
        slogan: 'Học thực chiến. Làm được việc.',
        contactEmail: 'tranbaho@gmail.com',
        hotline: '0988 123 456',
        address: 'Cao đẳng FPT Polytechnic',
        facebook: 'https://www.facebook.com/thayhotb',
        youtube: 'https://www.youtube.com/@thayhotb',
        zalo: '0988 123 456',
      });
    }

    const publicData = {
      siteName: setting.siteName,
      siteTitle: setting.siteTitle,
      slogan: setting.slogan,
      contactEmail: setting.contactEmail,
      hotline: setting.hotline,
      address: setting.address,
      facebook: setting.facebook,
      youtube: setting.youtube,
      zalo: setting.zalo,
    };

    return sendResponse(res, 200, publicData, 'Lấy cấu hình thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy toàn bộ cấu hình hệ thống (Admin)
 * @route   GET /api/settings/admin
 * @access  Private (Admin)
 */
const getAdminSettings = async (req, res, next) => {
  try {
    let setting = await SiteSetting.findOne();
    if (!setting) {
      setting = await SiteSetting.create({
        adminEmail: 'tranbaho@gmail.com',
        siteName: 'THẦY HOTB',
        siteTitle: 'Thầy HOTB Learning Hub - Kho kiến thức thực chiến',
        slogan: 'Học thực chiến. Làm được việc.',
        contactEmail: 'tranbaho@gmail.com',
        hotline: '0988 123 456',
        address: 'Cao đẳng FPT Polytechnic',
        facebook: 'https://www.facebook.com/thayhotb',
        youtube: 'https://www.youtube.com/@thayhotb',
        zalo: '0988 123 456',
      });
    }

    return sendResponse(res, 200, setting, 'Lấy cấu hình admin thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật cấu hình hệ thống (Admin)
 * @route   PUT /api/settings
 * @access  Private (Admin)
 */
const updateSettings = async (req, res, next) => {
  try {
    const data = req.body;
    let setting = await SiteSetting.findOne();

    if (!setting) {
      setting = await SiteSetting.create(data);
    } else {
      setting = await SiteSetting.findByIdAndUpdate(setting._id, data, {
        new: true,
        runValidators: true,
      });
    }

    return sendResponse(res, 200, setting, 'Cập nhật cấu hình hệ thống thành công');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicSettings,
  getAdminSettings,
  updateSettings,
};
