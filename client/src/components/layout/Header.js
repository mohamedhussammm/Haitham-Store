'use client';
import { useState } from 'react';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import styles from './Header.module.css';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.getItemCount());
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Mobile menu toggle */}
        <button className={styles.menuBtn} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`} />
        </button>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          /Haitham.Store/
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          <Link href="/shop" className={styles.navLink}>shop</Link>
          <Link href="/about" className={styles.navLink}>about us</Link>
          {isAdmin && <Link href="/admin" className={styles.navLink}>admin</Link>}
        </nav>

        {/* Utility Icons */}
        <div className={styles.utils}>
          <Link href={isAuthenticated ? (isAdmin ? '/admin' : '/account') : '/account/login'} className={styles.utilBtn} aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
          
          {!isAdmin && (
            <button className={styles.cartBtn} onClick={openCart} aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <Link href="/shop" onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)}>About Us</Link>
            {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>}
            {isAuthenticated ? (
              <>
                {!isAdmin && <Link href="/account" onClick={() => setMobileOpen(false)}>My Account</Link>}
                <button 
                  className={styles.mobileLogout} 
                  onClick={async () => { await useAuthStore.getState().logout(); setMobileOpen(false); }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/account/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
