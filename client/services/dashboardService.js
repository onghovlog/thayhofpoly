import { fetchApi } from './api';

export const getDashboardStats = async () => {
  return await fetchApi('/dashboard/stats', { cache: 'no-store' });
};
