import { api } from './client.js';

export function getStudents() {
  return api.get('/students');
}

export function createStudent(data) {
  return api.post('/students', data);
}
