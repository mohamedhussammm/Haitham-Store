'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import ProductCarousel from '@/components/home/ProductCarousel';
import styles from './page.module.css';

// ── Trust pill ────────────────────────────────────────────────────
function TrustPill({ icon, label }) {
  return (
    <div className={styles.trustPill}>
      <span className={styles.trustIcon}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

// ── Home Page ─────────────────────────────────────────────────────
export default function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [planMeals,   setPlanMeals]   = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/products?limit=20');
        const all = res.data.products || [];
        setAllProducts(all);
        setPlanMeals(all.filter(p => p.isBundle || (p.planCadence && p.planCadence !== 'one-off')).slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-enter">

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className="section-label">🌿 Fresh • Healthy • Real</span>
          <h1 className={styles.heroTitle}>
            EAT FIT.<br />
            <span className={styles.heroAccent}>LIVE STRONG.</span>
          </h1>
          <p className={styles.heroSub}>
            Calorie-counted, high-protein meals crafted for your goals —<br />
            delivered fresh to your door every day.
          </p>
          <div className={styles.heroCta}>
            <Link href="/shop" className="btn btn-primary btn-lg">
              🥗 Explore Menu
            </Link>
            <Link href="/shop?category=meal-plans" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
              📅 View Meal Plans
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}><strong>10K+</strong><span>Happy Customers</span></div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}><strong>★ 4.9</strong><span>Average Rating</span></div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}><strong>100%</strong><span>Halal Certified</span></div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.heroImageCard}>
            <img
              src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=500&fit=crop"
              alt="Fit Station meal box"
            />
            <div className={styles.heroMacroFloat}>
              <span className="macro-chip macro-chip-protein">39g Protein</span>
              <span className="macro-chip macro-chip-cal">460 kcal</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────── */}
      <section className={styles.trust}>
        <div className="container">
          <div className={styles.trustGrid}>
            <TrustPill icon="💪" label="High Protein" />
            <TrustPill icon="🌿" label="100% Fresh Daily" />
            <TrustPill icon="📊" label="Calorie Counted" />
            <TrustPill icon="✅" label="Halal Certified" />
            <TrustPill icon="🚀" label="Fast Delivery" />
            <TrustPill icon="🎯" label="Customizable Macros" />
          </div>
        </div>
      </section>

      {/* ── ANIMATED PRODUCT CAROUSEL ────────────────────────── */}
      {!loading && (
        <ProductCarousel
          products={allProducts}
          title="CHEF'S BESTSELLERS"
          subtitle="Swipe through our macro-balanced hot meals and fresh salads"
        />
      )}

      {/* ── WHY FIT STATION ──────────────────────────────────── */}
      <section className={styles.why}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--fs-green-400)' }}>The Difference</span>
          <h2 className={styles.whyTitle}>Fit Station vs. Regular Takeout</h2>
          <div className={styles.compTable}>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th className={styles.highlight}>Fit Station</th>
                  <th>Regular Takeout</th>
                  <th>Cooking at Home</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Calorie Counted', '✓', '✗', '± Varies'],
                  ['Macro-Optimized', '✓', '✗', '± Varies'],
                  ['Fresh Ingredients', '✓', '± Varies', '✓'],
                  ['High Protein', '✓', '✗', '± Varies'],
                  ['Halal Certified', '✓', '± Varies', '✓'],
                  ['Ready in Minutes', '✓', '✓', '✗'],
                  ['Customizable', '✓', '✗', '✓'],
                ].map(([feature, ...cols]) => (
                  <tr key={feature}>
                    <td>{feature}</td>
                    {cols.map((val, i) => (
                      <td key={i} className={i === 0 ? styles.highlight : ''}>
                        <span className={val === '✓' ? styles.yes : val === '✗' ? styles.no : styles.maybe}>{val}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── MEAL PLANS ───────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--fs-green-50)' }}>
        <div className="container">
          <span className="section-label">Subscribe & Save</span>
          <h2 className="section-title">Weekly & Monthly Meal Plans</h2>
          <p className={styles.planIntro}>
            Weekly & monthly subscriptions — fully customized to your diet plan and fitness goals.
          </p>
          {!loading && (
            <div className={styles.plansGrid}>
              {planMeals.map(plan => (
                <Link href={`/products/${plan.slug}`} key={plan._id} className={styles.planCard}>
                  <div className={styles.planCardImg}>
                    {plan.images?.[0]?.url && (
                      <img src={plan.images[0].url} alt={plan.name} loading="lazy" />
                    )}
                  </div>
                  <div className={styles.planCardBody}>
                    {plan.planCadence && plan.planCadence !== 'one-off' && (
                      <span className={`badge badge-green`} style={{ marginBottom: 8, display: 'inline-flex' }}>
                        {plan.planCadence === 'weekly' ? '📅 WEEKLY' : '🗓️ MONTHLY'}
                      </span>
                    )}
                    <h3 className={styles.planCardName}>{plan.name}</h3>
                    <p className={styles.planCardDesc}>{plan.description?.slice(0, 90)}…</p>
                    <div className={styles.planCardFooter}>
                      <div>
                        <span className={styles.planPrice}>{plan.price} EGP</span>
                        {plan.compareAtPrice && (
                          <span className={styles.planOld}>{plan.compareAtPrice} EGP</span>
                        )}
                      </div>
                      <span className="btn btn-primary btn-sm">Order Now</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <span className="section-label">Simple as 1-2-3</span>
          <h2 className="section-title">How It Works</h2>
          <div className={styles.stepsGrid}>
            {[
              { step: '01', icon: '🥗', title: 'Choose Your Meals', desc: 'Browse our fresh menu and pick your favorite protein-packed meals or subscribe to a plan.' },
              { step: '02', icon: '📅', title: 'Select Delivery Slot', desc: 'Pick a delivery time that works for you — morning, afternoon, or evening. We deliver 7 days.' },
              { step: '03', icon: '🚀', title: 'Enjoy Fresh & Fit', desc: 'We prep it fresh. You eat it hot. Track your macros and smash your goals.' },
            ].map(s => (
              <div key={s.step} className={styles.step}>
                <div className={styles.stepNum}>{s.step}</div>
                <div className={styles.stepIcon}>{s.icon}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────── */}
      <section className={styles.newsletter}>
        <div className="container">
          <div className={styles.nlInner}>
            <div className={styles.nlText}>
              <span className="section-label" style={{ color: 'var(--fs-gold)' }}>Stay on Track</span>
              <h2 className={styles.nlTitle}>Join the Fit Station Family</h2>
              <p className={styles.nlSub}>Get 10% off your first order + weekly meal tips and exclusive offers.</p>
            </div>
            <form className={styles.nlForm} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" className={styles.nlInput} />
              <button type="submit" className="btn btn-promo">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
