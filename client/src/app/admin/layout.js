'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import styles from './layout.module.css';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/orders', label: 'Orders', icon: '🛒' },
  { href: '/admin/expenses', label: 'Expenses', icon: '💰' },
  { href: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
];

export default function AdminLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && (!user || user.role !== 'admin')) {
      router.push('/account/login');
    }
  }, [user, isLoading, mounted]);

  if (!mounted || isLoading) return <div className="loading-center"><div className="spinner spinner-lg" /></div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.sidebarLogo}>/Haitham.Store/</Link>
          <span className={styles.adminBadge}>Admin</span>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{user.firstName[0]}{user.lastName[0]}</div>
            <div>
              <p className={styles.userName}>{user.firstName} {user.lastName}</p>
              <p className={styles.userRole}>Administrator</p>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={async () => { await logout(); router.push('/'); }}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.topBar}>
          <div className={styles.breadcrumb}>Admin / {pathname.split('/').pop() || 'Dashboard'}</div>
          <button className={styles.topLogoutBtn} onClick={async () => { await logout(); router.push('/'); }}>
            Logout
          </button>
        </header>
        {children}
      </main>
    </div>
  );
}
