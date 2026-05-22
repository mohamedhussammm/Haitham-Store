'use client';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import { formatPrice } from '@/lib/constants';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const currency = useCartStore((s) => s.currency);

  const price = product.prices?.[currency] || product.price;
  const comparePrice = product.compareAtPrice
    ? (currency === 'EGP' ? product.compareAtPrice * 13.5 : product.compareAtPrice)
    : null;

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.slug}`} className={styles.imageWrap}>
        <img
          src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&h=400&fit=crop'}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        {product.images?.[1] && (
          <img
            src={product.images[1].url}
            alt={product.name}
            className={styles.imageHover}
            loading="lazy"
          />
        )}
        {product.discount > 0 && (
          <span className={styles.badge}>-{product.discount}%</span>
        )}
      </Link>
      <div className={styles.info}>
        <Link href={`/products/${product.slug}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        {product.rating > 0 && (
          <div className={styles.rating}>
            <span className={styles.stars}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span className={styles.ratingNum}>{product.rating}</span>
          </div>
        )}
        <div className={styles.pricing}>
          <span className={styles.price}>{formatPrice(price, currency)}</span>
          {comparePrice && (
            <span className={styles.comparePrice}>{formatPrice(comparePrice, currency)}</span>
          )}
        </div>
        <button className={styles.addBtn} onClick={() => addItem(product._id)}>
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
