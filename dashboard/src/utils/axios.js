import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://mern-portfolio-with-admin-panel-backend.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': true
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
    const originalRequest = error.config;
    
    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear authentication state
      localStorage.removeItem('isAuthenticated');
      
      // If we're not already on the login page, redirect there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Always reject the error to be handled by the calling code
    return Promise.reject(error);
  }
);

export default axiosInstance; 