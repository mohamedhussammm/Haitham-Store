'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import styles from './page.module.css';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products?limit=20${sort ? `&sort=${sort}` : ''}`);
        setProducts(res.data.products || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [sort]);

  return (
    <div className="page-enter">
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Shop All</h1>
          <select className={`form-select ${styles.sort}`} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner spinner-lg" /></div>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
