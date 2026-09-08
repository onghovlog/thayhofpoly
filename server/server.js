const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Route files
const authRoutes = require('./src/routes/authRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const articleRoutes = require('./src/routes/articleRoutes');
const learningPathRoutes = require('./src/routes/learningPathRoutes');
const youtubeRoutes = require('./src/routes/youtubeRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const instructorRoutes = require('./src/routes/instructorRoutes');
const settingRoutes = require('./src/routes/settingRoutes');
const contactRoutes = require('./src/routes/contactRoutes');

// Initialize database
connectDB();

const app = express();

// Trust reverse proxy (Nginx, Cloudflare, Traefik) trên VPS
// Rất quan trọng để express-rate-limit và req.ip hoạt động chính xác khi chạy sau proxy
app.set('trust proxy', 1);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration linh hoạt cho VPS / Production / Development
const parseAllowedOrigins = () => {
  const envOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/+$/, ''))
    : [];
  const defaultOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://thayhotb.vn',
    'https://www.thayhotb.vn',
  ];
  return Array.from(new Set([...envOrigins, ...defaultOrigins].filter(Boolean)));
};

const allowedOrigins = parseAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép request không có origin (như curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);

      // Nếu CLIENT_URL là '*' hoặc đang ở chế độ development, cho phép tất cả
      if (process.env.CLIENT_URL === '*' || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, '');
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed === '*') return true;
        return allowed === normalizedOrigin;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked] Origin '${origin}' không nằm trong danh sách được phép:`, allowedOrigins);
        callback(new Error('Chặn bởi chính sách CORS'));
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 500, // Tối đa 500 requests mỗi 15 phút
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', globalLimiter);

// Rate limiter riêng cho authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 lần đăng nhập mỗi 15 phút
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu đăng nhập, vui lòng thử lại sau 15 phút.',
  },
});
app.use('/api/auth/login', authLimiter);

// Health check & Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Thầy HOTB Learning Hub API Server đang hoạt động!',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/learning-paths', learningPathRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/contact', contactRoutes);

// 404 Handler cho API routes không tồn tại
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy tài nguyên: ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  🚀 Thầy HOTB API Server`);
  console.log(`  🔗 Port: http://localhost:${PORT}`);
  console.log(`  🌐 Môi trường: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
});
