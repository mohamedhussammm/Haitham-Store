'use client';
import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';

export default function AuthProvider({ children }) {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    checkAuth();
    fetchCart();
  }, []);

  return <>{children}</>;
}
