const Joi = require('joi');

module.exports.Schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).trim().required(),
  name: Joi.string().min(1).max(30).trim().required(),
  lastname: Joi.string().default('').max(30).trim()
});

module.exports.Pay = Joi.object({
  bank: Joi.string().alphanum().min(3).max(30).trim().required(),
  amountUSD: Joi.string().alphanum().max(30).trim().required(),
  referenceNumber: Joi.string().min(1).max(30).trim().required(),
  code: Joi.string().min(1).max(30).trim().required(),
  exchangeRate: Joi.string().max(30).trim().required(),
  paymentUSD: Joi.boolean().required(),
});


module.exports.Id = Joi.object({
  id: Joi.number().min(1).required()
})
