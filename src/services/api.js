import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Admin API calls
export const adminAPI = {
  // Get all CSR users
  getAllCSRs: async () => {
    const response = await api.get('/admin/csrs');
    return response.data;
  },

  // Create new CSR user
  createCSR: async (csrData) => {
    const response = await api.post('/admin/csrs', csrData);
    return response.data;
  },

  // Update CSR permissions
  updateCSRPermissions: async (csrId, permissions) => {
    const response = await api.put(`/admin/csrs/${csrId}/permissions`, { permissions });
    return response.data;
  },

  // Delete CSR user
  deleteCSR: async (csrId) => {
    const response = await api.delete(`/admin/csrs/${csrId}`);
    return response.data;
  },

  // Get available permissions
  getPermissions: async () => {
    const response = await api.get('/admin/permissions');
    return response.data;
  }
};

// Lead API calls
export const leadAPI = {
  // Get all leads
  getAllLeads: async () => {
    const response = await api.get('/leads');
    return response.data;
  },

  // Get single lead
  getLead: async (leadId) => {
    const response = await api.get(`/leads/${leadId}`);
    return response.data;
  },

  // Create new lead
  createLead: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  // Update lead
  updateLead: async (leadId, leadData) => {
    const response = await api.put(`/leads/${leadId}`, leadData);
    return response.data;
  },

  // Delete lead
  deleteLead: async (leadId) => {
    const response = await api.delete(`/leads/${leadId}`);
    return response.data;
  },

  // Get lead statistics
  getLeadStats: async () => {
    const response = await api.get('/leads/stats');
    return response.data;
  }
};

// Project API calls
export const projectAPI = {
  // Get all projects
  getAllProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  // Get single project
  getProject: async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },

  // Get project statistics
  getProjectStats: async () => {
    const response = await api.get('/projects/stats');
    return response.data;
  }
};

// Payment API calls
export const paymentAPI = {
  // Get all payments
  getAllPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  // Get single payment
  getPayment: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  },

  // Create new payment
  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  // Update payment
  updatePayment: async (paymentId, paymentData) => {
    const response = await api.put(`/payments/${paymentId}`, paymentData);
    return response.data;
  },

  // Delete payment
  deletePayment: async (paymentId) => {
    const response = await api.delete(`/payments/${paymentId}`);
    return response.data;
  },

  // Get payment statistics
  getPaymentStats: async () => {
    const response = await api.get('/payments/stats');
    return response.data;
  },

  // Get payments by project
  getPaymentsByProject: async (projectId) => {
    const response = await api.get(`/payments/project/${projectId}`);
    return response.data;
  }
};

export default api;
