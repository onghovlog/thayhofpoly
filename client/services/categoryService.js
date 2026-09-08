import { fetchApi } from './api';

export const getCategories = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const queryString = query ? `?${query}` : '';
  return await fetchApi(`/categories${queryString}`);
};

export const getCategoryBySlug = async (slug) => {
  return await fetchApi(`/categories/${slug}`);
};

export const createCategory = async (data) => {
  return await fetchApi('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
};

export const updateCategory = async (id, data) => {
  return await fetchApi(`/categories/id/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
};

export const deleteCategory = async (id) => {
  return await fetchApi(`/categories/id/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });
};
