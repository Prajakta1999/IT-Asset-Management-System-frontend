<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <h3>{{ isEditing ? 'Edit Asset' : 'Add New Asset' }}</h3>
        <button class="btn-close" @click="close">&times;</button>
      </div>
      <form @submit.prevent="submitForm" class="modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label for="assetType">Asset Type</label>
            <select id="assetType" class="input" v-model="form.assetType" required>
              <option disabled value="">Select a type</option>
              <option value="LAPTOP">Laptop</option>
              <option value="DESKTOP">Desktop</option>
              <option value="MONITOR">Monitor</option>
              <option value="SERVER">Server</option>
              <option value="SOFTWARE">Software</option>
              <option value="KEYBOARD">Keyboard</option>
              <option value="MOUSE">Mouse</option>
            </select>
          </div>
          <div class="form-group">
            <label for="serialNumber">Serial Number</label>
            <input id="serialNumber" type="text" class="input" v-model.trim="form.serialNumber" required placeholder="e.g., C02-1234-XYZ" />
          </div>
          <div class="form-group">
            <label for="manufacturer">Manufacturer</label>
            <input id="manufacturer" type="text" class="input" v-model.trim="form.manufacturer" required placeholder="e.g., Apple, Dell" />
          </div>
          <div class="form-group">
            <label for="model">Model</label>
            <input id="model" type="text" class="input" v-model.trim="form.model" required placeholder="e.g., MacBook Pro 16" />
          </div>
          <div class="form-group">
            <label for="purchaseDate">Purchase Date</label>
            <input id="purchaseDate" type="date" class="input" v-model="form.purchaseDate" />
          </div>
          <div class="form-group">
            <label for="warrantyExpiry">Warranty Expiry</label>
            <input id="warrantyExpiry" type="date" class="input" v-model="form.warrantyExpiry" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" type="button" @click="close">Cancel</button>
          <button class="btn primary" type="submit" :disabled="loading">
            {{ loading ? 'Saving...' : 'Save Asset' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  asset: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

const isEditing = computed(() => !!props.asset);

const form = ref({
  assetType: '',
  manufacturer: '',
  model: '',
  serialNumber: '',
  purchaseDate: null,
  warrantyExpiry: null,
});

// Watch for changes in the asset prop to populate the form for editing
watch(() => props.asset, (newAsset) => {
  if (newAsset) {
    form.value = { ...newAsset };
  } else {
    // Reset form for creation
    form.value = {
      assetType: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      purchaseDate: null,
      warrantyExpiry: null,
    };
  }
}, { immediate: true });

function close() {
  emit('close');
}

function submitForm() {
  // Create a clean payload to send, removing any null/empty optional fields
  const payload = { ...form.value };
  if (!payload.purchaseDate) delete payload.purchaseDate;
  if (!payload.warrantyExpiry) delete payload.warrantyExpiry;

  emit('submit', payload);
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}
.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  color: #a0aec0;
}
.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #4a5568;
}
.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background-color: #f7fafc;
}
</style>

