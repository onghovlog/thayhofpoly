const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/helpers');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return sendError(res, 401, 'Không có quyền truy cập. Vui lòng đăng nhập.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, 401, 'Người dùng không tồn tại hoặc đã bị xóa.');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 401, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Quyền '${req.user.role}' không được phép thực hiện hành động này.`
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
