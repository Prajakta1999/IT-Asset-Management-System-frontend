import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const LoginView = () => import('@/pages/LoginView.vue');
const SignupView = () => import('@/pages/SignupView.vue');
const DashboardStudent = () => import('@/pages/DashboardStudent.vue');
const DashboardInstructor = () => import('@/pages/DashboardInstructor.vue');
const StudentCourseView = () => import('@/pages/StudentCourseView.vue');
const NotFound = () => import('@/pages/NotFound.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    { path: '/signup', name: 'signup', component: SignupView, meta: { guestOnly: true } },
    { path: '/student', name: 'student', component: DashboardStudent, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
    { 
      path: '/courses/:id/view', 
      name: 'student-course-view', 
      component: StudentCourseView, 
      meta: { requiresAuth: true, role: 'EMPLOYEE' } 
    },
    { path: '/instructor', name: 'instructor', component: DashboardInstructor, meta: { requiresAuth: true, role: 'ADMIN' } },
    { path: '/:pathMatch(.*)*', name: 'notfound', component: NotFound },
  ],
});

// Navigation guard with corrected route names
router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (to.meta.guestOnly && auth.isAuthenticated) {
    // FIX: Changed 'admin' to 'instructor' and 'employee' to 'student'
    return auth.role === 'ADMIN' ? { name: 'instructor' } : { name: 'student' };
  }

  if (to.meta.requiresAuth) {
    if (!auth.isAuthenticated) {
      return { name: 'login', query: { next: to.fullPath } };
    }

    const need = (to.meta.role || '').toUpperCase();
    if (need && auth.role !== need) {
      // FIX: Changed 'admin' to 'instructor' and 'employee' to 'student'
      return { name: auth.role === 'ADMIN' ? 'instructor' : 'student' };
    }
  }
});

export default router;