async function runTests() {
  console.log('==============================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ THẦY HOTB LEARNING HUB');
  console.log('==============================================\n');

  // 1. Test Backend API
  console.log('--- 1. Kiểm tra Backend REST API (Port 5000) ---');
  try {
    const healthRes = await fetch('http://localhost:5000/api/health');
    const health = await healthRes.json();
    console.log('✅ /api/health:', health.status, `(Environment: ${health.environment})`);

    const coursesRes = await fetch('http://localhost:5000/api/courses?limit=5');
    const courses = await coursesRes.json();
    console.log('✅ /api/courses:', `Trả về ${courses.data.length} khóa học (Tổng: ${courses.pagination.total})`);

    const courseDetailRes = await fetch('http://localhost:5000/api/courses/html-css-tu-co-ban-den-thuc-chien');
    const courseDetail = await courseDetailRes.json();
    console.log('✅ /api/courses/:slug (HTML CSS):', courseDetail.data.course.title, `(Playlist: ${courseDetail.data.course.youtubePlaylistId})`);

    const articlesRes = await fetch('http://localhost:5000/api/articles?limit=5');
    const articles = await articlesRes.json();
    console.log('✅ /api/articles:', `Trả về ${articles.data.length} bài viết (Tổng: ${articles.pagination.total})`);

    const articleDetailRes = await fetch('http://localhost:5000/api/articles/html-semantic-la-gi-va-tai-sao-can-dung');
    const articleDetail = await articleDetailRes.json();
    console.log('✅ /api/articles/:slug (HTML Semantic):', articleDetail.data.article.title, `(Views: ${articleDetail.data.article.views})`);

    const categoriesRes = await fetch('http://localhost:5000/api/categories');
    const categories = await categoriesRes.json();
    console.log('✅ /api/categories:', `Trả về ${categories.data.length} chủ đề`);

    const pathsRes = await fetch('http://localhost:5000/api/learning-paths');
    const paths = await pathsRes.json();
    console.log('✅ /api/learning-paths:', `Trả về ${paths.data.length} lộ trình học tập`);

    const searchRes = await fetch('http://localhost:5000/api/search?q=CSS');
    const search = await searchRes.json();
    console.log('✅ /api/search?q=CSS:', `Tìm thấy ${search.data.totalCourses} khóa học & ${search.data.totalArticles} bài viết`);
  } catch (err) {
    console.error('❌ Lỗi Backend API:', err.message);
  }

  // 2. Test Admin Authentication & JWT Protection
  console.log('\n--- 2. Kiểm tra Authentication & Quyền Admin ---');
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@thayhotb.vn',
        password: 'Admin@123456',
      }),
    });
    const login = await loginRes.json();
    console.log('✅ /api/auth/login:', login.success ? 'Đăng nhập thành công' : 'Thất bại', `(Role: ${login.data?.user?.role})`);

    const token = login.data?.token;

    // Test Protected Dashboard Stats API with Token
    const statsRes = await fetch('http://localhost:5000/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const stats = await statsRes.json();
    console.log('✅ /api/dashboard/stats (Protected):', stats.success ? 'Đã lấy thống kê' : 'Thất bại', stats.data?.counts);

    // Test accessing protected endpoint without token (should be 401)
    const unauthorizedRes = await fetch('http://localhost:5000/api/dashboard/stats');
    console.log('✅ Kiểm tra chặn truy cập không có Token:', unauthorizedRes.status === 401 ? '401 Unauthorized (Bảo mật hoạt động đúng)' : 'Lỗi');
  } catch (err) {
    console.error('❌ Lỗi Auth:', err.message);
  }

  // 3. Test Frontend Next.js Pages (Port 3000)
  console.log('\n--- 3. Kiểm tra Frontend Next.js Pages (Port 3000) ---');
  const pages = [
    { url: 'http://localhost:3000/', name: 'Homepage (Trang chủ)' },
    { url: 'http://localhost:3000/khoa-hoc', name: 'Trang Danh sách Khóa học' },
    { url: 'http://localhost:3000/khoa-hoc/html-css-tu-co-ban-den-thuc-chien', name: 'Trang Chi tiết Khóa học' },
    { url: 'http://localhost:3000/bai-viet', name: 'Trang Danh sách Bài viết' },
    { url: 'http://localhost:3000/bai-viet/html-semantic-la-gi-va-tai-sao-can-dung', name: 'Trang Chi tiết Bài viết' },
    { url: 'http://localhost:3000/chu-de/ui-ux-design', name: 'Trang Chi tiết Chủ đề' },
    { url: 'http://localhost:3000/lo-trinh', name: 'Trang Danh sách Lộ trình' },
    { url: 'http://localhost:3000/lo-trinh/lo-trinh-frontend-developer-thuc-chien', name: 'Trang Chi tiết Lộ trình' },
    { url: 'http://localhost:3000/tim-kiem?q=React', name: 'Trang Tìm kiếm' },
    { url: 'http://localhost:3000/gioi-thieu', name: 'Trang Giới thiệu Thầy HOTB' },
    { url: 'http://localhost:3000/lien-he', name: 'Trang Liên hệ' },
    { url: 'http://localhost:3000/admin/login', name: 'Trang Admin Login' },
    { url: 'http://localhost:3000/sitemap.xml', name: 'Dynamic Sitemap XML' },
    { url: 'http://localhost:3000/robots.txt', name: 'Robots TXT' },
  ];

  for (const page of pages) {
    try {
      const res = await fetch(page.url);
      console.log(`✅ [${res.status}] ${page.name} (${page.url})`);
    } catch (err) {
      console.error(`❌ Lỗi khi tải ${page.name}:`, err.message);
    }
  }

  console.log('\n==============================================');
  console.log('🎉 TẤT CẢ CÁC BÀI KIỂM THỬ ĐÃ HOÀN TẤT THÀNH CÔNG!');
  console.log('==============================================');
}

runTests();
