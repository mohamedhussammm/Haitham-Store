'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatPrice, ORDER_STATUSES } from '@/lib/constants';
import ConfirmModal from '@/components/common/ConfirmModal';
import styles from '../admin.module.css';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams({ limit: 20 });
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);
      const res = await api.get(`/orders/admin/all?${params}`);
      setOrders(res.data.orders || []);
      setPagination(res.data.pagination || {});
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter, search]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((o) => ({ ...o, status: newStatus }));
      }
    } catch (e) { alert(e.message); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/orders/${deleteId}`);
      fetchOrders();
      if (selectedOrder?._id === deleteId) setSelectedOrder(null);
    } catch (e) {
      alert(e.message || 'Failed to delete order');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Orders</h1>
          <p className={styles.pageSub}>{pagination.total || 0} total orders</p>
        </div>
      </div>

      <div className={styles.filters}>
        <input className="form-input" placeholder="Search by order #, email, name..." value={search}
          onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
        <select className={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {Object.entries(ORDER_STATUSES).map(([val, { label }]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead><tr>
              <th>Order #</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {orders.map((order) => {
                const statusInfo = ORDER_STATUSES[order.status] || { label: order.status, color: '#999' };
                return (
                  <tr key={order._id}>
                    <td><strong style={{ cursor: 'pointer', color: '#3b82f6' }} onClick={() => setSelectedOrder(order)}>{order.orderNumber}</strong></td>
                    <td>
                      <div>{order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest'}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{order.contact?.email}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td><strong>{formatPrice(order.total, order.currency)}</strong></td>
                    <td><span className="badge badge-neutral">COD</span></td>
                    <td>
                      <select className={styles.statusSelect}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{ color: statusInfo.color, borderColor: statusInfo.color }}>
                        {Object.entries(ORDER_STATUSES).map(([val, { label }]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.viewBtn} onClick={() => setSelectedOrder(order)}>View</button>
                        <button className={styles.deleteBtn} onClick={() => setDeleteId(order._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Order {selectedOrder.orderNumber}</h2>
              <button onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.orderDetail}>
                <div className={styles.orderDetailRow}><span>Status</span><strong style={{ color: ORDER_STATUSES[selectedOrder.status]?.color }}>{selectedOrder.status}</strong></div>
                <div className={styles.orderDetailRow}><span>Date</span><span>{new Date(selectedOrder.createdAt).toLocaleString()}</span></div>
                <div className={styles.orderDetailRow}><span>Email</span><span>{selectedOrder.contact?.email}</span></div>
                <div className={styles.orderDetailRow}><span>Phone</span><span>{selectedOrder.shippingAddress?.phone}</span></div>
                <div className={styles.orderDetailRow}><span>Address</span>
                  <span>{selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}, {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}</span>
                </div>
                <div className={styles.orderDetailRow}><span>Payment</span><span>Cash on Delivery</span></div>
              </div>

              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-text-muted)' }}>Items</h3>
              {selectedOrder.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <img src={item.image || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=60'} alt={item.name}
                    style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--color-border)' }} />
                  <div style={{ flex: 1, fontSize: 13 }}>{item.name} × {item.quantity}</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{formatPrice(item.price * item.quantity, selectedOrder.currency)}</div>
                </div>
              ))}

              <div style={{ marginTop: 16, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
                <div className={styles.orderDetailRow}><span>Subtotal</span><span>{formatPrice(selectedOrder.subtotal, selectedOrder.currency)}</span></div>
                <div className={styles.orderDetailRow}><span>Shipping</span><span>{selectedOrder.shippingCost === 0 ? 'FREE' : formatPrice(selectedOrder.shippingCost, selectedOrder.currency)}</span></div>
                {selectedOrder.discount > 0 && <div className={styles.orderDetailRow}><span>Discount</span><span style={{ color: 'var(--color-success)' }}>-{formatPrice(selectedOrder.discount, selectedOrder.currency)}</span></div>}
                <div className={styles.orderDetailRow} style={{ borderBottom: 'none', fontWeight: 700, fontSize: 15 }}><span>Total</span><span>{formatPrice(selectedOrder.total, selectedOrder.currency)}</span></div>
              </div>

              <div style={{ marginTop: 16 }}>
                <label className="form-label">Update Status</label>
                <select className="form-select" value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}>
                  {Object.entries(ORDER_STATUSES).map(([val, { label }]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-outline" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
