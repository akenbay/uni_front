import { api } from './client.js';

export function getGroups() {
  return api.get('/groups');
}
