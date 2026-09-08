/**
 * Chuyển chuỗi tiếng Việt thành slug chuẩn SEO
 */
const slugifyText = (text) => {
  if (!text) return '';
  let str = text.toLowerCase().trim();

  // Chuyển ký tự có dấu thành không dấu
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');

  // Xóa ký tự đặc biệt
  str = str.replace(/[^a-z0-9 -]/g, '');
  // Thay khoảng trắng thành dấu gạch ngang
  str = str.replace(/\s+/g, '-');
  // Gộp nhiều dấu gạch ngang
  str = str.replace(/-+/g, '-');

  return str;
};

/**
 * Trích xuất YouTube Playlist ID từ URL hoặc ID thuần
 * Ví dụ:
 * https://www.youtube.com/playlist?list=PL4cUxeGndAeCg48k9_2bYpUre4Wk_g40e
 * https://youtu.be/watch?v=xxx&list=PL4cUxeGndAeCg48k9_2bYpUre4Wk_g40e
 * PL4cUxeGndAeCg48k9_2bYpUre4Wk_g40e
 */
const parseYoutubePlaylistId = (input) => {
  if (!input) return '';
  const trimmed = input.trim();
  
  // Nếu đã là ID thuần (bắt đầu bằng PL hoặc RD hoặc dài từ 10-60 ký tự không chứa / hay ?)
  if (/^[a-zA-Z0-9_-]{10,60}$/.test(trimmed) && !trimmed.includes('/') && !trimmed.includes('http')) {
    return trimmed;
  }

  // Regex tìm tham số list=
  const match = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }

  return trimmed;
};

/**
 * Trích xuất YouTube Video ID từ URL hoặc ID thuần
 * Ví dụ:
 * https://www.youtube.com/watch?v=kUMe1FH4CHE
 * https://youtu.be/kUMe1FH4CHE
 * https://www.youtube.com/embed/kUMe1FH4CHE
 * kUMe1FH4CHE
 */
const parseYoutubeVideoId = (input) => {
  if (!input) return '';
  const trimmed = input.trim();

  // Nếu là chuỗi 11 ký tự alnum/_/- không chứa dấu / hay ?
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // youtu.be/<id>
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // youtube.com/watch?v=<id>
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // embed/<id> or v/<id>
  const embedMatch = trimmed.match(/(?:embed|v)\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  return trimmed;
};

/**
 * Tính thời gian đọc bài viết (phút)
 */
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const cleanText = content.replace(/[#*`_\[\]()]/g, '');
  const wordCount = cleanText.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
};

/**
 * Format JSON response thành công
 */
const sendResponse = (res, statusCode = 200, data = null, message = 'Thành công', pagination = null) => {
  const payload = {
    success: true,
    message,
    data,
  };
  if (pagination) {
    payload.pagination = pagination;
  }
  return res.status(statusCode).json(payload);
};

/**
 * Format JSON response lỗi
 */
const sendError = (res, statusCode = 400, message = 'Đã có lỗi xảy ra', errors = null) => {
  const payload = {
    success: false,
    message,
  };
  if (errors) {
    payload.errors = errors;
  }
  return res.status(statusCode).json(payload);
};

module.exports = {
  slugifyText,
  parseYoutubePlaylistId,
  parseYoutubeVideoId,
  calculateReadingTime,
  sendResponse,
  sendError,
};
