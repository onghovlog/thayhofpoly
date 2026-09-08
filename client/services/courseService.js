import { fetchApi } from './api';

export const getCourses = async (params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      query.append(key, params[key]);
    }
  });
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await fetchApi(`/courses${queryString}`);
};

export const getCourseBySlug = async (slug) => {
  return await fetchApi(`/courses/${slug}`);
};

export const getCourseById = async (id) => {
  return await fetchApi(`/courses/id/${id}`, { cache: 'no-store' });
};

export const createCourse = async (data) => {
  return await fetchApi('/courses', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
};

export const updateCourse = async (id, data) => {
  return await fetchApi(`/courses/id/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
};

export const deleteCourse = async (id) => {
  return await fetchApi(`/courses/id/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });
};
