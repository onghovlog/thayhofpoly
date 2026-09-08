const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
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
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || `Lỗi API: ${res.status}`);
    }

    return result;
  } catch (error) {
    console.error(`[API Fetch Error] ${endpoint}:`, error.message);
    throw error;
  }
};
