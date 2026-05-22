'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/constants';
import ConfirmModal from '@/components/common/ConfirmModal';
import styles from '../admin.module.css';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', description: '', price: '', compareAtPrice: '', prices: { JOD: '', EGP: '' }, discount: 0, category: '', stock: 100, imageUrls: '', highlights: '', uses: '', isActive: true });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products/admin/all?limit=50&search=${search}`);
      setProducts(res.data.products || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data || []));
  }, []);

  const openCreate = () => { setEditProduct(null); setForm({ name: '', description: '', price: '', compareAtPrice: '', prices: { JOD: '', EGP: '' }, discount: 0, category: '', stock: 100, imageUrls: '', highlights: '', uses: '', isActive: true }); setShowModal(true); };
  const openEdit = (p) => { setEditProduct(p); setForm({ name: p.name, description: p.description || '', price: p.price, compareAtPrice: p.compareAtPrice || '', prices: { JOD: p.prices?.JOD || p.price, EGP: p.prices?.EGP || '' }, discount: p.discount || 0, category: p.category?._id || '', stock: p.stock, imageUrls: p.images?.map((i) => i.url).join('\n') || '', highlights: p.highlights?.join('\n') || '', uses: p.uses?.join('\n') || '', isActive: p.isActive }); setShowModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: form.highlights.split('\n').filter(Boolean),
        uses: form.uses.split('\n').filter(Boolean),
        imageUrls: form.imageUrls.split('\n').filter(Boolean),
        prices: { JOD: Number(form.prices.JOD) || Number(form.price), EGP: Number(form.prices.EGP) || 0 },
      };
      if (editProduct) await api.put(`/products/${editProduct._id}`, payload);
      else await api.post('/products', payload);
      setShowModal(false);
      fetchProducts();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/products/${deleteId}`);
      fetchProducts();
    } catch (e) {
      alert(e.message || 'Failed to delete product');
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
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.pageSub}>{products.length} total products</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      <div className={styles.searchBar}>
        <input className="form-input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead><tr>
              <th>Product</th><th>Price (JOD)</th><th>Price (EGP)</th><th>Stock</th><th>Category</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className={styles.productCell}>
                      <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=60'} alt={p.name} className={styles.productThumb} />
                      <div>
                        <strong>{p.name}</strong>
                        {p.discount > 0 && <span className="badge badge-sale" style={{ marginLeft: 6 }}>-{p.discount}%</span>}
                      </div>
                    </div>
                  </td>
                  <td>{formatPrice(p.prices?.JOD || p.price, 'JOD')}</td>
                  <td>{formatPrice(p.prices?.EGP || 0, 'EGP')}</td>
                  <td><span className={p.stock < 10 ? styles.lowStock : ''}>{p.stock}</span></td>
                  <td>{p.category?.name || '—'}</td>
                  <td>
                    <button className={`badge ${p.isActive ? 'badge-success' : 'badge-neutral'}`} onClick={() => handleToggleActive(p)}>
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
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Price JOD *</label><input className="form-input" type="number" value={form.prices.JOD} onChange={(e) => setForm((p) => ({ ...p, prices: { ...p.prices, JOD: e.target.value }, price: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Price EGP</label><input className="form-input" type="number" value={form.prices.EGP} onChange={(e) => setForm((p) => ({ ...p, prices: { ...p.prices, EGP: e.target.value } }))} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Compare At Price (JOD)</label><input className="form-input" type="number" value={form.compareAtPrice} onChange={(e) => setForm((p) => ({ ...p, compareAtPrice: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Discount %</label><input className="form-input" type="number" value={form.discount} onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Stock</label><input className="form-input" type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} /></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} /></div>
              <div className="form-group"><label className="form-label">Image URLs (one per line)</label><textarea className="form-input" rows={3} value={form.imageUrls} onChange={(e) => setForm((p) => ({ ...p, imageUrls: e.target.value }))} style={{ resize: 'vertical' }} placeholder="https://..." /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Highlights (one per line)</label><textarea className="form-input" rows={4} value={form.highlights} onChange={(e) => setForm((p) => ({ ...p, highlights: e.target.value }))} style={{ resize: 'vertical' }} /></div>
                <div className="form-group"><label className="form-label">Uses (one per line)</label><textarea className="form-input" rows={4} value={form.uses} onChange={(e) => setForm((p) => ({ ...p, uses: e.target.value }))} style={{ resize: 'vertical' }} /></div>
              </div>
              <div className="form-group">
                <label className="form-checkbox"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />Active (visible to customers)</label>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : (editProduct ? 'Update Product' : 'Create Product')}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
