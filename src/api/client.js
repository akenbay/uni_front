import { API_BASE_URL, getStoredToken, setStoredToken } from './config.js';

let onUnauthorized = () => {};

export function setOnUnauthorized(callback) {
  onUnauthorized = callback;
}

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: res.statusText || 'Request failed' };
  }

  if (res.status === 401) {
    setStoredToken(null);
    onUnauthorized();
    const err = new Error(data?.error || 'Unauthorized');
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(data?.error || data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

export default api;
