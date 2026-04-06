import client from './client'

export const getTimeline = () => client.get('/api/timeline/')
export const createTimelineEvent = (data) => client.post('/api/timeline/', data)