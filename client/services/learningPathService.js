import { fetchApi } from './api';

export const getLearningPaths = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const queryString = query ? `?${query}` : '';
  return await fetchApi(`/learning-paths${queryString}`);
};

export const getLearningPathBySlug = async (slug) => {
  return await fetchApi(`/learning-paths/${slug}`);
};

export const getLearningPathById = async (id) => {
  return await fetchApi(`/learning-paths/id/${id}`, { cache: 'no-store' });
};

export const createLearningPath = async (data) => {
  return await fetchApi('/learning-paths', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
};

export const updateLearningPath = async (id, data) => {
  return await fetchApi(`/learning-paths/id/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
};

export const deleteLearningPath = async (id) => {
  return await fetchApi(`/learning-paths/id/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });
};
