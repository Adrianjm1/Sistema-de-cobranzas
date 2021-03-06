const Joi = require('joi');

module.exports.Schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).trim().required(),
  name: Joi.string().min(1).max(30).trim().required(),
  lastname: Joi.string().default('').max(30).trim()
});

module.exports.Pay = Joi.object({
  bank: Joi.string().min(0).max(30).trim().required(),
  amountUSD: Joi.string().max(30).trim().required(),
  referenceNumber: Joi.string().min(1).max(30).trim().required(),
  code: Joi.string().min(1).max(30).trim().required(),
  exchangeRate: Joi.string().max(30).trim().required(),
  paymentUSD: Joi.boolean().required(),
  date: Joi.string().max(30).trim().required(),
  description: Joi.string().max(80),
  nota: Joi.number(),
});


module.exports.Id = Joi.object({
  id: Joi.number().min(1).required()
})
