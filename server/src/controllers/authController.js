const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendResponse, sendError } = require('../utils/helpers');

// Helper ký token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * @desc    Đăng nhập Admin
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Vui lòng cung cấp email và mật khẩu');
    }

    // Lấy user kèm password để so sánh
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return sendError(res, 401, 'Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Email hoặc mật khẩu không chính xác');
    }

    const token = generateToken(user._id, user.role);

    return sendResponse(
      res,
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
      'Đăng nhập thành công'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy thông tin người dùng hiện tại
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return sendResponse(res, 200, user, 'Lấy thông tin thành công');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe,
};
