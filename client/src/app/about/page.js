'use client';
import Link from 'next/link';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className="page-enter">
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className="section-label" style={{ color: 'var(--fs-gold)' }}>ABOUT FIT STATION</span>
            <h1 className={styles.title}>REAL FOOD. REAL RESULTS.</h1>
            <p className={styles.subtitle}>
              We take the hassle out of healthy eating — delivering fresh, calorie-counted, high-protein meals straight to your door.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.mission}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.textContent}>
              <span className="section-label">OUR MISSION</span>
              <h2 className={styles.heading2}>Fueling Active Lifestyles Across Egypt</h2>
              <p>
                Founded on the belief that eating healthy should never taste boring or take hours of prep time, 
                <strong> Fit Station Kitchen</strong> delivers chef-crafted meals designed around your exact fitness goals.
              </p>
              <p>
                Whether you're building muscle, shedding fat, or simply looking to eat clean daily, 
                every single meal box is weighed, calorie-counted, and packaged fresh with zero artificial preservatives.
              </p>

              <div className={styles.statGrid}>
                <div className={styles.statItem}>
                  <strong>100%</strong>
                  <span>Halal Certified</span>
                </div>
                <div className={styles.statItem}>
                  <strong>0</strong>
                  <span>Preservatives</span>
                </div>
                <div className={styles.statItem}>
                  <strong>Daily</strong>
                  <span>Fresh Delivery</span>
                </div>
              </div>
            </div>

            <div className={styles.imageWrap}>
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
                alt="Fit Station Kitchen meal prep"
                className={styles.missionImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className={styles.whyUs}>
        <div className="container">
          <span className="section-label" style={{ textAlign: 'center', display: 'block' }}>OUR GUARANTEE</span>
          <h2 className={styles.sectionTitle}>The Fit Station Difference</h2>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>💪</div>
              <h3>Macro-Optimized</h3>
              <p>Every portion of protein, complex carbs, and healthy fats is measured to ensure accurate nutrition tracking.</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🌿</div>
              <h3>100% Fresh Daily</h3>
              <p>Prepared every morning using premium local meats, fresh vegetables, and extra virgin olive oil.</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🕐</div>
              <h3>Scheduled Delivery Slots</h3>
              <p>Choose your preferred delivery window so your food arrives right when you need it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support Box */}
      <section className={styles.contactBox}>
        <div className="container">
          <div className={styles.contactInner}>
            <h2 className={styles.contactHeading}>Have Questions or Need a Custom Plan?</h2>
            <p className={styles.contactDesc}>
              Our nutrition team is here to help you choose the right meal plan for your macros.
            </p>
            <div className={styles.phoneButtons}>
              <a href="tel:+201113395716" className="btn btn-primary btn-lg">
                📞 01113395716
              </a>
              <a href="https://wa.me/201020865939" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
                💬 WhatsApp 01020865939
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2>Ready to Smash Your Goals?</h2>
            <p>Explore our fresh menu or subscribe to a weekly meal plan today.</p>
            <Link href="/shop" className="btn btn-primary btn-lg">
              🥗 View Menu & Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
