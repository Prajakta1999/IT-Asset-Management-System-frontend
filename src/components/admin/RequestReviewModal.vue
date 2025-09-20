<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal card">
      <h3>Review Asset Request</h3>
      <div v-if="request">
          <p><strong>Requester:</strong> {{ request.requestedBy.name }}</p>
          <p><strong>Asset Type:</strong> {{ request.assetType }}</p>
          <p><strong>Justification:</strong> {{ request.justification }}</p>
      </div>

      <div class="row">
          <label>Action</label>
          <select v-model="review.status" class="input">
              <option value="APPROVED">Approve</option>
              <option value="REJECTED">Reject</option>
          </select>
      </div>

      <div v-if="review.status === 'APPROVED'" class="row">
        <label>Assign Asset</label>
        <select v-model="review.assetIdToAssign" class="input" required>
            <option :value="null" disabled>Select an available asset</option>
            <option v-for="asset in availableAssets" :key="asset.id" :value="asset.id">
                {{ asset.manufacturer }} {{ asset.model }} ({{ asset.serialNumber }})
            </option>
        </select>
        <p v-if="availableAssets.length === 0" class="error-text">No available assets of this type to assign.</p>
      </div>

      <div v-if="review.status === 'REJECTED'" class="row">
          <label>Rejection Reason</label>
          <textarea v-model.trim="review.rejectionReason" class="input" placeholder="Provide a reason for rejection" required></textarea>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn" @click="$emit('close')">Cancel</button>
        <button type="button" class="btn primary" @click="handleSubmit" :disabled="loading || isSubmitDisabled">
          {{ loading ? 'Submitting...' : 'Submit Review' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  request: Object,
  availableAssets: Array,
  loading: Boolean,
});
const emit = defineEmits(['close', 'submit']);

const review = ref({
    status: 'APPROVED',
    assetIdToAssign: null,
    rejectionReason: ''
});

watch(() => props.request, () => {
    review.value = { status: 'APPROVED', assetIdToAssign: null, rejectionReason: '' };
});

const isSubmitDisabled = computed(() => {
    if (review.value.status === 'APPROVED') {
        return !review.value.assetIdToAssign;
    }
    if (review.value.status === 'REJECTED') {
        return !review.value.rejectionReason;
    }
    return true;
});

function handleSubmit() {
    emit('submit', props.request.id, review.value);
}
</script>

<style scoped>
.error-text {
    font-size: 0.9em;
    color: #e53e3e;
    margin-top: 0.5rem;
}
</style>
