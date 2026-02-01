export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080';

const TOKEN_KEY = 'uni_token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
