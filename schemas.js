const Joi = require('joi');

module.exports.productSchema = Joi.object({
	product: Joi.object({
		title: Joi.string().required(),
		image: Joi.string().required(),
		price: Joi.number().required().min(0),
		discount: Joi.number().optional().min(0).max(100).allow(null),
		quantity: Joi.number().required().min(0),
		description: Joi.string().required()
	}).required()
});
