import { create } from 'zustand';
import { Product } from '../types/product';
import { CartItem } from '../types/cart';

interface CartState {
  items: CartItem[];

  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  incrementQuantity: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: number) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (product: Product, quantity = 1) => {
    set(state => {
      const existingIndex = state.items.findIndex(
        item => item.product.id === product.id,
      );

      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        };
        return { items: updatedItems };
      }

      return {
        items: [...state.items, { product, quantity }],
      };
    });
  },

  removeFromCart: (productId: number) => {
    set(state => ({
      items: state.items.filter(item => item.product.id !== productId),
    }));
  },

  incrementQuantity: (productId: number) => {
    set(state => ({
      items: state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    }));
  },

  decrementQuantity: (productId: number) => {
    set(state => ({
      items: state.items
        .map(item => {
          if (item.product.id === productId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter(item => item.quantity > 0),
    }));
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    set(state => ({
      items: state.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  },

  getItemQuantity: (productId: number) => {
    const item = get().items.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  },
}));
