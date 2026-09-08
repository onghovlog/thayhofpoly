const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Course = require('./src/models/Course');
const Article = require('./src/models/Article');
const LearningPath = require('./src/models/LearningPath');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thayhotb';

const seedDatabase = async () => {
  try {
    console.log('[SEED] Đang kết nối MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('[SEED] Kết nối MongoDB thành công!');

    // 1. Dọn dẹp dữ liệu cũ và drop indexes cũ
    console.log('[SEED] Dọn dẹp dữ liệu cũ...');
    try {
      await mongoose.connection.dropDatabase();
      console.log('[SEED] Đã reset database sạch sẽ.');
    } catch (e) {
      console.log('[SEED] Dọn dẹp collection thủ công...');
      await Promise.all([
        User.deleteMany({}),
        Category.deleteMany({}),
        Course.deleteMany({}),
        Article.deleteMany({}),
        LearningPath.deleteMany({}),
      ]);
    }

    // 2. Tạo Admin User
    console.log('[SEED] Tạo tài khoản Admin...');
    const adminUser = await User.create({
      name: 'Thầy HOTB',
      email: 'admin@thayhotb.vn',
      password: 'Admin@123456', // Sẽ được hash tự động qua User pre-save hook
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });
    console.log(`[SEED] Tạo admin thành công: ${adminUser.email} (Mật khẩu: Admin@123456)`);

    // 3. Tạo Categories
    console.log('[SEED] Tạo danh mục chủ đề...');
    const categoriesData = [
      {
        name: 'Thiết kế đồ họa',
        slug: 'thiet-ke-do-hoa',
        description: 'Tư duy thị giác, Photoshop, Illustrator và mỹ thuật ứng dụng thực chiến.',
        thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
        type: 'both',
        order: 1,
      },
      {
        name: 'UI/UX Design',
        slug: 'ui-ux-design',
        description: 'Thiết kế trải nghiệm người dùng, Figma, Design System và Prototype.',
        thumbnail: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=600&q=80',
        type: 'both',
        order: 2,
      },
      {
        name: 'Lập trình Web',
        slug: 'lap-trinh-web',
        description: 'Tổng quan công nghệ web, kiến trúc client-server và tư duy xây dựng website.',
        thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80',
        type: 'both',
        order: 3,
      },
      {
        name: 'Frontend Development',
        slug: 'frontend-development',
        description: 'HTML5, CSS3, JavaScript, ReactJS, Next.js và tối ưu hóa hiệu năng giao diện.',
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
        type: 'both',
        order: 4,
      },
      {
        name: 'Backend Development',
        slug: 'backend-development',
        description: 'Node.js, Express, REST API, MongoDB và bảo mật hệ thống.',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
        type: 'both',
        order: 5,
      },
      {
        name: 'AI ứng dụng',
        slug: 'ai-ung-dung',
        description: 'Khai thác ChatGPT, Claude, Midjourney, v0 vào thiết kế và lập trình.',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
        type: 'both',
        order: 6,
      },
      {
        name: 'Digital Marketing',
        slug: 'digital-marketing',
        description: 'Chiến lược tiếp thị kỹ thuật số, SEO, Performance Ads và tối ưu chuyển đổi.',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
        type: 'both',
        order: 7,
      },
      {
        name: 'Content Marketing',
        slug: 'content-marketing',
        description: 'Nghệ thuật kể chuyện thương hiệu, copywriting và xây dựng phễu nội dung.',
        thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
        type: 'both',
        order: 8,
      },
      {
        name: 'Video Editing',
        slug: 'video-editing',
        description: 'Dựng video ngắn TikTok, Reels, YouTube bằng Premiere và CapCut chuyên sâu.',
        thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
        type: 'both',
        order: 9,
      },
      {
        name: 'Kỹ năng nghề nghiệp',
        slug: 'ky-nang-nghe-nghiep',
        description: 'Xây dựng Portfolio, phỏng vấn xin việc, kỹ năng làm việc nhóm và Freelancing.',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
        type: 'both',
        order: 10,
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.slug] = c._id;
    });
    console.log(`[SEED] Đã tạo ${createdCategories.length} danh mục!`);

    // 4. Tạo Courses
    console.log('[SEED] Tạo các khóa học thực chiến...');
    const coursesData = [
      {
        title: 'HTML CSS từ cơ bản đến thực chiến',
        slug: 'html-css-tu-co-ban-den-thuc-chien',
        shortDescription: 'Làm chủ nền tảng HTML5 ngữ nghĩa, CSS3 hiện đại, Flexbox, Grid và xây dựng website chuẩn Responsive đa thiết bị.',
        description: `Khóa học này được thiết kế dành riêng cho các bạn sinh viên và người mới bắt đầu bước chân vào thế giới Lập trình Web. Thay vì chỉ học lý thuyết hàn lâm, bạn sẽ cùng Thầy HOTB thực hành xây dựng từng thành phần giao diện thực tế: từ thanh Navigation, Hero Section, Product Grid đến hoàn thiện một Landing Page hoàn chỉnh.

Nội dung trọng tâm:
- HTML5 ngữ nghĩa (Semantic tags) giúp website chuẩn SEO và thân thiện với thiết bị hỗ trợ.
- CSS Box Model, Selector chuyên sâu và tư duy viết CSS mạch lạc, dễ mở rộng.
- Làm chủ Flexbox và CSS Grid qua các bài tập dàn trang giao diện thực tế.
- Xử lý Responsive mượt mà trên mọi kích thước màn hình: Mobile, Tablet và Desktop.`,
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        category: catMap['frontend-development'],
        tags: ['HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'Responsive', 'Web Design'],
        level: 'beginner',
        language: 'Tiếng Việt',
        youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGndAeCg48k9_2bYpUre4Wk_g40e',
        youtubePlaylistId: 'PL4cUxeGndAeCg48k9_2bYpUre4Wk_g40e',
        videoCount: 6,
        duration: '3 giờ 10 phút',
        lessons: [
          {
            order: 1,
            title: 'Bài 1: Cài đặt môi trường VS Code & Cấu trúc file HTML5',
            youtubeUrl: 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
            videoId: 'kUMe1FH4CHE',
            thumbnail: 'https://i.ytimg.com/vi/kUMe1FH4CHE/hqdefault.jpg',
            duration: '12:30',
            fileName: 'slide-bai-1-html5-basic.pdf',
            fileUrl: '#',
          },
          {
            order: 2,
            title: 'Bài 2: Các thẻ HTML Semantic chuẩn SEO & Accessibility',
            youtubeUrl: 'https://www.youtube.com/watch?v=mU6anWqZJcc',
            videoId: 'mU6anWqZJcc',
            thumbnail: 'https://i.ytimg.com/vi/mU6anWqZJcc/hqdefault.jpg',
            duration: '18:45',
            fileName: 'source-code-bai-2-semantic.zip',
            fileUrl: '#',
          },
          {
            order: 3,
            title: 'Bài 3: CSS Box Model & Đơn vị đo rem, em, px',
            youtubeUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
            videoId: '1Rs2ND1ryYc',
            thumbnail: 'https://i.ytimg.com/vi/1Rs2ND1ryYc/hqdefault.jpg',
            duration: '22:15',
            fileName: 'bai-tap-box-model.pdf',
            fileUrl: '#',
          },
          {
            order: 4,
            title: 'Bài 4: Làm chủ Flexbox qua các bài tập thực chiến',
            youtubeUrl: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
            videoId: 'yfoY53QXEnI',
            thumbnail: 'https://i.ytimg.com/vi/yfoY53QXEnI/hqdefault.jpg',
            duration: '28:00',
            fileName: 'flexbox-cheatsheet.pdf',
            fileUrl: '#',
          },
          {
            order: 5,
            title: 'Bài 5: Dàn trang với CSS Grid hiện đại',
            youtubeUrl: 'https://www.youtube.com/watch?v=G3e-cpL7ofc',
            videoId: 'G3e-cpL7ofc',
            thumbnail: 'https://i.ytimg.com/vi/G3e-cpL7ofc/hqdefault.jpg',
            duration: '25:10',
            fileName: 'grid-layout-project.zip',
            fileUrl: '#',
          },
          {
            order: 6,
            title: 'Bài 6: Xây dựng Landing Page Responsive chuẩn Mobile',
            youtubeUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
            videoId: 'w7ejDZ8SWv8',
            thumbnail: 'https://i.ytimg.com/vi/w7ejDZ8SWv8/hqdefault.jpg',
            duration: '35:20',
            fileName: 'landing-page-final.zip',
            fileUrl: '#',
          },
        ],
        instructor: {
          name: 'Thầy HOTB',
          title: 'Giảng viên Thiết kế & CNTT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          bio: 'Giảng viên chuyên ngành CNTT & Đồ họa với phương châm: Học thực chiến - Làm được việc ngay.',
        },
        objectives: [
          'Nắm vững toàn bộ cấu trúc thẻ HTML5 ngữ nghĩa chuẩn W3C',
          'Làm chủ CSS3, Flexbox và CSS Grid để dựng mọi layout phức tạp',
          'Tự tin thiết kế giao diện chuẩn Mobile-First và Responsive',
          'Biết cách tổ chức cấu trúc thư mục dự án gọn gàng, chuẩn công nghiệp',
        ],
        requirements: [
          'Máy tính có kết nối Internet',
          'Cài đặt sẵn phần mềm VS Code và trình duyệt Chrome/Firefox',
          'Tinh thần tự giác và sẵn sàng thực hành liên tục',
        ],
        targetAudience: [
          'Sinh viên ngành Công nghệ thông tin mới bắt đầu',
          'Sinh viên ngành Thiết kế đồ họa muốn học thêm code giao diện',
          'Bất kỳ ai muốn tự tay xây dựng trang web cá nhân hoặc doanh nghiệp',
        ],
        featured: true,
        status: 'published',
        seoTitle: 'Khóa học HTML CSS Thực Chiến Miễn Phí | Thầy HOTB',
        seoDescription: 'Học HTML5 CSS3 từ cơ bản đến nâng cao cùng Thầy HOTB. Xây dựng giao diện web thực tế chuẩn SEO và Responsive.',
      },
      {
        title: 'Figma UI/UX cho người mới bắt đầu',
        slug: 'figma-ui-ux-cho-nguoi-moi-bat-dau',
        shortDescription: 'Nắm vững công cụ thiết kế Figma, tư duy Layout, Typography, Color Palette, Auto Layout và xây dựng Design System hoàn chỉnh.',
        description: `Figma hiện là tiêu chuẩn vàng trong ngành thiết kế giao diện số toàn cầu. Khóa học Figma UI/UX của Thầy HOTB sẽ đưa bạn từ con số 0 đến khả năng tự tin thiết kế ứng dụng di động (Mobile App) và giao diện trang web (Web UI) hiện đại.

Bạn sẽ không chỉ học cách bấm các nút trong phần mềm, mà quan trọng hơn là thấu hiểu tư duy thiết kế: tại sao màu sắc này phù hợp, kích thước chữ bao nhiêu là chuẩn tỉ lệ vàng, và làm sao để bàn giao file hoàn hảo cho lập trình viên Front-end.`,
        thumbnail: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=800&q=80',
        category: catMap['ui-ux-design'],
        tags: ['Figma', 'UI Design', 'UX Design', 'Auto Layout', 'Design System', 'Wireframe'],
        level: 'beginner',
        language: 'Tiếng Việt',
        youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGndAeDkPnOtdLAmwG6ePkWsm7mr',
        youtubePlaylistId: 'PL4cUxeGndAeDkPnOtdLAmwG6ePkWsm7mr',
        videoCount: 5,
        duration: '2 giờ 45 phút',
        lessons: [
          {
            order: 1,
            title: 'Bài 1: Làm quen với giao diện & công cụ cốt lõi trong Figma',
            youtubeUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
            videoId: 'c9Wg6Cb_YlU',
            thumbnail: 'https://i.ytimg.com/vi/c9Wg6Cb_YlU/hqdefault.jpg',
            duration: '15:20',
            fileName: 'figma-starter-kit.fig',
            fileUrl: '#',
          },
          {
            order: 2,
            title: 'Bài 2: Typography & Phối màu chuẩn tỉ lệ vàng UI',
            youtubeUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
            videoId: 'FTFaQWZBqQ8',
            thumbnail: 'https://i.ytimg.com/vi/FTFaQWZBqQ8/hqdefault.jpg',
            duration: '20:40',
            fileName: 'color-palette-tokens.pdf',
            fileUrl: '#',
          },
          {
            order: 3,
            title: 'Bài 3: Làm chủ Auto Layout & Responsive Constraints',
            youtubeUrl: 'https://www.youtube.com/watch?v=jwCmIBJ8Jtc',
            videoId: 'jwCmIBJ8Jtc',
            thumbnail: 'https://i.ytimg.com/vi/jwCmIBJ8Jtc/hqdefault.jpg',
            duration: '24:15',
            fileName: 'auto-layout-practice.fig',
            fileUrl: '#',
          },
          {
            order: 4,
            title: 'Bài 4: Xây dựng UI Components & Variants',
            youtubeUrl: 'https://www.youtube.com/watch?v=e3T1N9_r_vM',
            videoId: 'e3T1N9_r_vM',
            thumbnail: 'https://i.ytimg.com/vi/e3T1N9_r_vM/hqdefault.jpg',
            duration: '30:00',
            fileName: 'ui-component-library.fig',
            fileUrl: '#',
          },
          {
            order: 5,
            title: 'Bài 5: Thiết kế Design System & Prototype tương tác',
            youtubeUrl: 'https://www.youtube.com/watch?v=jk1tE_2Xb6c',
            videoId: 'jk1tE_2Xb6c',
            thumbnail: 'https://i.ytimg.com/vi/jk1tE_2Xb6c/hqdefault.jpg',
            duration: '38:45',
            fileName: 'prototype-ecommerce.fig',
            fileUrl: '#',
          },
        ],
        instructor: {
          name: 'Thầy HOTB',
          title: 'Giảng viên Thiết kế & CNTT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          bio: 'Chuyên gia đào tạo UI/UX Design với hơn 100+ dự án sản phẩm số thực tế.',
        },
        objectives: [
          'Sử dụng thành thạo toàn bộ công cụ cốt lõi trong Figma',
          'Làm chủ tính năng Auto Layout và Responsive Constraints cực mạnh',
          'Xây dựng bộ thư viện UI Components và Design System chuyên nghiệp',
          'Tạo tương tác Prototype sống động để thuyết trình cho khách hàng',
        ],
        requirements: [
          'Tài khoản Figma miễn phí trên figma.com',
          'Không yêu cầu kinh nghiệm vẽ hay thiết kế trước đó',
        ],
        targetAudience: [
          'Sinh viên muốn theo đuổi nghề UI/UX Designer',
          'Lập trình viên Frontend muốn nâng cao mắt thẩm mỹ và thiết kế',
          'Product Owner / Marketer muốn phác thảo ý tưởng sản phẩm nhanh',
        ],
        featured: true,
        status: 'published',
        seoTitle: 'Khóa học Figma UI/UX Design Thực Chiến Miễn Phí | Thầy HOTB',
        seoDescription: 'Làm chủ Figma, Auto Layout, Components và Design System cùng Thầy HOTB. Kho bài giảng thực hành chất lượng cao.',
      },
      {
        title: 'JavaScript căn bản và thực chiến',
        slug: 'javascript-can-ban-va-thuc-chien',
        shortDescription: 'Xây dựng tư duy lập trình vững chắc với JavaScript hiện đại ES6+, thao tác DOM, xử lý sự kiện, Asynchronous, Fetch API và xử lý dữ liệu.',
        description: `JavaScript là ngôn ngữ linh hồn của web. Khóa học này giải thích rõ ràng các khái niệm then chốt như Scope, Hoisting, Closure, Prototype, Callback, Promise và Async/Await. 

Mỗi bài học đều đi kèm các ứng dụng mini thực tế như: Todo App, Giỏ hàng thương mại điện tử, Ứng dụng thời tiết gọi API trực tiếp, giúp bạn hiểu sâu sắc bản chất của ngôn ngữ trước khi tiến tới các Framework như React hay Next.js.`,
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-ddab3573138b?auto=format&fit=crop&w=800&q=80',
        category: catMap['frontend-development'],
        tags: ['JavaScript', 'ES6', 'DOM', 'Async/Await', 'Fetch API', 'Frontend'],
        level: 'beginner',
        language: 'Tiếng Việt',
        youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGndAeC50nslFp_E5Nq0AioX_sC6',
        youtubePlaylistId: 'PL4cUxeGndAeC50nslFp_E5Nq0AioX_sC6',
        videoCount: 5,
        duration: '3 giờ 15 phút',
        lessons: [
          {
            order: 1,
            title: 'Bài 1: Cú pháp JavaScript ES6+, Biến let/const & Kiểu dữ liệu',
            youtubeUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            videoId: 'W6NZfCO5SIk',
            thumbnail: 'https://i.ytimg.com/vi/W6NZfCO5SIk/hqdefault.jpg',
            duration: '18:00',
            fileName: 'bai-1-es6-syntax.pdf',
            fileUrl: '#',
          },
          {
            order: 2,
            title: 'Bài 2: Hàm, Arrow Function & Scope trong JS',
            youtubeUrl: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
            videoId: 'hdI2bqOjy3c',
            thumbnail: 'https://i.ytimg.com/vi/hdI2bqOjy3c/hqdefault.jpg',
            duration: '22:30',
            fileName: 'bai-2-functions.js',
            fileUrl: '#',
          },
          {
            order: 3,
            title: 'Bài 3: Thao tác DOM & Xử lý sự kiện (Event Handling)',
            youtubeUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
            videoId: 'PkZNo7MFNFg',
            thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/hqdefault.jpg',
            duration: '27:15',
            fileName: 'todo-app-starter.zip',
            fileUrl: '#',
          },
          {
            order: 4,
            title: 'Bài 4: Bất đồng bộ: Promise, Async/Await & Fetch API',
            youtubeUrl: 'https://www.youtube.com/watch?v=Bv_5Zv5cyp4',
            videoId: 'Bv_5Zv5cyp4',
            thumbnail: 'https://i.ytimg.com/vi/Bv_5Zv5cyp4/hqdefault.jpg',
            duration: '32:40',
            fileName: 'fetch-weather-api.js',
            fileUrl: '#',
          },
          {
            order: 5,
            title: 'Bài 5: Xây dựng Mini Project giỏ hàng E-Commerce',
            youtubeUrl: 'https://www.youtube.com/watch?v=mus_dM-u8Ww',
            videoId: 'mus_dM-u8Ww',
            thumbnail: 'https://i.ytimg.com/vi/mus_dM-u8Ww/hqdefault.jpg',
            duration: '40:10',
            fileName: 'cart-project-full.zip',
            fileUrl: '#',
          },
        ],
        instructor: {
          name: 'Thầy HOTB',
          title: 'Giảng viên Thiết kế & CNTT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        objectives: [
          'Hiểu sâu bản chất ngôn ngữ JavaScript và các tính năng mới nhất từ ES6 đến ES2024',
          'Thao tác thuần thục DOM, bắt sự kiện và xử lý Form Validation',
          'Làm chủ bất đồng bộ: Promise, Async/Await và gọi REST API với fetch/axios',
          'Nắm vững phương pháp debug lỗi trong trình duyệt Chrome DevTools',
        ],
        requirements: [
          'Đã có kiến thức cơ bản về HTML và CSS',
        ],
        targetAudience: [
          'Người muốn trở thành lập trình viên Web chuyên nghiệp',
          'Sinh viên CNTT cần củng cố nền tảng tư duy lập trình',
        ],
        featured: true,
        status: 'published',
        seoTitle: 'Khóa học JavaScript ES6+ Căn Bản Đến Thực Chiến | Thầy HOTB',
        seoDescription: 'Làm chủ JavaScript từ gốc đến ngọn với Thầy HOTB: DOM, Event, Async/Await, Mini Projects.',
      },
      {
        title: 'ReactJS thực chiến xây dựng ứng dụng',
        slug: 'reactjs-thuc-chien-xay-dung-ung-dung',
        shortDescription: 'Học ReactJS từ nền tảng: Functional Components, Hooks (useState, useEffect, useMemo, custom hooks), State Management và Router.',
        description: `ReactJS là thư viện Frontend phổ biến nhất hiện nay trên thế giới. Trong khóa học này, Thầy HOTB sẽ dẫn dắt bạn qua từng bước xây dựng Single Page Application (SPA) chuyên nghiệp.

Bạn sẽ được tiếp cận phương pháp tư duy "Think in React": cách phân tách UI thành các component tái sử dụng, luồng dữ liệu một chiều (Unidirectional Data Flow), tối ưu re-render và quản lý state hiệu quả.`,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        category: catMap['frontend-development'],
        tags: ['ReactJS', 'React Hooks', 'State Management', 'Single Page App', 'JavaScript'],
        level: 'intermediate',
        language: 'Tiếng Việt',
        youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGndAeB-94TgnU_7_YI9eI70cR_i',
        youtubePlaylistId: 'PL4cUxeGndAeB-94TgnU_7_YI9eI70cR_i',
        videoCount: 5,
        duration: '2 giờ 50 phút',
        lessons: [
          {
            order: 1,
            title: 'Bài 1: Tư duy Component & Cài đặt dự án với Vite',
            youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            videoId: 'bMknfKXIFA8',
            thumbnail: 'https://i.ytimg.com/vi/bMknfKXIFA8/hqdefault.jpg',
            duration: '16:20',
            fileName: 'vite-react-template.zip',
            fileUrl: '#',
          },
          {
            order: 2,
            title: 'Bài 2: JSX, Props và State với useState',
            youtubeUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
            videoId: 'SqcY0GlETPk',
            thumbnail: 'https://i.ytimg.com/vi/SqcY0GlETPk/hqdefault.jpg',
            duration: '24:10',
            fileName: 'counter-app.jsx',
            fileUrl: '#',
          },
          {
            order: 3,
            title: 'Bài 3: Side Effects & Gọi API với useEffect',
            youtubeUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
            videoId: 'w7ejDZ8SWv8',
            thumbnail: 'https://i.ytimg.com/vi/w7ejDZ8SWv8/hqdefault.jpg',
            duration: '28:30',
            fileName: 'api-fetching-demo.jsx',
            fileUrl: '#',
          },
          {
            order: 4,
            title: 'Bài 4: Điều hướng trang với React Router DOM v6',
            youtubeUrl: 'https://www.youtube.com/watch?v=4UZrsTqkcW4',
            videoId: '4UZrsTqkcW4',
            thumbnail: 'https://i.ytimg.com/vi/4UZrsTqkcW4/hqdefault.jpg',
            duration: '31:00',
            fileName: 'router-setup.zip',
            fileUrl: '#',
          },
          {
            order: 5,
            title: 'Bài 5: Tối ưu hiệu năng với useMemo, useCallback & Custom Hooks',
            youtubeUrl: 'https://www.youtube.com/watch?v=Rh3tobg7hEo',
            videoId: 'Rh3tobg7hEo',
            thumbnail: 'https://i.ytimg.com/vi/Rh3tobg7hEo/hqdefault.jpg',
            duration: '36:45',
            fileName: 'custom-hooks-guide.pdf',
            fileUrl: '#',
          },
        ],
        instructor: {
          name: 'Thầy HOTB',
          title: 'Giảng viên Thiết kế & CNTT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        objectives: [
          'Tư duy phân rã giao diện thành các React Components độc lập, tái sử dụng',
          'Làm chủ React Hooks: useState, useEffect, useRef, useContext và Custom Hooks',
          'Điều hướng trang mượt mà với React Router DOM',
          'Xây dựng ứng dụng hoàn chỉnh kết nối Backend REST API',
        ],
        requirements: [
          'Đã có nền tảng JavaScript ES6+ vững chắc',
        ],
        targetAudience: [
          'Lập trình viên muốn nâng cấp kỹ năng từ HTML/JS thuần lên ReactJS',
          'Sinh viên chuẩn bị đi thực tập vị trí Frontend Developer',
        ],
        featured: true,
        status: 'published',
        seoTitle: 'Khóa học ReactJS Thực Chiến Cho Người Mới | Thầy HOTB',
        seoDescription: 'Làm chủ ReactJS, Hooks và xây dựng Web App hiện đại cùng Thầy HOTB.',
      },
      {
        title: 'Next.js App Router cho người mới',
        slug: 'nextjs-app-router-cho-nguoi-moi',
        shortDescription: 'Xây dựng ứng dụng Full-stack với Next.js App Router: Server Components, Server Actions, Dynamic Routes, SEO và tối ưu hiệu năng.',
        description: `Next.js là framework hàng đầu của hệ sinh thái React, mang lại khả năng tối ưu SEO vượt trội, Server-side Rendering (SSR), Static Site Generation (SSG) và Server Components thế hệ mới.

Khóa học giúp bạn nắm vững cơ chế hoạt động của App Router, cấu trúc route lồng nhau, layout chia sẻ, fetching data bảo mật và deploy trực tiếp lên nền tảng đám mây Vercel chỉ với 1 cú click.`,
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        category: catMap['frontend-development'],
        tags: ['Next.js', 'App Router', 'React Server Components', 'SEO', 'Fullstack'],
        level: 'intermediate',
        language: 'Tiếng Việt',
        youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGndAeC50nslFp_E5Nq0AioX_sC6',
        youtubePlaylistId: 'PL4cUxeGndAeC50nslFp_E5Nq0AioX_sC6',
        videoCount: 4,
        duration: '2 giờ 10 phút',
        lessons: [
          {
            order: 1,
            title: 'Bài 1: Tổng quan Next.js 14 App Router & Cấu trúc thư mục',
            youtubeUrl: 'https://www.youtube.com/watch?v=843nec-IvW0',
            videoId: '843nec-IvW0',
            thumbnail: 'https://i.ytimg.com/vi/843nec-IvW0/hqdefault.jpg',
            duration: '19:15',
            fileName: 'nextjs-starter-guide.pdf',
            fileUrl: '#',
          },
          {
            order: 2,
            title: 'Bài 2: Server Components vs Client Components',
            youtubeUrl: 'https://www.youtube.com/watch?v=TJQhAclprkw',
            videoId: 'TJQhAclprkw',
            thumbnail: 'https://i.ytimg.com/vi/TJQhAclprkw/hqdefault.jpg',
            duration: '25:40',
            fileName: 'rsc-demo.zip',
            fileUrl: '#',
          },
          {
            order: 3,
            title: 'Bài 3: Dynamic Routes, Loading & Error Boundaries',
            youtubeUrl: 'https://www.youtube.com/watch?v=gSSsZReIFRk',
            videoId: 'gSSsZReIFRk',
            thumbnail: 'https://i.ytimg.com/vi/gSSsZReIFRk/hqdefault.jpg',
            duration: '29:10',
            fileName: 'dynamic-routes-project.zip',
            fileUrl: '#',
          },
          {
            order: 4,
            title: 'Bài 4: Tối ưu SEO, Metadata, Open Graph & Deploy Vercel',
            youtubeUrl: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
            videoId: 'wm5gMKuwSYk',
            thumbnail: 'https://i.ytimg.com/vi/wm5gMKuwSYk/hqdefault.jpg',
            duration: '34:00',
            fileName: 'seo-checklist-nextjs.pdf',
            fileUrl: '#',
          },
        ],
        instructor: {
          name: 'Thầy HOTB',
          title: 'Giảng viên Thiết kế & CNTT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        objectives: [
          'Hiểu rõ sự khác biệt giữa Server Components và Client Components',
          'Tối ưu hóa SEO toàn diện với Dynamic Metadata và Open Graph',
          'Quản lý Routing lồng nhau, Loading states và Error boundaries chuyên nghiệp',
          'Deploy và giám sát hiệu năng web ứng dụng trên môi trường Production',
        ],
        requirements: [
          'Đã biết ReactJS cơ bản',
        ],
        targetAudience: [
          'Frontend Developer muốn làm chủ công nghệ Next.js',
          'Người muốn xây dựng website tin tức, blog, e-commerce chuẩn SEO',
        ],
        featured: false,
        status: 'published',
        seoTitle: 'Khóa học Next.js App Router Thực Chiến | Thầy HOTB',
        seoDescription: 'Học Next.js App Router từ căn bản: Server Components, API routes và SEO đỉnh cao.',
      },
      {
        title: 'Node.js & Express RESTful API',
        slug: 'nodejs-express-restful-api',
        shortDescription: 'Xây dựng dịch vụ Web API mạnh mẽ, bảo mật cao với Node.js, Express framework, JWT Authentication và Middleware kiến trúc chuẩn.',
        description: `Học cách tự tay xây dựng hệ thống Backend từ đầu. Bạn sẽ hiểu rõ kiến trúc Event Loop của Node.js, cách phân chia MVC, viết Router, Controller, Service, Middleware kiểm tra quyền đăng nhập bằng JWT và bảo vệ API trước các cuộc tấn công bảo mật phổ biến.`,
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        category: catMap['backend-development'],
        tags: ['Node.js', 'Express.js', 'REST API', 'JWT', 'Backend', 'Security'],
        level: 'intermediate',
        language: 'Tiếng Việt',
        youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGndAeC8P9A_229_v4P5i0q39F8x',
        youtubePlaylistId: 'PL4cUxeGndAeC8P9A_229_v4P5i0q39F8x',
        videoCount: 4,
        duration: '2 giờ 20 phút',
        lessons: [
          {
            order: 1,
            title: 'Bài 1: Kiến trúc Node.js & Khởi tạo Express Server',
            youtubeUrl: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
            videoId: 'fBNz5xF-Kx4',
            thumbnail: 'https://i.ytimg.com/vi/fBNz5xF-Kx4/hqdefault.jpg',
            duration: '20:10',
            fileName: 'express-boilerplate.zip',
            fileUrl: '#',
          },
          {
            order: 2,
            title: 'Bài 2: Xây dựng Router, Controller & Kiến trúc MVC chuẩn',
            youtubeUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
            videoId: 'Oe421EPjeBE',
            thumbnail: 'https://i.ytimg.com/vi/Oe421EPjeBE/hqdefault.jpg',
            duration: '26:30',
            fileName: 'mvc-pattern.pdf',
            fileUrl: '#',
          },
          {
            order: 3,
            title: 'Bài 3: Xác thực JWT & Middleware phân quyền Admin',
            youtubeUrl: 'https://www.youtube.com/watch?v=vJEO57B05Sg',
            videoId: 'vJEO57B05Sg',
            thumbnail: 'https://i.ytimg.com/vi/vJEO57B05Sg/hqdefault.jpg',
            duration: '33:15',
            fileName: 'jwt-auth-middleware.js',
            fileUrl: '#',
          },
          {
            order: 4,
            title: 'Bài 4: Xử lý lỗi tập trung & Validate dữ liệu an toàn',
            youtubeUrl: 'https://www.youtube.com/watch?v=y18Ubzau4Qo',
            videoId: 'y18Ubzau4Qo',
            thumbnail: 'https://i.ytimg.com/vi/y18Ubzau4Qo/hqdefault.jpg',
            duration: '28:50',
            fileName: 'error-handling-utils.zip',
            fileUrl: '#',
          },
        ],
        instructor: {
          name: 'Thầy HOTB',
          title: 'Giảng viên Thiết kế & CNTT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        objectives: [
          'Xây dựng RESTful API chuẩn chuẩn công nghiệp với Express.js',
          'Xác thực người dùng an toàn bằng JWT và mã hóa mật khẩu bcrypt',
          'Phân tầng kiến trúc Controller, Service, Model rõ ràng',
          'Xử lý lỗi tập trung và validate dữ liệu an toàn',
        ],
        requirements: [
          'Nắm vững JavaScript cơ bản',
        ],
        targetAudience: [
          'Frontend Developer muốn mở rộng kỹ năng sang Backend (Fullstack)',
          'Sinh viên muốn làm đồ án tốt nghiệp hoặc dự án thực tế',
        ],
        featured: false,
        status: 'published',
        seoTitle: 'Khóa học Node.js & Express RESTful API | Thầy HOTB',
        seoDescription: 'Xây dựng Backend REST API chuẩn bảo mật với Node.js Express và JWT cùng Thầy HOTB.',
      },
      {
        title: 'MongoDB căn bản cho Web Developer',
        slug: 'mongodb-can-ban-cho-web-developer',
        shortDescription: 'Làm chủ cơ sở dữ liệu NoSQL MongoDB, thiết kế Schema dữ liệu với Mongoose ODM, Aggregation Pipeline và Indexing tăng tốc truy vấn.',
        description: `MongoDB là cơ sở dữ liệu Document NoSQL phổ biến hàng đầu thế giới. Khóa học hướng dẫn chi tiết cách mô hình hóa dữ liệu dạng JSON/BSON, mối quan hệ 1-1, 1-N, N-N trong NoSQL, sử dụng Mongoose để tương tác với MongoDB Atlas trên cloud và tối ưu hiệu suất với index.`,
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
        category: catMap['backend-development'],
        tags: ['MongoDB', 'NoSQL', 'Mongoose', 'Database', 'Backend'],
        level: 'beginner',
        language: 'Tiếng Việt',
        youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGndAeC4n76v_g4eS_7r6e3gP9_s',
        youtubePlaylistId: 'PL4cUxeGndAeC4n76v_g4eS_7r6e3gP9_s',
        videoCount: 4,
        duration: '1 giờ 45 phút',
        lessons: [
          {
            order: 1,
            title: 'Bài 1: Giới thiệu NoSQL & Kết nối MongoDB Atlas',
            youtubeUrl: 'https://www.youtube.com/watch?v=ofme2o29ngU',
            videoId: 'ofme2o29ngU',
            thumbnail: 'https://i.ytimg.com/vi/ofme2o29ngU/hqdefault.jpg',
            duration: '17:40',
            fileName: 'mongodb-setup-atlas.pdf',
            fileUrl: '#',
          },
          {
            order: 2,
            title: 'Bài 2: Thiết kế Schema dữ liệu với Mongoose ODM',
            youtubeUrl: 'https://www.youtube.com/watch?v=W-b9KGwVOCc',
            videoId: 'W-b9KGwVOCc',
            thumbnail: 'https://i.ytimg.com/vi/W-b9KGwVOCc/hqdefault.jpg',
            duration: '23:20',
            fileName: 'mongoose-schemas.js',
            fileUrl: '#',
          },
          {
            order: 3,
            title: 'Bài 3: Truy vấn CRUD & Mối quan hệ Populate',
            youtubeUrl: 'https://www.youtube.com/watch?v=ExcRbA7fy_A',
            videoId: 'ExcRbA7fy_A',
            thumbnail: 'https://i.ytimg.com/vi/ExcRbA7fy_A/hqdefault.jpg',
            duration: '29:00',
            fileName: 'crud-operations.js',
            fileUrl: '#',
          },
          {
            order: 4,
            title: 'Bài 4: Indexing & Tối ưu hóa truy vấn Database',
            youtubeUrl: 'https://www.youtube.com/watch?v=rU9ZOB0NW8s',
            videoId: 'rU9ZOB0NW8s',
            thumbnail: 'https://i.ytimg.com/vi/rU9ZOB0NW8s/hqdefault.jpg',
            duration: '25:30',
            fileName: 'indexing-performance.pdf',
            fileUrl: '#',
          },
        ],
        instructor: {
          name: 'Thầy HOTB',
          title: 'Giảng viên Thiết kế & CNTT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        objectives: [
          'Hiểu rõ sự khác biệt giữa Relational DB (SQL) và Document DB (NoSQL)',
          'Thao tác CRUD thuần thục bằng Mongoose ODM',
          'Thiết kế cấu trúc Schema dữ liệu tối ưu cho ứng dụng web',
          'Sử dụng MongoDB Atlas Cloud miễn phí và tiện lợi',
        ],
        requirements: [
          'Kiến thức lập trình cơ bản',
        ],
        targetAudience: [
          'Web Developer muốn lưu trữ dữ liệu linh hoạt với NoSQL',
        ],
        featured: false,
        status: 'published',
        seoTitle: 'Khóa học MongoDB Căn Bản Cho Web Developer | Thầy HOTB',
        seoDescription: 'Làm chủ MongoDB và Mongoose ODM cùng Thầy HOTB. Xây dựng Database thực chiến.',
      },
      {
        title: 'AI ứng dụng cho Designer & Creator',
        slug: 'ai-ung-dung-cho-designer-creator',
        shortDescription: 'Ứng dụng Midjourney, ChatGPT, v0, Canva AI để tạo concept, viết prompt chuyên sâu, tăng tốc quy trình thiết kế và sản xuất nội dung gấp 5 lần.',
        description: `Khóa học đột phá giúp bạn làm chủ làn sóng Trí tuệ nhân tạo (AI). Bạn sẽ học cách đặt câu hỏi (Prompt Engineering), ứng dụng Midjourney để render ý tưởng thị giác, dùng ChatGPT để lên kịch bản nội dung và phối hợp các công cụ AI vào quy trình làm việc thực tế hàng ngày.`,
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
        category: catMap['ai-ung-dung'],
        tags: ['AI', 'Midjourney', 'ChatGPT', 'Prompt Engineering', 'Design', 'Content'],
        level: 'beginner',
        language: 'Tiếng Việt',
        youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGndAeDkPnOtdLAmwG6ePkWsm7mr',
        youtubePlaylistId: 'PL4cUxeGndAeDkPnOtdLAmwG6ePkWsm7mr',
        videoCount: 3,
        duration: '1 giờ 20 phút',
        lessons: [
          {
            order: 1,
            title: 'Bài 1: Prompt Engineering căn bản cho ChatGPT & Claude',
            youtubeUrl: 'https://www.youtube.com/watch?v=sTeoEFz30w0',
            videoId: 'sTeoEFz30w0',
            thumbnail: 'https://i.ytimg.com/vi/sTeoEFz30w0/hqdefault.jpg',
            duration: '18:30',
            fileName: 'prompt-formula-guide.pdf',
            fileUrl: '#',
          },
          {
            order: 2,
            title: 'Bài 2: Tạo concept thiết kế & ảnh nghệ thuật với Midjourney',
            youtubeUrl: 'https://www.youtube.com/watch?v=jC4v5AS4RIM',
            videoId: 'jC4v5AS4RIM',
            thumbnail: 'https://i.ytimg.com/vi/jC4v5AS4RIM/hqdefault.jpg',
            duration: '27:10',
            fileName: 'midjourney-prompts-pack.pdf',
            fileUrl: '#',
          },
          {
            order: 3,
            title: 'Bài 3: Ứng dụng AI tạo slide, copywriting và nội dung mạng xã hội',
            youtubeUrl: 'https://www.youtube.com/watch?v=0i0g5r5jEHg',
            videoId: '0i0g5r5jEHg',
            thumbnail: 'https://i.ytimg.com/vi/0i0g5r5jEHg/hqdefault.jpg',
            duration: '30:00',
            fileName: 'ai-content-workflow.pdf',
            fileUrl: '#',
          },
        ],
        instructor: {
          name: 'Thầy HOTB',
          title: 'Giảng viên Thiết kế & CNTT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        objectives: [
          'Nắm vững kỹ thuật viết Prompt chuẩn xác cho các mô hình AI',
          'Tạo ảnh nghệ thuật, minh họa concept thương hiệu bằng AI',
          'Tự động hóa quy trình sáng tạo bài viết và hình ảnh truyền thông',
          'Tối ưu hóa thời gian và tăng vượt bậc năng suất cá nhân',
        ],
        requirements: [
          'Không yêu cầu biết lập trình hay vẽ tay',
        ],
        targetAudience: [
          'Designer, Content Creator, Marketer và người sáng tạo nội dung',
        ],
        featured: true,
        status: 'published',
        seoTitle: 'Khóa học AI Ứng Dụng Cho Designer & Creator | Thầy HOTB',
        seoDescription: 'Ứng dụng AI thực chiến vào thiết kế, sáng tạo hình ảnh và nội dung cùng Thầy HOTB.',
      },
      {
        title: 'Digital Marketing thực chiến cho sinh viên',
        slug: 'digital-marketing-thuc-chien-cho-sinh-vien',
        shortDescription: 'Chiến lược tiếp thị số toàn diện: Xây dựng chân dung khách hàng, Content Funnel, SEO on-page, Facebook Ads, Google Ads và phân tích dữ liệu.',
        description: `Digital Marketing không chỉ là chạy quảng cáo bấm nút. Khóa học trang bị cho bạn tư duy tiếp thị gốc: hiểu tâm lý khách hàng, xây dựng hành trình mua sắm (Customer Journey), viết nội dung chạm cảm xúc và đo lường chuyển đổi thực tế trên các kênh số.`,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        category: catMap['digital-marketing'],
        tags: ['Marketing', 'SEO', 'Facebook Ads', 'Google Ads', 'Analytics'],
        level: 'beginner',
        language: 'Tiếng Việt',
        youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGndAeCg48k9_2bYpUre4Wk_g40e',
        youtubePlaylistId: 'PL4cUxeGndAeCg48k9_2bYpUre4Wk_g40e',
        videoCount: 3,
        duration: '1 giờ 25 phút',
        lessons: [
          {
            order: 1,
            title: 'Bài 1: Xây dựng chân dung khách hàng & Phễu tiếp thị nội dung',
            youtubeUrl: 'https://www.youtube.com/watch?v=Z_KspIXeb6U',
            videoId: 'Z_KspIXeb6U',
            thumbnail: 'https://i.ytimg.com/vi/Z_KspIXeb6U/hqdefault.jpg',
            duration: '21:15',
            fileName: 'customer-persona-template.xlsx',
            fileUrl: '#',
          },
          {
            order: 2,
            title: 'Bài 2: Chiến lược SEO On-page & Nghiên cứu từ khóa',
            youtubeUrl: 'https://www.youtube.com/watch?v=4yD_UqF_u2w',
            videoId: '4yD_UqF_u2w',
            thumbnail: 'https://i.ytimg.com/vi/4yD_UqF_u2w/hqdefault.jpg',
            duration: '28:40',
            fileName: 'keyword-research-sheet.xlsx',
            fileUrl: '#',
          },
          {
            order: 3,
            title: 'Bài 3: Thiết lập chiến dịch quảng cáo Facebook Ads tối ưu chi phí',
            youtubeUrl: 'https://www.youtube.com/watch?v=w4Z1o6Hq0gI',
            videoId: 'w4Z1o6Hq0gI',
            thumbnail: 'https://i.ytimg.com/vi/w4Z1o6Hq0gI/hqdefault.jpg',
            duration: '35:20',
            fileName: 'facebook-ads-checklist.pdf',
            fileUrl: '#',
          },
        ],
        instructor: {
          name: 'Thầy HOTB',
          title: 'Giảng viên Thiết kế & CNTT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        objectives: [
          'Hiểu rõ phễu Marketing từ Nhận biết (Awareness) đến Chuyển đổi (Conversion)',
          'Tự thiết lập chiến dịch quảng cáo Facebook và Google chuẩn tối ưu chi phí',
          'Phân tích chỉ số ROI, CTR, CPA qua công cụ Google Analytics',
        ],
        requirements: [
          'Điện thoại hoặc máy tính kết nối Internet',
        ],
        targetAudience: [
          'Sinh viên ngành Kinh tế, Marketing, Quản trị kinh doanh',
          'Chủ shop online muốn tự chạy chiến dịch tiếp thị',
        ],
        featured: false,
        status: 'published',
        seoTitle: 'Khóa học Digital Marketing Thực Chiến Cho Sinh Viên | Thầy HOTB',
        seoDescription: 'Học Digital Marketing thực chiến từ gốc đến ngọn cùng Thầy HOTB.',
      },
      {
        title: 'Canva & Video Editing cho người sáng tạo nội dung',
        slug: 'canva-video-editing-sang-tao-noi-dung',
        shortDescription: 'Thiết kế ấn phẩm truyền thông với Canva chuyên sâu và biên tập video ngắn cuốn hút trên CapCut/Premiere dành cho TikTok, Reels.',
        description: `Học cách sản xuất video ngắn triệu view và thiết kế banner, thumbnail thu hút người xem ngay trong 3 giây đầu tiên. Thầy HOTB hướng dẫn trọn vẹn quy trình: từ chọn nhạc nền, căn nhịp cắt cảnh (Beat sync), chỉnh màu video đến chèn phụ đề tự động bắt mắt.`,
        thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
        category: catMap['video-editing'],
        tags: ['Canva', 'CapCut', 'Video Editing', 'Shorts', 'TikTok', 'Reels'],
        level: 'beginner',
        language: 'Tiếng Việt',
        youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGndAeDkPnOtdLAmwG6ePkWsm7mr',
        youtubePlaylistId: 'PL4cUxeGndAeDkPnOtdLAmwG6ePkWsm7mr',
        videoCount: 3,
        duration: '1 giờ 15 phút',
        lessons: [
          {
            order: 1,
            title: 'Bài 1: Thiết kế bộ nhận diện mạng xã hội với Canva Pro',
            youtubeUrl: 'https://www.youtube.com/watch?v=Uf1I0y1aU34',
            videoId: 'Uf1I0y1aU34',
            thumbnail: 'https://i.ytimg.com/vi/Uf1I0y1aU34/hqdefault.jpg',
            duration: '16:50',
            fileName: 'canva-brandkit-templates.pdf',
            fileUrl: '#',
          },
          {
            order: 2,
            title: 'Bài 2: Cắt dựng video ngắn TikTok / Reels bằng CapCut PC',
            youtubeUrl: 'https://www.youtube.com/watch?v=d_8L_oO0oM4',
            videoId: 'd_8L_oO0oM4',
            thumbnail: 'https://i.ytimg.com/vi/d_8L_oO0oM4/hqdefault.jpg',
            duration: '26:10',
            fileName: 'capcut-sound-effects-pack.zip',
            fileUrl: '#',
          },
          {
            order: 3,
            title: 'Bài 3: Chỉnh màu, hiệu ứng chuyển cảnh và âm thanh viral',
            youtubeUrl: 'https://www.youtube.com/watch?v=_7rP0x4U3wY',
            videoId: '_7rP0x4U3wY',
            thumbnail: 'https://i.ytimg.com/vi/_7rP0x4U3wY/hqdefault.jpg',
            duration: '31:30',
            fileName: 'color-grading-presets.zip',
            fileUrl: '#',
          },
        ],
        instructor: {
          name: 'Thầy HOTB',
          title: 'Giảng viên Thiết kế & CNTT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        objectives: [
          'Làm chủ công cụ Canva Pro để thiết kế poster, banner, slide thuyết trình',
          'Biên tập video ngắn chuyên nghiệp bằng CapCut PC và Premiere',
          'Tạo hiệu ứng chữ chạy, sound effect và chuyển cảnh cuốn hút',
        ],
        requirements: [
          'Máy tính hoặc điện thoại thông minh',
        ],
        targetAudience: [
          'Người muốn làm kênh YouTube, TikTok, Facebook Reels cá nhân',
        ],
        featured: false,
        status: 'published',
        seoTitle: 'Khóa học Canva & Video Editing Cho Người Sáng Tạo | Thầy HOTB',
        seoDescription: 'Thiết kế đồ họa Canva và dựng video ngắn viral cùng Thầy HOTB.',
      },
    ];

    const createdCourses = await Course.insertMany(coursesData);
    const courseMap = {};
    createdCourses.forEach((c) => {
      courseMap[c.slug] = c._id;
    });
    console.log(`[SEED] Đã tạo ${createdCourses.length} khóa học!`);

    // 5. Tạo 12+ Articles chất lượng cao (bằng Markdown thuần chuẩn tiếng Việt)
    console.log('[SEED] Tạo các bài viết tutorial chuyên sâu...');
    const articlesData = [
      {
        title: 'HTML Semantic là gì? Hướng dẫn chuẩn SEO & Accessibility',
        slug: 'html-semantic-la-gi-va-tai-sao-can-dung',
        excerpt: 'Tìm hiểu tại sao thẻ HTML Semantic lại quan trọng đối với thứ hạng SEO, khả năng tiếp cận người dùng khuyết tật (Accessibility) và cấu trúc code sạch.',
        category: catMap['frontend-development'],
        tags: ['HTML5', 'Semantic Web', 'SEO', 'Accessibility', 'Frontend'],
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        readingTime: 4,
        featured: true,
        status: 'published',
        relatedCourses: [courseMap['html-css-tu-co-ban-den-thuc-chien']],
        content: `## 1. HTML Semantic là gì?

**HTML Semantic** (hay HTML mang tính ngữ nghĩa) là việc sử dụng các thẻ HTML phản ánh chính xác ý nghĩa và vai trò của nội dung bên trong nó, thay vì lạm dụng thẻ vô nghĩa như \`<div>\` hay \`<span>\` cho tất cả mọi thứ.

Ví dụ:
- Thẻ \`<header>\` thể hiện phần đầu trang hoặc đầu của một bài viết.
- Thẻ \`<nav>\` thể hiện thanh điều hướng chính.
- Thẻ \`<main>\` bao bọc nội dung cốt lõi của trang web.
- Thẻ \`<article>\` thể hiện một bài viết hoặc mẩu tin độc lập.
- Thẻ \`<section>\` thể hiện một phân đoạn nội dung theo chủ đề.
- Thẻ \`<aside>\` thể hiện nội dung bổ trợ (như thanh sidebar).
- Thẻ \`<footer>\` thể hiện phần chân trang.

---

## 2. So sánh Semantic vs Non-Semantic

Hãy nhìn vào hai cách viết cấu trúc trang dưới đây:

### Cách viết cũ (Non-Semantic - Lạm dụng Div):
\`\`\`html
<div id="header">
  <div class="logo">Thầy HOTB</div>
  <div class="menu">
    <a href="/">Trang chủ</a>
    <a href="/khoa-hoc">Khóa học</a>
  </div>
</div>
<div id="main-content">
  <div class="post">
    <div class="post-title">HTML Semantic là gì?</div>
  </div>
</div>
\`\`\`

### Cách viết chuẩn hiện đại (HTML5 Semantic):
\`\`\`html
<header>
  <div class="logo">Thầy HOTB</div>
  <nav aria-label="Menu chính">
    <a href="/">Trang chủ</a>
    <a href="/khoa-hoc">Khóa học</a>
  </nav>
</header>
<main>
  <article>
    <h1>HTML Semantic là gì?</h1>
  </article>
</main>
\`\`\`

---

## 3. Ba lợi ích to lớn của HTML Semantic

> **Lời khuyên từ Thầy HOTB:** Một lập trình viên Frontend giỏi không chỉ tạo ra giao diện đẹp bằng mắt thường, mà mã nguồn bên dưới phải chuẩn mực và thân thiện với máy tìm kiếm.

| Lợi ích | Mô tả chi tiết |
| :--- | :--- |
| **Tối ưu SEO** | Google Bot dễ dàng phân biệt đâu là tiêu đề chính (\`<h1>\`), nội dung bài (\`<article>\`) và chân trang (\`<footer>\`). |
| **Accessibility (A11y)** | Trình đọc màn hình (Screen Reader) của người khiếm thị có thể nhảy nhanh giữa các khu vực mà không bị lạc lối. |
| **Dễ bảo trì mã nguồn** | Các thành viên trong team nhìn vào file HTML là hiểu ngay cấu trúc trang web mà không cần dò class CSS. |

---

## 4. Bảng tra cứu các thẻ Semantic phổ biến nhất

- \`<figure>\` và \`<figcaption>\`: Dùng khi nhúng hình ảnh kèm chú thích minh họa.
- \`<time>\`: Định dạng ngày tháng chuẩn máy đọc (ví dụ: \`<time datetime="2026-09-08">08/09/2026</time>\`).
- \`<mark>\`: Đánh dấu văn bản được highlight.
- \`<details>\` và \`<summary>\`: Tạo khối đóng/mở nội dung mà không cần dùng đến JavaScript.

Hãy áp dụng ngay vào các dự án của bạn để nâng tầm chất lượng code nhé!`,
      },
      {
        title: 'Flexbox CSS toàn tập: Cẩm nang dàn trang layout thực tế',
        slug: 'flexbox-css-tu-co-ban-den-thuc-chien',
        excerpt: 'Làm chủ Flexbox với sơ đồ trực quan: display flex, justify-content, align-items, flex-wrap, flex-grow và cách căn giữa phần tử hoàn hảo.',
        category: catMap['frontend-development'],
        tags: ['CSS', 'Flexbox', 'Layout', 'Web Design', 'Frontend'],
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        readingTime: 5,
        featured: true,
        status: 'published',
        relatedCourses: [courseMap['html-css-tu-co-ban-den-thuc-chien']],
        content: `## 1. Giới thiệu về Flexbox (Flexible Box Layout)

**Flexbox** là mô hình dàn trang 1 chiều (1D) mạnh mẽ trong CSS3, được thiết kế để phân bổ không gian và căn chỉnh các phần tử con bên trong một container, ngay cả khi kích thước của chúng không cố định hoặc động.

Trước khi Flexbox ra đời, lập trình viên phải "vật lộn" với \`float\`, \`clear\`, \`inline-block\` và \`position: absolute\` vô cùng đau đầu để căn giữa một khối.

---

## 2. Hai trục cốt lõi trong Flexbox

Để hiểu Flexbox, bạn chỉ cần nhớ 2 trục:

1. **Main Axis (Trục chính):** Mặc định là trục nằm ngang từ trái sang phải (\`flex-direction: row\`).
2. **Cross Axis (Trục phụ):** Luôn vuông góc với Main Axis (mặc định là trục dọc từ trên xuống dưới).

\`\`\`css
.container {
  display: flex; /* Kích hoạt Flexbox container */
  flex-direction: row; /* row | column | row-reverse | column-reverse */
}
\`\`\`

---

## 3. Các thuộc tính quan trọng dành cho Cha (Container)

### 3.1. Căn chỉnh trên trục chính với \`justify-content\`
- \`flex-start\`: Dồn về đầu trục.
- \`flex-end\`: Dồn về cuối trục.
- \`center\`: Căn chính giữa.
- \`space-between\`: Đẩy 2 phần tử ra sát 2 mép, chia đều khoảng trống ở giữa.
- \`space-around\`: Chia đều khoảng cách xung quanh mỗi phần tử.
- \`space-evenly\`: Chia khoảng cách đều tuyệt đối giữa các phần tử và mép ngoài.

### 3.2. Căn chỉnh trên trục phụ với \`align-items\`
- \`stretch\` (mặc định): Kéo giãn các phần tử con để chiếm trọn chiều cao.
- \`center\`: Căn giữa theo trục dọc.
- \`flex-start\` / \`flex-end\`: Căn sát mép trên hoặc dưới.

---

## 4. Tuyệt kỹ căn giữa kinh điển trong CSS

\`\`\`css
/* Căn giữa 1 phần tử cả ngang lẫn dọc chỉ với 3 dòng code */
.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
\`\`\`

> **Mẹo hay:** Kết hợp thêm thuộc tính \`gap: 16px;\` trên container để tạo khoảng cách giữa các thẻ con mà không cần dùng \`margin\` rườm rà.`,
      },
      {
        title: 'CSS Grid thực chiến: Xây dựng giao diện responsive nhiều cột',
        slug: 'css-grid-danh-cho-nguoi-moi-bat-dau',
        excerpt: 'Khi nào nên dùng CSS Grid thay vì Flexbox? Hướng dẫn tạo grid 12 cột, grid-template-columns, minmax, auto-fit và grid-template-areas.',
        category: catMap['frontend-development'],
        tags: ['CSS', 'CSS Grid', 'Responsive', 'Frontend'],
        coverImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
        readingTime: 4,
        featured: false,
        status: 'published',
        relatedCourses: [courseMap['html-css-tu-co-ban-den-thuc-chien']],
        content: `## 1. CSS Grid là gì?

Nếu Flexbox chuyên xử lý bố cục 1 chiều (theo dòng hoặc theo cột), thì **CSS Grid** là hệ thống bố cục 2 chiều (2D), cho phép bạn điều khiển cả hàng (rows) và cột (columns) cùng một lúc.

---

## 2. Công thức tạo Grid Responsive tự động không cần Media Query

Đây là công thức "ma thuật" mà Thầy HOTB luôn khuyến khích sinh viên áp dụng:

\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
\`\`\`

### Giải thích công thức:
- \`auto-fit\`: Tự động điền số lượng cột vừa vặn với kích thước màn hình.
- \`minmax(280px, 1fr)\`: Mỗi card có độ rộng tối thiểu là 280px. Khi màn hình lớn hơn, các card sẽ tự dãn đều bằng nhau theo đơn vị phân số \`1fr\`.
- Kết quả: Trên mobile sẽ hiển thị 1 cột, tablet tự chuyển thành 2 cột, và màn hình desktop tự mở thành 3-4 cột mà không cần viết 1 dòng \`@media\` nào!`,
      },
      {
        title: 'DOM JavaScript là gì? Các phương thức thao tác DOM quan trọng nhất',
        slug: 'javascript-dom-la-gi-huong-dan-thao-tac-dom',
        excerpt: 'Hiểu cặn kẽ Document Object Model (DOM), cách truy vấn phần tử, lắng nghe sự kiện click/input, thay đổi nội dung và tạo animation.',
        category: catMap['frontend-development'],
        tags: ['JavaScript', 'DOM', 'Events', 'Frontend'],
        coverImage: 'https://images.unsplash.com/photo-1579468118864-ddab3573138b?auto=format&fit=crop&w=800&q=80',
        readingTime: 5,
        featured: false,
        status: 'published',
        relatedCourses: [courseMap['javascript-can-ban-va-thuc-chien']],
        content: `## 1. Khái niệm Document Object Model (DOM)

Khi trình duyệt tải một trang web HTML, nó sẽ chuyển đổi toàn bộ mã nguồn HTML thành một cây đối tượng gọi là **DOM Tree**. 

JavaScript có thể truy cập vào cây đối tượng này để:
- Thay đổi nội dung văn bản hoặc mã HTML bên trong.
- Thêm, xóa hoặc chỉnh sửa các thuộc tính và class CSS.
- Lắng nghe và phản hồi lại các hành động của người dùng (như click chuột, gõ phím, cuộn trang).

---

## 2. Các phương thức tìm kiếm phần tử phổ biến

\`\`\`javascript
// 1. Tìm phần tử đơn đầu tiên khớp với CSS selector
const submitBtn = document.querySelector('#btn-submit');

// 2. Tìm tất cả các phần tử khớp (trả về NodeList)
const allCards = document.querySelectorAll('.course-card');

// 3. Lắng nghe sự kiện click
submitBtn.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('Người dùng đã bấm nút gửi!');
});
\`\`\`

> **Lưu ý hiệu năng:** Hạn chế truy vấn DOM nhiều lần trong các vòng lặp lớn. Hãy lưu phần tử vào biến để tái sử dụng.`,
      },
      {
        title: 'React Component, Props & State hoạt động như thế nào?',
        slug: 'react-component-hoat-dong-the-nao-props-state',
        excerpt: 'Bí quyết tư duy phân rã component trong React: Phân biệt sự khác nhau giữa Props (dữ liệu truyền vào) và State (dữ liệu nội tại).',
        category: catMap['frontend-development'],
        tags: ['ReactJS', 'Props', 'State', 'Frontend'],
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        readingTime: 5,
        featured: false,
        status: 'published',
        relatedCourses: [courseMap['reactjs-thuc-chien-xay-dung-ung-dung']],
        content: `## 1. Ba trụ cột của React: Component, Props và State

React hoạt động dựa trên triết lý xây dựng ứng dụng từ các khối lego độc lập gọi là **Components**.

### So sánh nhanh giữa Props và State:

| Tiêu chí | Props | State |
| :--- | :--- | :--- |
| **Nguồn gốc** | Do Component cha truyền xuống | Khởi tạo và quản lý bên trong Component |
| **Khả năng thay đổi** | Bất biến (Read-only / Immutable) | Có thể thay đổi thông qua hàm setter |
| **Mục đích** | Tùy biến hiển thị cho Component con | Lưu trữ trạng thái tương tác động của UI |

---

## 2. Ví dụ thực hành với Functional Component & useState

\`\`\`jsx
import React, { useState } from 'react';

// CourseCard nhận vào 'props' từ cha
function CourseCard({ title, videoCount, level }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{videoCount} bài học • Cấp độ: {level}</p>
      
      <button onClick={() => setIsLiked(!isLiked)}>
        {isLiked ? '❤️ Đã thích' : '🤍 Thích khóa học'}
      </button>
    </div>
  );
}
\`\`\``,
      },
      {
        title: 'Tìm hiểu Next.js App Router: Server Components và Client Components',
        slug: 'nextjs-app-router-la-gi-huong-dan-toan-dien',
        excerpt: 'Giải mã cơ chế hoạt động của React Server Components (RSC), Client Components (\'use client\'), cách tải dữ liệu siêu nhanh và tối ưu SEO.',
        category: catMap['frontend-development'],
        tags: ['Next.js', 'React Server Components', 'SEO', 'App Router'],
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        readingTime: 6,
        featured: true,
        status: 'published',
        relatedCourses: [courseMap['nextjs-app-router-cho-nguoi-moi']],
        content: `## 1. Sự đột phá của Next.js App Router

Kể từ Next.js 13.4, thư mục \`/app\` (App Router) chính thức trở thành chuẩn mặc định thay thế cho Pages Router cũ. 

Sự thay đổi lớn nhất nằm ở mô hình **React Server Components (RSC)**: mặc định tất cả component bên trong \`/app\` đều chạy trên máy chủ (Server).

---

## 2. Khi nào dùng Server Component vs Client Component?

### Server Components (Mặc định):
- Trực tiếp kết nối cơ sở dữ liệu (Database) hoặc gọi API an toàn mà không lộ token.
- Giảm dung lượng JavaScript tải về trình duyệt của người dùng (Zero Bundle Size).
- Tối ưu SEO vượt bậc vì mã HTML được render sẵn 100%.

### Client Components (Thêm chỉ thị \`'use client'\` ở đầu file):
- Khi cần xử lý tương tác người dùng: \`onClick\`, \`onChange\`, \`onSubmit\`.
- Khi cần sử dụng các React Hooks: \`useState\`, \`useEffect\`, \`useRef\`.
- Khi cần truy cập các API của trình duyệt: \`localStorage\`, \`window\`, \`document\`.`,
      },
      {
        title: 'REST API là gì? 7 nguyên tắc thiết kế API chuẩn RESTful cho lập trình viên',
        slug: 'rest-api-la-gi-nguyen-tac-thiet-ke-api-chuan',
        excerpt: 'Hướng dẫn thiết kế RESTful API chuẩn quốc tế: Quy tắc đặt tên endpoint danh từ số nhiều, sử dụng đúng HTTP Methods và chuẩn hóa HTTP Status Code.',
        category: catMap['backend-development'],
        tags: ['REST API', 'Backend', 'Node.js', 'HTTP'],
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        readingTime: 5,
        featured: false,
        status: 'published',
        relatedCourses: [courseMap['nodejs-express-restful-api']],
        content: `## 1. REST API là gì?

**REST** (Representational State Transfer) là kiểu kiến trúc phần mềm phổ biến nhất để truyền tải dữ liệu giữa Frontend và Backend qua giao thức HTTP.

---

## 2. 7 Nguyên tắc thiết kế RESTful API chuẩn mực

### 1. Sử dụng Danh từ số nhiều thay vì Động từ trong URI
- ✅ Chuẩn: \`GET /api/courses\`, \`POST /api/courses\`
- ❌ Sai: \`GET /api/get-all-courses\`, \`POST /api/create-new-course\`

### 2. Sử dụng đúng HTTP Method cho từng hành động
- \`GET\`: Đọc dữ liệu (Không làm thay đổi state server).
- \`POST\`: Tạo mới bản ghi.
- \`PUT\`: Cập nhật toàn bộ bản ghi.
- \`PATCH\`: Cập nhật một vài trường cụ thể.
- \`DELETE\`: Xóa bản ghi.

### 3. Trả về đúng mã trạng thái HTTP (Status Code)
- \`200 OK\`: Thành công.
- \`201 Created\`: Tạo mới thành công.
- \`400 Bad Request\`: Dữ liệu gửi lên sai định dạng.
- \`401 Unauthorized\`: Chưa đăng nhập hoặc token không hợp lệ.
- \`403 Forbidden\`: Đã đăng nhập nhưng không có quyền.
- \`404 Not Found\`: Không tìm thấy tài nguyên.
- \`500 Internal Server Error\`: Lỗi máy chủ.`,
      },
      {
        title: 'So sánh MongoDB (NoSQL) và SQL Database: Khi nào nên chọn NoSQL?',
        slug: 'mongodb-khac-sql-nhu-the-nao-khi-nao-nen-dung',
        excerpt: 'Phân tích ưu nhược điểm giữa cơ sở dữ liệu quan hệ SQL (MySQL, PostgreSQL) và cơ sở dữ liệu Document NoSQL (MongoDB).',
        category: catMap['backend-development'],
        tags: ['MongoDB', 'SQL', 'NoSQL', 'Database', 'Backend'],
        coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
        readingTime: 4,
        featured: false,
        status: 'published',
        relatedCourses: [courseMap['mongodb-can-ban-cho-web-developer']],
        content: `## 1. Sự khác biệt căn bản giữa SQL và MongoDB

Trong khi các hệ quản trị CSDL quan hệ (RDBMS) lưu trữ dữ liệu dưới dạng các bảng (Tables) có cấu trúc cố định với các cột và dòng, thì **MongoDB** lưu trữ dữ liệu dưới dạng các tài liệu linh hoạt (Documents) theo chuẩn BSON/JSON.

---

## 2. Bảng so sánh thuật ngữ

| Khái niệm SQL (MySQL, PostgreSQL) | Khái niệm MongoDB (NoSQL) |
| :--- | :--- |
| **Database** | Database |
| **Table** (Bảng) | **Collection** (Tập hợp) |
| **Row / Record** (Dòng) | **Document** (Tài liệu JSON) |
| **Column** (Cột) | **Field** (Thuộc tính) |
| **JOIN** | **Populate / $lookup** |
| **Primary Key** | **_id (ObjectId)** |

---

## 3. Khi nào bạn nên chọn MongoDB?
- Dự án cần phát triển nhanh (Agile/MVP), cấu trúc dữ liệu liên tục thay đổi.
- Lưu trữ các tài liệu phân cấp lồng nhau (Nested data) như danh sách bài học trong khóa học, bình luận lồng nhau.
- Các hệ thống quản lý nội dung (CMS, Learning Hub, Blog, E-commerce Catalog).`,
      },
      {
        title: 'Làm chủ Auto Layout trong Figma: Bí quyết thiết kế UI responsive nhanh chóng',
        slug: 'figma-auto-layout-bi-quyet-thiet-ke-responsive',
        excerpt: 'Khám phá sức mạnh của Auto Layout Figma (Shift + A): Hug contents, Fill container, Min/Max width và thiết kế Card giao diện tự động thích ứng.',
        category: catMap['ui-ux-design'],
        tags: ['Figma', 'Auto Layout', 'UI Design', 'UX'],
        coverImage: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=800&q=80',
        readingTime: 4,
        featured: true,
        status: 'published',
        relatedCourses: [courseMap['figma-ui-ux-cho-nguoi-moi-bat-dau']],
        content: `## 1. Auto Layout là gì?

**Auto Layout** là tính năng quyền lực nhất trong Figma. Nó mô phỏng lại chính xác cách mà Flexbox trong CSS hoạt động trên trình duyệt web.

Khi bật Auto Layout cho một khung (Frame), các phần tử bên trong sẽ tự động co giãn, dàn đều và giữ đúng khoảng cách (Padding & Gap) mỗi khi bạn thay đổi độ dài văn bản hoặc kích thước màn hình.

---

## 2. Ba chế độ kích thước (Resizing) trong Auto Layout

1. **Fixed Width / Height:** Giữ nguyên kích thước cố định (ví dụ nút bấm luôn rộng 120px).
2. **Hug Contents:** Khung tự co lại vừa khít với nội dung bên trong (rất phù hợp cho Badge hoặc Button).
3. **Fill Container:** Khung tự giãn ra để chiếm trọn 100% không gian của khung cha (phù hợp cho Card bài viết, Form Input).

> **Phím tắt cần nhớ:** Nhấn tổ hợp \`Shift + A\` để kích hoạt Auto Layout cho bất kỳ lựa chọn nào trong Figma!`,
      },
      {
        title: '10 nguyên tắc thiết kế UI/UX kinh điển mọi Designer cần khắc cốt ghi tâm',
        slug: '10-nguyen-tac-thiet-ke-ui-ux-kinh-dien',
        excerpt: 'Từ luật Fitts, luật Hick, phân cấp thị giác (Visual Hierarchy), độ tương phản màu sắc đến việc tôn trọng khoảng trắng (Whitespace).',
        category: catMap['ui-ux-design'],
        tags: ['UI Design', 'UX Design', 'Design Principles'],
        coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
        readingTime: 6,
        featured: false,
        status: 'published',
        relatedCourses: [courseMap['figma-ui-ux-cho-nguoi-moi-bat-dau']],
        content: `## 1. Phân cấp thị giác rõ ràng (Visual Hierarchy)
Người dùng web không đọc từng chữ, họ quét (scan) mắt qua trang theo hình chữ **F** hoặc chữ **Z**. Hãy dùng kích thước chữ (Font Size), độ đậm (Font Weight) và màu sắc để hướng mắt người dùng vào thông điệp quan trọng nhất trước.

## 2. Luật Hick: Càng ít lựa chọn, ra quyết định càng nhanh
Đừng nhồi nhét quá nhiều nút bấm kêu gọi hành động (CTA) trên cùng một màn hình. Hãy làm nổi bật duy nhất 1 nút chính (Primary Button).

## 3. Sức mạnh của khoảng trắng (Whitespace)
Khoảng trắng không phải là không gian lãng phí, mà là "khoảng thở" giúp mắt người dùng thư giãn và làm nổi bật các khối nội dung giá trị.`,
      },
      {
        title: 'AI hỗ trợ Designer như thế nào? Top công cụ AI đắc lực cho dân thiết kế',
        slug: 'ai-ho-tro-designer-nhu-the-nao-top-cong-cu-2026',
        excerpt: 'Khám phá cách tận dụng Midjourney, ChatGPT, v0 và Canva AI để mở rộng ý tưởng sáng tạo mà không sợ bị trí tuệ nhân tạo thay thế.',
        category: catMap['ai-ung-dung'],
        tags: ['AI', 'Midjourney', 'Design', 'Creativity'],
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
        readingTime: 4,
        featured: true,
        status: 'published',
        relatedCourses: [courseMap['ai-ung-dung-cho-designer-creator']],
        content: `## 1. AI không thay thế Designer — Người dùng AI sẽ thay thế người không dùng

AI đang biến đổi căn bản cách chúng ta sáng tạo. Thay vì mất hàng giờ tìm kiếm stock ảnh hay vẽ từng icon thô sơ, Designer hiện đại có thể dùng AI như một người trợ lý siêu năng lực để:
- Tạo Moodboard và phát triển ý tưởng Visual Concept tức thì.
- Viết văn bản mẫu (Copywriting) thực tế thay vì dùng "Lorem Ipsum" sáo rỗng.
- Chuyển đổi bản vẽ tay phác thảo thành bản vẽ số chỉ trong vài giây.`,
      },
      {
        title: 'Ứng dụng AI trong Lập trình Web: Cách tăng 300% hiệu suất viết code',
        slug: 'ai-ho-tro-lap-trinh-web-tang-nang-suat',
        excerpt: 'Khai thác tối đa trợ lý AI để sinh code, tạo unit test, tìm kiếm bug và giải thích kiến trúc phần mềm phức tạp.',
        category: catMap['ai-ung-dung'],
        tags: ['AI', 'Coding', 'Web Development', 'Productivity'],
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
        readingTime: 4,
        featured: false,
        status: 'published',
        relatedCourses: [courseMap['javascript-can-ban-va-thuc-chien'], courseMap['nextjs-app-router-cho-nguoi-moi']],
        content: `## 1. Cách lập trình viên hiện đại làm việc với AI

Thời đại ngày nay, lập trình viên không còn phải nhớ từng hàm nhỏ trong thư viện. Thay vào đó, kỹ năng quan trọng nhất chuyển thành:
- **Tư duy kiến trúc hệ thống (Architecture Design).**
- **Khả năng mô tả bài toán chính xác cho AI (Context & Prompting).**
- **Năng lực thẩm định, kiểm tra tính đúng đắn và bảo mật của đoạn mã do AI sinh ra.**`,
      },
    ];

    const createdArticles = await Article.insertMany(articlesData);
    const articleMap = {};
    createdArticles.forEach((a) => {
      articleMap[a.slug] = a._id;
    });
    console.log(`[SEED] Đã tạo ${createdArticles.length} bài viết!`);

    // 6. Cập nhật liên kết chéo 2 chiều (Course <-> Article)
    console.log('[SEED] Thiết lập liên kết chéo giữa Khóa học và Bài viết...');
    await Course.findByIdAndUpdate(courseMap['html-css-tu-co-ban-den-thuc-chien'], {
      relatedArticles: [
        articleMap['html-semantic-la-gi-va-tai-sao-can-dung'],
        articleMap['flexbox-css-tu-co-ban-den-thuc-chien'],
        articleMap['css-grid-danh-cho-nguoi-moi-bat-dau'],
      ],
    });

    await Course.findByIdAndUpdate(courseMap['figma-ui-ux-cho-nguoi-moi-bat-dau'], {
      relatedArticles: [
        articleMap['figma-auto-layout-bi-quyet-thiet-ke-responsive'],
        articleMap['10-nguyen-tac-thiet-ke-ui-ux-kinh-dien'],
      ],
    });

    await Course.findByIdAndUpdate(courseMap['javascript-can-ban-va-thuc-chien'], {
      relatedArticles: [
        articleMap['javascript-dom-la-gi-huong-dan-thao-tac-dom'],
        articleMap['ai-ho-tro-lap-trinh-web-tang-nang-suat'],
      ],
    });

    await Course.findByIdAndUpdate(courseMap['reactjs-thuc-chien-xay-dung-ung-dung'], {
      relatedArticles: [
        articleMap['react-component-hoat-dong-the-nao-props-state'],
        articleMap['nextjs-app-router-la-gi-huong-dan-toan-dien'],
      ],
    });

    await Course.findByIdAndUpdate(courseMap['ai-ung-dung-cho-designer-creator'], {
      relatedArticles: [
        articleMap['ai-ho-tro-designer-nhu-the-nao-top-cong-cu-2026'],
      ],
    });

    // 7. Tạo Learning Paths
    console.log('[SEED] Tạo các lộ trình học tập...');
    const learningPathsData = [
      {
        title: 'Lộ trình Front-end Developer thực chiến',
        slug: 'lo-trinh-frontend-developer-thuc-chien',
        description: 'Lộ trình từng bước vững chắc giúp bạn đi từ người chưa biết gì trở thành Lập trình viên Front-end sẵn sàng làm việc tại doanh nghiệp.',
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        level: 'beginner',
        category: catMap['frontend-development'],
        featured: true,
        status: 'published',
        courses: [
          courseMap['html-css-tu-co-ban-den-thuc-chien'],
          courseMap['javascript-can-ban-va-thuc-chien'],
          courseMap['reactjs-thuc-chien-xay-dung-ung-dung'],
          courseMap['nextjs-app-router-cho-nguoi-moi'],
        ],
        articles: [
          articleMap['html-semantic-la-gi-va-tai-sao-can-dung'],
          articleMap['flexbox-css-tu-co-ban-den-thuc-chien'],
          articleMap['react-component-hoat-dong-the-nao-props-state'],
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Nền tảng HTML5 & CSS3 Ngữ Nghĩa',
            description: 'Làm quen với cấu trúc tài liệu web, các thẻ HTML5 ngữ nghĩa chuẩn SEO, làm chủ Box Model và tư duy định kiểu giao diện.',
            estimatedTime: '2-3 tuần',
            course: courseMap['html-css-tu-co-ban-den-thuc-chien'],
            article: articleMap['html-semantic-la-gi-va-tai-sao-can-dung'],
          },
          {
            stepNumber: 2,
            title: 'Dàn trang Hiện Đại: Flexbox & CSS Grid',
            description: 'Thành thạo dàn trang Responsive đa thiết bị, cắt giao diện từ bản vẽ thiết kế Figma sang mã HTML/CSS sạch.',
            estimatedTime: '2 tuần',
            course: courseMap['html-css-tu-co-ban-den-thuc-chien'],
            article: articleMap['flexbox-css-tu-co-ban-den-thuc-chien'],
          },
          {
            stepNumber: 3,
            title: 'JavaScript ES6+ & Tư duy Tương Tác DOM',
            description: 'Lập trình logic, xử lý sự kiện người dùng, bất đồng bộ Async/Await, gọi REST API và làm việc với dữ liệu JSON.',
            estimatedTime: '3-4 tuần',
            course: courseMap['javascript-can-ban-va-thuc-chien'],
            article: articleMap['javascript-dom-la-gi-huong-dan-thao-tac-dom'],
          },
          {
            stepNumber: 4,
            title: 'ReactJS: Xây dựng Single Page App',
            description: 'Tư duy Component, làm chủ React Hooks (useState, useEffect), quản lý State, điều hướng React Router DOM.',
            estimatedTime: '4 tuần',
            course: courseMap['reactjs-thuc-chien-xay-dung-ung-dung'],
            article: articleMap['react-component-hoat-dong-the-nao-props-state'],
          },
          {
            stepNumber: 5,
            title: 'Next.js App Router & Tối Ưu Production',
            description: 'Tận dụng React Server Components, Server-side Rendering, tối ưu hóa điểm số SEO & Lighthouse và triển khai lên Vercel.',
            estimatedTime: '3 tuần',
            course: courseMap['nextjs-app-router-cho-nguoi-moi'],
            article: articleMap['nextjs-app-router-la-gi-huong-dan-toan-dien'],
          },
        ],
      },
      {
        title: 'Lộ trình UI/UX Designer từ Zero đến Hero',
        slug: 'lo-trinh-ui-ux-designer-tu-zero-den-hero',
        description: 'Học thiết kế trải nghiệm người dùng bài bản: từ nghiên cứu hành vi người dùng, phác thảo Wireframe đến hoàn thiện Prototype và Portfolio.',
        thumbnail: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=800&q=80',
        level: 'beginner',
        category: catMap['ui-ux-design'],
        featured: true,
        status: 'published',
        courses: [
          courseMap['figma-ui-ux-cho-nguoi-moi-bat-dau'],
          courseMap['ai-ung-dung-cho-designer-creator'],
        ],
        articles: [
          articleMap['10-nguyen-tac-thiet-ke-ui-ux-kinh-dien'],
          articleMap['figma-auto-layout-bi-quyet-thiet-ke-responsive'],
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Tư duy thị giác & Nguyên tắc UX cốt lõi',
            description: 'Nắm vững lý thuyết màu sắc, nghệ thuật sắp chữ (Typography), luật Fitts, luật Hick và Visual Hierarchy.',
            estimatedTime: '2 tuần',
            article: articleMap['10-nguyen-tac-thiet-ke-ui-ux-kinh-dien'],
          },
          {
            stepNumber: 2,
            title: 'Làm chủ Figma & Auto Layout',
            description: 'Sử dụng thành thạo phần mềm Figma, Auto Layout, Constraints, Components và Variants.',
            estimatedTime: '3 tuần',
            course: courseMap['figma-ui-ux-cho-nguoi-moi-bat-dau'],
            article: articleMap['figma-auto-layout-bi-quyet-thiet-ke-responsive'],
          },
          {
            stepNumber: 3,
            title: 'Xây dựng Design System & Prototype',
            description: 'Thiết kế bộ UI Kit hoàn chỉnh, tạo liên kết chuyển động Prototype tương tác sống động.',
            estimatedTime: '2 tuần',
            course: courseMap['figma-ui-ux-cho-nguoi-moi-bat-dau'],
          },
          {
            stepNumber: 4,
            title: 'Hoàn thiện Case Study & Portfolio cá nhân',
            description: 'Đóng gói dự án mẫu chuẩn quốc tế để ứng tuyển vào các công ty công nghệ.',
            estimatedTime: '2 tuần',
          },
        ],
      },
      {
        title: 'Lộ trình AI Creator & Tự Động Hóa Nội Dung',
        slug: 'lo-trinh-ai-creator-tu-dong-hoa-noi-dung',
        description: 'Tận dụng sức mạnh của AI thế hệ mới để xây dựng hệ thống sản xuất hình ảnh, video và bài viết tự động chất lượng cao.',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
        level: 'all',
        category: catMap['ai-ung-dung'],
        featured: true,
        status: 'published',
        courses: [
          courseMap['ai-ung-dung-cho-designer-creator'],
          courseMap['canva-video-editing-sang-tao-noi-dung'],
        ],
        articles: [
          articleMap['ai-ho-tro-designer-nhu-the-nao-top-cong-cu-2026'],
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Làm chủ Prompt Engineering với ChatGPT & Claude',
            description: 'Viết lời nhắc có cấu trúc để lên ý tưởng, tóm tắt tài liệu và tạo dàn ý bài giảng chuyên sâu.',
            estimatedTime: '1 tuần',
            course: courseMap['ai-ung-dung-cho-designer-creator'],
          },
          {
            stepNumber: 2,
            title: 'Sáng tạo hình ảnh thương hiệu với Midjourney',
            description: 'Điều khiển góc máy, ánh sáng, phong cách nghệ thuật để render ảnh chất lượng studio.',
            estimatedTime: '2 tuần',
            article: articleMap['ai-ho-tro-designer-nhu-the-nao-top-cong-cu-2026'],
          },
          {
            stepNumber: 3,
            title: 'Sản xuất Video ngắn triệu view với CapCut & AI Voice',
            description: 'Tự động tạo giọng đọc AI, chèn phụ đề thông minh và dựng video hàng loạt.',
            estimatedTime: '2 tuần',
            course: courseMap['canva-video-editing-sang-tao-noi-dung'],
          },
        ],
      },
    ];

    await LearningPath.insertMany(learningPathsData);
    console.log(`[SEED] Đã tạo ${learningPathsData.length} lộ trình học tập!`);

    console.log('==============================================');
    console.log('🎉 SEED DATABASE THÀNH CÔNG VỚI DỮ LIỆU ĐẦY ĐỦ!');
    console.log('👤 Admin: admin@thayhotb.vn | Pass: Admin@123456');
    console.log('==============================================');
    process.exit(0);
  } catch (error) {
    console.error('[SEED ERROR]', error);
    process.exit(1);
  }
};

seedDatabase();
