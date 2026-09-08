import { fetchApi } from './api';

/**
 * Gửi biểu mẫu liên hệ / Đăng ký tư vấn
 */
export const submitContact = async (data) => {
  return await fetchApi('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Lấy danh sách tin nhắn liên hệ (Admin)
 */
export const getContacts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await fetchApi(`/contact${query ? `?${query}` : ''}`, { revalidate: 0 });
};

/**
 * Xóa tin nhắn liên hệ (Admin)
 */
export const deleteContact = async (id) => {
  return await fetchApi(`/contact/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Cập nhật trạng thái tin nhắn (Admin)
 */
export const updateContactStatus = async (id, status) => {
  return await fetchApi(`/contact/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};
