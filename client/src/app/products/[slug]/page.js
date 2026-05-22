'use client';
import { useEffect, useState } from 'react';
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

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const currency = useCartStore((s) => s.currency);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data);

        const relRes = await api.get(`/products/related/${slug}`);
        setRelated(relRes.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    if (slug) fetchProduct();
  }, [slug]);

  if (loading) return <div className="loading-center"><div className="spinner spinner-lg" /></div>;
  if (!product) return <div className="loading-center"><p>Product not found</p></div>;

  const price = product.prices?.[currency] || product.price;
  const comparePrice = product.compareAtPrice
    ? (currency === 'EGP' ? product.compareAtPrice * 13.5 : product.compareAtPrice)
    : null;

  const accordions = [
    { title: 'TOWEL HIGHLIGHTS', content: product.highlights },
    { title: 'TOWEL USES', content: product.uses },
    { title: 'PRODUCT DESCRIPTION', content: product.description ? [product.description] : [] },
  ].filter((a) => a.content?.length > 0);

  return (
    <div className="page-enter">
      <div className="container">
        <div className={styles.layout}>
          {/* Image Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImage} onClick={() => setLightboxOpen(true)}>
              <img
                src={product.images?.[selectedImage]?.url || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800'}
                alt={product.name}
              />
              {product.discount > 0 && (
                <span className={styles.badge}>-{product.discount}%</span>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === selectedImage ? styles.thumbActive : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img.url} alt={`${product.name} ${i + 1}`} />
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
              className={styles.addBtn}
              onClick={() => addItem(product._id)}
              disabled={isLoading}
            >
              {isLoading ? 'ADDING...' : 'ADD TO CART'}
            </button>

            {/* Accordions */}
            <div className={styles.accordions}>
              {accordions.map((acc, i) => (
                <div key={i} className={styles.accordion}>
                  <button
                    className={styles.accordionHeader}
                    onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
                  >
                    <span>{acc.title}</span>
                    <span className={styles.accordionIcon}>{openAccordion === i ? '∧' : '∨'}</span>
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
        <div className={styles.lightbox} onClick={() => setLightboxOpen(false)}>
          <button className={styles.lightboxClose}>✕</button>
          <img
            src={product.images?.[selectedImage]?.url}
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
