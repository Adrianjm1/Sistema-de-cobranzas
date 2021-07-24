const Joi = require('joi');

module.exports.Schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).trim().required(),
  password: Joi.string().min(3).max(30).trim().required(),
});

module.exports.Id = Joi.object({
  id: Joi.number().min(1).required()
})

module.exports.Username = Joi.object({
  username: Joi.string().alphanum().trim().required(),
  password: Joi.string().alphanum().trim().required(),

});
