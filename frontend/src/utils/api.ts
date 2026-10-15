import axios from 'axios';

// Create an Axios instance configured to point to our ASP.NET Core API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://edurate.runasp.net/api' : 'http://localhost:5232/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach the JWT token to every request
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

// Response Interceptor: Handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the token is expired or invalid, log the user out
      // IMPORTANT: Do NOT redirect if the request was specifically for logging in!
      if (error.config && !error.config.url.includes('/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('profileId');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
