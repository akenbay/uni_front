import { api } from './client.js';

export function getFaculties() {
  return api.get('/faculties');
}

export function getFacultyByID(id) {
  return api.get(`/faculties/${id}`);
}

export function createFaculty(data) {
  return api.post('/faculties', data);
}
