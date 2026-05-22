'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { EXPENSE_CATEGORIES, formatPrice } from '@/lib/constants';
import ConfirmModal from '@/components/common/ConfirmModal';
import styles from '../admin.module.css';

const emptyForm = { title: '', amount: '', currency: 'JOD', category: 'other', description: '', date: new Date().toISOString().split('T')[0] };

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [catFilter, setCatFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      const [expRes, statsRes] = await Promise.all([
        api.get(`/expenses?limit=50${catFilter ? `&category=${catFilter}` : ''}`),
        api.get('/expenses/stats'),
      ]);
      setExpenses(expRes.data.expenses || []);
      setStats(statsRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [catFilter]);

  const openCreate = () => { setEditExpense(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (e) => { setEditExpense(e); setForm({ title: e.title, amount: e.amount, currency: e.currency, category: e.category, description: e.description || '', date: e.date?.split('T')[0] || '' }); setShowModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editExpense) await api.put(`/expenses/${editExpense._id}`, form);
      else await api.post('/expenses', form);
      setShowModal(false); fetchData();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/expenses/${deleteId}`);
      fetchData();
    } catch (e) {
      alert(e.message || 'Failed to delete expense');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Expenses</h1>
          <p className={styles.pageSub}>Total: {stats ? formatPrice(stats.totalExpenses, 'JOD') : '—'}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Expense</button>
      </div>

      {/* Stats by category */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 24 }}>
          {stats.byCategory?.map((cat) => (
            <div key={cat._id} style={{ background: 'white', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textTransform: 'capitalize' }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>{cat._id}</p>
              <p style={{ fontSize: 17, fontWeight: 700 }}>JOD {cat.total.toFixed(0)}</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-light)' }}>{cat.count} entries</p>
            </div>
          ))}
        </div>
      )}

      <div className={styles.filters}>
        <select className={styles.filterSelect} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead><tr>
              <th>Title</th><th>Category</th><th>Amount</th><th>Currency</th><th>Date</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e._id}>
                  <td><strong>{e.title}</strong>{e.description && <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{e.description}</div>}</td>
                  <td><span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{e.category}</span></td>
                  <td><strong>{e.amount.toFixed(3)}</strong></td>
                  <td>{e.currency}</td>
                  <td style={{ fontSize: 12 }}>{new Date(e.date).toLocaleDateString()}</td>
                  <td><div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEdit(e)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => setDeleteId(e._id)}>Delete</button>
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
            <div className={styles.modalHeader}><h2>{editExpense ? 'Edit Expense' : 'Add Expense'}</h2><button onClick={() => setShowModal(false)}>✕</button></div>
            <div className={styles.modalBody}>
              <div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Amount *</label><input className="form-input" type="number" step="0.001" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Currency</label>
                  <select className="form-select" value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}>
                    <option value="JOD">JOD</option><option value="EGP">EGP</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                    {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} /></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} /></div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : (editExpense ? 'Update' : 'Add Expense')}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense entry? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
