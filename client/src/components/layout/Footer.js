'use client';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>/Haitham.Store/</Link>
            <p className={styles.tagline}>Simple switch, better skin.</p>
            <div className={styles.social}>
              <a href="#" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .54.04.79.1v-3.49a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.16 15.2a6.34 6.34 0 006.33 6.34 6.34 6.34 0 006.34-6.34V8.84a8.27 8.27 0 004.76 1.52V6.94a4.85 4.85 0 01-1-.25z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Policies */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Store Policies</h4>
            <nav className={styles.colNav}>
              <Link href="/about">About Us</Link>
              <Link href="#">FAQs</Link>
              <Link href="#">Shipping Policy</Link>
              <Link href="#">Return & Refund Policy</Link>
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Stay Updated</h4>
            <p className={styles.colDesc}>Subscribe for exclusive offers and skincare tips.</p>
            <form className={styles.newsletter} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" className={styles.newsletterInput} />
              <button type="submit" className={styles.newsletterBtn}>→</button>
            </form>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Haitham Store. All rights reserved.</p>
          <div className={styles.payments}>
            <span className={styles.paymentIcon}>VISA</span>
            <span className={styles.paymentIcon}>MC</span>
            <span className={styles.paymentIcon}>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
