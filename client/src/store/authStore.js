'use client';
import { create } from 'zustand';
import api from '@/lib/api';

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  // Check auth on mount
  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) localStorage.setItem('token', res.data.token);
    set({ user: res.data.user, isAuthenticated: true });
    return res;
  },

  register: async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.data.token) localStorage.setItem('token', res.data.token);
    set({ user: res.data.user, isAuthenticated: true });
    return res;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch { /* ignore */ }
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  isAdmin: () => get().user?.role === 'admin',
}));

export default useAuthStore;
