import axios from 'axios';

// Configure a base instance of axios.
// The auth store will intercept requests to add the JWT.
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

// =================================================
// ASSET ENDPOINTS (Mainly for Admins)
// =================================================

/**
 * Fetches a paginated and filtered list of assets.
 * @param {Object} params - page, size, sort, type, status, employeeName, etc.
 * @returns {Promise}
 */
export const getAssets = (params) => {
    return apiClient.get('/assets', { params });
};

/**
 * Creates a new asset.
 * @param {Object} assetData - The asset details to create.
 * @returns {Promise}
 */
export const createAsset = (assetData) => {
    return apiClient.post('/assets', assetData);
};

/**
 * Updates an existing asset.
 * @param {number} assetId - The ID of the asset to update.
 * @param {Object} assetData - The updated asset details.
 * @returns {Promise}
 */
export const updateAsset = (assetId, assetData) => {
    return apiClient.put(`/assets/${assetId}`, assetData);
};

/**
 * Deletes an asset.
 * @param {number} assetId - The ID of the asset to delete.
 * @returns {Promise}
 */
export const deleteAsset = (assetId) => {
    return apiClient.delete(`/assets/${assetId}`);
};


// =================================================
// ASSET REQUEST ENDPOINTS (For Employees & Admins)
// =================================================

/**
 * Submits a new asset request (for Employees).
 * @param {Object} requestData - The details of the request.
 * @returns {Promise}
 */
export const createAssetRequest = (requestData) => {
    return apiClient.post('/asset-requests', requestData);
};

/**
 * Fetches all requests submitted by the current employee.
 * @returns {Promise}
 */
export const getMyAssetRequests = () => {
    return apiClient.get('/asset-requests/my-requests');
};

/**
 * Fetches all pending asset requests (for Admins).
 * @returns {Promise}
 */
export const getPendingAssetRequests = () => {
    return apiClient.get('/asset-requests/pending');
};

/**
 * Approves or rejects an asset request (for Admins).
 * @param {number} requestId - The ID of the request to review.
 * @param {Object} reviewData - The review details (status, assetIdToAssign, etc.).
 * @returns {Promise}
 */
export const reviewAssetRequest = (requestId, reviewData) => {
    return apiClient.put(`/asset-requests/${requestId}/review`, reviewData);
};


// =================================================
// REPAIR & ISSUE ENDPOINTS
// =================================================

/**
 * Reports an issue with an asset (for Employees).
 * @param {Object} issueData - The details of the issue.
 * @returns {Promise}
 */
export const reportIssue = (issueData) => {
    return apiClient.post('/repairs', issueData);
};

/**
 * Updates the status of a repair log (for Admins).
 * @param {number} repairId - The ID of the repair log.
 * @param {Object} statusData - The new status.
 * @returns {Promise}
 */
export const updateRepairStatus = (repairId, statusData) => {
    return apiClient.put(`/repairs/${repairId}`, statusData);
};

/**
 * Fetches the repair history for a specific asset.
 * @param {number} assetId - The ID of the asset.
 * @returns {Promise}
 */
export const getRepairHistory = (assetId) => {
    return apiClient.get(`/repairs/asset/${assetId}`);
};
