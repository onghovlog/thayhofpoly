const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Xác định Base URL phù hợp cho môi trường SSR (Node.js) và Client Browser
 */
const getBaseUrl = () => {
  let base = API_BASE_URL;

  // Nếu là đường dẫn tương đối (ví dụ: '/api')
  if (base.startsWith('/')) {
    if (typeof window === 'undefined') {
      // Trong môi trường SSR Node.js, fetch bắt buộc cần full URL
      const internalServer =
        process.env.INTERNAL_API_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        'http://127.0.0.1:5000';
      return `${internalServer.replace(/\/+$/, '')}${base}`;
    }
  }

  return base.replace(/\/+$/, '');
};

/**
 * Lấy token xác thực từ client storage
 */
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('thayhotb_token');
  }
  return null;
};

/**
 * Base Fetch Wrapper
 */
export const fetchApi = async (endpoint, options = {}) => {
  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  // Nếu là Next.js Server Components, cho phép revalidation hoặc SSR caching
  if (options.revalidate !== undefined) {
    config.next = { revalidate: options.revalidate };
  } else if (!config.cache && !config.next) {
    // Mặc định cache nhẹ 60s để trang load tức thì
    config.next = { revalidate: 60 };
  }

  try {
    const res = await fetch(url, config);
    const contentType = res.headers.get('content-type') || '';
    
    let result;
    if (contentType.includes('application/json')) {
      result = await res.json();
    } else {
      const text = await res.text();
      if (!res.ok) {
        throw new Error(
          res.status === 404
            ? `Không tìm thấy API endpoint: ${url}`
            : `Lỗi kết nối máy chủ API (${res.status}). Vui lòng đảm bảo Server Backend đang chạy.`
        );
      }
      try {
        result = JSON.parse(text);
      } catch (e) {
        throw new Error(`Phản hồi không đúng định dạng JSON từ ${url}`);
      }
    }

    if (!res.ok) {
      throw new Error(result?.message || `Lỗi API: ${res.status}`);
    }

    return result;
  } catch (error) {
    console.error(`[API Fetch Error] ${url}:`, error.message);
    throw error;
  }
};

