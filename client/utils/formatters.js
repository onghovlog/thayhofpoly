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
