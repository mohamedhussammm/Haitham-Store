'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import styles from './page.module.css';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products?limit=8');
        setProducts(res.data.products || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>simple switch,<br />better skin</h1>
          <p className={styles.heroSubtitle}>Premium biodegradable face towels for your daily skincare routine</p>
          <Link href="/shop" className="btn btn-primary btn-lg">Shop Now</Link>
        </div>
      </section>

      {/* Trust Signals */}
      <section className={styles.trust}>
        <div className="container">
          <p className={styles.trustLabel}>TRUSTED BY THOUSANDS</p>
          <div className={styles.trustLogos}>
            <span>★ 4.9/5 Rating</span>
            <span>•</span>
            <span>10,000+ Happy Customers</span>
            <span>•</span>
            <span>Eco-Friendly</span>
            <span>•</span>
            <span>Dermatologist Approved</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Bestsellers</h2>
          {loading ? (
            <div className="loading-center"><div className="spinner spinner-lg" /></div>
          ) : (
            <div className={styles.productGrid}>
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comparison Section */}
      <section className={styles.comparison}>
        <div className="container">
          <h2 className="section-title">Why Haitham Store?</h2>
          <div className={styles.compTable}>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th className={styles.highlight}>Haitham Store</th>
                  <th>Regular Towels</th>
                  <th>Tissues</th>
                  <th>Wipes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Bacteria-Free</td><td className={styles.highlight}>✓</td><td>✗</td><td>✗</td><td>✗</td></tr>
                <tr><td>Soft on Skin</td><td className={styles.highlight}>✓</td><td>Varies</td><td>✗</td><td>✗</td></tr>
                <tr><td>Absorbent</td><td className={styles.highlight}>✓</td><td>✓</td><td>✗</td><td>✗</td></tr>
                <tr><td>Biodegradable</td><td className={styles.highlight}>✓</td><td>✗</td><td>✓</td><td>✗</td></tr>
                <tr><td>Single-Use Hygiene</td><td className={styles.highlight}>✓</td><td>✗</td><td>✓</td><td>✓</td></tr>
                <tr><td>No Chemicals</td><td className={styles.highlight}>✓</td><td>✓</td><td>✓</td><td>✗</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* All Products / Bundles */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop Bundles & Save</h2>
          {!loading && (
            <div className={styles.productGrid}>
              {products.filter((p) => p.isBundle).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className={styles.viewAll}>
            <Link href="/shop" className="btn btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletter}>
        <div className="container">
          <h2 className={styles.nlTitle}>Join the Haitham Store Family</h2>
          <p className={styles.nlDesc}>Get 10% off your first order + exclusive skincare tips</p>
          <form className={styles.nlForm} onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" className={styles.nlInput} />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
