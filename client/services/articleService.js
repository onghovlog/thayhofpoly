import { fetchApi } from './api';

export const getArticles = async (params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      query.append(key, params[key]);
    }
  });
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await fetchApi(`/articles${queryString}`);
};

export const getArticleBySlug = async (slug) => {
  return await fetchApi(`/articles/${slug}`, { cache: 'no-store' }); // view counter updates
};

export const getArticleById = async (id) => {
  return await fetchApi(`/articles/id/${id}`, { cache: 'no-store' });
};

export const createArticle = async (data) => {
  return await fetchApi('/articles', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
};

export const updateArticle = async (id, data) => {
  return await fetchApi(`/articles/id/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
};

export const deleteArticle = async (id) => {
  return await fetchApi(`/articles/id/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });
};
