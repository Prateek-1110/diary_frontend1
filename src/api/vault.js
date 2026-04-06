import client from './client';

export const getVaultItems = (params) => client.get('/api/vault/', { params });
export const uploadVaultItem = (formData) =>
  client.post('/api/vault/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteVaultItem = (id) => client.delete(`/api/vault/${id}/`);