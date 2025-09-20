import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// Import your page/view components
import LoginView from '@/pages/LoginView.vue';
import SignupView from '@/pages/SignupView.vue';
import AdminDashboard from '@/pages/AdminDashboard.vue';
import EmployeeDashboard from '@/pages/EmployeeDashboard.vue';
import NotFound from '@/pages/NotFound.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true } // Users already logged in shouldn't see this
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
    meta: { requiresGuest: true }
  },
  {
    path: '/admin',
    name: 'admin-dashboard', // The correct name for the admin route
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'ADMIN' } // Protect this route
  },
  {
    path: '/employee',
    name: 'employee-dashboard', // The correct name for the employee route
    component: EmployeeDashboard,
    meta: { requiresAuth: true, role: 'EMPLOYEE' } // Protect this route
  },
  {
    // Redirect the root path to the login page
    path: '/',
    redirect: '/login'
  },
  { 
    // Catch-all 404 route
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFound 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard - This is a security checkpoint for your routes
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isAuthenticated = auth.isAuthenticated;
  const userRole = auth.role;

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // User is not logged in, redirect to login
      next({ name: 'login' });
    } else if (to.meta.role && to.meta.role !== userRole) {
      // User is logged in but doesn't have the required role
      // Redirect them to their own dashboard or a 'not-authorized' page
      next(userRole === 'ADMIN' ? { name: 'admin-dashboard' } : { name: 'employee-dashboard' });
    } else {
      // User is authenticated and has the correct role
      next();
    }
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // If a logged-in user tries to visit login/signup, redirect them away
    next(userRole === 'ADMIN' ? { name: 'admin-dashboard' } : { name: 'employee-dashboard' });
  } else {
    // For public pages
    next();
  }
});

export default router;
