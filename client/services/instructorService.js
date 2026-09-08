import { fetchApi } from './api';

/**
 * Lấy thông tin hồ sơ giảng viên
 */
export const getInstructorProfile = async () => {
  return await fetchApi('/instructor', { revalidate: 0 });
};

/**
 * Cập nhật thông tin hồ sơ giảng viên (Admin)
 */
export const updateInstructorProfile = async (data) => {
  return await fetchApi('/instructor', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
