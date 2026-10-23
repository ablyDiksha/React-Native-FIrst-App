import { create } from 'zustand';
import { Product } from '../types/product';

interface ProductState {
  products: Product[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;

  fetchProducts: (isRefresh?: boolean) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  resetFilters: () => void;
  getProductById: (id: number) => Product | undefined;
}

export const useProductStore = create<ProductState>((set, get) => ({
  // State
  products: [],
  loading: true,
  refreshing: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'All',

  // Fetch products from API
  fetchProducts: async (isRefresh = false) => {
    set({
      error: null,
      ...(isRefresh ? { refreshing: true } : { loading: true }),
    });

    try {
      const response = await fetch('https://fakestoreapi.com/products');

      if (!response.ok) {
        throw new Error(`Failed to fetch products (${response.status})`);
      }

      const data: Product[] = await response.json();

      set({
        products: data,
        error: null,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load products';

      set({ error: message });
    } finally {
      set({
        loading: false,
        refreshing: false,
      });
    }
  },

  // Update search text
  setSearchQuery: query => {
    set({ searchQuery: query });
  },

  // Select a category
  setSelectedCategory: category => {
    set({ selectedCategory: category });
  },

  // Reset search and category filters
  resetFilters: () => {
    set({
      searchQuery: '',
      selectedCategory: 'All',
    });
  },

  // Retrieve single product by id
  getProductById: (id: number) => {
    return get().products.find(product => product.id === id);
  },
}));
