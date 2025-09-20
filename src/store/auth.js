import { defineStore } from 'pinia';
import { extractRole, isExpired } from '@/utils/jwt';
import router from '@/router';
import http from '@/api/http';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    role: localStorage.getItem('role') || null, 
    userEmail: null,
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
    const role = (extractRole(token) || '').toUpperCase();
    console.log("Decoded role from JWT:", role);   // 👈 debug
    this.role = role;
    localStorage.setItem('accessToken', token);
    localStorage.setItem('role', role);
  } else {
    this.role = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
  }
},


   async doLogin({ email, password }) {
  const { data } = await http.post('/auth/login', { email, password });
  
  // FIX: token is inside data.data.accessToken
  const token = data?.data?.accessToken;

  console.log("Raw login response:", data);  // 👈 debug
  console.log("Extracted token:", token);    // 👈 debug

  this.setToken(token);

  const role = (extractRole(token) || '').toUpperCase();
  console.log("Redirecting based on role:", role);  // 👈 debug
  if (role === 'EMPLOYEE') router.replace({ name: 'instructor' });
  else router.replace({ name: 'employee' });
}
,

    async doSignup(payload) {
      await http.post('/auth/signup', payload);
      // after signup, go to login
      router.replace({ name: 'login' });
    },

    logout(forceToLogin = false) {
      this.setToken(null);
      if (forceToLogin) router.replace({ name: 'login' });
    },
  },
});
