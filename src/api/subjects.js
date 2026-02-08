import { api } from './client.js';

export function getSubjects() {
  return api.get('/subjects');
}

export function getSubjectByID(id) {
  return api.get(`/subjects/${id}`);
}

export function createSubject(data) {
  return api.post('/subjects', data);
}

export function getSubjectStats() {
  return api.get('/subjects/stats');
}
