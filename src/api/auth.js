import { api } from './client.js';
import { setStoredToken } from './config.js';

export async function login(email, password) {
  const data = await api.post('/api/auth/login', { email, password });
  setStoredToken(data.token);
  return data;
}

export async function register(email, password) {
  const data = await api.post('/api/auth/register', { email, password });
  setStoredToken(data.token);
  return data;
}

export async function getMe() {
  return api.get('/api/users/me');
}
