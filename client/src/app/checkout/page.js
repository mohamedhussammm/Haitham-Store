'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import { formatPrice, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants';
import styles from './page.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, coupon, currency } = useCartStore();
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getShippingCost = useCartStore((s) => s.getShippingCost);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountMsg, setDiscountMsg] = useState('');
  const applyCoupon = useCartStore((s) => s.applyCoupon);

  const [form, setForm] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: 'Jordan',
    deliveryPhone: '',
    saveInfo: false,
    shippingMethod: 'standard',
    paymentMethod: 'cod',
    billingSame: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingApartment: '',
    billingCity: '',
    billingPostalCode: '',
    billingCountry: 'Jordan',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (items.length === 0 && !loading) {
      // Allow page to render even with empty cart during checkout completion
    }
  }, [items]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.firstName) errs.firstName = 'First name is required';
    if (!form.lastName) errs.lastName = 'Last name is required';
    if (!form.address) errs.address = 'Address is required';
    if (!form.city) errs.city = 'City is required';
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
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          apartment: form.apartment,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
          phone: form.deliveryPhone,
        },
        billingAddress: {
          sameAsShipping: form.billingSame,
          ...(form.billingSame ? {} : {
            firstName: form.billingFirstName,
            lastName: form.billingLastName,
            address: form.billingAddress,
            apartment: form.billingApartment,
            city: form.billingCity,
            postalCode: form.billingPostalCode,
            country: form.billingCountry,
          }),
        },
        shippingMethod: form.shippingMethod,
        paymentMethod: form.paymentMethod,
        currency,
        couponCode: coupon?.code || '',
        saveInfo: form.saveInfo,
      };

      const res = await api.post('/orders', orderData);
      
      // Success logic: clear cart and show overlay instead of immediate redirect
      setPlacedOrder(res.data);
      setOrderSuccess(true);
      clearCart();
      
      // scrollToTop for the overlay
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  const discount = getDiscount();
  const total = getTotal();
  const taxIncluded = (subtotal * 16) / (100 + 16);

  return (
    <div className={styles.page}>
      {/* Success Overlay */}
      {orderSuccess && placedOrder && (
        <div className={styles.successOverlay}>
          <div className={styles.successCard}>
            <div className={styles.successHeader}>
              <div className={styles.successIcon}>✓</div>
              <h2>Order Placed Successfully!</h2>
              <p className={styles.orderNumber}>Order #{placedOrder.orderNumber}</p>
            </div>

            <div className={styles.successDetails}>
              <div className={styles.successSection}>
                <h3>Shipping Details</h3>
                <p>{placedOrder.shippingAddress.firstName} {placedOrder.shippingAddress.lastName}</p>
                <p>{placedOrder.shippingAddress.address}</p>
                <p>{placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.country}</p>
                <p>{placedOrder.shippingAddress.phone}</p>
              </div>

              <div className={styles.successSection}>
                <h3>Order Summary</h3>
                <div className={styles.successItems}>
                  {placedOrder.items.map((item, idx) => (
                    <div key={idx} className={styles.successItem}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity, placedOrder.currency)}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.successTotal}>
                  <span>Total Paid (COD)</span>
                  <span>{formatPrice(placedOrder.total, placedOrder.currency)}</span>
                </div>
              </div>
            </div>

            <div className={styles.successFooter}>
              <button onClick={() => router.push('/')} className="btn btn-primary btn-lg">
                Continue Shopping
              </button>
              <p className={styles.successNote}>We&apos;ll process your order shortly. Contact us for any questions.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={styles.checkoutHeader}>
        <a href="/" className={styles.logo}>/Haitham.Store/</a>
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
                name="email"
                type="email"
                placeholder="Email or mobile phone number"
                value={form.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
          </section>

          {/* Delivery */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Delivery</h2>

            <div className="form-group">
              <select name="country" value={form.country} onChange={handleChange} className="form-select">
                <option value="Jordan">Jordan</option>
                <option value="Egypt">Egypt</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="UAE">UAE</option>
                <option value="Iraq">Iraq</option>
                <option value="Palestine">Palestine</option>
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
              <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className={`form-input ${errors.address ? 'error' : ''}`} />
              {errors.address && <p className="form-error">{errors.address}</p>}
            </div>

            <div className="form-group">
              <input name="apartment" placeholder="Apartment, suite, etc. (optional)" value={form.apartment} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} className={`form-input ${errors.city ? 'error' : ''}`} />
                {errors.city && <p className="form-error">{errors.city}</p>}
              </div>
              <div className="form-group">
                <input name="postalCode" placeholder="Postal code (optional)" value={form.postalCode} onChange={handleChange} className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <input name="deliveryPhone" placeholder="Phone" value={form.deliveryPhone} onChange={handleChange} className={`form-input ${errors.deliveryPhone ? 'error' : ''}`} />
              {errors.deliveryPhone && <p className="form-error">{errors.deliveryPhone}</p>}
            </div>

            <label className="form-checkbox">
              <input type="checkbox" name="saveInfo" checked={form.saveInfo} onChange={handleChange} />
              Save this information for next time
            </label>
          </section>

          {/* Shipping Method */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping method</h2>
            <div className="radio-group">
              <label className="radio-option active">
                <input type="radio" name="shippingMethod" value="standard" checked readOnly />
                <div className="radio-option-content">
                  <div className="radio-option-label">Standard Shipping</div>
                  <div className="radio-option-desc">GET FREE SHIPPING ON ORDERS ABOVE {currency} {FREE_SHIPPING_THRESHOLD}</div>
                </div>
                <span className="radio-option-price">
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost, currency)}
                </span>
              </label>
            </div>
          </section>

          {/* Payment */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment</h2>
            <p className={styles.secureText}>All transactions are secure and encrypted.</p>
            <div className="radio-group">
              <label className={`radio-option ${form.paymentMethod === 'cod' ? 'active' : ''}`}>
                <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === 'cod'} onChange={handleChange} />
                <div className="radio-option-content">
                  <div className="radio-option-label">Cash on Delivery (COD)</div>
                  <div className="radio-option-desc">Pay when your order arrives</div>
                </div>
              </label>
            </div>
          </section>

          {/* Billing Address */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Billing address</h2>
            <div className="radio-group">
              <label className={`radio-option ${form.billingSame ? 'active' : ''}`}>
                <input type="radio" name="billingSame" checked={form.billingSame} onChange={() => setForm((p) => ({ ...p, billingSame: true }))} />
                <div className="radio-option-content">
                  <div className="radio-option-label">Same as shipping address</div>
                </div>
              </label>
              <label className={`radio-option ${!form.billingSame ? 'active' : ''}`}>
                <input type="radio" name="billingSame" checked={!form.billingSame} onChange={() => setForm((p) => ({ ...p, billingSame: false }))} />
                <div className="radio-option-content">
                  <div className="radio-option-label">Use a different billing address</div>
                </div>
              </label>
            </div>

            {!form.billingSame && (
              <div className={styles.billingForm}>
                <div className="form-row">
                  <div className="form-group">
                    <input name="billingFirstName" placeholder="First name" value={form.billingFirstName} onChange={handleChange} className="form-input" />
                  </div>
                  <div className="form-group">
                    <input name="billingLastName" placeholder="Last name" value={form.billingLastName} onChange={handleChange} className="form-input" />
                  </div>
                </div>
                <div className="form-group">
                  <input name="billingAddress" placeholder="Address" value={form.billingAddress} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input name="billingCity" placeholder="City" value={form.billingCity} onChange={handleChange} className="form-input" />
                  </div>
                  <div className="form-group">
                    <input name="billingPostalCode" placeholder="Postal code" value={form.billingPostalCode} onChange={handleChange} className="form-input" />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Submit */}
          {error && <div className={styles.errorMsg}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <><div className="spinner" style={{ borderTopColor: 'white', width: 18, height: 18 }} /> Processing...</>
            ) : (
              'Complete order'
            )}
          </button>

          {/* Footer Links */}
          <div className={styles.footerLinks}>
            <a href="#">Refund policy</a>
            <a href="#">Shipping</a>
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
                const price = product.prices?.[currency] || product.price || item.price;
                return (
                  <div key={item._id} className={styles.summaryItem}>
                    <div className={styles.summaryItemImg}>
                      <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.name} />
                      <span className={styles.summaryItemQty}>{item.quantity}</span>
                    </div>
                    <span className={styles.summaryItemName}>{product.name || 'Product'}</span>
                    <span className={styles.summaryItemPrice}>{formatPrice(price * item.quantity, currency)}</span>
                  </div>
                );
              })}
            </div>

            {/* Discount Code */}
            <div className={styles.summaryDiscount}>
              <input
                type="text"
                placeholder="Discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className={styles.discountInput}
              />
              <button type="button" onClick={handleDiscountApply} className={styles.discountBtn}>Apply</button>
            </div>
            {discountMsg && <p className={styles.discountMsg}>{discountMsg}</p>}
            {coupon && <p className={styles.couponActive}>🎟️ {coupon.code} (-{formatPrice(discount, currency)})</p>}

            {/* Totals */}
            <div className={styles.summaryTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal · {items.reduce((s, i) => s + i.quantity, 0)} items</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost, currency)}</span>
              </div>
              {discount > 0 && (
                <div className={`${styles.totalRow} ${styles.discountRow}`}>
                  <span>Discount</span>
                  <span>-{formatPrice(discount, currency)}</span>
                </div>
              )}
              <div className={styles.totalRowMain}>
                <span>Total</span>
                <span className={styles.totalPrice}>{currency} {total.toFixed(3)}</span>
              </div>
              <p className={styles.taxNote}>Includes {currency} {taxIncluded.toFixed(3)} Tax</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
