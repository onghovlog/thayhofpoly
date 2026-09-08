import { fetchApi } from './api';

/**
 * Lấy cấu hình website công khai
 */
export const getPublicSettings = async () => {
  return await fetchApi('/settings', { revalidate: 0 });
};

/**
 * Lấy toàn bộ cấu hình hệ thống (Admin)
 */
export const getAdminSettings = async () => {
  return await fetchApi('/settings/admin', { revalidate: 0 });
};

/**
 * Cập nhật cấu hình hệ thống (Admin)
 */
export const updateSettings = async (data) => {
  return await fetchApi('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
