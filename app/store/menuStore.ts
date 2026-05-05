import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { useAuthStore } from './authStore';

interface LocalizedString {
  pl: string;
  en: string;
}

interface PriceOption {
  label: string;
  value: string;
}

interface Product {
  _id: string;
  name: LocalizedString;
  desc?: LocalizedString;
  price?: string;
  prices?: PriceOption[];
  image?: string;
  category: string;
  subcategory?: string;
  order: number;
}

interface Subcategory {
  _id: string;
  title: LocalizedString;
  category: string;
  order: number;
  products: Product[];
}

interface Category {
  _id: string;
  title: LocalizedString;
  anchorId: string;
  image: string;
  order: number;
  subcategories: Subcategory[];
  products: Product[];
}

interface MenuState {
  menu: Category[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchMenu: (force?: boolean) => Promise<void>;

  // Admin Actions
  createCategory: (data: any) => Promise<void>;
  updateCategory: (id: string, data: any) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  createSubcategory: (data: any) => Promise<void>;
  updateSubcategory: (id: string, data: any) => Promise<void>;
  deleteSubcategory: (id: string) => Promise<void>;

  createProduct: (data: any) => Promise<void>;
  updateProduct: (id: string, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  reorder: (type: string, items: { id: string; order: number }[]) => Promise<void>;
}

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
});

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      menu: [],
      loading: false,
      error: null,
      lastFetched: null,

      fetchMenu: async (force = false) => {
        const { menu, lastFetched } = get();

        const isStale = !lastFetched || Date.now() - lastFetched > 1000 * 60 * 60;
        if (!force && menu.length > 0 && !isStale) {
          return;
        }

        set({ loading: true, error: null });
        try {
          const response = await axios.get('/api/menu');
          set({ menu: response.data, loading: false, lastFetched: Date.now() });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch menu',
            loading: false,
          });
        }
      },

      // Category CRUD
      createCategory: async (data) => {
        await axios.post('/api/admin/categories', data, getAuthHeader());
        await get().fetchMenu(true);
      },
      updateCategory: async (id, data) => {
        await axios.put(`/api/admin/categories/${id}`, data, getAuthHeader());
        await get().fetchMenu(true);
      },
      deleteCategory: async (id) => {
        await axios.delete(`/api/admin/categories/${id}`, getAuthHeader());
        await get().fetchMenu(true);
      },

      // Subcategory CRUD
      createSubcategory: async (data) => {
        await axios.post('/api/admin/subcategories', data, getAuthHeader());
        await get().fetchMenu(true);
      },
      updateSubcategory: async (id, data) => {
        await axios.put(`/api/admin/subcategories/${id}`, data, getAuthHeader());
        await get().fetchMenu(true);
      },
      deleteSubcategory: async (id) => {
        await axios.delete(`/api/admin/subcategories/${id}`, getAuthHeader());
        await get().fetchMenu(true);
      },

      // Product CRUD
      createProduct: async (data) => {
        await axios.post('/api/admin/products', data, getAuthHeader());
        await get().fetchMenu(true);
      },
      updateProduct: async (id, data) => {
        await axios.put(`/api/admin/products/${id}`, data, getAuthHeader());
        await get().fetchMenu(true);
      },
      deleteProduct: async (id) => {
        await axios.delete(`/api/admin/products/${id}`, getAuthHeader());
        await get().fetchMenu(true);
      },
      reorder: async (type, items) => {
        await axios.post('/api/admin/reorder', { type, items }, getAuthHeader());
        await get().fetchMenu(true);
      },
    }),
    {
      name: 'fajka-menu-storage',
      partialize: (state) => ({ menu: state.menu, lastFetched: state.lastFetched }),
    }
  )
);
