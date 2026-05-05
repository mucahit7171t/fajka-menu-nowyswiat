import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

interface SettingsState {
  settings: Record<string, any>;
  loading: boolean;
  fetchSettings: () => Promise<void>;
  updateSetting: (key: string, value: any) => Promise<void>;
}

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
});

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {},
  loading: false,
  fetchSettings: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/api/settings');
      set({ settings: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      set({ loading: false });
    }
  },
  updateSetting: async (key, value) => {
    await axios.put('/api/admin/settings', { key, value }, getAuthHeader());
    set((state) => ({
      settings: { ...state.settings, [key]: value },
    }));
  },
}));
