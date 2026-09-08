import { fetchApi } from './api';

export const searchAll = async (query, limit = 10) => {
  return await fetchApi(`/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
    cache: 'no-store',
  });
};
