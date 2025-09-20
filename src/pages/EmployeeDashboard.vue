<template>
  <div>
    <h2>Employee Dashboard</h2>

    <!-- My Assigned Assets -->
    <div class="card">
        <h3>My Assigned Assets</h3>
        <div v-if="loading.assigned">Loading...</div>
        <div v-else-if="assignedAssets.length === 0">
            <p>You do not have any IT assets assigned to you.</p>
        </div>
        <ul v-else class="item-list">
            <li v-for="asset in assignedAssets" :key="asset.id">
                <div>
                    <strong>{{ asset.manufacturer }} {{ asset.model }}</strong>
                    <p class="item-meta">Type: {{ asset.assetType }} | S/N: {{ asset.serialNumber }}</p>
                </div>
                <button class="btn small danger-outline" @click="openReportIssueModal(asset)">Report Issue</button>
            </li>
        </ul>
    </div>

    <!-- Request a New Asset -->
    <div class="card" style="margin-top: 2rem;">
        <h3>Request a New Asset</h3>
        <form @submit.prevent="handleRequestSubmit" class="row">
            <select v-model="newRequest.assetType" class="input" required>
                <option disabled value="">Select Asset Type</option>
                <option value="LAPTOP">Laptop</option>
                <option value="DESKTOP">Desktop</option>
                <option value="MONITOR">Monitor</option>
                <option value="KEYBOARD">Keyboard</option>
                <option value="MOUSE">Mouse</option>
            </select>
            <textarea v-model.trim="newRequest.justification" class="input" placeholder="Business Justification" required></textarea>
            <input v-model.trim="newRequest.preferredSpecifications" class="input" placeholder="Preferred Specifications (optional)" />
            <button class="btn primary" :disabled="loading.form" type="submit">
                {{ loading.form ? 'Submitting...' : 'Submit Request' }}
            </button>
        </form>
    </div>
    
    <!-- My Request History -->
    <div class="card" style="margin-top: 2rem;">
        <h3>My Request History</h3>
        <div v-if="loading.history">Loading...</div>
        <ul v-else-if="requestHistory.length > 0" class="item-list">
            <li v-for="req in requestHistory" :key="req.id">
                <div>
                    <strong>Request for {{ req.assetType }}</strong>
                    <p class="item-meta">Submitted on {{ new Date(req.createdAt).toLocaleDateString() }}</p>
                </div>
                <span :class="['status-badge', req.status.toLowerCase()]">{{ req.status }}</span>
            </li>
        </ul>
        <p v-else>You have not submitted any asset requests.</p>
    </div>

    <!-- TODO: Create a modal component for reporting issues -->

  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import * as api from '@/api/apiService';

const assignedAssets = ref([]);
const requestHistory = ref([]);

const newRequest = reactive({
    assetType: '',
    justification: '',
    preferredSpecifications: ''
});

const loading = reactive({
    assigned: false,
    history: false,
    form: false
});

async function fetchData() {
    loading.assigned = true;
    loading.history = true;
    try {
        // We need to fetch all assets and filter by current user on the frontend
        // A dedicated endpoint `/api/v1/assets/my-assets` would be more efficient
        const allAssetsRes = await api.getAssets({ size: 1000 }); // Fetch all for now
        // This part needs the user's info from the auth store
        // For now, we assume we can get it. This needs wiring to your auth store.
        const currentUserEmail = 'employee@example.com'; // ** TODO: Replace with actual logged-in user email **
        
        const allAssets = Array.isArray(allAssetsRes.data.data.content) ? allAssetsRes.data.data.content : [];
        assignedAssets.value = allAssets.filter(asset => asset.assignedTo?.email === currentUserEmail);

        const historyRes = await api.getMyAssetRequests();
        requestHistory.value = Array.isArray(historyRes.data.data) ? historyRes.data.data : [];

    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
    } finally {
        loading.assigned = false;
        loading.history = false;
    }
}

async function handleRequestSubmit() {
    loading.form = true;
    try {
        await api.createAssetRequest(newRequest);
        // Reset form and refresh data
        newRequest.assetType = '';
        newRequest.justification = '';
        newRequest.preferredSpecifications = '';
        await fetchData();
    } catch (error) {
        console.error("Failed to submit request:", error);
        alert("Failed to submit request. Please try again.");
    } finally {
        loading.form = false;
    }
}

function openReportIssueModal(asset) {
    // This would open a modal for reporting an issue
    alert(`Reporting issue for ${asset.manufacturer} ${asset.model} (S/N: ${asset.serialNumber}).\nThis requires a new component to be built.`);
}

onMounted(fetchData);
</script>

<style scoped>
.item-list { list-style: none; padding: 0; margin: 0; }
.item-list li { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #eee; }
.item-list li:last-child { border-bottom: none; }
.item-meta { margin:0.25rem 0 0 0; font-size:0.9em; color: #718096; }
.danger-outline { background-color: transparent; border: 1px solid #e53e3e; color: #e53e3e; }
.danger-outline:hover { background-color: #e53e3e; color: white; }
.status-badge { padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.8em; font-weight: 600; color: white; }
.status-badge.pending { background-color: #ecc94b; }
.status-badge.approved { background-color: #48bb78; }
.status-badge.rejected { background-color: #f56565; }
</style>
