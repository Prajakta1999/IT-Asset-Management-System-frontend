<template>
  <div>
    <div class="header">
      <h2>Admin Dashboard</h2>
      <!-- This button now has a console.log for debugging -->
      <button class="btn primary" @click="console.log('Add Asset button clicked!'); openAssetModal(null)">
        <span class="icon">+</span> Add New Asset
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <h4>Total Assets</h4>
        <p>{{ assetStats.total }}</p>
      </div>
      <div class="stat-card available">
        <h4>Available</h4>
        <p>{{ assetStats.available }}</p>
      </div>
      <div class="stat-card assigned">
        <h4>Assigned</h4>
        <p>{{ assetStats.assigned }}</p>
      </div>
      <div class="stat-card in-repair">
        <h4>In Repair</h4>
        <p>{{ assetStats.inRepair }}</p>
      </div>
    </div>

    <!-- Asset Table -->
    <div class="card">
      <h3>All IT Assets</h3>
      <!-- Filtering UI -->
      <div class="filters">
        <select v-model="filters.status" @change="fetchAssets" class="input small">
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_REPAIR">In Repair</option>
          <option value="RETIRED">Retired</option>
        </select>
        <select v-model="filters.type" @change="fetchAssets" class="input small">
          <option value="">All Types</option>
          <option value="LAPTOP">Laptop</option>
          <option value="DESKTOP">Desktop</option>
          <option value="MONITOR">Monitor</option>
          <option value="SOFTWARE">Software</option>
        </select>
      </div>

      <div v-if="loading.assets">Loading assets...</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Serial #</th>
            <th>Type</th>
            <th>Model</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="asset in assets" :key="asset.id">
            <td>{{ asset.serialNumber }}</td>
            <td>{{ asset.assetType }}</td>
            <td>{{ asset.manufacturer }} {{ asset.model }}</td>
            <td><span :class="['status-badge', asset.status.toLowerCase().replace('_', '-')]">{{ asset.status }}</span></td>
            <td>{{ asset.assignedTo?.name || 'N/A' }}</td>
            <td class="actions">
              <button class="btn-icon" title="Edit Asset" @click="openAssetModal(asset)">✏️</button>
              <button class="btn-icon" title="Delete Asset" @click="handleDeleteAsset(asset.id)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pending Requests Table -->
    <div class="card" style="margin-top: 2rem;">
        <h3>Pending Asset Requests ({{ pendingRequests.length }})</h3>
        <div v-if="loading.requests">Loading requests...</div>
        <table v-else-if="pendingRequests.length" class="data-table">
            <thead>
                <tr>
                    <th>Requested By</th>
                    <th>Asset Type</th>
                    <th>Justification</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="req in pendingRequests" :key="req.id">
                    <td>{{ req.requestedBy.name }}</td>
                    <td>{{ req.assetType }}</td>
                    <td>{{ req.justification }}</td>
                    <td class="actions">
                        <button class="btn small primary" @click="openReviewModal(req)">Review</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <p v-else>No pending requests.</p>
    </div>

    <!-- Modals (These will now appear when the state changes) -->
    <AssetForm 
      v-if="showAssetForm" 
      :asset="editingAsset"
      :loading="loading.form"
      @close="closeAssetModal" 
      @submit="handleAssetSubmit"
    />
    
    <RequestReviewModal
        v-if="showReviewForm"
        :request="reviewingRequest"
        :availableAssets="availableAssets"
        :loading="loading.form"
        @close="closeReviewModal"
        @submit="handleReviewSubmit"
    />

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import useAssetManagement from '@/composables/useAssetManagement';
import AssetForm from '@/components/admin/AssetForm.vue';
import RequestReviewModal from '@/components/admin/RequestReviewModal.vue';

// DEBUGGING TIP: After clicking the "Add New Asset" button, check your browser's
// developer console. If you see the message "Add Asset button clicked!", it means the
// click event is working. If the modal still doesn't appear, the issue might be
// with the modal component's visibility or a silent error.

const {
  assets,
  pendingRequests,
  editingAsset,
  reviewingRequest,
  showAssetForm,
  showReviewForm,
  loading,
  filters,
  assetStats,
  availableAssets,
  fetchAssets,
  fetchPendingRequests,
  openAssetModal,
  closeAssetModal,
  handleAssetSubmit,
  handleDeleteAsset,
  openReviewModal,
  closeReviewModal,
  handleReviewSubmit
} = useAssetManagement();

// Fetch the initial data when the component is first created
onMounted(() => {
  fetchAssets();
  fetchPendingRequests();
});
</script>

<style scoped>
/* Scoped styles to make the dashboard look professional */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.header .btn .icon {
  margin-right: 0.5rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.stat-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-left: 4px solid #a0aec0;
}
.stat-card.available { border-color: #48bb78; }
.stat-card.assigned { border-color: #f6ad55; }
.stat-card.in-repair { border-color: #e53e3e; }

.stat-card h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: #4a5568;
}
.stat-card p {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
}
.filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th, .data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}
.data-table th {
  background-color: #f7fafc;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #718096;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.25rem;
}
.status-badge {
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
    background-color: #e2e8f0;
    color: #4a5568;
}
.status-badge.available { background-color: #c6f6d5; color: #22543d; }
.status-badge.assigned { background-color: #feebc8; color: #7b341e; }
/* (FIX) Corrected CSS class name from in_repair to in-repair */
.status-badge.in-repair { background-color: #fed7d7; color: #822727; } 
.status-badge.retired { background-color: #cbd5e0; color: #2d3748; }

</style>

