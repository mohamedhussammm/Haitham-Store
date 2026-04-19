const Joi = require('joi');

const checkoutSchema = Joi.object({
  contact: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().allow(''),
  }).required(),
  shippingAddress: Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    apartment: Joi.string().allow(''),
    city: Joi.string().trim().required(),
    postalCode: Joi.string().allow(''),
    country: Joi.string().default('Jordan'),
    phone: Joi.string().required(),
  }).required(),
  billingAddress: Joi.object({
    sameAsShipping: Joi.boolean().default(true),
    firstName: Joi.string().allow(''),
    lastName: Joi.string().allow(''),
    address: Joi.string().allow(''),
    apartment: Joi.string().allow(''),
    city: Joi.string().allow(''),
    postalCode: Joi.string().allow(''),
    country: Joi.string().allow(''),
  }),
  shippingMethod: Joi.string().default('standard'),
  paymentMethod: Joi.string().valid('cod').default('cod'),
  currency: Joi.string().valid('EGP', 'JOD').default('JOD'),
  couponCode: Joi.string().allow(''),
  saveInfo: Joi.boolean().default(false),
  notes: Joi.string().allow(''),
});

const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).default(1),
});

const updateCartSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

const applyCouponSchema = Joi.object({
  code: Joi.string().trim().required(),
});

module.exports = { checkoutSchema, addToCartSchema, updateCartSchema, applyCouponSchema };
