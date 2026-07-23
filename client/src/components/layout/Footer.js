import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand Column */}
            <div className={styles.brandCol}>
              <div className={styles.brand}>
                <div className={styles.brandLogo}>
                  <svg width="28" height="18" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="9" width="4" height="4" rx="1" fill="#6FBE44"/>
                    <rect x="4" y="7" width="3" height="8" rx="1" fill="#6FBE44"/>
                    <rect x="7" y="9.5" width="10" height="3" rx="1" fill="#6FBE44"/>
                    <rect x="17" y="7" width="3" height="8" rx="1" fill="#6FBE44"/>
                    <rect x="20" y="9" width="4" height="4" rx="1" fill="#6FBE44"/>
                    <path d="M23 3 C27 1 32 4 30 9 C28 5 24 4 23 3Z" fill="#6FBE44" opacity="0.9"/>
                    <path d="M23 3 C24 6 26 8 30 9" stroke="#1B4332" strokeWidth="0.8" fill="none"/>
                  </svg>
                  <div>
                    <div className={styles.brandName}>FIT STATION</div>
                    <div className={styles.brandSub}>— KITCHEN —</div>
                  </div>
                </div>
                <p className={styles.brandTagline}>Real Food. Real Results.</p>
                <p className={styles.brandDesc}>
                  Fresh, calorie-counted meals crafted for your fitness goals. 
                  High-protein. Halal. Delivered daily.
                </p>
                <div className={styles.socialRow}>
                  <a href="https://instagram.com/fit_station_healthy_meal" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Instagram">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Facebook">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://wa.me/201113395716" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="WhatsApp">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Quick Links</h4>
              <ul className={styles.linkList}>
                <li><Link href="/shop"  className={styles.footerLink}>Our Menu</Link></li>
                <li><Link href="/shop?category=meal-plans" className={styles.footerLink}>Meal Plans</Link></li>
                <li><Link href="/shop?category=salads" className={styles.footerLink}>Salads</Link></li>
                <li><Link href="/about" className={styles.footerLink}>About Us</Link></li>
                <li><Link href="/account" className={styles.footerLink}>My Account</Link></li>
              </ul>
            </div>

            {/* Dietary */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Dietary Options</h4>
              <ul className={styles.linkList}>
                <li><Link href="/shop?tag=high-protein" className={styles.footerLink}>💪 High Protein</Link></li>
                <li><Link href="/shop?tag=keto"         className={styles.footerLink}>🥑 Keto Meals</Link></li>
                <li><Link href="/shop?tag=vegan"        className={styles.footerLink}>🌱 Vegan</Link></li>
                <li><Link href="/shop?tag=low-carb"     className={styles.footerLink}>📉 Low Carb</Link></li>
                <li><Link href="/shop?tag=gluten-free"  className={styles.footerLink}>🌾 Gluten Free</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Contact Us</h4>
              <ul className={styles.contactList}>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.86 19.79 19.79 0 01.01 1.24a2 2 0 012-2.2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.4A16 16 0 0015.6 17l1.27-.77a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  <a href="tel:+201113395716">01113395716</a>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.86 19.79 19.79 0 01.01 1.24a2 2 0 012-2.2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.4A16 16 0 0015.6 17l1.27-.77a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  <a href="tel:+201020865939">01020865939</a>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  <a href="https://instagram.com/fitstation.eg" target="_blank" rel="noopener noreferrer">fitstation.eg</a>
                </li>
              </ul>
              <div className={styles.badge}>
                <span>📦 Fast Delivery</span>
                <span>🌿 Fresh & Ready</span>
                <span>✅ Quality You Can Trust</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © {currentYear} Fit Station Kitchen. All rights reserved.
            </p>
            <p className={styles.bottomTagline}>
              <span>Eat Fit.</span>
              <span className={styles.dot}>·</span>
              <span>Live Strong.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
