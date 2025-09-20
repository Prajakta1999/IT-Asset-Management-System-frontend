import { defineStore } from 'pinia';
import { extractRole, isExpired } from '@/utils/jwt';
import router from '@/router';
import http from '@/api/http';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    role: localStorage.getItem('role') || null,
  }),

  getters: {
    isAuthenticated: state => !!state.accessToken && !isExpired(state.accessToken),
    isEmployee: state => state.role === 'EMPLOYEE',
    isAdmin: state => state.role === 'ADMIN',
  },

  actions: {
    setToken(token) {
      this.accessToken = token;
      if (token) {
        // The role from your JWT might not have the "ROLE_" prefix, let's handle that.
        const rawRole = (extractRole(token) || '').replace('ROLE_', '').toUpperCase();
        this.role = rawRole;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('role', rawRole);
      } else {
        this.role = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
      }
    },

    async doLogin({ email, password }) {
      // Your backend wraps the successful response in a `data` object
      const response = await http.post('/auth/login', { email, password });
      
      // The actual token is nested inside response.data.data.accessToken
      const token = response.data?.data?.accessToken;

      if (!token) {
        // Add a check to ensure we actually got a token
        throw new Error("Login failed: No token received from server.");
      }

      this.setToken(token);

      // (FIX) Use the correct route names defined in your router/index.js
      if (this.isAdmin) {
        router.replace({ name: 'admin-dashboard' });
      } else if (this.isEmployee) {
        router.replace({ name: 'employee-dashboard' });
      } else {
        // If the role is somehow unknown, fall back to the login page
        router.replace({ name: 'login' });
      }
    },

    async doSignup(payload) {
      await http.post('/auth/signup', payload);
      router.replace({ name: 'login' });
    },

    logout(forceToLogin = true) {
      this.setToken(null);
      if (forceToLogin) router.replace({ name: 'login' });
    },
  },
});

