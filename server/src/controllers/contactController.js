const Contact = require('../models/Contact');
const { sendAdminNotificationEmail } = require('../services/emailService');
const { sendResponse, sendError } = require('../utils/helpers');

/**
 * @desc    Gửi tin nhắn liên hệ / Đăng ký tư vấn
 * @route   POST /api/contact
 * @access  Public
 */
const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, type, course } = req.body;

    if (!name || !email || !message) {
      return sendError(res, 400, 'Vui lòng điền đầy đủ Họ tên, Email và Nội dung');
    }

    // Lưu vào database
    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'Liên hệ từ website',
      message,
      type: type || 'contact',
      course: course || '',
      status: 'new',
    });

    // Gửi email thông báo tới email admin trong nền (không làm chậm response)
    sendAdminNotificationEmail({
      name,
      email,
      phone,
      subject,
      message,
      type,
      course,
    }).catch((err) => console.error('[EMAIL NOTIFY ERR]', err));

    return sendResponse(
      res,
      201,
      contact,
      'Gửi thông tin thành công! Chúng tôi sẽ liên hệ lại với bạn sớm nhất.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy danh sách tin nhắn liên hệ (Admin)
 * @route   GET /api/contact
 * @access  Private (Admin)
 */
const getContacts = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const contacts = await Contact.find(query).sort({ createdAt: -1 });

    return sendResponse(res, 200, contacts, 'Lấy danh sách tin nhắn thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa tin nhắn liên hệ (Admin)
 * @route   DELETE /api/contact/:id
 * @access  Private (Admin)
 */
const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      return sendError(res, 404, 'Không tìm thấy tin nhắn');
    }

    await Contact.findByIdAndDelete(id);
    return sendResponse(res, 200, null, 'Xóa tin nhắn thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật trạng thái tin nhắn (Admin)
 * @route   PATCH /api/contact/:id/status
 * @access  Private (Admin)
 */
const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return sendError(res, 404, 'Không tìm thấy tin nhắn');
    }

    return sendResponse(res, 200, contact, 'Cập nhật trạng thái thành công');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  getContacts,
  deleteContact,
  updateContactStatus,
};
