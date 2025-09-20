

<template>
  <div class="auth-container">
    <div class="auth-card" :class="{ 'loading': loading }">
      <div class="card-header">
        <h2 class="title">Join Us Today</h2>
        <p class="subtitle">Create your account to get started</p>
      </div>
      
      <SignupForm @submit="onSubmit" :loading="loading" />
      
      <div class="auth-footer">
        <p class="footer-text">
          Already have an account?
          <router-link class="auth-link" to="/login">
            <span>Sign in</span>
            <svg class="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import SignupForm from '@/components/forms/SignupForm.vue';

const auth = useAuthStore();
const loading = ref(false);

async function onSubmit(payload) {
  loading.value = true;
  try {
    await auth.doSignup(payload);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  position: relative;
  overflow: hidden;
}

.auth-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
  animation: float 25s linear infinite reverse;
}

@keyframes float {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-60px); }
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 8px 25px rgba(0, 0, 0, 0.06);
  max-width: 520px;
  width: 100%;
  position: relative;
  transform: translateY(20px);
  opacity: 0;
  animation: slideInUp 0.8s ease-out forwards;
  transition: all 0.3s ease;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #764ba2, #667eea);
  border-radius: 24px 24px 0 0;
}

.auth-card.loading {
  transform: scale(0.98);
}

@keyframes slideInUp {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.card-header {
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fadeIn 1s ease-out 0.3s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  animation: fadeIn 1s ease-out 0.6s both;
}

.footer-text {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.auth-link {
  color: #764ba2;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.auth-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(118, 75, 162, 0.1), transparent);
  transition: left 0.5s ease;
}

.auth-link:hover {
  color: #6b46c1;
  transform: translateY(-1px);
  background: rgba(118, 75, 162, 0.05);
}

.auth-link:hover::before {
  left: 100%;
}

.auth-link:hover .link-arrow {
  transform: translateX(4px);
}

.link-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

@media (max-width: 640px) {
  .auth-container {
    padding: 1rem;
  }
  
  .auth-card {
    padding: 2rem;
  }
  
  .title {
    font-size: 1.75rem;
  }
}
</style>
