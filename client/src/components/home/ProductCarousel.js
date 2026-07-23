'use client';
import { useState, useEffect, useRef } from 'react';
import ProductCard from '@/components/product/ProductCard';
import styles from './ProductCarousel.module.css';

export default function ProductCarousel({ products = [], title = 'CHEF\'S BESTSELLERS', subtitle = 'Swipe through our macro-balanced hot meals and fresh salads' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused]         = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const carouselRef                     = useRef(null);

  // Touch Swipe State
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd]     = useState(null);

  // Responsive items per page calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) setItemsPerPage(1);
      else if (window.innerWidth <= 900) setItemsPerPage(2);
      else if (window.innerWidth <= 1200) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerPage);

  // Auto-slide effect
  useEffect(() => {
    if (isPaused || maxIndex === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch Swipe Handlers for Mobile Finger Scrolling
  const minSwipeDistance = 40;

  const onTouchStart = (e) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe  = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section
      className={styles.carouselSection}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        
        {/* Section Header with Controls */}
        <div className={styles.header}>
          <div>
            <span className="section-label">CURATED MENU</span>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          <div className={styles.controls}>
            <button
              className={styles.controlBtn}
              onClick={handlePrev}
              aria-label="Previous meals"
            >
              ←
            </button>

            <span className={styles.slideCounter}>
              {currentIndex + 1} / {maxIndex + 1}
            </span>

            <button
              className={styles.controlBtn}
              onClick={handleNext}
              aria-label="Next meals"
            >
              →
            </button>
          </div>
        </div>

        {/* Carousel Window with Touch Swipe Events */}
        <div
          className={styles.carouselWindow}
          ref={carouselRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className={styles.carouselTrack}
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              gridAutoColumns: `calc((100% - ${(itemsPerPage - 1) * 20}px) / ${itemsPerPage})`,
            }}
          >
            {products.map((product) => (
              <div key={product._id} className={styles.carouselItem}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {maxIndex > 0 && (
          <div className={styles.dots}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
