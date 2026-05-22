'use client';
import useCartStore from '@/store/cartStore';
import styles from './CartDrawer.module.css';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, coupon, currency } = useCartStore();
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

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
          <h2 className={styles.title}>YOUR CART</h2>
          <button className={styles.closeBtn} onClick={closeCart}>✕</button>
        </div>

        {/* Shipping Progress */}
        <div className={styles.shipping}>
          <div className={styles.shippingIcons}>
            <div className={styles.shippingMilestone}>
              <span className={styles.milestoneIcon}>🚚</span>
              <span className={styles.milestoneLabel}>Free Shipping</span>
            </div>
            <div className={styles.shippingMilestone}>
              <span className={styles.milestoneIcon}>🎁</span>
              <span className={styles.milestoneLabel}>Free Gift</span>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${shippingProgress}%` }} />
          </div>
          {amountToFreeShipping > 0 ? (
            <p className={styles.shippingMsg}>Add <strong>{formatPrice(amountToFreeShipping, currency)}</strong> to get <strong>FREE SHIPPING!</strong></p>
          ) : (
            <p className={styles.shippingMsg}>🎉 You qualify for <strong>FREE SHIPPING!</strong></p>
          )}
        </div>

        {/* Items */}
        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>Your cart is empty</p>
              <button className="btn btn-primary" onClick={closeCart}>Continue Shopping</button>
            </div>
          ) : (
            items.map((item) => {
              const product = item.product || {};
              const price = product.prices?.[currency] || product.price || item.price;
              return (
                <div key={item._id} className={styles.item}>
                  <div className={styles.itemImage}>
                    <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.name || 'Product'} />
                  </div>
                  <div className={styles.itemInfo}>
                    <h4 className={styles.itemName}>{product.name || 'Product'}</h4>
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
                    <span className={styles.itemPrice}>{formatPrice(price * item.quantity, currency)}</span>
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
                  <span>🎟️ <strong>{coupon.code}</strong> applied (-{formatPrice(coupon.discount, currency)})</span>
                  <button onClick={removeCoupon} className={styles.couponRemove}>✕</button>
                </div>
              ) : (
                <div className={styles.couponForm}>
                  <input
                    type="text"
                    placeholder="DISCOUNT CODE"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={styles.couponInput}
                  />
                  <button onClick={handleCoupon} className={styles.couponBtn}>Apply</button>
                </div>
              )}
              {couponMsg && <p className={styles.couponMsg}>{couponMsg}</p>}
            </div>

            {/* Subtotal */}
            <div className={styles.subtotalRow}>
              <span>Subtotal ({itemCount} items)</span>
              <span className={styles.subtotalPrice}>{formatPrice(subtotal, currency)}</span>
            </div>

            {/* Checkout Button */}
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
