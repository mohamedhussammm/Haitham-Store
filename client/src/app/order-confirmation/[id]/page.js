'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { formatPrice } from '@/lib/constants';
import styles from './page.module.css';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) return <div className="loading-center"><div className="spinner spinner-lg" /></div>;
  if (!order) return null;

  return (
    <div className="container">
      <div className={styles.wrapper}>
        <div className={styles.iconWrap}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h1 className={styles.title}>Order Placed Successfully!</h1>
        <p className={styles.sub}>Thank you for your order. We'll have it ready for you soon.</p>

        <div className={styles.orderBox}>
          <div className={styles.orderRow}>
            <span>Order Number</span>
            <strong>{order.orderNumber}</strong>
          </div>
          <div className={styles.orderRow}>
            <span>Payment Method</span>
            <strong>Cash on Delivery</strong>
          </div>
          <div className={styles.orderRow}>
            <span>Status</span>
            <strong className={styles.statusBadge}>{order.status}</strong>
          </div>
          <div className={styles.orderRow}>
            <span>Total</span>
            <strong className={styles.total}>{formatPrice(order.total, order.currency)}</strong>
          </div>
        </div>

        <div className={styles.deliveryBox}>
          <h3>Delivering to:</h3>
          <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
          <p>{order.shippingAddress.address}{order.shippingAddress.apartment ? `, ${order.shippingAddress.apartment}` : ''}</p>
          <p>{order.shippingAddress.city}{order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}</p>
          <p>{order.shippingAddress.country}</p>
          <p>{order.shippingAddress.phone}</p>
        </div>

        <div className={styles.itemsList}>
          <h3>Items Ordered</h3>
          {order.items.map((item, i) => (
            <div key={i} className={styles.item}>
              <img src={item.image || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=80'} alt={item.name} />
              <span className={styles.itemName}>{item.name} × {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity, order.currency)}</span>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className="btn btn-primary" onClick={() => router.push('/shop')}>Continue Shopping</button>
          <button className="btn btn-outline" onClick={() => router.push('/account/orders')}>View Orders</button>
        </div>
      </div>
    </div>
  );
}
