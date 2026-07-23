const Joi = require('joi');

const productSchema = Joi.object({
  name:           Joi.string().trim().max(200).required(),
  description:    Joi.string().max(5000).allow(''),
  highlights:     Joi.array().items(Joi.string()),
  // Nutrition facts
  nutrition: Joi.object({
    calories: Joi.number().min(0),
    protein:  Joi.number().min(0),
    carbs:    Joi.number().min(0),
    fat:      Joi.number().min(0),
    fiber:    Joi.number().min(0),
    sugar:    Joi.number().min(0),
  }),
  // Dietary & allergen
  dietaryTags:  Joi.array().items(Joi.string().valid('keto','vegan','vegetarian','gluten-free','high-protein','low-carb','halal','dairy-free','low-fat','high-fiber')),
  allergens:    Joi.array().items(Joi.string()),
  ingredients:  Joi.array().items(Joi.string()),
  portionSize:  Joi.string().allow(''),
  planCadence:  Joi.string().valid('one-off','weekly','monthly'),
  // Pricing (EGP only)
  price:          Joi.number().min(0).required(),
  compareAtPrice: Joi.number().min(0).allow(null),
  currency:       Joi.string().valid('EGP'),
  prices: Joi.object({
    EGP: Joi.number().min(0),
  }),
  discount:     Joi.number().min(0).max(100),
  category:     Joi.string().required(),
  isBundle:     Joi.boolean(),
  bundleItems:  Joi.array().items(Joi.string()),
  stock:        Joi.number().min(0),
  isActive:     Joi.boolean(),
  seo: Joi.object({
    metaTitle:       Joi.string().allow(''),
    metaDescription: Joi.string().allow(''),
  }),
});

const updateProductSchema = productSchema.fork(
  ['name', 'price', 'category'],
  (field) => field.optional()
);

module.exports = { productSchema, updateProductSchema };
