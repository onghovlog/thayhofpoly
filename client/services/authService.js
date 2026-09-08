import { fetchApi } from './api';

export const loginAdmin = async (email, password) => {
  const result = await fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });

  if (result.success && result.data.token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('thayhotb_token', result.data.token);
      localStorage.setItem('thayhotb_user', JSON.stringify(result.data.user));
    }
  }

  return result;
};

export const logoutAdmin = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('thayhotb_token');
    localStorage.removeItem('thayhotb_user');
    window.location.href = '/admin/login';
  }
};

export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('thayhotb_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

export const checkAuth = async () => {
  return await fetchApi('/auth/me', { cache: 'no-store' });
};
