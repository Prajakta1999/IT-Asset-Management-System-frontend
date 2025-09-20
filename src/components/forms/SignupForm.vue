<template>
  <form @submit.prevent="emitSubmit" class="row">
    <div class="row two">
      <input class="input" type="text" v-model.trim="name" placeholder="Full name" required />
      <select class="input" v-model="role" required>
        <option disabled value="">Select role</option>
        <option value="EMPLOYEE">Employee</option>
        <option value="ADMIN">Admin</option>
      </select>
    </div>
    <input class="input" type="email" v-model.trim="email" placeholder="Email" required />
    
    <!-- (NEW) Phone Number Input -->
    <input class="input" type="tel" v-model.trim="phoneNumber" placeholder="Phone Number" required />
    
    <input class="input" type="password" v-model.trim="password" placeholder="Password" required />
    
    <button class="btn primary" :disabled="loading" type="submit">
      {{ loading ? 'Creating...' : 'Sign up' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({ loading: Boolean });
const emit = defineEmits(['submit']);

const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('');
// (NEW) Add ref for phone number
const phoneNumber = ref('');

function emitSubmit() {
  // (NEW) Add phoneNumber to the emitted payload
  emit('submit', { 
    name: name.value, 
    email: email.value, 
    password: password.value, 
    role: role.value,
    phoneNumber: phoneNumber.value 
  });
}
</script>

