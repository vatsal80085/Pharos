import axios from 'axios';

export type AuthResponse = {
  token: string;
};

export type StoredFile = {
  id: string;
  originalFilename: string;
  fileSize: number;
  contentType: string | null;
  createdAt: string;
};

export const TOKEN_KEY = 'pharos_token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function hasToken() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}
