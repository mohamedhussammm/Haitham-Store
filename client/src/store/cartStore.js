'use client';
import { create } from 'zustand';
import api from '@/lib/api';

const useCartStore = create((set, get) => ({
  items: [],
  coupon: null,
  isOpen: false,
  isLoading: false,
  addingProductId: null,
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

  // Add item to cart with OPTIMISTIC update (instant response, no 3s freeze!)
  addItem: async (productOrId, quantity = 1) => {
    const productId = typeof productOrId === 'object' ? productOrId._id : productOrId;
    const productObj = typeof productOrId === 'object' ? productOrId : null;

    // Immediately open drawer and set loading indicators so user has instant feedback
    set({
      addingProductId: productId,
      isLoading: true,
      isOpen: true,
    });

    // If full product object was passed, perform instant optimistic update
    if (productObj) {
      const currentItems = [...get().items];
      const existingIdx = currentItems.findIndex(
        (i) => (i.product?._id || i.product) === productId
      );

      if (existingIdx > -1) {
        currentItems[existingIdx] = {
          ...currentItems[existingIdx],
          quantity: currentItems[existingIdx].quantity + quantity,
        };
      } else {
        currentItems.push({
          _id: 'temp_' + Date.now(),
          product: productObj,
          quantity,
          price: productObj.price,
        });
      }
      set({ items: currentItems });
    }

    try {
      const res = await api.post('/cart/add', { productId, quantity });
      set({
        items: res.data.items || [],
        coupon: res.data.coupon || null,
        isLoading: false,
        addingProductId: null,
      });
      return true;
    } catch (e) {
      set({ isLoading: false, addingProductId: null });
      console.error('Failed to add to cart:', e);
      // Re-fetch true server cart to revert optimistic changes if failed
      get().fetchCart();
      return false;
    }
  },

  // Update item quantity
  updateQuantity: async (itemId, quantity) => {
    // Optimistic quantity update
    const prevItems = get().items;
    set({
      items: prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      ),
    });

    try {
      const res = await api.put(`/cart/update/${itemId}`, { quantity });
      set({ items: res.data.items || [], coupon: res.data.coupon || null });
    } catch (e) {
      console.error('Failed to update cart:', e);
      set({ items: prevItems });
    }
  },

  // Remove item
  removeItem: async (itemId) => {
    const prevItems = get().items;
    set({ items: prevItems.filter((i) => i._id !== itemId) });

    try {
      const res = await api.delete(`/cart/remove/${itemId}`);
      set({ items: res.data.items || [], coupon: res.data.coupon || null });
    } catch (e) {
      console.error('Failed to remove item:', e);
      set({ items: prevItems });
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
      return sum + (price || 0) * item.quantity;
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
