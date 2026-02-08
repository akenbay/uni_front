import { api } from './client.js';

export function getGroups() {
  return api.get('/groups');
}

export function getGroupByID(id) {
  return api.get(`/groups/${id}`);
}

export function createGroup(data) {
  return api.post('/groups', data);
}
