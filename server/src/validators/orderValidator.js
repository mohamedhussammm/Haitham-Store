const Joi = require('joi');

const DELIVERY_SLOTS = [
  '10:00 – 12:00',
  '12:00 – 14:00',
  '14:00 – 16:00',
  '16:00 – 18:00',
  '18:00 – 20:00',
];

const checkoutSchema = Joi.object({
  contact: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().allow(''),
  }).required(),
  shippingAddress: Joi.object({
    firstName:  Joi.string().trim().required(),
    lastName:   Joi.string().trim().required(),
    address:    Joi.string().trim().required(),
    apartment:  Joi.string().allow(''),
    city:       Joi.string().trim().required(),
    postalCode: Joi.string().allow(''),
    country:    Joi.string().default('Egypt'),
    phone:      Joi.string().required(),
  }).required(),
  billingAddress: Joi.object({
    sameAsShipping: Joi.boolean().default(true),
    firstName:  Joi.string().allow(''),
    lastName:   Joi.string().allow(''),
    address:    Joi.string().allow(''),
    apartment:  Joi.string().allow(''),
    city:       Joi.string().allow(''),
    postalCode: Joi.string().allow(''),
    country:    Joi.string().allow(''),
  }),
  deliverySlot:  Joi.string().valid(...DELIVERY_SLOTS).allow('', null),
  shippingMethod: Joi.string().default('standard'),
  paymentMethod:  Joi.string().valid('cod').default('cod'),
  currency:       Joi.string().valid('EGP').default('EGP'),
  couponCode:     Joi.string().allow(''),
  saveInfo:       Joi.boolean().default(false),
  notes:          Joi.string().allow(''),
});

const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity:  Joi.number().integer().min(1).default(1),
});

const updateCartSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

const applyCouponSchema = Joi.object({
  code: Joi.string().trim().required(),
});

module.exports = { checkoutSchema, addToCartSchema, updateCartSchema, applyCouponSchema, DELIVERY_SLOTS };
