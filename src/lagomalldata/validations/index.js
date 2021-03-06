const Joi = require('@hapi/joi').extend(require('@joi/date'));

module.exports.Schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).trim().required(),
  name: Joi.string().min(1).max(30).trim().required(),
  lastname: Joi.string().default('').max(30).trim()
});

module.exports.Id = Joi.object({
  id: Joi.number().min(1).required()
})


module.exports.BreakE = Joi.object({
  id: Joi.number().min(1),
  breakeven: Joi.number().min(0).precision(2).required(),
  month: Joi.date().required(),
  discount: Joi.number().required(),
  meter: Joi.number(),
  prontoPagoDay: Joi.number()
})
