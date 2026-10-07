'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import useCartStore from '@/store/cartStore';
import { formatPrice } from '@/lib/constants';
import ProductCard from '@/components/product/ProductCard';
import styles from './page.module.css';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const galleryRef = useRef(null);

  const addItem = useCartStore((s) => s.addItem);
  const addingProductId = useCartStore((s) => s.addingProductId);
  const currency = useCartStore((s) => s.currency);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data);

        const relRes = await api.get(`/products/related/${slug}`);
        setRelated(relRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProduct();
  }, [slug]);

  // Lock scroll when lightbox is opened
  useEffect(() => {
    if (lightboxOpen) {
      document.documentElement.classList.add('scroll-locked');
    } else {
      document.documentElement.classList.remove('scroll-locked');
    }
    return () => {
      document.documentElement.classList.remove('scroll-locked');
    };
  }, [lightboxOpen]);

  // Sync horizontal swipe scroll on mobile with selectedImage dot
  const handleGalleryScroll = (e) => {
    const element = e.target;
    const scrollPosition = element.scrollLeft;
    const width = element.offsetWidth;
    const newIndex = Math.round(scrollPosition / width);
    if (newIndex !== selectedImage && newIndex >= 0 && newIndex < (product?.images?.length || 1)) {
      setSelectedImage(newIndex);
    }
  };

  const scrollToImage = (index) => {
    setSelectedImage(index);
    if (galleryRef.current) {
      const width = galleryRef.current.offsetWidth;
      galleryRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth',
      });
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner spinner-lg" /></div>;
  if (!product) return <div className="loading-center"><p>Product not found</p></div>;

  const isAdding = addingProductId === product._id;
  const price = product.prices?.[currency] || product.price;
  const comparePrice = product.compareAtPrice
    ? (currency === 'EGP' ? product.compareAtPrice * 13.5 : product.compareAtPrice)
    : null;

  const accordions = [
    { title: 'TOWEL HIGHLIGHTS', content: product.highlights },
    { title: 'TOWEL USES', content: product.uses },
    { title: 'PRODUCT DESCRIPTION', content: product.description ? [product.description] : [] },
  ].filter((a) => a.content?.length > 0);

  const images = product.images?.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800' }];

  return (
    <div className="page-enter">
      <div className="container">
        <div className={styles.layout}>
          {/* Image Gallery */}
          <div className={styles.gallery}>
            {/* Desktop & Mobile Carousel with smooth snap scrolling */}
            <div
              className={styles.carouselContainer}
              ref={galleryRef}
              onScroll={handleGalleryScroll}
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  className={styles.carouselSlide}
                  onClick={() => setLightboxOpen(true)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Enlarge image ${i + 1}`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} - slide ${i + 1}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  {product.discount > 0 && i === 0 && (
                    <span className={styles.badge}>-{product.discount}%</span>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Carousel Pagination Dots */}
            {images.length > 1 && (
              <div className={styles.dotsPagination}>
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.dot} ${i === selectedImage ? styles.dotActive : ''}`}
                    onClick={() => scrollToImage(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnails row */}
            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === selectedImage ? styles.thumbActive : ''}`}
                    onClick={() => scrollToImage(i)}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <img src={img.url} alt={`${product.name} thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={styles.info}>
            <h1 className={styles.name}>{product.name}</h1>
            <div className={styles.pricing}>
              <span className={styles.price}>{formatPrice(price, currency)}</span>
              {comparePrice && (
                <span className={styles.comparePrice}>{formatPrice(comparePrice, currency)}</span>
              )}
            </div>

            {product.rating > 0 && (
              <div className={styles.rating}>
                <span className={styles.stars}>{'★'.repeat(Math.round(product.rating))}</span>
                <span>{product.rating} ({product.numReviews} reviews)</span>
              </div>
            )}

            <button
              className={`${styles.addBtn} ${isAdding ? styles.adding : ''}`}
              onClick={() => addItem(product)}
              disabled={isAdding}
            >
              {isAdding ? (
                <span className={styles.btnLoading}>
                  <span className={styles.btnSpinner} />
                  ADDING TO CART...
                </span>
              ) : (
                'ADD TO CART'
              )}
            </button>

            {/* Accordions */}
            <div className={styles.accordions}>
              {accordions.map((acc, i) => (
                <div key={i} className={styles.accordion}>
                  <button
                    className={styles.accordionHeader}
                    onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
                    aria-expanded={openAccordion === i}
                  >
                    <span>{acc.title}</span>
                    <span className={styles.accordionIcon}>{openAccordion === i ? '▲' : '▼'}</span>
                  </button>
                  {openAccordion === i && (
                    <div className={styles.accordionBody}>
                      {acc.content.map((item, j) => (
                        <p key={j} className={styles.accordionItem}>{item}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className="section-title">Complete Your Routine</h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className={styles.lightbox}
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button className={styles.lightboxClose} aria-label="Close image viewer">✕</button>
          <img
            src={images[selectedImage]?.url}
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
