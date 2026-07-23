'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import ProductCarousel from '@/components/home/ProductCarousel';
import styles from './page.module.css';

// ── Default Showcase meals if loading/offline ────────────────────
const DEFAULT_SHOWCASE_MEALS = [
  {
    _id: 'sc1',
    name: 'Keto Chicken & Veggie Bowl',
    slug: 'keto-chicken-veggie-bowl',
    price: 180,
    nutrition: { protein: 42, calories: 480, carbs: 12, fat: 22 },
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop',
    tag: '🥑 KETO CHOICE'
  },
  {
    _id: 'sc2',
    name: 'Grilled Salmon & Quinoa',
    slug: 'grilled-salmon-quinoa',
    price: 240,
    nutrition: { protein: 38, calories: 520, carbs: 34, fat: 18 },
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=600&fit=crop',
    tag: '🔥 CHEF BESTSELLER'
  },
  {
    _id: 'sc3',
    name: 'Beef Tenderloin Steak Bowl',
    slug: 'beef-tenderloin-steak-bowl',
    price: 260,
    nutrition: { protein: 46, calories: 560, carbs: 28, fat: 20 },
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop',
    tag: '💪 HIGH PROTEIN'
  },
  {
    _id: 'sc4',
    name: 'Avocado Egg Power Bowl',
    slug: 'avocado-egg-power-bowl',
    price: 150,
    nutrition: { protein: 26, calories: 410, carbs: 22, fat: 24 },
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop',
    tag: '🌱 FRESH CHOICE'
  }
];

// ── Hero Automatic Animated Showcase ──────────────────────────────
function HeroShowcase({ products = [] }) {
  const showcaseItems = products.length >= 3
    ? products.slice(0, 4).map((p, i) => ({
        _id: p._id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        nutrition: p.nutrition || { protein: 35, calories: 450 },
        image: p.images?.[0]?.url || DEFAULT_SHOWCASE_MEALS[i % 4].image,
        tag: p.dietaryTags?.includes('high-protein') ? '💪 HIGH PROTEIN' : '🔥 CHEF BESTSELLER'
      }))
    : DEFAULT_SHOWCASE_MEALS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress]         = useState(0);
  const timerRef                         = useRef(null);

  useEffect(() => {
    const duration = 3200; // 3.2s per slide
    const step = 50; // update progress every 50ms

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % showcaseItems.length);
          return 0;
        }
        return prev + (step / duration) * 100;
      });
    }, step);

    return () => clearInterval(interval);
  }, [showcaseItems.length]);

  const currentMeal = showcaseItems[currentIndex];

  return (
    <div className={styles.heroShowcase}>
      <Link href={`/products/${currentMeal.slug}`} className={styles.showcaseCard}>
        <img
          key={currentMeal._id}
          src={currentMeal.image}
          alt={currentMeal.name}
          className={styles.showcaseImg}
        />

        <div className={styles.showcaseOverlay}>
          <div className={styles.showcaseTopRow}>
            <span className={styles.showcaseBadge}>{currentMeal.tag}</span>
            <span className={styles.liveTag}>
              <span className={styles.livePulse} /> LIVE CHEF SELECTION
            </span>
          </div>

          <div className={styles.showcaseBottom}>
            <h3 className={styles.showcaseName}>{currentMeal.name}</h3>

            <div className={styles.showcaseMacroRow}>
              <div className="macro-strip">
                {currentMeal.nutrition?.protein && (
                  <span className="macro-chip macro-chip-protein">{currentMeal.nutrition.protein}g Protein</span>
                )}
                {currentMeal.nutrition?.calories && (
                  <span className="macro-chip macro-chip-cal">{currentMeal.nutrition.calories} kcal</span>
                )}
              </div>

              <span className={styles.showcasePrice}>{currentMeal.price} EGP</span>
            </div>
          </div>
        </div>

        <div className={styles.showcaseProgress} style={{ width: `${progress}%` }} />
      </Link>
    </div>
  );
}

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

      {/* ── HERO (Compact + Animated Showcase) ────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        
        {/* Left Hero Text Content */}
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <span>🌿</span> 100% Fresh • Calorie Counted
          </div>

          <h1 className={styles.heroTitle}>
            EAT FIT.<br />
            <span className={styles.heroAccent}>LIVE STRONG.</span>
          </h1>

          <p className={styles.heroSub}>
            Chef-crafted, high-protein meal boxes delivered fresh every day. Track your macros effortlessly.
          </p>

          <div className={styles.heroCta}>
            <Link href="/shop" className="btn btn-primary">
              🥗 Explore Menu
            </Link>
            <Link href="/shop?category=meal-plans" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
              📅 Meal Plans
            </Link>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}><strong>10K+</strong><span>Fit Members</span></div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}><strong>★ 4.9</strong><span>Rating</span></div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}><strong>100%</strong><span>Halal</span></div>
          </div>
        </div>

        {/* Right Hero Automatic Showcase */}
        <HeroShowcase products={allProducts} />
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────── */}
      <section className={styles.trust}>
        <div className="container">
          <div className={styles.trustGrid}>
            <TrustPill icon="💪" label="High Protein" />
            <TrustPill icon="🌿" label="Fresh Daily" />
            <TrustPill icon="📊" label="Calorie Counted" />
            <TrustPill icon="✅" label="Halal Certified" />
            <TrustPill icon="🚀" label="Fast Delivery" />
            <TrustPill icon="🎯" label="Custom Macros" />
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
                  <th>Home Cooking</th>
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
                      <span className={`badge badge-green`} style={{ marginBottom: 6, display: 'inline-flex' }}>
                        {plan.planCadence === 'weekly' ? '📅 WEEKLY' : '🗓️ MONTHLY'}
                      </span>
                    )}
                    <h3 className={styles.planCardName}>{plan.name}</h3>
                    <p className={styles.planCardDesc}>{plan.description?.slice(0, 85)}…</p>
                    <div className={styles.planCardFooter}>
                      <div>
                        <span className={styles.planPrice}>{plan.price} EGP</span>
                      </div>
                      <span className="btn btn-primary btn-sm">Order Plan</span>
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
