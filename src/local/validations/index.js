const Joi = require('@hapi/joi').extend(require('@joi/date'));

module.exports.Schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).trim().required(),
  name: Joi.string().min(1).max(30).trim().required(),
  lastname: Joi.string().default('').max(30).trim()
});

module.exports.Id = Joi.object({
  id: Joi.number().min(1).required()
})

module.exports.Month = Joi.object({
  month: Joi.date().format('YYYY-MM').required()
})


module.exports.Pronto = Joi.object({
  month: Joi.date().required(),
  idLGData: Joi.number()
})

