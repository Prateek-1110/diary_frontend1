import client from './client'

export const getDiaryEntries = (params = {}) => client.get('/api/diary/', { params })
export const getDiaryEntry = (id) => client.get(`/api/diary/${id}/`)
export const createDiaryEntry = (data) => client.post('/api/diary/', data)
export const updateDiaryEntry = (id, data) => client.patch(`/api/diary/${id}/`, data)
export const deleteDiaryEntry = (id) => client.delete(`/api/diary/${id}/`)
export const getMemoryReplay = () => client.get('/api/diary/memory/')