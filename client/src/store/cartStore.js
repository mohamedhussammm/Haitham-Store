'use client';
import { create } from 'zustand';
import api from '@/lib/api';

const useCartStore = create((set, get) => ({
  items: [],
  coupon: null,
  isOpen: false,
  isLoading: false,
  currency: 'JOD',

  // Actions
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  setCurrency: (currency) => set({ currency }),

  // Fetch cart from server
  fetchCart: async () => {
    try {
      const res = await api.get('/cart');
      const cart = res.data;
      set({
        items: cart.items || [],
        coupon: cart.coupon || null,
      });
    } catch (e) {
      console.error('Failed to fetch cart:', e);
    }
  },

  // Add item to cart
  addItem: async (productId, quantity = 1) => {
    try {
      set({ isLoading: true });
      const res = await api.post('/cart/add', { productId, quantity });
      set({
        items: res.data.items || [],
        coupon: res.data.coupon || null,
        isOpen: true,
        isLoading: false,
      });
      return true;
    } catch (e) {
      set({ isLoading: false });
      console.error('Failed to add to cart:', e);
      return false;
    }
  },

  // Update item quantity
  updateQuantity: async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/update/${itemId}`, { quantity });
      set({ items: res.data.items || [], coupon: res.data.coupon || null });
    } catch (e) {
      console.error('Failed to update cart:', e);
    }
  },

  // Remove item
  removeItem: async (itemId) => {
    try {
      const res = await api.delete(`/cart/remove/${itemId}`);
      set({ items: res.data.items || [], coupon: res.data.coupon || null });
    } catch (e) {
      console.error('Failed to remove item:', e);
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      await api.delete('/cart/clear');
      set({ items: [], coupon: null });
    } catch (e) {
      console.error('Failed to clear cart:', e);
    }
  },

  // Apply coupon
  applyCoupon: async (code) => {
    try {
      const res = await api.post('/cart/apply-coupon', { code });
      set({ items: res.data.items || [], coupon: res.data.coupon || null });
      return { success: true, message: res.message };
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  // Remove coupon
  removeCoupon: async () => {
    try {
      const res = await api.delete('/cart/remove-coupon');
      set({ items: res.data.items || [], coupon: null });
    } catch (e) {
      console.error('Failed to remove coupon:', e);
    }
  },

  // Computed values
  getSubtotal: () => {
    const { items, currency } = get();
    return items.reduce((sum, item) => {
      const product = item.product;
      const price = product?.prices?.[currency] || product?.price || item.price;
      return sum + price * item.quantity;
    }, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getShippingCost: () => {
    const subtotal = get().getSubtotal();
    return subtotal >= 30 ? 0 : 2;
  },

  getDiscount: () => {
    const { coupon } = get();
    if (!coupon) return 0;
    return coupon.discount || 0;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const shipping = get().getShippingCost();
    const discount = get().getDiscount();
    return subtotal + shipping - discount;
  },
}));

export default useCartStore;
