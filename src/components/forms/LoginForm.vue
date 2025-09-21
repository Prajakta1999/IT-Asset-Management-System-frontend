<!-- <template>
  <form @submit.prevent="emitSubmit" class="row" autocomplete="on">
    <input class="input" type="email" v-model.trim="email" placeholder="Email" required />
    <input class="input" type="password" v-model.trim="password" placeholder="Password" required />
    <button class="btn primary" :disabled="loading" type="submit">
      {{ loading ? 'Signing in...' : 'Login' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({ loading: Boolean });
const emit = defineEmits(['submit']);

const email = ref('');
const password = ref('');

function emitSubmit() {
  emit('submit', { email: email.value, password: password.value });
}
</script> -->


<template>
  <Form @submit="emitSubmit" class="row" v-slot="{ meta }" autocomplete="on">
    <div class="field-container">
      <Field name="email" type="email" class="input" placeholder="Email" rules="required|email" v-model.trim="email" />
      <ErrorMessage name="email" class="error-message" />
    </div>

    <div class="field-container password-container">
      <Field name="password" :type="showPassword ? 'text' : 'password'" class="input" placeholder="Password" rules="required" v-model.trim="password" />
      <button type="button" class="password-toggle" @click="showPassword = !showPassword">
        {{ showPassword ? 'Hide' : 'Show' }}
      </button>
      <ErrorMessage name="password" class="error-message" />
    </div>

    <button class="btn primary" :disabled="!meta.valid || loading" type="submit">
      {{ loading ? 'Signing in...' : 'Login' }}
    </button>
  </Form>
</template>

<script setup>
import { ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';

defineProps({ loading: Boolean });
const emit = defineEmits(['submit']);

const email = ref('');
const password = ref('');
const showPassword = ref(false);

function emitSubmit() {
  emit('submit', { email: email.value, password: password.value });
}
</script>

<style scoped>
.field-container {
  position: relative;
  width: 100%;
  margin-bottom: 0.5rem; /* Space for error messages */
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.password-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
}
</style>