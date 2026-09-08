const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('[MongoDB Error] ❌ Biến môi trường MONGODB_URI chưa được thiết lập trong .env!');
      return;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] ✅ Đã kết nối thành công: ${conn.connection.host} (DB: ${conn.connection.name})`);
  } catch (error) {
    console.error(`[MongoDB Error] ❌ Lỗi kết nối CSDL: ${error.message}`);
    if (
      error.name === 'MongoServerSelectionError' ||
      error.message.includes('whitelist') ||
      error.message.includes('buffering timed out') ||
      error.message.includes('ETIMEDOUT')
    ) {
      console.error(`======================================================================`);
      console.error(`[MongoDB Tip] 👉 Vui lòng kiểm tra IP Access List trên MongoDB Atlas!`);
      console.error(`[MongoDB Tip] 👉 Vào Atlas -> Security -> Network Access -> Thêm IP của VPS hoặc cho phép '0.0.0.0/0' (Allow Access from Anywhere)`);
      console.error(`======================================================================`);
    }
  }
};

module.exports = connectDB;
