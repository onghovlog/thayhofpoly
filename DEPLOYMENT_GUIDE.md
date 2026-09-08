# 🚀 Hướng Dẫn Triển Khai (Deploy) Thầy HOTB Learning Hub lên VPS

Tài liệu này hướng dẫn chi tiết từng bước để triển khai toàn bộ hệ thống (Backend Node.js Express + Frontend Next.js 14 + MongoDB Atlas + Nginx + PM2 + SSL Let's Encrypt) lên máy chủ VPS (Ubuntu 20.04/22.04/24.04).

---

## 🏗️ Kiến Trúc Hoạt Động trên VPS

```
                              Internet / Người dùng
                                       │
                                       ▼
                       ┌──────────────────────────────┐
                       │   NGINX Reverse Proxy        │
                       │   (Port 80 HTTP / 443 HTTPS) │
                       └──────────────┬───────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              │                                               │
              ▼ (URL: /)                                      ▼ (URL: /api/*)
    ┌───────────────────────────┐                   ┌───────────────────────────┐
    │  Next.js Frontend (SSR)   │ ──(Server Fetch)──▶  Express Backend API      │
    │  Port 3000 (PM2 Quản lý)  │                   │  Port 5000 (PM2 Quản lý)  │
    └───────────────────────────┘                   └─────────────┬─────────────┘
                                                                  │
                                                                  ▼
                                                    ┌───────────────────────────┐
                                                    │  MongoDB Atlas (Cloud)    │
                                                    └───────────────────────────┘
```

---

## 📋 Bước 1: Chuẩn Bị Môi Trường trên VPS

Đăng nhập SSH vào VPS của bạn:
```bash
ssh root@<IP_VPS_CUA_BAN>
```

Cập nhật hệ thống và cài đặt **Node.js (v18 hoặc v20)**, **Nginx**, **Git**, **PM2**:

```bash
# Cập nhật packages
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# Kiểm tra phiên bản Node và NPM
node -v
npm -v

# Cài đặt PM2 toàn cục
sudo npm install -g pm2
```

---

## 🛡️ Bước 2: Cấu Hình MongoDB Atlas Network Access

Nếu bạn sử dụng MongoDB Atlas (như URI trong `.env`):
1. Truy cập [MongoDB Atlas](https://cloud.mongodb.com/).
2. Chọn **Security** -> **Network Access**.
3. Nhấn **Add IP Address**:
   - Cách 1 (Khuyên dùng khi bắt đầu): Chọn **Allow Access from Anywhere** (`0.0.0.0/0`).
   - Cách 2: Điền chính xác địa chỉ IP của VPS bạn.
4. Nhấn **Confirm** để lưu.

---

## ⚙️ Bước 3: Cấu Hình Biến Môi Trường (.env)

Trong thư mục dự án trên VPS:

### 1. Cấu hình Backend (`server/.env`):
Tạo hoặc chỉnh sửa file `server/.env`:
```bash
nano server/.env
```
Nội dung mẫu:
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Connection (MongoDB Atlas)
MONGODB_URI=mongodb+srv://tranbaho_db_user:Tuong29042011@mooncake.jrfchyc.mongodb.net/thayhotb?retryWrites=true&w=majority&appName=mooncake

# JWT Secret
JWT_SECRET=thayhotb_super_secret_jwt_key_2026_production_ready
JWT_EXPIRE=30d

# YouTube Data API v3 (Nếu có)
YOUTUBE_API_KEY=

# Cho phép Domain / IP truy cập qua CORS (cách nhau bởi dấu phẩy)
CLIENT_URL=https://yourdomain.com,https://www.yourdomain.com,http://IP_VPS:3000
```

### 2. Cấu hình Frontend (`client/.env.local` hoặc `client/.env.production`):
```bash
nano client/.env.local
```
Nội dung mẫu:
```env
# URL API công khai (nếu dùng Nginx proxy /api, hãy điền domain hoặc /api)
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# URL website chính thức
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Internal API dùng riêng cho SSR fetch trên máy chủ
INTERNAL_API_URL=http://127.0.0.1:5000
```

> [!IMPORTANT]
> **RẤT QUAN TRỌNG VỚI NEXT.JS:**
> Biến `NEXT_PUBLIC_*` được nạp vào code JavaScript của Client **trong lúc chạy lệnh `npm run build`**. Do đó, mỗi khi thay đổi `client/.env.local`, bạn **BẮT BUỘC** phải chạy lại lệnh `npm run build` ở thư mục `client` thì trình duyệt mới nhận API mới!

---

## 📦 Bước 4: Cài Đặt Dependencies và Build Dự Án

Tại thư mục gốc của dự án:

```bash
# 1. Cài đặt toàn bộ dependencies cho Server và Client
npm run install:all

# 2. (Chỉ cần chạy 1 lần đầu) Khởi tạo dữ liệu mẫu nếu Database trống
npm run seed

# 3. Build mã nguồn Frontend Next.js cho môi trường Production
npm run build:client
```

---

## 🚀 Bước 5: Khởi Chạy Tiến Trình Bằng PM2

Dự án đã tích hợp sẵn file `ecosystem.config.js`. Bạn chỉ cần chạy lệnh sau tại thư mục gốc:

```bash
# Khởi động cả Backend (Port 5000) và Frontend (Port 3000)
pm2 start ecosystem.config.js --env production

# Lưu danh sách tiến trình để tự động bật khi reboot VPS
pm2 save
pm2 startup
```

Các lệnh quản trị PM2 hữu ích:
```bash
pm2 status            # Xem trạng thái hoạt động của Server và Client
pm2 logs              # Xem log trực tiếp của cả 2 ứng dụng
pm2 logs thayhotb-server  # Chỉ xem log Backend
pm2 logs thayhotb-client  # Chỉ xem log Frontend
pm2 restart all       # Khởi động lại toàn bộ
```

---

## 🌐 Bước 6: Cấu Hình Nginx Reverse Proxy & SSL Miễn Phí

### 1. Tạo file cấu hình Nginx:
```bash
sudo nano /etc/nginx/sites-available/thayhotb.vn
```
Dán nội dung sau vào (thay `yourdomain.com` bằng domain hoặc IP của bạn):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 20M;

    gzip on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml font/woff2 image/svg+xml;

    # Backend API (Port 5000)
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90s;
        proxy_connect_timeout 90s;
    }

    # Static Assets Cache của Next.js
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        expires 365d;
        access_log off;
    }

    # Frontend Next.js SSR (Port 3000)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
```

### 2. Kích hoạt Virtual Host Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/thayhotb.vn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Cài đặt Chứng chỉ SSL miễn phí (Certbot Let's Encrypt):
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🛠️ Xử Lý Sự Cố Thường Gặp (Troubleshooting)

### 1. Trình duyệt vẫn gọi `http://localhost:5000` sau khi deploy:
- **Nguyên nhân:** Chưa chạy `npm run build` trên VPS sau khi sửa `NEXT_PUBLIC_API_URL`.
- **Khắc phục:**
  ```bash
  cd client
  npm run build
  pm2 restart thayhotb-client
  ```

### 2. Lỗi `Chặn bởi chính sách CORS`:
- **Nguyên nhân:** Domain hoặc IP truy cập chưa nằm trong `CLIENT_URL` của file `server/.env`.
- **Khắc phục:** Mở `server/.env`, thêm domain vào `CLIENT_URL` (ví dụ `CLIENT_URL=https://yourdomain.com,http://IP_VPS:3000`), sau đó chạy `pm2 restart thayhotb-server`.

### 3. Lỗi kết nối MongoDB `MongoServerSelectionError` hoặc `buffering timed out`:
- **Nguyên nhân:** IP của VPS chưa được whitelist trên MongoDB Atlas.
- **Khắc phục:** Vào MongoDB Atlas -> Network Access -> Thêm IP của VPS hoặc `0.0.0.0/0`.

### 4. Lỗi `502 Bad Gateway` trên Nginx:
- **Nguyên nhân:** Backend hoặc Frontend chưa khởi động thành công trong PM2.
- **Khắc phục:** Chạy `pm2 status` và `pm2 logs` để xem lỗi cụ thể.
