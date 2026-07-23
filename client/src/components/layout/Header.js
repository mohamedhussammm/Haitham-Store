'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import styles from './Header.module.css';

export default function Header() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [scrolled,   setScrolled]     = useState(false);
  const openCart   = useCartStore((s) => s.openCart);
  const itemCount  = useCartStore((s) => s.getItemCount());
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Mobile menu toggle */}
          <button
            className={styles.menuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`} />
          </button>

          {/* Logo */}
          <Link href="/" className={styles.logo} onClick={closeMobile}>
            <div className={styles.logoIcon}>
              {/* Dumbbell + leaf inline SVG matching brand mark */}
              <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="9" width="4" height="4" rx="1" fill="#6FBE44"/>
                <rect x="4" y="7" width="3" height="8" rx="1" fill="#6FBE44"/>
                <rect x="7" y="9.5" width="10" height="3" rx="1" fill="#6FBE44"/>
                <rect x="17" y="7" width="3" height="8" rx="1" fill="#6FBE44"/>
                <rect x="20" y="9" width="4" height="4" rx="1" fill="#6FBE44"/>
                {/* Leaf */}
                <path d="M23 3 C27 1 32 4 30 9 C28 5 24 4 23 3Z" fill="#6FBE44" opacity="0.9"/>
                <path d="M23 3 C24 6 26 8 30 9" stroke="#1B4332" strokeWidth="0.8" fill="none"/>
              </svg>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoMain}>FIT STATION</span>
              <span className={styles.logoSub}>KITCHEN</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav} aria-label="Main navigation">
            <Link href="/shop"  className={styles.navLink}>Menu</Link>
            <Link href="/about" className={styles.navLink}>About</Link>
            {isAdmin && <Link href="/admin" className={styles.navLink}>Admin</Link>}
          </nav>

          {/* Utility Icons */}
          <div className={styles.utils}>
            <Link
              href={isAuthenticated ? (isAdmin ? '/admin' : '/account') : '/account/login'}
              className={styles.utilBtn}
              aria-label="Account"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span className={styles.utilLabel}>
                {isAuthenticated ? user?.firstName : 'Sign In'}
              </span>
            </Link>

            {!isAdmin && (
              <button className={styles.cartBtn} onClick={openCart} aria-label="Cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {itemCount > 0 && (
                  <span className={styles.cartBadge}>{itemCount > 99 ? '99+' : itemCount}</span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={closeMobile} aria-hidden="true" />
      )}

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${mobileOpen ? styles.mobileDrawerOpen : ''}`}>
        <div className={styles.mobileDrawerHeader}>
          <span className={styles.mobileLogoText}>FIT STATION</span>
          <button className={styles.mobileClose} onClick={closeMobile} aria-label="Close menu">✕</button>
        </div>
        <nav className={styles.mobileNav}>
          <Link href="/shop"  onClick={closeMobile} className={styles.mobileLink}>🥗 Menu</Link>
          <Link href="/about" onClick={closeMobile} className={styles.mobileLink}>ℹ️ About Us</Link>
          {isAdmin && <Link href="/admin" onClick={closeMobile} className={styles.mobileLink}>⚙️ Admin Dashboard</Link>}
          <hr className={styles.mobileDivider} />
          {isAuthenticated ? (
            <>
              {!isAdmin && <Link href="/account" onClick={closeMobile} className={styles.mobileLink}>👤 My Account</Link>}
              <button
                className={styles.mobileLogout}
                onClick={async () => { await useAuthStore.getState().logout(); closeMobile(); }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/account/login" onClick={closeMobile} className={styles.mobileLink}>👤 Sign In</Link>
          )}
        </nav>
        <div className={styles.mobileFooter}>
          <p>📞 01113395716</p>
          <p>📞 01020865939</p>
        </div>
      </div>
    </>
  );
}
