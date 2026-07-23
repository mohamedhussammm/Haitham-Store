// ── Business constants ──────────────────────────────────────────
export const FREE_DELIVERY_THRESHOLD = 300;  // EGP — free delivery above this
export const DELIVERY_FEE = 30;              // EGP
export const TAX_RATE = 14;                  // % (VAT inclusive)

// ── Single currency: EGP ─────────────────────────────────────────
export const CURRENCY = { code: 'EGP', symbol: 'EGP', name: 'Egyptian Pound' };

// ── Delivery time slots ──────────────────────────────────────────
export const DELIVERY_SLOTS = [
  { value: '10:00 – 12:00', label: '10:00 AM – 12:00 PM' },
  { value: '12:00 – 14:00', label: '12:00 PM – 2:00 PM'  },
  { value: '14:00 – 16:00', label: '2:00 PM – 4:00 PM'   },
  { value: '16:00 – 18:00', label: '4:00 PM – 6:00 PM'   },
  { value: '18:00 – 20:00', label: '6:00 PM – 8:00 PM'   },
];

// ── Order statuses ────────────────────────────────────────────────
export const ORDER_STATUSES = {
  pending:    { label: 'Pending',    color: '#E07800', bg: '#FFF3E0' },
  confirmed:  { label: 'Confirmed',  color: '#0C6FD1', bg: '#E0EDFF' },
  processing: { label: 'Processing', color: '#7C3AED', bg: '#F5F0FF' },
  shipped:    { label: 'On the Way', color: '#0891B2', bg: '#E0F7FA' },
  delivered:  { label: 'Delivered',  color: '#166534', bg: '#E8F9E8' },
  cancelled:  { label: 'Cancelled',  color: '#B91C1C', bg: '#FFEBEB' },
};

// ── Plan cadence labels ───────────────────────────────────────────
export const PLAN_CADENCE = {
  'one-off': { label: 'Single Order', badge: null },
  'weekly':  { label: 'Weekly Plan',  badge: 'WEEKLY' },
  'monthly': { label: 'Monthly Plan', badge: 'MONTHLY' },
};

// ── Dietary tag config ────────────────────────────────────────────
export const DIETARY_TAGS = {
  'high-protein': { label: 'High Protein', class: 'diet-badge-high-protein', icon: '💪' },
  'vegan':        { label: 'Vegan',        class: 'diet-badge-vegan',        icon: '🌱' },
  'vegetarian':   { label: 'Vegetarian',   class: 'diet-badge-vegetarian',   icon: '🥦' },
  'keto':         { label: 'Keto',         class: 'diet-badge-keto',         icon: '🥑' },
  'low-carb':     { label: 'Low Carb',     class: 'diet-badge-low-carb',     icon: '📉' },
  'gluten-free':  { label: 'Gluten Free',  class: 'diet-badge-gluten-free',  icon: '🌾' },
  'halal':        { label: 'Halal',        class: 'diet-badge-halal',        icon: '✓'  },
  'dairy-free':   { label: 'Dairy Free',   class: 'diet-badge-dairy-free',   icon: '🥛' },
  'low-fat':      { label: 'Low Fat',      class: 'diet-badge-low-fat',      icon: '❤️' },
  'high-fiber':   { label: 'High Fiber',   class: 'diet-badge-high-fiber',   icon: '🌾' },
};

// ── Expense categories ────────────────────────────────────────────
export const EXPENSE_CATEGORIES = [
  { value: 'shipping',   label: 'Delivery & Shipping' },
  { value: 'marketing',  label: 'Marketing & Ads' },
  { value: 'inventory',  label: 'Ingredients & Inventory' },
  { value: 'operations', label: 'Kitchen & Operations' },
  { value: 'salaries',   label: 'Staff & Salaries' },
  { value: 'utilities',  label: 'Utilities' },
  { value: 'other',      label: 'Other' },
];

// ── Helpers ───────────────────────────────────────────────────────
export const formatPrice = (price) =>
  `${Number(price).toFixed(0)} EGP`;

export const getDiscountedPrice = (price, discount) =>
  price - (price * discount / 100);
