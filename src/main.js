import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';
import App from './App.vue';
import '@/assets/styles.css';
import { useAuthStore } from './store/auth';

// --- VeeValidate Imports ---
import { configure, defineRule } from 'vee-validate';
// Import the 'all' object specifically, which contains the rules
import { all } from '@vee-validate/rules';
// -------------------------


// --- Correct VeeValidate Configuration ---

// 1. Register all rules from the 'all' object
Object.keys(all).forEach(rule => {
  defineRule(rule, all[rule]);
});

// 2. Configure global options
configure({
  generateMessage: (context) => {
    const messages = {
      required: `The ${context.field} field is required.`,
      email: `The ${context.field} must be a valid email.`,
      min: `The ${context.field} must be at least ${context.rule.params[0]} characters.`,
      confirmed: `The password confirmation does not match.`
    };

    const message = messages[context.rule.name] ? messages[context.rule.name] : `The ${context.field} field is invalid.`;
    return message;
  },
  validateOnInput: true, // Validate fields as the user types
});
// ------------------------------------


const app = createApp(App);
app.use(createPinia());

useAuthStore().init();
app.use(router);
app.mount('#app');