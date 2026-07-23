'use client';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import { formatPrice, DIETARY_TAGS } from '@/lib/constants';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);

  const price = product.price;
  const comparePrice = product.compareAtPrice;
  const nutrition = product.nutrition || {};
  const dietaryTags = product.dietaryTags || [];

  const proteinVal = nutrition.protein ?? 35;
  const fatVal     = nutrition.fat ?? 12;
  const carbsVal   = nutrition.carbs ?? 40;
  const calVal     = nutrition.calories ?? 450;

  const imgPrimary = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop';
  const imgHover   = product.images?.[1]?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop';

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.slug}`} className={styles.imageWrap}>
        <img
          src={imgPrimary}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        <img
          src={imgHover}
          alt={product.name}
          className={styles.imageHover}
          loading="lazy"
        />
        {product.discount > 0 && (
          <span className={styles.badge}>-{product.discount}%</span>
        )}
        {product.planCadence && product.planCadence !== 'one-off' && (
          <span className={styles.cadenceBadge}>
            {product.planCadence.toUpperCase()} PLAN
          </span>
        )}
      </Link>

      <div className={styles.info}>
        {/* Dietary Tag Badges */}
        {dietaryTags.length > 0 && (
          <div className={styles.tagStrip}>
            {dietaryTags.slice(0, 2).map((tag) => {
              const config = DIETARY_TAGS[tag];
              return config ? (
                <span key={tag} className={config.class} style={{ fontSize: '10px', padding: '2px 6px' }}>
                  {config.icon} {config.label}
                </span>
              ) : null;
            })}
          </div>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>

        {/* Nutrition Macro Strip — Guaranteed Protein, Fat, Carbs, Calories */}
        <div className="macro-strip" style={{ margin: '6px 0 10px 0' }}>
          <span className="macro-chip macro-chip-protein">{proteinVal}g P</span>
          <span className="macro-chip macro-chip-fat">{fatVal}g F</span>
          <span className="macro-chip macro-chip-carbs">{carbsVal}g C</span>
          <span className="macro-chip macro-chip-cal">{calVal} kcal</span>
        </div>

        <div className={styles.pricing}>
          <span className={styles.price}>{formatPrice(price)}</span>
          {comparePrice && comparePrice > price && (
            <span className={styles.comparePrice}>{formatPrice(comparePrice)}</span>
          )}
        </div>

        <button className={styles.addBtn} onClick={() => addItem(product._id)}>
          ADD TO MEAL BOX
        </button>
      </div>
    </div>
  );
}
