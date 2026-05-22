'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ConfirmModal from '@/components/common/ConfirmModal';
import styles from '../admin.module.css';

const emptyForm = { code: '', type: 'percentage', value: '', minPurchase: 0, maxDiscount: '', usageLimit: '', expiresAt: '', isActive: true };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openCreate = () => { setEditCoupon(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c) => {
    setEditCoupon(c);
    setForm({ code: c.code, type: c.type, value: c.value, minPurchase: c.minPurchase || 0, maxDiscount: c.maxDiscount || '', usageLimit: c.usageLimit || '', expiresAt: c.expiresAt?.split('T')[0] || '', isActive: c.isActive });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, code: form.code.toUpperCase() };
      if (editCoupon) await api.put(`/coupons/${editCoupon._id}`, payload);
      else await api.post('/coupons', payload);
      setShowModal(false); fetchCoupons();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/coupons/${deleteId}`);
      fetchCoupons();
    } catch (e) {
      alert(e.message || 'Failed to delete coupon');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div><h1 className={styles.pageTitle}>Coupons</h1><p className={styles.pageSub}>{coupons.length} active coupons</p></div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Coupon</button>
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead><tr>
              <th>Code</th><th>Type</th><th>Value</th><th>Min Purchase</th><th>Used / Limit</th><th>Expires</th><th>Active</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td><strong style={{ letterSpacing: 1.5, fontFamily: 'monospace' }}>{c.code}</strong></td>
                  <td><span className="badge badge-info">{c.type}</span></td>
                  <td>{c.type === 'percentage' ? `${c.value}%` : `JOD ${c.value}`}</td>
                  <td>{c.minPurchase > 0 ? `JOD ${c.minPurchase}` : '—'}</td>
                  <td>{c.usedCount} / {c.usageLimit ?? '∞'}</td>
                  <td style={{ fontSize: 12 }}>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                  <td><span className={`badge ${c.isActive ? 'badge-success' : 'badge-neutral'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td><div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEdit(c)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => setDeleteId(c._id)}>Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}><h2>{editCoupon ? 'Edit Coupon' : 'Add Coupon'}</h2><button onClick={() => setShowModal(false)}>✕</button></div>
            <div className={styles.modalBody}>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Code *</label><input className="form-input" style={{ textTransform: 'uppercase', letterSpacing: 2 }} value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} /></div>
                <div className="form-group"><label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                    <option value="percentage">Percentage (%)</option><option value="fixed">Fixed Amount (JOD)</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Value *</label><input className="form-input" type="number" value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Min Purchase (JOD)</label><input className="form-input" type="number" value={form.minPurchase} onChange={(e) => setForm((p) => ({ ...p, minPurchase: e.target.value }))} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Max Discount (JOD)</label><input className="form-input" type="number" value={form.maxDiscount} onChange={(e) => setForm((p) => ({ ...p, maxDiscount: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Usage Limit</label><input className="form-input" type="number" value={form.usageLimit} onChange={(e) => setForm((p) => ({ ...p, usageLimit: e.target.value }))} /></div>
              </div>
              <div className="form-group"><label className="form-label">Expiry Date *</label><input className="form-input" type="date" value={form.expiresAt} onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))} /></div>
              <div className="form-group"><label className="form-checkbox"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />Active</label></div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : (editCoupon ? 'Update' : 'Create Coupon')}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
