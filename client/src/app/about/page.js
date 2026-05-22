'use client';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Our Story</h1>
            <p className={styles.subtitle}>Transforming your daily routine into a premium, sustainable experience.</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.mission}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.textContent}>
              <h2>Better for Skin, Better for the Planet</h2>
              <p>
                At /Haitham.Store/, we believe that the most important part of your skincare routine is the one often overlooked: how you dry your face. 
                Regular towels are breeding grounds for bacteria, and traditional tissues can be too harsh and wasteful.
              </p>
              <p>
                Our mission was simple: create a premium, ultra-soft, and biodegradable alternative that ensures your skin remains as clean as the products you apply to it.
              </p>
              <div className={styles.statGrid}>
                <div className={styles.statItem}>
                  <strong>100%</strong>
                  <span>Biodegradable</span>
                </div>
                <div className={styles.statItem}>
                  <strong>0%</strong>
                  <span>Bacteria buildup</span>
                </div>
                <div className={styles.statItem}>
                  <strong>Premium</strong>
                  <span>Bamboo Fiber</span>
                </div>
              </div>
            </div>
            <div className={styles.imageWrap}>
              <img 
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800" 
                alt="Our mission" 
                className={styles.missionImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className={styles.whyUs}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Why /Haitham.Store/?</h2>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🌱</div>
              <h3>Eco-Conscious</h3>
              <p>Made from responsibly sourced bamboo fibers that decompose naturally in weeks.</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>✨</div>
              <h3>Hypoallergenic</h3>
              <p>Specifically designed for sensitive skin types. Dermatologically tested and irritant-free.</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>💧</div>
              <h3>Ultra Absorbent</h3>
              <p>Tough enough for deep cleansing, yet soft enough for the most delicate facial areas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2>Ready to make the switch?</h2>
            <p>Join thousands of happy customers who have upgraded their skincare game.</p>
            <a href="/shop" className="btn btn-primary btn-lg">Shop Haitham Store Now</a>
          </div>
        </div>
      </section>
    </div>
  );
}
