'use client';
import useCartStore from '@/store/cartStore';
import styles from './CartDrawer.module.css';
import { formatPrice, FREE_DELIVERY_THRESHOLD } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, coupon } = useCartStore();
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem     = useCartStore((s) => s.removeItem);
  const applyCoupon    = useCartStore((s) => s.applyCoupon);
  const removeCoupon   = useCartStore((s) => s.removeCoupon);
  const getSubtotal    = useCartStore((s) => s.getSubtotal);
  const getItemCount   = useCartStore((s) => s.getItemCount);

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg]   = useState('');

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const deliveryProgress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const amountToFreeDelivery = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);

  const handleCoupon = async () => {
    if (!couponCode.trim()) return;
    const res = await applyCoupon(couponCode);
    setCouponMsg(res.message);
    if (res.success) setCouponCode('');
    setTimeout(() => setCouponMsg(''), 3000);
  };

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={closeCart} />}

      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>YOUR MEAL BOX</h2>
          <button className={styles.closeBtn} onClick={closeCart}>✕</button>
        </div>

        {/* Delivery Progress */}
        <div className={styles.shipping}>
          <div className={styles.shippingIcons}>
            <div className={styles.shippingMilestone}>
              <span className={styles.milestoneIcon}>🚴‍♂️</span>
              <span className={styles.milestoneLabel}>Free Delivery</span>
            </div>
            <div className={styles.shippingMilestone}>
              <span className={styles.milestoneIcon}>🥗</span>
              <span className={styles.milestoneLabel}>Fresh Pack</span>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${deliveryProgress}%` }} />
          </div>
          {amountToFreeDelivery > 0 ? (
            <p className={styles.shippingMsg}>
              Add <strong>{formatPrice(amountToFreeDelivery)}</strong> to get <strong>FREE DELIVERY!</strong>
            </p>
          ) : (
            <p className={styles.shippingMsg}>
              🎉 You qualify for <strong>FREE DELIVERY!</strong>
            </p>
          )}
        </div>

        {/* Items */}
        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>Your meal box is empty</p>
              <button className="btn btn-primary" onClick={closeCart}>Explore Our Menu</button>
            </div>
          ) : (
            items.map((item) => {
              const product = item.product || {};
              const price = product.price || item.price;
              return (
                <div key={item._id} className={styles.item}>
                  <div className={styles.itemImage}>
                    <img
                      src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                      alt={product.name || 'Meal'}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <h4 className={styles.itemName}>{product.name || 'Meal'}</h4>
                    {product.portionSize && (
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{product.portionSize}</span>
                    )}
                    <div className={styles.itemControls}>
                      <div className={styles.qty}>
                        <button onClick={() => item.quantity > 1 && updateQuantity(item._id, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                  </div>
                  <div className={styles.itemRight}>
                    <button className={styles.removeBtn} onClick={() => removeItem(item._id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/>
                      </svg>
                    </button>
                    <span className={styles.itemPrice}>{formatPrice(price * item.quantity)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer (coupon + checkout) */}
        {items.length > 0 && (
          <div className={styles.footer}>
            {/* Coupon */}
            <div className={styles.couponSection}>
              {coupon ? (
                <div className={styles.couponApplied}>
                  <span>🎟️ <strong>{coupon.code}</strong> applied (-{formatPrice(coupon.discount)})</span>
                  <button onClick={removeCoupon} className={styles.couponRemove}>✕</button>
                </div>
              ) : (
                <div className={styles.couponForm}>
                  <input
                    type="text"
                    placeholder="DISCOUNT CODE"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className={styles.couponInput}
                  />
                  <button onClick={handleCoupon} className={styles.couponBtn}>Apply</button>
                </div>
              )}
              {couponMsg && <p className={styles.couponMsg}>{couponMsg}</p>}
            </div>

            {/* Subtotal */}
            <div className={styles.subtotalRow}>
              <span>Subtotal ({itemCount} meal{itemCount !== 1 ? 's' : ''})</span>
              <span className={styles.subtotalPrice}>{formatPrice(subtotal)}</span>
            </div>

            {/* Checkout Button */}
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
