<template>
  <Form @submit="emitSubmit" class="row" v-slot="{ meta }">
    <div class="row two">
      <div class="field-container">
        <Field name="name" type="text" class="input" placeholder="Full name" rules="required" v-model.trim="form.name" />
        <ErrorMessage name="name" class="error-message" />
      </div>

      <div class="field-container">
        <Field name="role" as="select" class="input" rules="required" v-model="form.role">
          <option disabled value="">Select role</option>
          <option value="STUDENT">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
        </Field>
        <ErrorMessage name="role" class="error-message" />
      </div>
    </div>

    <div class="field-container">
      <Field name="email" type="email" class="input" placeholder="Email" rules="required|email" v-model.trim="form.email" />
      <ErrorMessage name="email" class="error-message" />
    </div>

    <div class="field-container">
        <Field name="phoneNumber" type="tel" class="input" placeholder="Phone Number" rules="required|min:10" v-model.trim="form.phoneNumber" />
        <ErrorMessage name="phoneNumber" class="error-message" />
    </div>

    <div class="field-container password-container">
      <Field name="password" :type="showPassword ? 'text' : 'password'" class="input" placeholder="Password" rules="required|min:8" v-model="form.password" />
      <button type="button" class="password-toggle" @click="showPassword = !showPassword">
        {{ showPassword ? 'Hide' : 'Show' }}
      </button>
      <ErrorMessage name="password" class="error-message" />
    </div>

    <div class="field-container">
      <Field name="password_confirmation" :type="showPassword ? 'text' : 'password'" class="input" placeholder="Confirm Password" rules="required|confirmed:@password" v-model="form.password_confirmation" />
      <ErrorMessage name="password_confirmation" class="error-message" />
    </div>

    <button class="btn primary" :disabled="!meta.valid || loading" type="submit">
      {{ loading ? 'Creating...' : 'Sign up' }}
    </button>
  </Form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';

defineProps({ loading: Boolean });
const emit = defineEmits(['submit']);

const form = reactive({
  name: '',
  email: '',
  phoneNumber: '',
  password: '',
  password_confirmation: '',
  role: ''
});

const showPassword = ref(false);

function emitSubmit() {
  emit('submit', form);
}
</script>

<style scoped>
.field-container {
  position: relative;
  width: 100%;
  margin-bottom: 0.5rem;
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