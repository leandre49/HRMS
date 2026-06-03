import api from './api';

export const positionService = {
  getAllPositions: () => api.get('/positions'),
  getPositionById: (id) => api.get(`/positions/${id}`),
  createPosition: (data) => api.post('/positions', data),
  updatePosition: (id, data) => api.put(`/positions/${id}`, data),
  deletePosition: (id) => api.delete(`/positions/${id}`),
};

export default positionService;
