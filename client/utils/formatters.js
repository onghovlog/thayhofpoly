/**
 * Định dạng ngày theo chuẩn tiếng Việt: dd/mm/yyyy
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

/**
 * Định dạng ngày giờ chi tiết
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Định dạng số view (ví dụ: 1.2k views)
 */
export const formatViews = (views) => {
  if (!views && views !== 0) return '0';
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'k';
  }
  return views.toString();
};

/**
 * Chuyển đổi mã level thành nhãn tiếng Việt
 */
export const formatLevel = (level) => {
  switch (level) {
    case 'beginner':
      return 'Cơ bản';
    case 'intermediate':
      return 'Trung cấp';
    case 'advanced':
      return 'Nâng cao';
    case 'all':
      return 'Mọi cấp độ';
    default:
      return level || 'Cơ bản';
  }
};

/**
 * Chuyển đổi chuỗi tiếng Việt thành slug chuẩn SEO
 */
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Tự động tính tổng thời lượng từ danh sách bài học
 * @param {Array} lessons - Danh sách bài học có thuộc tính duration (ví dụ '15:30', '01:20:00')
 * @returns {string} - Chuỗi thời lượng dạng 'X giờ Y phút' hoặc 'X phút'
 */
export const calculateTotalDuration = (lessons = []) => {
  if (!lessons || lessons.length === 0) return 'Tự học theo tiến độ';

  let totalSeconds = 0;

  for (const lesson of lessons) {
    const raw = lesson.duration || '';
    if (!raw) continue;

    const parts = raw.toString().trim().split(':').map((p) => parseInt(p, 10));

    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      // HH:MM:SS
      totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      // MM:SS
      totalSeconds += parts[0] * 60 + parts[1];
    } else if (parts.length === 1 && !isNaN(parts[0])) {
      // MM or seconds
      totalSeconds += parts[0] * 60;
    }
  }

  if (totalSeconds === 0) return 'Tự học theo tiến độ';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours} giờ ${minutes} phút` : `${hours} giờ`;
  }
  return `${minutes > 0 ? minutes : 1} phút`;
};
