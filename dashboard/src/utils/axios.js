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
    // You can add any additional headers or logic here
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
    if (error.response?.status === 401) {
      // Clear authentication state
      localStorage.removeItem('isAuthenticated');
      // You might want to redirect to login page here
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 