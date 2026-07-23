'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import useCartStore from '@/store/cartStore';
import { formatPrice, DIETARY_TAGS } from '@/lib/constants';
import ProductCard from '@/components/product/ProductCard';
import styles from './page.module.css';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct]           = useState(null);
  const [related, setRelated]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [lightboxOpen, setLightboxOpen]   = useState(false);
  const [quantity, setQuantity]         = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

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
  if (!product) return <div className="loading-center"><p>Meal not found</p></div>;

  const {
    name, description, price, compareAtPrice, discount,
    nutrition = {}, dietaryTags = [], allergens = [], ingredients = [],
    portionSize, planCadence
  } = product;

  const accordions = [
    { title: '📊 FULL NUTRITION BREAKDOWN', content: [
      `Calories: ${nutrition.calories || 0} kcal`,
      `Protein: ${nutrition.protein || 0}g`,
      `Carbohydrates: ${nutrition.carbs || 0}g`,
      `Fats: ${nutrition.fat || 0}g`,
      `Dietary Fiber: ${nutrition.fiber || 0}g`,
      `Sodium: ${nutrition.sodium || 0}mg`,
    ]},
    { title: '🌱 INGREDIENTS & SOURCE', content: ingredients.length > 0 ? ingredients : [description] },
    { title: '🔥 HEATING & STORAGE INSTRUCTIONS', content: [
      '• Microwave: Remove lid, heat on high for 2.5 to 3 minutes until hot.',
      '• Storage: Keep refrigerated at 2°C – 4°C. Best consumed within 4 days of delivery.',
      '• Freezing: Can be frozen for up to 30 days. Thaw in fridge overnight before heating.'
    ]},
  ];

  return (
    <div className="page-enter">
      <div className="container">
        <div className={styles.layout}>

          {/* Left Column: Image Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImage} onClick={() => setLightboxOpen(true)}>
              <img
                src={product.images?.[selectedImage]?.url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
                alt={name}
              />
              {discount > 0 && <span className={styles.badge}>-{discount}%</span>}
              {planCadence && planCadence !== 'one-off' && (
                <span className={styles.planBadge}>{planCadence.toUpperCase()} PLAN</span>
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
                    <img src={img.url} alt={`${name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Meal Details & Macros */}
          <div className={styles.info}>
            
            {/* Dietary Badges */}
            <div className={styles.badgeRow}>
              {dietaryTags.map((tag) => {
                const conf = DIETARY_TAGS[tag];
                return conf ? (
                  <span key={tag} className={conf.class} style={{ fontSize: '11px', padding: '4px 10px' }}>
                    {conf.icon} {conf.label}
                  </span>
                ) : null;
              })}
              {portionSize && (
                <span className="badge badge-green" style={{ fontSize: '11px', padding: '4px 10px' }}>
                  ⚖️ {portionSize}
                </span>
              )}
            </div>

            <h1 className={styles.name}>{name}</h1>

            <div className={styles.pricing}>
              <span className={styles.price}>{formatPrice(price)}</span>
              {compareAtPrice && compareAtPrice > price && (
                <span className={styles.comparePrice}>{formatPrice(compareAtPrice)}</span>
              )}
            </div>

            {description && <p className={styles.description}>{description}</p>}

            {/* ── MACRO GRID DISPLAY ── */}
            {(nutrition.calories || nutrition.protein || nutrition.carbs || nutrition.fat) && (
              <div className={styles.macroCardGrid}>
                <div className={styles.macroBox} style={{ borderTopColor: '#6FBE44' }}>
                  <span className={styles.macroVal}>{nutrition.calories || 0}</span>
                  <span className={styles.macroLabel}>CALORIES</span>
                </div>
                <div className={styles.macroBox} style={{ borderTopColor: '#10B981' }}>
                  <span className={styles.macroVal}>{nutrition.protein || 0}g</span>
                  <span className={styles.macroLabel}>PROTEIN</span>
                </div>
                <div className={styles.macroBox} style={{ borderTopColor: '#3B82F6' }}>
                  <span className={styles.macroVal}>{nutrition.carbs || 0}g</span>
                  <span className={styles.macroLabel}>CARBS</span>
                </div>
                <div className={styles.macroBox} style={{ borderTopColor: '#F59E0B' }}>
                  <span className={styles.macroVal}>{nutrition.fat || 0}g</span>
                  <span className={styles.macroLabel}>FATS</span>
                </div>
              </div>
            )}

            {/* Ingredients & Allergens preview */}
            {ingredients.length > 0 && (
              <div className={styles.ingSection}>
                <strong style={{ fontSize: 12, color: 'var(--fs-green-800)', textTransform: 'uppercase', letterSpacing: 1 }}>Ingredients:</strong>
                <p className={styles.ingList}>{ingredients.join(', ')}</p>
              </div>
            )}

            {allergens.length > 0 && (
              <div className={styles.allergenSection}>
                <span className={styles.allergenTag}>⚠️ Contains: {allergens.join(', ')}</span>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className={styles.actionRow}>
              <div className={styles.qtyControl}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button
                className={styles.addBtn}
                onClick={() => addItem(product._id, quantity)}
                disabled={isLoading}
              >
                {isLoading ? 'ADDING...' : `🥗 ADD TO MEAL BOX (${(price * quantity).toFixed(0)} EGP)`}
              </button>
            </div>

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

        {/* Related Meals */}
        {related.length > 0 && (
          <section className={styles.related}>
            <span className="section-label">RECOMMENDED</span>
            <h2 className="section-title">You Might Also Like</h2>
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
            alt={name}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
