'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import styles from './page.module.css';
import { formatPrice } from '@/lib/constants';

function StatCard({ label, value, icon, color }) {
  return (
    <div className={styles.statCard} style={{ '--card-color': color }}>
      <div className={styles.statIcon}>{icon}</div>
      <div>
        <p className={styles.statValue}>{value}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [expenseStats, setExpenseStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordRes, expRes] = await Promise.all([
          api.get('/orders/admin/stats'),
          api.get('/expenses/stats'),
        ]);
        setStats(ordRes.data);
        setExpenseStats(expRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner spinner-lg" /></div>;

  const profit = (stats?.totalRevenue || 0) - (expenseStats?.totalExpenses || 0);

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      <p className={styles.pageSub}>Welcome back! Here&apos;s what&apos;s happening.</p>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Revenue" value={`JOD ${(stats?.totalRevenue || 0).toFixed(3)}`} icon="💰" color="#22c55e" />
        <StatCard label="Total Orders" value={stats?.totalOrders || 0} icon="🛒" color="#3b82f6" />
        <StatCard label="Pending Orders" value={stats?.pendingOrders || 0} icon="⏳" color="#f59e0b" />
        <StatCard label="Delivered Orders" value={stats?.deliveredOrders || 0} icon="✅" color="#10b981" />
        <StatCard label="Total Expenses" value={`JOD ${(expenseStats?.totalExpenses || 0).toFixed(3)}`} icon="📤" color="#ef4444" />
        <StatCard label="Net Profit" value={`JOD ${profit.toFixed(3)}`} icon="📈" color={profit >= 0 ? '#22c55e' : '#ef4444'} />
        <StatCard label="Avg Order Value" value={`JOD ${(stats?.averageOrder || 0).toFixed(3)}`} icon="🎯" color="#8b5cf6" />
        <StatCard label="Cancelled Orders" value={stats?.cancelledOrders || 0} icon="❌" color="#94a3b8" />
      </div>

      <div className={styles.twoCol}>
        {/* Recent Orders */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Recent Orders</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id}>
                    <td><strong>{order.orderNumber}</strong></td>
                    <td>{order.user ? `${order.user.firstName} ${order.user.lastName}` : order.contact?.email}</td>
                    <td>{formatPrice(order.total, order.currency)}</td>
                    <td><span className={`badge badge-${STATUS_COLOR[order.status]}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Expenses by Category</h2>
          {expenseStats?.byCategory?.map((cat) => (
            <div key={cat._id} className={styles.expenseRow}>
              <span className={styles.expenseCategory}>{cat._id}</span>
              <div className={styles.expenseBar}>
                <div
                  className={styles.expenseFill}
                  style={{ width: `${Math.min((cat.total / (expenseStats?.totalExpenses || 1)) * 100, 100)}%` }}
                />
              </div>
              <span className={styles.expenseAmt}>JOD {cat.total.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Monthly Revenue (Last 12 Months)</h2>
        <div className={styles.monthlyGrid}>
          {stats?.monthlyRevenue?.slice().reverse().map((m) => (
            <div key={m._id} className={styles.monthBar}>
              <div
                className={styles.monthFill}
                style={{ height: `${Math.min((m.revenue / (stats?.totalRevenue || 1)) * 200, 120)}px` }}
              />
              <span className={styles.monthLabel}>{m._id.slice(5)}</span>
              <span className={styles.monthRevenue}>JOD {m.revenue.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const STATUS_COLOR = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};
