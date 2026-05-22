export const FREE_SHIPPING_THRESHOLD = 30;
export const SHIPPING_COST = 2;
export const TAX_RATE = 16;

export const CURRENCIES = {
  JOD: { code: 'JOD', symbol: 'JOD', name: 'Jordanian Dinar' },
  EGP: { code: 'EGP', symbol: 'EGP', name: 'Egyptian Pound' },
};

export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: '#f59e0b' },
  confirmed: { label: 'Confirmed', color: '#3b82f6' },
  processing: { label: 'Processing', color: '#8b5cf6' },
  shipped: { label: 'Shipped', color: '#06b6d4' },
  delivered: { label: 'Delivered', color: '#22c55e' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
};

export const EXPENSE_CATEGORIES = [
  { value: 'shipping', label: 'Shipping' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'operations', label: 'Operations' },
  { value: 'salaries', label: 'Salaries' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'other', label: 'Other' },
];

export const formatPrice = (price, currency = 'JOD') => {
  return `${Number(price).toFixed(3)} ${currency}`;
};

export const getDiscountedPrice = (price, discount) => {
  return price - (price * discount / 100);
};
