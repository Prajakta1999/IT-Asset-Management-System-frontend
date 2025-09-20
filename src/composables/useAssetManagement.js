import { ref, reactive, computed } from 'vue';
import * as api from '@/api/apiService';

export default function useAssetManagement() {
  const assets = ref([]);
  const pendingRequests = ref([]);
  const editingAsset = ref(null);
  const reviewingRequest = ref(null);

  const showAssetForm = ref(false);
  const showReviewForm = ref(false);

  const loading = reactive({
    assets: false,
    requests: false,
    form: false,
  });

  const filters = reactive({
    type: '',
    status: '',
  });

  // --- Computed Properties ---
  const assetStats = computed(() => {
    const stats = { total: assets.value.length, assigned: 0, available: 0, inRepair: 0 };
    assets.value.forEach(asset => {
        if (asset.status === 'ASSIGNED') stats.assigned++;
        else if (asset.status === 'AVAILABLE') stats.available++;
        else if (asset.status === 'IN_REPAIR') stats.inRepair++;
    });
    return stats;
  });

  const availableAssets = computed(() => {
      if (!reviewingRequest.value) return [];
      return assets.value.filter(a => a.status === 'AVAILABLE' && a.assetType === reviewingRequest.value.assetType);
  });

  // --- API Functions ---
  async function fetchAssets() {
    loading.assets = true;
    try {
      const params = { page: 0, size: 200, type: filters.type || null, status: filters.status || null };
      const response = await api.getAssets(params);
      assets.value = Array.isArray(response.data.data.content) ? response.data.data.content : [];
    } catch (error) {
      console.error("Failed to fetch assets:", error);
      alert('Could not fetch assets.');
    } finally {
      loading.assets = false;
    }
  }

  async function fetchPendingRequests() {
      loading.requests = true;
      try {
          const response = await api.getPendingAssetRequests();
          pendingRequests.value = Array.isArray(response.data.data) ? response.data.data : [];
      } catch (error) {
          console.error("Failed to fetch pending requests:", error);
      } finally {
          loading.requests = false;
      }
  }

  // --- Modal & Form Handlers ---
  function openAssetModal(asset) {
    editingAsset.value = asset;
    showAssetForm.value = true;
  }

  function closeAssetModal() {
    showAssetForm.value = false;
    editingAsset.value = null;
  }

  async function handleAssetSubmit(assetData) {
    loading.form = true;
    try {
      if (editingAsset.value) {
        await api.updateAsset(editingAsset.value.id, assetData);
      } else {
        await api.createAsset(assetData);
      }
      closeAssetModal();
      await fetchAssets();
    } catch (error) {
      console.error("Failed to save asset:", error);
      alert('Failed to save asset. Check for duplicate serial number.');
    } finally {
      loading.form = false;
    }
  }

  async function handleDeleteAsset(assetId) {
      if (confirm('Are you sure you want to delete this asset?')) {
          try {
              await api.deleteAsset(assetId);
              await fetchAssets();
          } catch (error) {
              console.error("Failed to delete asset:", error);
              alert('Failed to delete asset. It might be currently assigned.');
          }
      }
  }

  function openReviewModal(request) {
    reviewingRequest.value = request;
    showReviewForm.value = true;
  }

  function closeReviewModal() {
    showReviewForm.value = false;
    reviewingRequest.value = null;
  }

  async function handleReviewSubmit(requestId, reviewData) {
    loading.form = true;
    try {
        await api.reviewAssetRequest(requestId, reviewData);
        closeReviewModal();
        await fetchAssets();
        await fetchPendingRequests();
    } catch (error) {
        console.error("Failed to submit review:", error);
        alert('Failed to submit review.');
    } finally {
        loading.form = false;
    }
  }

  return {
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
  };
}
