'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import { formatPrice, FREE_DELIVERY_THRESHOLD, DELIVERY_FEE, DELIVERY_SLOTS } from '@/lib/constants';
import styles from './page.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, coupon }  = useCartStore();
  const getSubtotal        = useCartStore((s) => s.getSubtotal);
  const getDeliveryFee     = useCartStore((s) => s.getDeliveryFee);
  const getDiscount        = useCartStore((s) => s.getDiscount);
  const getTotal           = useCartStore((s) => s.getTotal);
  const clearCart          = useCartStore((s) => s.clearCart);
  const { user }           = useAuthStore();

  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');
  const [orderSuccess,  setOrderSuccess]  = useState(false);
  const [placedOrder,   setPlacedOrder]   = useState(null);
  const [discountCode,  setDiscountCode]  = useState('');
  const [discountMsg,   setDiscountMsg]   = useState('');
  const applyCoupon = useCartStore((s) => s.applyCoupon);

  const [form, setForm] = useState({
    email:          user?.email || '',
    phone:          user?.phone || '',
    firstName:      '',
    lastName:       '',
    address:        '',
    apartment:      '',
    city:           '',
    postalCode:     '',
    country:        'Egypt',
    deliveryPhone:  '',
    deliverySlot:   '',          // ← NEW: delivery time slot
    saveInfo:       false,
    shippingMethod: 'standard',
    paymentMethod:  'cod',
    billingSame:    true,
    billingFirstName: '',
    billingLastName:  '',
    billingAddress:   '',
    billingApartment: '',
    billingCity:      '',
    billingPostalCode: '',
    billingCountry:   'Egypt',
    notes:            '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email)         errs.email         = 'Email is required';
    if (!form.firstName)     errs.firstName     = 'First name is required';
    if (!form.lastName)      errs.lastName      = 'Last name is required';
    if (!form.address)       errs.address       = 'Address is required';
    if (!form.city)          errs.city          = 'City is required';
    if (!form.deliveryPhone) errs.deliveryPhone = 'Phone is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDiscountApply = async () => {
    if (!discountCode.trim()) return;
    const res = await applyCoupon(discountCode);
    setDiscountMsg(res.message);
    if (res.success) setDiscountCode('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) { setError('Your cart is empty'); return; }
    if (loading || orderSuccess) return;

    setLoading(true);
    setError('');

    try {
      const orderData = {
        contact: { email: form.email, phone: form.phone },
        shippingAddress: {
          firstName:  form.firstName,
          lastName:   form.lastName,
          address:    form.address,
          apartment:  form.apartment,
          city:       form.city,
          postalCode: form.postalCode,
          country:    form.country,
          phone:      form.deliveryPhone,
        },
        billingAddress: {
          sameAsShipping: form.billingSame,
          ...(form.billingSame ? {} : {
            firstName:  form.billingFirstName,
            lastName:   form.billingLastName,
            address:    form.billingAddress,
            apartment:  form.billingApartment,
            city:       form.billingCity,
            postalCode: form.billingPostalCode,
            country:    form.billingCountry,
          }),
        },
        deliverySlot:   form.deliverySlot || null,
        shippingMethod: form.shippingMethod,
        paymentMethod:  form.paymentMethod,
        currency:       'EGP',
        couponCode:     coupon?.code || '',
        saveInfo:       form.saveInfo,
        notes:          form.notes,
      };

      const res = await api.post('/orders', orderData);
      setPlacedOrder(res.data);
      setOrderSuccess(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal     = getSubtotal();
  const deliveryFee  = getDeliveryFee();
  const discount     = getDiscount();
  const total        = getTotal();
  const taxIncluded  = (subtotal * 14) / 114;

  return (
    <div className={styles.page}>
      {/* Success Overlay */}
      {orderSuccess && placedOrder && (
        <div className={styles.successOverlay}>
          <div className={styles.successCard}>
            <div className={styles.successHeader}>
              <div className={styles.successIcon}>🎉</div>
              <h2>Order Confirmed!</h2>
              <p className={styles.orderNumber}>Order #{placedOrder.orderNumber}</p>
            </div>

            <div className={styles.successDetails}>
              <div className={styles.successSection}>
                <h3>Delivery Details</h3>
                <p>{placedOrder.shippingAddress.firstName} {placedOrder.shippingAddress.lastName}</p>
                <p>{placedOrder.shippingAddress.address}</p>
                <p>{placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.country}</p>
                <p>{placedOrder.shippingAddress.phone}</p>
                {placedOrder.deliverySlot && (
                  <p style={{ color: 'var(--fs-green-700)', fontWeight: 600 }}>
                    🕐 Delivery slot: {placedOrder.deliverySlot}
                  </p>
                )}
              </div>

              <div className={styles.successSection}>
                <h3>Order Summary</h3>
                <div className={styles.successItems}>
                  {placedOrder.items.map((item, idx) => (
                    <div key={idx} className={styles.successItem}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(0)} EGP</span>
                    </div>
                  ))}
                </div>
                <div className={styles.successTotal}>
                  <span>Total (Cash on Delivery)</span>
                  <span>{placedOrder.total.toFixed(0)} EGP</span>
                </div>
              </div>
            </div>

            <div className={styles.successFooter}>
              <button onClick={() => router.push('/')} className="btn btn-primary btn-lg">
                🥗 Back to Menu
              </button>
              <p className={styles.successNote}>We&apos;ll prep your meal fresh and deliver at the selected slot. For questions: 01113395716</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={styles.checkoutHeader}>
        <a href="/" className={styles.logo}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, letterSpacing: '2px', color: 'var(--fs-green-800)' }}>FIT STATION</span>
          <span style={{ fontSize: 9, color: 'var(--fs-green-400)', letterSpacing: '3px', display: 'block', marginTop: 1 }}>KITCHEN</span>
        </a>
        <button onClick={() => router.push('/shop')} className={styles.cartIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </button>
      </div>

      <div className={styles.layout}>
        {/* Left Column: Form */}
        <form className={styles.formSide} onSubmit={handleSubmit}>
          {/* Contact */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Contact</h2>
              <a href="/account/login" className={styles.signInLink}>Sign in</a>
            </div>
            <div className="form-group">
              <input
                name="email" type="email" placeholder="Email address"
                value={form.email} onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
          </section>

          {/* Delivery */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Delivery Address</h2>

            <div className="form-group">
              <select name="country" value={form.country} onChange={handleChange} className="form-select">
                <option value="Egypt">Egypt 🇪🇬</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} className={`form-input ${errors.firstName ? 'error' : ''}`} />
                {errors.firstName && <p className="form-error">{errors.firstName}</p>}
              </div>
              <div className="form-group">
                <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} className={`form-input ${errors.lastName ? 'error' : ''}`} />
                {errors.lastName && <p className="form-error">{errors.lastName}</p>}
              </div>
            </div>

            <div className="form-group">
              <input name="address" placeholder="Street address" value={form.address} onChange={handleChange} className={`form-input ${errors.address ? 'error' : ''}`} />
              {errors.address && <p className="form-error">{errors.address}</p>}
            </div>

            <div className="form-group">
              <input name="apartment" placeholder="Apartment, floor, landmark (optional)" value={form.apartment} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <input name="city" placeholder="City / District" value={form.city} onChange={handleChange} className={`form-input ${errors.city ? 'error' : ''}`} />
                {errors.city && <p className="form-error">{errors.city}</p>}
              </div>
              <div className="form-group">
                <input name="postalCode" placeholder="Postal code (optional)" value={form.postalCode} onChange={handleChange} className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <input name="deliveryPhone" placeholder="Phone number" value={form.deliveryPhone} onChange={handleChange} className={`form-input ${errors.deliveryPhone ? 'error' : ''}`} />
              {errors.deliveryPhone && <p className="form-error">{errors.deliveryPhone}</p>}
            </div>

            <label className="form-checkbox">
              <input type="checkbox" name="saveInfo" checked={form.saveInfo} onChange={handleChange} />
              Save my information for faster checkout next time
            </label>
          </section>

          {/* ─── DELIVERY TIME SLOT (NEW) ─── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>🕐 Delivery Time Slot</h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 12 }}>
              Select your preferred delivery window (optional)
            </p>
            <div className={styles.slotGrid}>
              {DELIVERY_SLOTS.map((slot) => (
                <label
                  key={slot.value}
                  className={`${styles.slotOption} ${form.deliverySlot === slot.value ? styles.slotActive : ''}`}
                >
                  <input
                    type="radio"
                    name="deliverySlot"
                    value={slot.value}
                    checked={form.deliverySlot === slot.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={styles.slotTime}>{slot.label}</span>
                </label>
              ))}
              <label className={`${styles.slotOption} ${form.deliverySlot === '' ? styles.slotActive : ''}`}>
                <input type="radio" name="deliverySlot" value="" checked={form.deliverySlot === ''} onChange={handleChange} className="sr-only" />
                <span className={styles.slotTime}>Any Time</span>
              </label>
            </div>
          </section>

          {/* Shipping Method */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Delivery Method</h2>
            <div className="radio-group">
              <label className="radio-option active">
                <input type="radio" name="shippingMethod" value="standard" checked readOnly />
                <div className="radio-option-content">
                  <div className="radio-option-label">Standard Delivery</div>
                  <div className="radio-option-desc">FREE DELIVERY ON ORDERS ABOVE {FREE_DELIVERY_THRESHOLD} EGP</div>
                </div>
                <span className="radio-option-price">
                  {deliveryFee === 0 ? 'FREE' : `${deliveryFee} EGP`}
                </span>
              </label>
            </div>
          </section>

          {/* Payment */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment</h2>
            <p className={styles.secureText}>💳 Cash on Delivery (COD) — pay when your meal arrives.</p>
            <div className="radio-group">
              <label className={`radio-option ${form.paymentMethod === 'cod' ? 'active' : ''}`}>
                <input type="radio" name="paymentMethod" value="cod" checked onChange={handleChange} />
                <div className="radio-option-content">
                  <div className="radio-option-label">Cash on Delivery</div>
                  <div className="radio-option-desc">Pay when your order arrives at your door</div>
                </div>
              </label>
            </div>
          </section>

          {/* Notes */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Notes (optional)</h2>
            <textarea
              name="notes"
              placeholder="Special dietary requirements, building instructions, etc."
              value={form.notes}
              onChange={handleChange}
              className="form-input"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </section>

          {/* Submit */}
          {error && <div className={styles.errorMsg}>{error}</div>}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <><div className="spinner" style={{ borderTopColor: 'white', width: 18, height: 18 }} /> Placing Order...</>
            ) : (
              '🥗 Complete Order'
            )}
          </button>

          <div className={styles.footerLinks}>
            <a href="#">Refund policy</a>
            <a href="#">Privacy policy</a>
            <a href="#">Terms of service</a>
          </div>
        </form>

        {/* Right Column: Order Summary */}
        <aside className={styles.summarySide}>
          <div className={styles.summarySticky}>
            {/* Items */}
            <div className={styles.summaryItems}>
              {items.map((item) => {
                const product = item.product || {};
                const price   = product.prices?.EGP || product.price || item.price;
                return (
                  <div key={item._id} className={styles.summaryItem}>
                    <div className={styles.summaryItemImg}>
                      <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.name} />
                      <span className={styles.summaryItemQty}>{item.quantity}</span>
                    </div>
                    <span className={styles.summaryItemName}>{product.name || 'Meal'}</span>
                    <span className={styles.summaryItemPrice}>{(price * item.quantity).toFixed(0)} EGP</span>
                  </div>
                );
              })}
            </div>

            {/* Discount Code */}
            <div className={styles.summaryDiscount}>
              <input
                type="text" placeholder="Promo / discount code"
                value={discountCode} onChange={(e) => setDiscountCode(e.target.value)}
                className={styles.discountInput}
              />
              <button type="button" onClick={handleDiscountApply} className={styles.discountBtn}>Apply</button>
            </div>
            {discountMsg && <p className={styles.discountMsg}>{discountMsg}</p>}
            {coupon && <p className={styles.couponActive}>🎟️ {coupon.code} (-{discount.toFixed(0)} EGP)</p>}

            {/* Totals */}
            <div className={styles.summaryTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal · {items.reduce((s, i) => s + i.quantity, 0)} items</span>
                <span>{subtotal.toFixed(0)} EGP</span>
              </div>
              <div className={styles.totalRow}>
                <span>Delivery</span>
                <span style={{ color: deliveryFee === 0 ? 'var(--fs-green-700)' : 'inherit' }}>
                  {deliveryFee === 0 ? '🚀 FREE' : `${deliveryFee} EGP`}
                </span>
              </div>
              {discount > 0 && (
                <div className={`${styles.totalRow} ${styles.discountRow}`}>
                  <span>Discount</span>
                  <span>-{discount.toFixed(0)} EGP</span>
                </div>
              )}
              {form.deliverySlot && (
                <div className={styles.totalRow} style={{ color: 'var(--fs-green-700)' }}>
                  <span>🕐 Slot</span>
                  <span style={{ fontSize: 12 }}>{form.deliverySlot}</span>
                </div>
              )}
              <div className={styles.totalRowMain}>
                <span>Total</span>
                <span className={styles.totalPrice}>{total.toFixed(0)} EGP</span>
              </div>
              <p className={styles.taxNote}>Includes VAT ({taxIncluded.toFixed(0)} EGP)</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
