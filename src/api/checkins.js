import client from './client';

export const getCheckins = (params) => client.get('/api/checkins/', { params });
export const createCheckin = (data) => client.post('/api/checkins/', data);
export const getTrend = (params) => client.get('/api/checkins/trend/', { params });