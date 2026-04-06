import client from './client';

export const getLetters = () => client.get('/api/letters/');
export const getLetter = (id) => client.get(`/api/letters/${id}/`);
export const createLetter = (data) => client.post('/api/letters/', data);
export const deleteLetter = (id) => client.delete(`/api/letters/${id}/`);