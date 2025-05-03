import axios from '../api/axios';

// Add token to requests if it exists
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dashboardApi = {
  getShippingCosts: (period: 'month' | 'year' | 'custom', startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    params.append('period', period);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return axios.get(`/dashboard/shipping-costs?${params.toString()}`);
  },
  
  getCodStats: () => {
    return axios.get('/dashboard/cod-stats');
  },
  
  getOrderStats: () => {
    return axios.get('/dashboard/order-stats');
  },
  
  exportExcel: (period: 'month' | 'year' | 'custom', startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    params.append('period', period);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return axios.get(`/dashboard/export-excel?${params.toString()}`, {
      responseType: 'blob'
    });
  }
};

export const orderApi = {
  createOrder: (orderData: any) => {
    return axios.post('/orders', orderData);
  },

  getOrders: (params: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    return axios.get(`/orders?${queryParams.toString()}`);
  },

  getOrderById: (orderId: string) => {
    return axios.get(`/orders/${orderId}`);
  },

  trackOrder: (trackingCode: string) => {
    return axios.get(`/orders/track/${trackingCode}`);
  },

  updateOrder: (orderId: string, orderData: any) => {
    return axios.put(`/orders/${orderId}`, orderData);
  },

  cancelOrder: (orderId: string) => {
    return axios.post(`/orders/${orderId}/cancel`);
  },

  getOrderHistory: (orderId: string) => {
    return axios.get(`/orders/${orderId}/history`);
  },

  getShipperLocation: (orderId: string) => {
    return axios.get(`/orders/${orderId}/shipper-location`);
  }
};

export default axios; 