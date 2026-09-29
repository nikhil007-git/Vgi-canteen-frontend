const getApiBaseUrl = () => {
  const raw = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
  return raw.endsWith('/api') ? raw : `${raw}/api`;
};

const API_BASE_URL = getApiBaseUrl();

const getHeaders = (extraHeaders = {}) => {
  const adminToken = localStorage.getItem("vgi_admin_token");
  const userToken = localStorage.getItem("vgi_token");
  const isAdminPath = typeof window !== "undefined" && (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/admin-secure-panel"));
  const token = isAdminPath ? (adminToken || userToken) : (userToken || adminToken);
  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  post: async (endpoint, body) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  put: async (endpoint, body) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  patch: async (endpoint, body = {}) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("vgi_admin_token") || localStorage.getItem("vgi_token");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      headers,
      body: formData
    });
    return handleResponse(res);
  },

  getUploadStatus: async () => {
    const res = await fetch(`${API_BASE_URL}/upload/status`);
    return handleResponse(res);
  },

  delete: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};

// API Endpoints Object
export const vgiApi = {
  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updateAdminCredentials: (data) => api.patch('/auth/admin/credentials', data),

  // Menu & Categories
  getCategories: () => api.get('/menu/categories'),
  getItems: (params = {}) => {
    const query = new URLSearchParams();
    if (params.categoryId && params.categoryId !== 'all') query.append('categoryId', params.categoryId);
    if (params.search) query.append('search', params.search);
    if (params.popular) query.append('popular', 'true');
    if (params.featured) query.append('featured', 'true');
    return api.get(`/menu/items?${query.toString()}`);
  },
  getItemById: (id) => api.get(`/menu/items/${id}`),

  // Admin Menu CRUD
  createMenuItem: (data) => api.post('/menu/items', data),
  updateMenuItem: (id, data) => api.put(`/menu/items/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/menu/items/${id}`),
  toggleSoldOut: (id) => api.patch(`/menu/items/${id}/sold-out`),
  createCategory: (data) => api.post('/menu/categories', data),
  updateCategory: (id, data) => api.put(`/menu/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/menu/categories/${id}`),

  // Coupons
  validateCoupon: (code, subtotal) => api.post('/coupons/validate', { code, subtotal }),
  getActiveCoupons: () => api.get('/coupons/active'),
  getAdminCoupons: () => api.get('/coupons/admin'),
  createCoupon: (data) => api.post('/coupons/admin', data),
  updateCoupon: (id, data) => api.put(`/coupons/admin/${id}`, data),
  deleteCoupon: (id) => api.delete(`/coupons/admin/${id}`),

  // Canteen Settings & Status
  getCanteenStatus: () => api.get('/canteen/status'),
  updateCanteenSettings: (data) => api.put('/canteen/settings', data),

  // Orders
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getMyActiveOrders: () => api.get('/orders/my-active'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  submitRating: (id, ratingData) => api.post(`/orders/${id}/rate`, ratingData),

  // Payment
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),

  
  // Cloudinary Image Upload
  uploadImage: (file) => api.uploadImage(file),
  getUploadStatus: () => api.getUploadStatus(),

  // Admin Ops
  getAdminOrders: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    return api.get(`/admin/orders?${query.toString()}`);
  },
  updateOrderStatus: (id, data) => api.patch(`/admin/orders/${id}/status`, data),
  verifyPickup: (data) => api.post('/admin/orders/verify-pickup', data),
  getDashboardKPIs: () => api.get('/admin/kpis'),
  getAnalytics: () => api.get('/admin/analytics'),

  // Notifications
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllNotificationsRead: () => api.patch('/notifications/read-all')
};

