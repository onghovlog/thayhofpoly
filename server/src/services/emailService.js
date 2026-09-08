const nodemailer = require('nodemailer');
const SiteSetting = require('../models/SiteSetting');

/**
 * Gửi email thông báo liên hệ / đăng ký tới Email Admin
 */
const sendAdminNotificationEmail = async (contactData) => {
  try {
    const setting = await SiteSetting.findOne();
    const adminEmail = setting?.adminEmail || 'tranbaho@gmail.com';
    const siteName = setting?.siteName || 'THẦY HOTB Learning Hub';

    const { name, email, phone, subject, message, type, course } = contactData;
    const typeLabel =
      type === 'consultation'
        ? 'Đăng ký tư vấn 1 kèm 1'
        : type === 'registration'
        ? 'Đăng ký khóa học'
        : 'Liên hệ / Góp ý';

    console.log('====================================================');
    console.log(`📧 [NEW INQUIRY] Nhận được tin nhắn từ: ${name} (${email})`);
    console.log(`🎯 Loại: ${typeLabel}`);
    if (phone) console.log(`📞 Điện thoại: ${phone}`);
    if (course) console.log(`📚 Khóa học quan tâm: ${course}`);
    console.log(`📝 Chủ đề: ${subject || 'Không có'}`);
    console.log(`💬 Nội dung: ${message}`);
    console.log(`📬 Chuyển tiếp tới Admin Email: ${adminEmail}`);
    console.log('====================================================');

    // Nếu có cấu hình SMTP thì gửi email thật qua nodemailer
    if (setting?.smtp?.enabled && setting?.smtp?.user && setting?.smtp?.pass) {
      const transporter = nodemailer.createTransport({
        host: setting.smtp.host || 'smtp.gmail.com',
        port: setting.smtp.port || 587,
        secure: setting.smtp.port === 465,
        auth: {
          user: setting.smtp.user,
          pass: setting.smtp.pass,
        },
      });

      const mailOptions = {
        from: `"${setting.smtp.fromName || siteName}" <${setting.smtp.fromEmail || setting.smtp.user}>`,
        to: adminEmail,
        replyTo: email,
        subject: `[${siteName}] [${typeLabel}] Tin nhắn mới từ ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
            <div style="background-color: #EA580C; padding: 15px 20px; border-radius: 6px; color: #ffffff; text-align: center;">
              <h2 style="margin: 0; font-size: 20px;">${siteName} - ${typeLabel}</h2>
            </div>
            
            <div style="padding: 20px 0; color: #334155; line-height: 1.6;">
              <p>Xin chào <strong>Admin (${adminEmail})</strong>,</p>
              <p>Hệ thống website vừa nhận được một yêu cầu mới từ người dùng với thông tin chi tiết như sau:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                <tr style="background-color: #F8FAFC;">
                  <td style="padding: 10px; border: 1px solid #E2E8F0; font-weight: bold; width: 140px;">Họ và tên:</td>
                  <td style="padding: 10px; border: 1px solid #E2E8F0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #E2E8F0; font-weight: bold;">Email:</td>
                  <td style="padding: 10px; border: 1px solid #E2E8F0;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                ${
                  phone
                    ? `<tr style="background-color: #F8FAFC;">
                  <td style="padding: 10px; border: 1px solid #E2E8F0; font-weight: bold;">Điện thoại:</td>
                  <td style="padding: 10px; border: 1px solid #E2E8F0;"><a href="tel:${phone}">${phone}</a></td>
                </tr>`
                    : ''
                }
                ${
                  course
                    ? `<tr>
                  <td style="padding: 10px; border: 1px solid #E2E8F0; font-weight: bold;">Chương trình:</td>
                  <td style="padding: 10px; border: 1px solid #E2E8F0; color: #EA580C; font-weight: bold;">${course}</td>
                </tr>`
                    : ''
                }
                <tr style="background-color: #F8FAFC;">
                  <td style="padding: 10px; border: 1px solid #E2E8F0; font-weight: bold;">Chủ đề:</td>
                  <td style="padding: 10px; border: 1px solid #E2E8F0;">${subject || 'Liên hệ từ website'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #E2E8F0; font-weight: bold; vertical-align: top;">Nội dung:</td>
                  <td style="padding: 10px; border: 1px solid #E2E8F0; white-space: pre-wrap;">${message}</td>
                </tr>
              </table>
              
              <p style="margin-top: 20px;">Bạn có thể trả lời trực tiếp email này để gửi phản hồi tới <strong>${email}</strong>.</p>
            </div>
            
            <div style="border-top: 1px solid #E2E8F0; padding-top: 15px; font-size: 12px; color: #94A3B8; text-align: center;">
              Email tự động từ hệ thống ${siteName} • Đã gửi tới ${adminEmail}
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ [EMAIL SENT] Đã gửi thông báo thành công tới ${adminEmail}`);
    }

    return { success: true, adminEmail };
  } catch (err) {
    console.error(`⚠️ [EMAIL NOTIFICATION ERROR] Không thể gửi email:`, err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendAdminNotificationEmail,
};
