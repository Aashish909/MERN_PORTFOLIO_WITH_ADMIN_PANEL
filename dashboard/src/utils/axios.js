import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://mern-portfolio-with-admin-panel-backend.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure credentials are included in every request
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If we get a 401, clear auth state and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('isAuthenticated');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 