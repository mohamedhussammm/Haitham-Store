'use client';
import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import { DIETARY_TAGS } from '@/lib/constants';
import styles from './page.module.css';

function ShopContent() {
  const searchParams   = useSearchParams();
  const initialCat     = searchParams.get('category') || '';
  const initialTag     = searchParams.get('tag') || '';

  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeCat,   setActiveCat]   = useState(initialCat);
  const [activeTag,   setActiveTag]   = useState(initialTag);
  const [sort,        setSort]        = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `/products?limit=50${sort ? `&sort=${sort}` : ''}`;
        if (activeCat) url += `&category=${activeCat}`;

        const [prodRes, catRes] = await Promise.all([
          api.get(url),
          api.get('/categories')
        ]);

        setProducts(prodRes.data.products || []);
        setCategories(catRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCat, sort]);

  // Client-side filtering for dietary tags and search query
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Tag filter
      if (activeTag && (!p.dietaryTags || !p.dietaryTags.includes(activeTag))) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchTag  = p.dietaryTags?.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchTag) return false;
      }
      return true;
    });
  }, [products, activeTag, searchQuery]);

  return (
    <div className="container">
      
      {/* Page Header */}
      <div className={styles.heroHeader}>
        <span className="section-label">FRESH & CALORIE-COUNTED</span>
        <h1 className={styles.title}>OUR MENU</h1>
        <p className={styles.subtitle}>
          Protein-rich meals, vibrant salads, and full weekly subscriptions — crafted for real results.
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search meals, ingredients, or macros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button className={styles.clearSearch} onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className={styles.sortBox}>
          <label htmlFor="sort-select" className={styles.sortLabel}>Sort by:</label>
          <select
            id="sort-select"
            className={styles.sortSelect}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className={styles.catTabs}>
        <button
          className={`${styles.catTab} ${activeCat === '' ? styles.catTabActive : ''}`}
          onClick={() => setActiveCat('')}
        >
          All Meals
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`${styles.catTab} ${activeCat === cat.slug ? styles.catTabActive : ''}`}
            onClick={() => setActiveCat(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Dietary Tag Filter Pills */}
      <div className={styles.tagPills}>
        <span className={styles.tagPillsLabel}>Dietary Filter:</span>
        <button
          className={`${styles.tagPill} ${activeTag === '' ? styles.tagPillActive : ''}`}
          onClick={() => setActiveTag('')}
        >
          All Diets
        </button>
        {Object.entries(DIETARY_TAGS).map(([tagKey, config]) => (
          <button
            key={tagKey}
            className={`${styles.tagPill} ${activeTag === tagKey ? styles.tagPillActive : ''}`}
            onClick={() => setActiveTag(activeTag === tagKey ? '' : tagKey)}
          >
            <span>{config.icon}</span> {config.label}
          </button>
        ))}
      </div>

      {/* Active Filter Summary Indicator */}
      {(activeCat || activeTag || searchQuery) && (
        <div className={styles.filterMeta}>
          <span>Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}</span>
          <button
            className={styles.resetBtn}
            onClick={() => { setActiveCat(''); setActiveTag(''); setSearchQuery(''); }}
          >
            Clear all filters ✕
          </button>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="loading-center"><div className="spinner spinner-lg" /></div>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <span style={{ fontSize: '48px' }}>🥗</span>
          <h3>No meals found matching your criteria</h3>
          <p>Try clearing your dietary filter or search keywords.</p>
          <button
            className="btn btn-primary"
            onClick={() => { setActiveCat(''); setActiveTag(''); setSearchQuery(''); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="page-enter">
      <Suspense fallback={<div className="loading-center"><div className="spinner spinner-lg" /></div>}>
        <ShopContent />
      </Suspense>
    </div>
  );
}
