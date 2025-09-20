import axios from 'axios';
import { useAuthStore } from '@/store/auth';

// Create an Axios instance with the base URL from your environment variables
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// IMPORTANT: This interceptor attaches the token to every outgoing request.
http.interceptors.request.use(
  (config) => {
    // Before the request is sent, get the authentication store.
    // This must be done inside the function to avoid issues with Pinia's setup timing.
    const auth = useAuthStore();
    const token = auth.accessToken;

    // If a token exists, add it to the Authorization header.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle any request errors.
    return Promise.reject(error);
  }
);

// Optional but Recommended: This interceptor handles cases where the token has expired.
http.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx will trigger this function.
    return response;
  },
  (error) => {
    // If the API returns a 401 Unauthorized error, it means the token is invalid.
    if (error.response && error.response.status === 401) {
      const auth = useAuthStore();
      // Log the user out, which will clear the bad token and redirect to the login page.
      auth.logout(true); 
    }
    return Promise.reject(error);
  }
);

export default http;

