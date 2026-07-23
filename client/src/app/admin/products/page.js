'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatPrice, DIETARY_TAGS } from '@/lib/constants';
import ConfirmModal from '@/components/common/ConfirmModal';
import styles from '../admin.module.css';

export default function AdminProductsPage() {
  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch]           = useState('');
  const [saving, setSaving]           = useState(false);
  const [deleteId, setDeleteId]       = useState(null);

  const initialForm = {
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    discount: 0,
    category: '',
    stock: 100,
    imageUrls: '',
    portionSize: '400g',
    planCadence: 'one-off',
    isBundle: false,
    isActive: true,
    nutrition: {
      calories: 450,
      protein: 35,
      carbs: 40,
      fat: 12,
      fiber: 5,
      sodium: 400,
    },
    dietaryTags: ['high-protein', 'halal'],
    allergens: '',
    ingredients: '',
  };

  const [form, setForm] = useState(initialForm);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/admin/all?limit=50&search=${search}`);
      setProducts(res.data.products || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data || []));
  }, []);

  const openCreate = () => {
    setEditProduct(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      compareAtPrice: p.compareAtPrice || '',
      discount: p.discount || 0,
      category: p.category?._id || '',
      stock: p.stock ?? 100,
      imageUrls: p.images?.map((i) => i.url).join('\n') || '',
      portionSize: p.portionSize || '400g',
      planCadence: p.planCadence || 'one-off',
      isBundle: p.isBundle || false,
      isActive: p.isActive ?? true,
      nutrition: {
        calories: p.nutrition?.calories || 0,
        protein: p.nutrition?.protein || 0,
        carbs: p.nutrition?.carbs || 0,
        fat: p.nutrition?.fat || 0,
        fiber: p.nutrition?.fiber || 0,
        sodium: p.nutrition?.sodium || 0,
      },
      dietaryTags: p.dietaryTags || [],
      allergens: p.allergens?.join('\n') || '',
      ingredients: p.ingredients?.join('\n') || '',
    });
    setShowModal(true);
  };

  const handleTagToggle = (tagKey) => {
    setForm((prev) => {
      const exists = prev.dietaryTags.includes(tagKey);
      return {
        ...prev,
        dietaryTags: exists
          ? prev.dietaryTags.filter((t) => t !== tagKey)
          : [...prev.dietaryTags, tagKey],
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        discount: Number(form.discount) || 0,
        category: form.category,
        stock: Number(form.stock) || 0,
        portionSize: form.portionSize,
        planCadence: form.planCadence,
        isBundle: form.isBundle || form.planCadence !== 'one-off',
        isActive: form.isActive,
        imageUrls: form.imageUrls.split('\n').filter(Boolean),
        allergens: form.allergens.split('\n').filter(Boolean),
        ingredients: form.ingredients.split('\n').filter(Boolean),
        dietaryTags: form.dietaryTags,
        nutrition: {
          calories: Number(form.nutrition.calories) || 0,
          protein:  Number(form.nutrition.protein) || 0,
          carbs:    Number(form.nutrition.carbs) || 0,
          fat:      Number(form.nutrition.fat) || 0,
          fiber:    Number(form.nutrition.fiber) || 0,
          sodium:   Number(form.nutrition.sodium) || 0,
        },
        prices: { EGP: Number(form.price) },
      };

      if (editProduct) await api.put(`/products/${editProduct._id}`, payload);
      else await api.post('/products', payload);

      setShowModal(false);
      fetchProducts();
    } catch (e) { alert(e.message || 'Error saving meal'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/products/${deleteId}`);
      fetchProducts();
    } catch (e) {
      alert(e.message || 'Failed to delete meal');
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (p) => {
    await api.put(`/products/${p._id}`, { isActive: !p.isActive });
    fetchProducts();
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Meals & Plans</h1>
          <p className={styles.pageSub}>{products.length} total items in menu</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add New Meal</button>
      </div>

      <div className={styles.searchBar}>
        <input
          className="form-input"
          placeholder="Search meals by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Meal</th>
                <th>Price (EGP)</th>
                <th>Macros (P / F / C / kcal)</th>
                <th>Category</th>
                <th>Cadence</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className={styles.productCell}>
                      <img
                        src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=60'}
                        alt={p.name}
                        className={styles.productThumb}
                      />
                      <div>
                        <strong>{p.name}</strong>
                        {p.portionSize && <span style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'block' }}>{p.portionSize}</span>}
                      </div>
                    </div>
                  </td>
                  <td><strong>{formatPrice(p.price)}</strong></td>
                  <td>
                    {p.nutrition ? (
                      <span style={{ fontSize: 12 }}>
                        💪 <strong>{p.nutrition.protein || 0}g</strong> P · {p.nutrition.fat || 0}g F · {p.nutrition.carbs || 0}g C · <strong>{p.nutrition.calories || 0}</strong> kcal
                      </span>
                    ) : '—'}
                  </td>
                  <td>{p.category?.name || '—'}</td>
                  <td>
                    <span className={`badge ${p.planCadence === 'one-off' ? 'badge-neutral' : 'badge-green'}`}>
                      {p.planCadence || 'one-off'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`badge ${p.isActive ? 'badge-success' : 'badge-neutral'}`}
                      onClick={() => handleToggleActive(p)}
                    >
                      {p.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEdit(p)}>Edit</button>
                      <button className={styles.deleteBtn} onClick={() => setDeleteId(p._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal} style={{ maxWidth: 720 }}>
            <div className={styles.modalHeader}>
              <h2>{editProduct ? 'Edit Meal' : 'Add New Meal'}</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              
              {/* Basic Info */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Meal Name *</label>
                  <input className="form-input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Grilled Salmon Bowl" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (EGP) *</label>
                  <input className="form-input" type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="165" />
                </div>
                <div className="form-group">
                  <label className="form-label">Compare At Price (EGP)</label>
                  <input className="form-input" type="number" value={form.compareAtPrice} onChange={(e) => setForm((p) => ({ ...p, compareAtPrice: e.target.value }))} placeholder="190" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input className="form-input" type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} />
                </div>
              </div>

              {/* Plan Cadence & Portion Size */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Portion Size</label>
                  <input className="form-input" value={form.portionSize} onChange={(e) => setForm((p) => ({ ...p, portionSize: e.target.value }))} placeholder="450g" />
                </div>
                <div className="form-group">
                  <label className="form-label">Plan Type / Cadence</label>
                  <select className="form-select" value={form.planCadence} onChange={(e) => setForm((p) => ({ ...p, planCadence: e.target.value, isBundle: e.target.value !== 'one-off' }))}>
                    <option value="one-off">Single Meal (One-off)</option>
                    <option value="weekly">Weekly Plan Subscription</option>
                    <option value="monthly">Monthly Plan Subscription</option>
                  </select>
                </div>
              </div>

              {/* ── NUTRITION MACROS SECTION ── */}
              <div style={{ background: 'var(--fs-green-50)', padding: 14, borderRadius: 8, marginBottom: 16, border: '1px solid var(--fs-green-200)' }}>
                <strong style={{ fontSize: 13, color: 'var(--fs-green-800)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 10 }}>
                  📊 Nutrition Facts (per serving)
                </strong>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Calories (kcal)</label>
                    <input className="form-input" type="number" value={form.nutrition.calories} onChange={(e) => setForm((p) => ({ ...p, nutrition: { ...p.nutrition, calories: e.target.value } }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Protein (g)</label>
                    <input className="form-input" type="number" value={form.nutrition.protein} onChange={(e) => setForm((p) => ({ ...p, nutrition: { ...p.nutrition, protein: e.target.value } }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Carbs (g)</label>
                    <input className="form-input" type="number" value={form.nutrition.carbs} onChange={(e) => setForm((p) => ({ ...p, nutrition: { ...p.nutrition, carbs: e.target.value } }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fat (g)</label>
                    <input className="form-input" type="number" value={form.nutrition.fat} onChange={(e) => setForm((p) => ({ ...p, nutrition: { ...p.nutrition, fat: e.target.value } }))} />
                  </div>
                </div>
              </div>

              {/* ── DIETARY TAGS CHECKBOXES ── */}
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Dietary Tags</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
                  {Object.entries(DIETARY_TAGS).map(([tagKey, conf]) => (
                    <label key={tagKey} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', background: form.dietaryTags.includes(tagKey) ? 'var(--fs-green-100)' : 'white', padding: '4px 8px', borderRadius: 4, border: '1px solid var(--color-border)' }}>
                      <input
                        type="checkbox"
                        checked={form.dietaryTags.includes(tagKey)}
                        onChange={() => handleTagToggle(tagKey)}
                      />
                      <span>{conf.icon} {conf.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>

              <div className="form-group">
                <label className="form-label">Image URLs (one per line)</label>
                <textarea className="form-input" rows={2} value={form.imageUrls} onChange={(e) => setForm((p) => ({ ...p, imageUrls: e.target.value }))} style={{ resize: 'vertical' }} placeholder="https://..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ingredients (one per line)</label>
                  <textarea className="form-input" rows={3} value={form.ingredients} onChange={(e) => setForm((p) => ({ ...p, ingredients: e.target.value }))} style={{ resize: 'vertical' }} placeholder="Grilled chicken breast&#10;Basmati rice&#10;Steamed broccoli" />
                </div>
                <div className="form-group">
                  <label className="form-label">Allergens (one per line)</label>
                  <textarea className="form-input" rows={3} value={form.allergens} onChange={(e) => setForm((p) => ({ ...p, allergens: e.target.value }))} style={{ resize: 'vertical' }} placeholder="Dairy&#10;Nuts" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-checkbox">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
                  Active (visible on Fit Station menu)
                </label>
              </div>

            </div>

            <div className={styles.modalFooter}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : (editProduct ? 'Update Meal' : 'Create Meal')}
              </button>
            </div>

          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Meal"
        message="Are you sure you want to delete this meal? This action cannot be undone."
        confirmLabel="Delete Meal"
      />
    </div>
  );
}
