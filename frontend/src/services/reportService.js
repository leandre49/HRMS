import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:2000/api',
  withCredentials: true,
});

export const reportService = {
  getStatusSummary: () => api.get('/reports/status-summary'),
  getOnLeaveReport: () => api.get('/reports/on-leave'),
};

export default reportService;
