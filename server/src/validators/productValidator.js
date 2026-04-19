const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  description: Joi.string().max(5000).allow(''),
  highlights: Joi.array().items(Joi.string()),
  uses: Joi.array().items(Joi.string()),
  price: Joi.number().min(0).required(),
  compareAtPrice: Joi.number().min(0).allow(null),
  currency: Joi.string().valid('EGP', 'JOD'),
  prices: Joi.object({
    JOD: Joi.number().min(0),
    EGP: Joi.number().min(0),
  }),
  discount: Joi.number().min(0).max(100),
  category: Joi.string().required(),
  isBundle: Joi.boolean(),
  bundleItems: Joi.array().items(Joi.string()),
  stock: Joi.number().min(0),
  isActive: Joi.boolean(),
  seo: Joi.object({
    metaTitle: Joi.string().allow(''),
    metaDescription: Joi.string().allow(''),
  }),
});

const updateProductSchema = productSchema.fork(
  ['name', 'price', 'category'],
  (field) => field.optional()
);

module.exports = { productSchema, updateProductSchema };
