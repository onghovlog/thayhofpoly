# 🎓 THẦY HOTB LEARNING HUB

> **Slogan:** *Học thực chiến. Làm được việc.*  
> **Định vị:** Kho học liệu miễn phí, playlist YouTube và bài viết chuyên sâu về Design, Web Development, Marketing và AI dành cho sinh viên, người mới bắt đầu và người đi làm cần nâng cấp kỹ năng.

---

## 📌 Mục Lục

1. [Tổng Quan Kiến Trúc Hệ Thống](#1-tổng-quan-kiến-trúc-hệ-thống)
2. [Cấu Trúc Thư Mục Dự Án](#2-cấu-trúc-thư-mục-dự-án)
3. [Công Nghệ Sử Dụng](#3-công-nghệ-sử-dụng)
4. [Database Models](#4-database-models)
5. [Danh Sách REST API Endpoints](#5-danh-sách-rest-api-endpoints)
6. [Biến Môi Trường (Environment Variables)](#6-biến-môi-trường-environment-variables)
7. [Hướng Dẫn Cài Đặt & Chạy Localhost](#7-hướng-dẫn-cài-đặt--chạy-localhost)
8. [Tài Khoản Quản Trị (Admin CMS)](#8-tài-khoản-quản-trị-admin-cms)
9. [Hướng Dẫn Triển Khai Production (Deploy)](#9-hướng-dẫn-triển-khai-production-deploy)
10. [Các Thông Tin Cá Nhân Cần Thay Đổi](#10-các-thông-tin-cá-nhân-cần-thay-đổi)

---

## 1. Tổng Quan Kiến Trúc Hệ Thống

Website được thiết kế theo kiến trúc hiện đại tách biệt hoàn toàn giữa Frontend và Backend:
- **Client (`/client`):** Next.js App Router (JavaScript, HTML5, Vanilla CSS Design System không phụ thuộc framework CSS nặng nề).
- **Server (`/server`):** Node.js + Express.js REST API chuẩn bảo mật (Helmet, CORS, Rate Limit, JWT, Bcrypt).
- **Database:** MongoDB Atlas / Local MongoDB với Mongoose ODM, quan hệ 2 chiều giữa Khóa học ↔ Bài viết.
- **YouTube Integration:** Trực tiếp nhúng YouTube Playlist Responsive 16:9, kèm service sẵn sàng tích hợp YouTube Data API v3.

---

## 2. Cấu Trúc Thư Mục Dự Án

```
thayho_fpoly/
├── package.json                    # Script điều khiển chạy cả dự án
├── README.md                       # Tài liệu hướng dẫn toàn diện
├── .gitignore                      # Git ignore chuẩn chuẩn công nghiệp
├── test_suite.js                   # Kịch bản kiểm thử tích hợp tự động
│
├── server/                         # BACKEND API (Express + MongoDB)
│   ├── server.js                   # Điểm khởi chạy ứng dụng Express
│   ├── seed.js                     # Script nạp dữ liệu mẫu thực tế
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   └── src/
│       ├── config/                 # db.js, env.js
│       ├── models/                 # User.js, Course.js, Article.js, Category.js, LearningPath.js
│       ├── controllers/            # auth, course, article, category, learningPath, youtube, search, dashboard
│       ├── routes/                 # Express API routes
│       ├── middleware/             # authMiddleware, validate, errorHandler
│       ├── services/               # youtubeService.js (YouTube API v3 & Fallback)
│       └── utils/                  # helpers.js (slugify, formatters, youtube parser)
│
└── client/                         # FRONTEND (Next.js 14 App Router)
    ├── package.json
    ├── next.config.mjs
    ├── jsconfig.json
    ├── .env.example
    ├── .env.local
    ├── app/
    │   ├── layout.js               # Root layout, Google Font Inter, SEO Structured Data
    │   ├── globals.css             # Design System (CSS variables, buttons, cards, typography)
    │   ├── page.js                 # Homepage với 12 sections theo thứ tự chuẩn
    │   ├── khoa-hoc/               # Danh sách khóa học (Filter, Search, Pagination)
    │   │   ├── page.js
    │   │   └── [slug]/page.js      # Chi tiết khóa học + YouTube player + Bài viết liên quan
    │   ├── bai-viet/               # Danh sách bài viết & tutorial
    │   │   ├── page.js
    │   │   └── [slug]/page.js      # Chi tiết bài viết + Table of Contents + Markdown Viewer
    │   ├── chu-de/[slug]/page.js   # Chi tiết chủ đề chuyên ngành
    │   ├── lo-trinh/               # Lộ trình học tập (Roadmaps)
    │   │   ├── page.js
    │   │   └── [slug]/page.js      # Chi tiết lộ trình tương tác từng bước
    │   ├── tim-kiem/page.js        # Tìm kiếm toàn trang (Khóa học & Bài viết)
    │   ├── gioi-thieu/page.js      # Giới thiệu Thầy HOTB & triết lý đào tạo
    │   ├── lien-he/page.js         # Trang liên hệ & hợp tác
    │   ├── sitemap.js              # Dynamic XML Sitemap chuẩn SEO
    │   ├── robots.js               # Robots.txt
    │   └── admin/                  # Admin CMS Panel
    │       ├── layout.js           # Admin Sidebar & Auth Guard
    │       ├── login/page.js       # Admin Login
    │       ├── dashboard/page.js   # Admin Dashboard Overview
    │       ├── courses/            # Quản lý khóa học (CRUD)
    │       ├── articles/           # Quản lý bài viết (CRUD + Markdown Editor)
    │       ├── categories/         # Quản lý chuyên mục
    │       └── learning-paths/     # Quản lý lộ trình học
    ├── components/                 # Layout, Course, Article, Category, Learning Path, Common UI
    ├── services/                   # Frontend API fetch client modules
    └── utils/                      # Constants, formatters
```

---

## 3. Công Nghệ Sử Dụng

- **Frontend:** Next.js 14, React 18, HTML5, Vanilla CSS3 (Custom Design System với CSS Variables), `lucide-react`, `react-markdown`, `remark-gfm`.
- **Backend:** Node.js, Express.js, Mongoose 8.
- **Bảo mật & Tiện ích:** `jsonwebtoken` (JWT), `bcryptjs`, `helmet`, `cors`, `express-rate-limit`, `morgan`, `dotenv`.
- **Database:** MongoDB (Local MongoDB hoặc MongoDB Atlas Cloud).

---

## 4. Database Models

1. **`User` (`users`):** `name`, `email`, `password` (bcrypt hash), `role` (`admin`), `avatar`.
2. **`Category` (`categories`):** `name`, `slug`, `description`, `thumbnail`, `type` (`course`, `article`, `both`), `order`, `active`.
3. **`Course` (`courses`):** `title`, `slug`, `shortDescription`, `description`, `thumbnail`, `category`, `tags`, `level` (`beginner`, `intermediate`, `advanced`), `language`, `youtubePlaylistUrl`, `youtubePlaylistId`, `videoCount`, `duration`, `instructor`, `objectives`, `requirements`, `targetAudience`, `syllabus`, `relatedArticles`, `featured`, `status` (`draft`, `published`), `seoTitle`, `seoDescription`.
4. **`Article` (`articles`):** `title`, `slug`, `excerpt`, `content` (Markdown), `coverImage`, `category`, `tags`, `author`, `relatedCourses`, `relatedArticles`, `featured`, `status`, `views`, `readingTime`, `publishedAt`, `seoTitle`, `seoDescription`.
5. **`LearningPath` (`learningpaths`):** `title`, `slug`, `description`, `thumbnail`, `level`, `category`, `courses`, `articles`, `steps` (mảng các giai đoạn học tập chi tiết), `featured`, `status`.

---

## 5. Danh Sách REST API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/login`: Đăng nhập Admin lấy JWT token.
- `GET /api/auth/me`: Lấy thông tin tài khoản hiện tại (Protected).

### 🎓 Courses (`/api/courses`)
- `GET /api/courses`: Danh sách khóa học (Hỗ trợ `page`, `limit`, `category`, `level`, `featured`, `search`, `sort`).
- `GET /api/courses/:slug`: Chi tiết khóa học theo slug kèm bài viết liên quan.
- `GET /api/courses/id/:id`: Lấy khóa học theo ID cho Admin (Protected).
- `POST /api/courses`: Tạo khóa học mới (Protected).
- `PUT /api/courses/id/:id`: Cập nhật khóa học (Protected).
- `DELETE /api/courses/id/:id`: Xóa khóa học (Protected).

### 📝 Articles (`/api/articles`)
- `GET /api/articles`: Danh sách bài viết (Hỗ trợ phân trang, lọc theo chủ đề, tìm kiếm).
- `GET /api/articles/:slug`: Chi tiết bài viết (tự động tăng view, liên kết khóa học).
- `GET /api/articles/id/:id`: Lấy bài viết theo ID cho Admin (Protected).
- `POST /api/articles`: Tạo bài viết mới dạng Markdown (Protected).
- `PUT /api/articles/id/:id`: Cập nhật bài viết (Protected).
- `DELETE /api/articles/id/:id`: Xóa bài viết (Protected).

### 📂 Categories (`/api/categories`)
- `GET /api/categories`: Danh sách tất cả chủ đề (kèm số lượng khóa học & bài viết).
- `GET /api/categories/:slug`: Chi tiết chủ đề kèm danh sách khóa học và bài viết thuộc chủ đề.
- `POST /api/categories`: Thêm chủ đề mới (Protected).
- `PUT /api/categories/id/:id`: Sửa chủ đề (Protected).
- `DELETE /api/categories/id/:id`: Xóa chủ đề (Protected).

### 🗺️ Learning Paths (`/api/learning-paths`)
- `GET /api/learning-paths`: Danh sách lộ trình học tập.
- `GET /api/learning-paths/:slug`: Chi tiết lộ trình và các bước thực hiện.
- `POST /api/learning-paths`: Tạo lộ trình mới (Protected).
- `PUT /api/learning-paths/id/:id`: Cập nhật lộ trình (Protected).
- `DELETE /api/learning-paths/id/:id`: Xóa lộ trình (Protected).

### 🔍 Search & YouTube
- `GET /api/search?q=...`: Tìm kiếm đồng thời cả Khóa học và Bài viết.
- `GET /api/youtube/playlist/:playlistId`: Lấy thông tin playlist từ YouTube API v3 hoặc Fallback.
- `GET /api/dashboard/stats`: Thống kê tổng quan cho Admin CMS (Protected).

---

## 6. Biến Môi Trường (Environment Variables)

### Backend (`/server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/thayhotb
JWT_SECRET=thayhotb_super_secret_jwt_key_2026_production_ready
JWT_EXPIRE=30d
YOUTUBE_API_KEY=
CLIENT_URL=http://localhost:3000
```

### Frontend (`/client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 7. Hướng Dẫn Cài Đặt & Chạy Localhost

### Yêu Cầu Hệ Thống:
- Node.js >= v18.0.0
- MongoDB Server đang chạy (hoặc connection string từ MongoDB Atlas)

### Bước 1: Cài đặt Dependencies
```bash
# Cài đặt toàn bộ dependencies cho cả server và client
npm run install:all
```

### Bước 2: Seed Dữ Liệu Mẫu vào Database
```bash
# Nạp tài khoản Admin, 10 Danh mục, 10 Khóa học, 12 Bài viết và 3 Lộ trình học
npm run seed
```

### Bước 3: Chạy Backend Server
Mở terminal thứ nhất:
```bash
npm run dev:server
# Server chạy tại: http://localhost:5000
```

### Bước 4: Chạy Frontend Next.js Client
Mở terminal thứ hai:
```bash
npm run dev:client
# Frontend chạy tại: http://localhost:3000
```

Truy cập trình duyệt tại: **`http://localhost:3000`**

---

## 8. Tài Khoản Quản Trị (Admin CMS)

- **URL Đăng nhập:** `http://localhost:3000/admin/login`
- **Email:** `admin@thayhotb.vn`
- **Mật khẩu:** `Admin@123456`

---

## 9. Hướng Dẫn Triển Khai Production (Deploy)

### 1. Database (MongoDB Atlas)
1. Đăng ký tài khoản miễn phí tại [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Tạo một Cluster miễn phí (M0 Sandbox).
3. Lấy chuỗi kết nối: `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/thayhotb?retryWrites=true&w=majority`.

### 2. Backend Deploy (Render / Railway / VPS)
1. Upload mã nguồn thư mục `/server` lên Render hoặc Railway.
2. Cấu hình biến môi trường trên dashboard của Render/Railway:
   - `MONGODB_URI`: Chuỗi kết nối MongoDB Atlas ở trên.
   - `JWT_SECRET`: Chuỗi bí mật ngẫu nhiên mạnh.
   - `CLIENT_URL`: Domain của Frontend (ví dụ `https://thayhotb.vn`).
   - `NODE_ENV`: `production`.
3. Command build: `npm install`
4. Command start: `node server.js`
5. Chạy seed 1 lần qua terminal: `node seed.js`

### 3. Frontend Deploy (Vercel)
1. Đăng nhập [vercel.com](https://vercel.com) và liên kết với Git Repository của bạn.
2. Thiết lập **Root Directory** là `client`.
3. Cấu hình Environment Variables trên Vercel:
   - `NEXT_PUBLIC_API_URL`: URL Backend trên Render (ví dụ `https://api.thayhotb.vn/api` hoặc `https://thayhotb-api.onrender.com/api`).
   - `NEXT_PUBLIC_SITE_URL`: `https://thayhotb.vn` (hoặc domain vercel của bạn).
4. Bấm **Deploy**.

---

## 10. Các Thông Tin Cá Nhân Cần Thay Đổi

Khi đưa vào sử dụng thực tế, Thầy có thể thay đổi các thông tin tại các vị trí sau:

1. **Thông tin Giảng viên & Mạng xã hội:**
   - File: [`client/utils/constants.js`](file:///c:/laragon/www/thayho_fpoly/client/utils/constants.js)
   - Cần thay:
     - `name`: Tên hiển thị (mặc định "THẦY HOTB").
     - `title`: Chức danh giảng dạy.
     - `avatar`: Đường dẫn ảnh đại diện thật của Thầy.
     - `socialLinks.youtube`: Link kênh YouTube chính thức của Thầy.
     - `socialLinks.facebook`: Link trang cá nhân / Fanpage Facebook.
     - `socialLinks.linkedin`: Link LinkedIn.
     - `socialLinks.github`: Link GitHub.
     - `socialLinks.email`: Email liên hệ cá nhân/công vụ.
     - `socialLinks.address`: Đơn vị công tác / Trường giảng dạy.

2. **Khóa học & Playlist YouTube:**
   - Có thể thêm, sửa, xóa trực tiếp tại giao diện Quản trị **`/admin/courses`**.
   - Hoặc chỉnh sửa trong file [`server/seed.js`](file:///c:/laragon/www/thayho_fpoly/server/seed.js).

3. **Mật khẩu Admin:**
   - Có thể đổi trong file [`server/seed.js`](file:///c:/laragon/www/thayho_fpoly/server/seed.js) trước khi seed hoặc tạo tài khoản mới.

4. **YouTube Data API Key (Tùy chọn):**
   - Điền vào `YOUTUBE_API_KEY` trong file `server/.env` nếu muốn backend tự động đồng bộ tiêu đề, số lượng video mới nhất trực tiếp từ YouTube API. Nếu để trống, website vẫn nhúng và phát toàn bộ Playlist YouTube mượt mà.
