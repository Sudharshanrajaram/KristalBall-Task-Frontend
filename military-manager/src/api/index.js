import axios from './axios';

// ASSETS
export const getAllAssets = () => axios.get('/assets');
export const createAsset = (data) => axios.post('/assets', data);
export const deleteAsset = (id) => axios.delete(`/assets/${id}`);
export const updateAsset = (id, data) => axios.put(`/assets/${id}`, data);

// PURCHASES
export const getAllPurchases = () => axios.get('/purchases');
export const createPurchase = (data) => axios.post('/purchases', data);

// TRANSFERS
export const getAllTransfers = () => axios.get('/transfers');
export const createTransfer = (data) => axios.post('/transfers', data);

// EXPENDITURES
export const getAllExpenditures = () => axios.get('/expenditures');
export const createExpenditure = (data) => axios.post('/expenditures', data);

// BASES
export const getAllBases = () => axios.get('/bases');
export const createBase = (data) => axios.post('/bases', data);
export const deleteBase = (id) => axios.delete(`/bases/${id}`);

export const getDashboardMetrics = (filters) => axios.get('/dashboard', { params: filters });

export const getAssignments = (params) => axios.get('/assignments', { params });
export const assignAsset = (payload) => axios.post('/assignments', payload);
export const markAssetExpended = (id) => axios.put(`/assignments/${id}/expended`);