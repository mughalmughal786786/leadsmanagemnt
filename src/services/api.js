import axios from "axios";

// =========================
// BASE API CONFIG
// =========================
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================
// AUTO ATTACH TOKEN
// =========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// AUTH API
// =========================
export const authAPI = {
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  login: async (data) => {
    const res = await api.post("/auth/login", data);
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { success: true };
  },

  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};

// =========================
// ADMIN API
// =========================
export const adminAPI = {
  getAllCSRs: async () => {
    const res = await api.get("/admin/csrs");
    return res.data;
  },

  createCSR: async (data) => {
    const res = await api.post("/admin/csrs", data);
    return res.data;
  },

  updateCSRPermissions: async (id, permissions) => {
    const res = await api.put(
      `/admin/csrs/${id}/permissions`,
      { permissions }
    );
    return res.data;
  },

  deleteCSR: async (id) => {
    const res = await api.delete(`/admin/csrs/${id}`);
    return res.data;
  },

  getPermissions: async () => {
    const res = await api.get("/admin/permissions");
    return res.data;
  },
};

// =========================
// LEADS API
// =========================
export const leadAPI = {
  getAllLeads: async () => {
    const res = await api.get("/leads");
    return res.data;
  },

  getLeadStats: async () => {
    const res = await api.get("/leads/stats");
    return res.data;
  },

  createLead: async (data) => {
    const res = await api.post("/leads", data);
    return res.data;
  },

  updateLead: async (id, data) => {
    const res = await api.put(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id) => {
    const res = await api.delete(`/leads/${id}`);
    return res.data;
  },
};

// =========================
// PROJECT API
// =========================
export const projectAPI = {
  getAllProjects: async () => {
    const res = await api.get("/projects");
    return res.data;
  },

  getProject: async (id) => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  getProjectStats: async () => {
    const res = await api.get("/projects/stats");
    return res.data;
  },

  createProject: async (data) => {
    const res = await api.post("/projects", data);
    return res.data;
  },

  updateProject: async (id, data) => {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },

  deleteProject: async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },
};

// =========================
// PAYMENT API (ONLY PAYMENTS)
// =========================
export const paymentAPI = {
  getAllPayments: async () => {
    const res = await api.get("/payments");
    return res.data;
  },

  getPaymentStats: async () => {
    const res = await api.get("/payments/stats");
    return res.data;
  },

  createPayment: async (data) => {
    const res = await api.post("/payments", data);
    return res.data;
  },

  updatePayment: async (id, data) => {
    const res = await api.put(`/payments/${id}`, data);
    return res.data;
  },

  deletePayment: async (id) => {
    const res = await api.delete(`/payments/${id}`);
    return res.data;
  },

  getPaymentsByProject: async (projectId) => {
    const res = await api.get(
      `/payments/project/${projectId}`
    );
    return res.data;
  },
};

// =========================
// INVOICE API (SEPARATE SYSTEM ✅)
// =========================
export const invoiceAPI = {
  getInvoices: async () => {
    const res = await api.get("/invoices");
    return res.data;
  },

  getInvoice: async (id) => {
    const res = await api.get(`/invoices/${id}`);
    return res.data;
  },

  createInvoice: async (data) => {
    const res = await api.post("/invoices", data);
    return res.data;
  },

  updateInvoice: async (id, data) => {
    const res = await api.put(`/invoices/${id}`, data);
    return res.data;
  },

  deleteInvoice: async (id) => {
    const res = await api.delete(`/invoices/${id}`);
    return res.data;
  },
};

// =========================
// DASHBOARD API
// =========================
export const dashboardAPI = {
  getAdminDashboard: async () => {
    const res = await api.get("/dashboard/admin");
    return res.data;
  },

  getCSRDashboard: async () => {
    const res = await api.get("/dashboard/csr");
    return res.data;
  },
};

export default api;
