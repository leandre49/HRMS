import api from './api';

export const employeeService = {
  getAllEmployees: (params) => api.get('/employees', { params }),
  getEmployeeById: (id) => api.get(`/employees/${id}`),
  createEmployee: (data) => api.post('/employees', data),
  updateEmployee: (id, data) => api.put(`/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
  searchEmployees: (query, department, status) => {
    return api.get('/employees', {
      params: {
        search: query,
        department,
        status,
      },
    });
  },
};

export default employeeService;
