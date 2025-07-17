// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllProperties = async (filters = {}) => {
  try {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    const params = new URLSearchParams(cleanedFilters);
    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    throw error;
  }
};

export const getPropertyById = async (id) => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch property with id ${id}:`, error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const getMyProperties = async () => {
    try {
        const response = await api.get('/properties/my');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch my properties:', error);
        throw error;
    }
};

export const getMyApplications = async () => {
    try {
        const response = await api.get('/applications/my-applications');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch my applications:', error);
        throw error;
    }
};

export const applyToProperty = async (propertyId, message) => {
    try {
        const response = await api.post(`/applications/${propertyId}/apply`, { message });
        return response.data;
    } catch (error) {
        console.error('Failed to apply to property:', error.response?.data?.message || error.message);
        throw error.response?.data || error;
    }
};

export const getApplicationStatus = async (propertyId) => {
  try {
    const response = await api.get(`/applications/status/${propertyId}`);
    return response.data;
  } catch (error) {
      if (error.response && error.response.status === 404) {
          return { status: 'not_applied' };
      }
    console.error('Failed to fetch application status:', error);
    throw error;
  }
};

export const getApplicationsForProperty = async (propertyId) => {
  try {
    const response = await api.get(`/applications/property/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch applications for property:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const approveApplication = async (applicationId) => {
  try {
    const response = await api.put(`/applications/${applicationId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Failed to approve application:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const rejectApplication = async (applicationId) => {
  try {
    const response = await api.put(`/applications/${applicationId}/reject`);
    return response.data;
  } catch (error) {
    console.error('Failed to reject application:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const createProperty = async (formData) => {
  try {
    const response = await api.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create property:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const getAllUsersForAdmin = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const deleteUserAsAdmin = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete user:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const getAllPropertiesForAdmin = async () => {
  try {
    const response = await api.get('/admin/properties');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch properties for admin:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const deletePropertyAsAdmin = async (propertyId) => {
  try {
    const response = await api.delete(`/admin/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete property as admin:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const getMessages = async () => {
  try {
    const response = await api.get('/messages');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch messages:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const sendMessage = async (messageData) => {
  try {
    const response = await api.post('/messages', messageData);
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Failed to create booking:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const getMyBookings = async () => {
  try {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    throw error;
  }
};

export const getBookedDates = async (propertyId) => {
    try {
        const response = await api.get(`/bookings/property/${propertyId}/dates`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch booked dates:', error);
        throw error;
    }
};

export const getBookingsForProperty = async (propertyId) => {
  try {
    const response = await api.get(`/bookings/property/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch bookings for property:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.put(`/bookings/${bookingId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Failed to update booking status:', error);
    throw error.response?.data || error;
  }
};

export const createRazorpayOrder = async (orderData) => {
  try {
    const response = await api.post('/payments/order', orderData);
    return response.data;
  } catch (error) {
    console.error('Failed to create Razorpay order:', error);
    throw error;
  }
};

export const verifyPayment = async (verificationData) => {
  try {
    const response = await api.post('/payments/verify', verificationData);
    return response.data;
  } catch (error) {
    console.error('Failed to verify payment:', error);
    throw error;
  }
};

// --- New Admin Analytics Function ---
/**
 * Fetches platform analytics data (Admin only).
 * Corresponds to GET /api/admin/analytics
 */
export const getPlatformAnalytics = async () => {
  try {
    const response = await api.get('/admin/analytics');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch platform analytics:', error);
    throw error;
  }
};
export default api;
