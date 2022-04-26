const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		total: {
			type: Number,
			required: true
		},
		items: [
			{
				qty: {
					type: Number,
					default: 1
				},
				title: {
					type: String
				},
				price: {
					type: Number
				},
				product: {
					type: Schema.Types.ObjectId,
					ref: 'Product'
				}
			}
		]
	},
	{
		timestamps: true
	}
);

const order_model = mongoose.model('order_model', cartSchema);
module.exports = order_model;
